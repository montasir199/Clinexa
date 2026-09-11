import React, { useState } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { Invoice, InvoiceLineItem } from '../../types/medsync';
import { 
  Receipt, 
  Search, 
  Plus, 
  DollarSign, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Printer, 
  TrendingUp,
  FileCheck
} from 'lucide-react';

export const BillingModule: React.FC = () => {
  const { invoices, createInvoice, markInvoicePaid, patients, openPrintDocument, t, language } = useMedSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'cash' | 'insurance' | 'bank_transfer'>('credit_card');

  // New Invoice Form
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [invItems, setInvItems] = useState<Array<{ description: string; quantity: number; unitPrice: number; category: InvoiceLineItem['category'] }>>([
    { description: 'Specialist Consultation OPD Fee', quantity: 1, unitPrice: 350, category: 'consultation' },
    { description: 'Complete Blood Count (CBC) Laboratory', quantity: 1, unitPrice: 120, category: 'laboratory' }
  ]);
  const [insuranceCoverageRate, setInsuranceCoverageRate] = useState(80); // 80% covered

  // Aggregates
  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.subtotal + inv.tax - inv.discount), 0);
  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.patientPayable, 0);
  const totalPending = invoices.filter(i => i.status !== 'paid').reduce((sum, inv) => sum + inv.patientPayable, 0);
  const totalInsurance = invoices.reduce((sum, inv) => sum + inv.insuranceCoverage, 0);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patientMrn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoiceForPayment(inv);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    markInvoicePaid(selectedInvoiceForPayment.id, paymentMethod);
    setSelectedInvoiceForPayment(null);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === selectedPatientId);
    if (!pat) return;

    const subtotal = invItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const tax = Math.round(subtotal * 0.15); // 15% VAT
    const discount = 0;
    const totalWithTax = subtotal + tax - discount;
    const insuranceCoverage = pat.insurancePolicyNumber ? Math.round(totalWithTax * (insuranceCoverageRate / 100)) : 0;
    const patientPayable = totalWithTax - insuranceCoverage;

    const lineItems: InvoiceLineItem[] = invItems.map((item, idx) => ({
      id: `line-${idx + 1}`,
      description: item.description,
      descriptionAr: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
      category: item.category
    }));

    createInvoice({
      hospitalId: 'hosp-1',
      patientId: pat.id,
      patientName: pat.name,
      patientMrn: pat.mrn,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: lineItems,
      subtotal,
      tax,
      discount,
      insuranceCoverage,
      patientPayable,
      status: 'pending'
    });

    setIsNewInvoiceOpen(false);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-emerald-600" />
            <span>{t('الفواتير والتحصيل المالي (Billing & Revenue)', 'Invoicing & Financial Management')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('إصدار الفواتير الضريبية، تسوية مطالبات التأمين الطبي، وتسجيل المدفوعات النقدية والبنكية', 'ZATCA compliant e-invoicing, health insurance claims, and revenue reconciliation')}
          </p>
        </div>

        <button
          onClick={() => setIsNewInvoiceOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>{t('إصدار فاتورة ضريبية جديدة', 'Create Invoice')}</span>
        </button>
      </div>

      {/* 2. Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('إجمالي الفواتير الصادرة', 'Total Invoiced')}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalBilled.toLocaleString()} SAR</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('الإيرادات المحصلة', 'Collected Revenue')}</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{totalCollected.toLocaleString()} SAR</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('الأرصدة المستحقة', 'Outstanding Receivables')}</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{totalPending.toLocaleString()} SAR</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('مطالبات التأمين المعلقة', 'Pending Insurance Claims')}</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{totalInsurance.toLocaleString()} SAR</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Filters & Search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ابحث برقم الفاتورة أو المريض...', 'Search invoice or patient...')}
            className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'paid', 'pending', 'partial', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? t('كافة الفواتير', 'All') : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Invoices Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-4">{t('رقم الفاتورة والتاريخ', 'Invoice & Date')}</th>
                <th className="p-4">{t('المريض والملف الطبي', 'Patient & MRN')}</th>
                <th className="p-4">{t('الإجمالي مع الضريبة (SAR)', 'Gross Total (VAT)')}</th>
                <th className="p-4">{t('تغطية التأمين', 'Insurance Claim')}</th>
                <th className="p-4">{t('المستحق على المريض', 'Patient Payable')}</th>
                <th className="p-4">{t('الحالة', 'Status')}</th>
                <th className="p-4 text-center">{t('الإجراء المالي', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredInvoices.map(inv => {
                const grossTotal = inv.subtotal + inv.tax - inv.discount;
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                        {inv.invoiceNumber}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">{inv.date}</p>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      <p className="font-bold">{inv.patientName}</p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">{inv.patientMrn}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white font-mono">
                      {grossTotal.toLocaleString()} SAR
                    </td>
                    <td className="p-4">
                      {inv.insuranceCoverage > 0 ? (
                        <div>
                          <span className="font-mono font-bold text-blue-600">{inv.insuranceCoverage.toLocaleString()} SAR</span>
                          <span className="block text-[10px] text-slate-400 font-semibold uppercase">Claim active</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Self Pay</span>
                      )}
                    </td>
                    <td className="p-4 font-bold font-mono">
                      <span className={inv.status !== 'paid' ? 'text-amber-600' : 'text-slate-400'}>
                        {inv.patientPayable.toLocaleString()} SAR
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : inv.status === 'partial'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {inv.status !== 'paid' ? (
                          <button
                            onClick={() => handleOpenPayment(inv)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors"
                          >
                            {t('تحصيل الدفعة', 'Receive Payment')}
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t('مسددة بالكامل', 'Paid')}</span>
                          </span>
                        )}
                        <button
                          onClick={() => openPrintDocument({
                            type: 'invoice',
                            data: inv,
                            title: t(`فاتورة ضريبية - ${inv.invoiceNumber}`, `Tax Invoice - ${inv.invoiceNumber}`)
                          })}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors"
                          title={t('طباعة الفاتورة الضريبية ZATCA', 'Print Tax Invoice')}
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Payment Modal */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>{t('تسجيل دفعة وتحصيل إيراد', 'Receive Patient Payment')}</span>
              </h3>
              <button onClick={() => setSelectedInvoiceForPayment(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
              <p><strong>{t('الفاتورة:', 'Invoice:')}</strong> {selectedInvoiceForPayment.invoiceNumber}</p>
              <p><strong>{t('المريض:', 'Patient:')}</strong> {selectedInvoiceForPayment.patientName} ({selectedInvoiceForPayment.patientMrn})</p>
              <p><strong>{t('المستحق على المريض:', 'Patient Due:')}</strong> <span className="font-bold text-amber-600">{selectedInvoiceForPayment.patientPayable.toLocaleString()} SAR</span></p>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('طريقة الدفع', 'Payment Method')} *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'credit_card', label: 'مدى / بطاقة بنكية (Card)' },
                    { id: 'cash', label: 'نقداً (Cash)' },
                    { id: 'insurance', label: 'تسوية تأمين (Insurance)' },
                    { id: 'bank_transfer', label: 'تحويل بنكي (Transfer)' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                        paymentMethod === m.id
                          ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPayment(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-600 font-semibold"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/25"
                >
                  {t('تأكيد التحصيل وإصدار السند', 'Confirm & Generate Receipt')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Create Invoice Modal */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <span>{t('إصدار فاتورة طبية ضريبية', 'Generate Medical Tax Invoice')}</span>
              </h3>
              <button onClick={() => setIsNewInvoiceOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('اختر المريض', 'Select Patient')} *</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn}) - {p.insuranceProvider || 'No Insurance'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <label className="block text-slate-700 dark:text-slate-300 font-bold">{t('بنود الخدمات السريرية والرسوم', 'Itemized Services')}</label>
                {invItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setInvItems(prev => prev.map((it, i) => i === idx ? { ...it, description: val } : it));
                      }}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                    />
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setInvItems(prev => prev.map((it, i) => i === idx ? { ...it, unitPrice: val } : it));
                      }}
                      className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono font-bold"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {t('نسبة التغطية التأمينية (%)', 'Insurance Coverage Rate (%)')}
                </label>
                <input
                  type="number"
                  value={insuranceCoverageRate}
                  onChange={(e) => setInsuranceCoverageRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono font-bold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-600 font-semibold"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/25"
                >
                  {t('إصدار الفاتورة الضريبية', 'Issue Tax Invoice')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
