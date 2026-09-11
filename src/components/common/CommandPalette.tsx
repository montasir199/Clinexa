import React, { useState, useEffect } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { 
  Search, 
  X, 
  User, 
  Stethoscope, 
  Calendar, 
  Pill, 
  Receipt, 
  ArrowRight,
  Sparkles,
  Building2
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { 
    isGlobalSearchOpen, 
    setIsGlobalSearchOpen, 
    patients, 
    doctors, 
    medicines, 
    invoices, 
    setActiveTab, 
    setSelectedPatientId,
    t,
    language
  } = useMedSync();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K or Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(!isGlobalSearchOpen);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(trimmed) || 
    p.nameAr.includes(trimmed) || 
    p.mrn.toLowerCase().includes(trimmed) ||
    p.phone.includes(trimmed)
  ).slice(0, 4);

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(trimmed) || 
    d.nameAr.includes(trimmed) || 
    d.specialty.toLowerCase().includes(trimmed) ||
    d.specialtyAr.includes(trimmed)
  ).slice(0, 3);

  const filteredMeds = medicines.filter(m => 
    m.brandName.toLowerCase().includes(trimmed) || 
    m.genericName.toLowerCase().includes(trimmed)
  ).slice(0, 3);

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(trimmed) ||
    inv.patientName.toLowerCase().includes(trimmed)
  ).slice(0, 2);

  const totalResults = filteredPatients.length + filteredDoctors.length + filteredMeds.length + filteredInvoices.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              'ابحث عن مريض بالاسم أو رقم الملف MRN، طبيب، دواء، أو فاتورة...',
              'Search patient by name or MRN, doctor, medication, invoice...'
            )}
            className="w-full px-4 py-2 text-base bg-transparent text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400"
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
            <button
              onClick={() => setIsGlobalSearchOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {trimmed.length === 0 ? (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-sky-500/50" />
              <p className="text-sm font-medium">
                {t('اكتب للبحث الفوري في سجلات المرضى والأطباء والصيدلية', 'Type to instantly search patient records, doctors, and pharmacy inventory')}
              </p>
              <div className="flex justify-center gap-3 mt-4 text-xs">
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                  {t('جرب: "الخطيب" أو "MRN" أو "Augmentin"', 'Try: "Khatib", "MRN", or "Augmentin"')}
                </span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <p className="text-base font-semibold">{t('لا توجد نتائج مطابقة', 'No results found')}</p>
              <p className="text-xs mt-1">{t('تأكد من صحة رقم الملف أو الاسم المدخل', 'Check the spelling or try a different keyword')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Patients Section */}
              {filteredPatients.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase px-3 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-500" />
                    {t('المرضى', 'Patients')} ({filteredPatients.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredPatients.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPatientId(p.id);
                          setActiveTab('patients');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-sky-50 dark:hover:bg-slate-800 text-right rtl:text-right ltr:text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-sm">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 transition-colors">
                              {language === 'ar' ? p.nameAr : p.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {p.mrn} • {p.age} {t('سنة', 'yrs')} • {p.bloodType} • {p.phone}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {p.department || t('عام', 'General')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctors Section */}
              {filteredDoctors.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase px-3 mb-2 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
                    {t('الأطباء والاستشاريين', 'Doctors & Consultants')} ({filteredDoctors.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredDoctors.map(d => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setActiveTab('doctors');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-teal-50 dark:hover:bg-slate-800 text-right rtl:text-right ltr:text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={d.avatar} alt={d.name} className="w-9 h-9 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 transition-colors">
                              {language === 'ar' ? d.nameAr : d.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {language === 'ar' ? d.specialtyAr : d.specialty} • {d.opdRoom}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-teal-600 dark:text-teal-400 font-bold">
                          {d.shiftHours}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Medicines Section */}
              {filteredMeds.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase px-3 mb-2 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-purple-500" />
                    {t('أدوية الصيدلية', 'Pharmacy Medications')} ({filteredMeds.length})
                  </h4>
                  <div className="space-y-1">
                    {filteredMeds.map(m => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setActiveTab('pharmacy');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-purple-50 dark:hover:bg-slate-800 text-right rtl:text-right ltr:text-left transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 transition-colors">
                            {m.brandName} <span className="text-xs font-normal text-slate-400">({m.genericName})</span>
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {m.code} • {m.strength} • {m.category}
                          </p>
                        </div>
                        <div className="text-right rtl:text-right ltr:text-left">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{m.stockQuantity} {t('وحدة', 'units')}</p>
                          <p className="text-[11px] text-slate-400">{m.unitPrice} SAR</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices Section */}
              {filteredInvoices.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase px-3 mb-2 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                    {t('الفواتير والمالية', 'Invoices & Billing')}
                  </h4>
                  <div className="space-y-1">
                    {filteredInvoices.map(inv => (
                      <button
                        key={inv.id}
                        onClick={() => {
                          setActiveTab('billing');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-emerald-50 dark:hover:bg-slate-800 text-right rtl:text-right ltr:text-left transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                            {inv.invoiceNumber}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {inv.patientName} • {inv.date}
                          </p>
                        </div>
                        <div className="text-right rtl:text-right ltr:text-left">
                          <p className="text-xs font-bold text-emerald-600">{inv.subtotal} SAR</p>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{t('نظام MedSync الذكي للبحث السريري والإداري', 'MedSync Smart Clinical & Admin Search')}</span>
          <span>{t('اضغط ESC للإغلاق', 'Press ESC to exit')}</span>
        </div>
      </div>
    </div>
  );
};
