import React, { useState } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { LaboratoryTest } from '../../types/medsync';
import { 
  FlaskConical, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  X, 
  FileText, 
  TestTube,
  Activity,
  Check
} from 'lucide-react';

export const LaboratoryModule: React.FC = () => {
  const { labTests, addLabTest, updateLabResult, patients, doctors, openPrintDocument, t, language } = useMedSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTestModal, setActiveTestModal] = useState<LaboratoryTest | null>(null);

  // Edit Test Results State
  const [resultsList, setResultsList] = useState<Array<{
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    isAbnormal: boolean;
  }>>([]);
  const [interpretation, setInterpretation] = useState('');

  const filteredTests = labTests.filter(t => {
    const matchesSearch = 
      t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.patientMrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.testCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenResultsModal = (test: LaboratoryTest) => {
    setActiveTestModal(test);
    if (test.results && test.results.length > 0) {
      setResultsList(test.results);
    } else {
      // Pre-fill default template based on test
      if (test.testName.includes('CBC') || test.testName.includes('Blood')) {
        setResultsList([
          { parameter: 'Hemoglobin (Hb)', value: '14.2', unit: 'g/dL', referenceRange: '13.5 - 17.5', isAbnormal: false },
          { parameter: 'White Blood Cells (WBC)', value: '7.8', unit: 'x10^3/uL', referenceRange: '4.5 - 11.0', isAbnormal: false },
          { parameter: 'Platelet Count', value: '250', unit: 'x10^3/uL', referenceRange: '150 - 450', isAbnormal: false },
          { parameter: 'RBC Count', value: '4.9', unit: 'x10^6/uL', referenceRange: '4.3 - 5.9', isAbnormal: false },
        ]);
      } else {
        setResultsList([
          { parameter: 'Serum Value 1', value: '110', unit: 'mg/dL', referenceRange: '70 - 100', isAbnormal: true },
          { parameter: 'Serum Value 2', value: '1.1', unit: 'mg/dL', referenceRange: '0.7 - 1.3', isAbnormal: false }
        ]);
      }
    }
    setInterpretation(test.interpretation || 'Results reviewed. Correlate with clinical presentation.');
  };

  const handleSaveResults = () => {
    if (!activeTestModal) return;
    updateLabResult(activeTestModal.id, resultsList, interpretation);
    setActiveTestModal(null);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <FlaskConical className="w-6 h-6 text-blue-600" />
            <span>{t('المختبر والتحاليل التشخيصية (Laboratory)', 'Clinical Diagnostic Laboratory')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('استلام عينات الفحص، معالجة النتائج، واكتشاف المؤشرات غير الطبيعية تلقائيًا', 'Sample collection, automated reference range checks, and validated lab certificates')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800">
            {labTests.filter(l => l.status === 'pending').length} {t('طلبات قيد الانتظار', 'Pending Tests')}
          </span>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ابحث بالمريض أو التحليل أو رقم الملف...', 'Search patient, test name, or MRN...')}
            className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'pending', 'processing', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? t('كافة الفحوصات', 'All Tests') : status}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Lab Tests Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-4">{t('اسم التحليل والكود', 'Test & Code')}</th>
                <th className="p-4">{t('المريض ورقم الملف', 'Patient & MRN')}</th>
                <th className="p-4">{t('الطبيب الطالب', 'Ordering Physician')}</th>
                <th className="p-4">{t('العينة والتاريخ', 'Specimen & Date')}</th>
                <th className="p-4">{t('الحالة', 'Status')}</th>
                <th className="p-4 text-center">{t('النتائج والتقرير', 'Results & Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredTests.map((test, index) => (
                <tr key={`${test.id}-${index}`} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      🔬 {test.testName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {test.testCode} • {test.category}
                    </p>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    <p className="font-bold">{test.patientName}</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold">{test.patientMrn}</p>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    <p className="font-bold">{test.doctorName}</p>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{test.urgency}</span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">
                    <p className="font-bold text-slate-700 dark:text-slate-300">{test.specimenType}</p>
                    <p className="text-[10px]">{test.requestDate}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      test.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : test.status === 'processing'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 animate-pulse'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {test.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleOpenResultsModal(test)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        test.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xs'
                      }`}
                    >
                      {test.status === 'completed' ? t('عرض التقرير المعتمد', 'View Verified Report') : t('إدخال واعتماد النتائج', 'Enter Lab Results')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Results Entry & View Modal */}
      {activeTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-600 text-white">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{activeTestModal.testName}</h3>
                  <p className="text-xs text-slate-400 font-mono">{activeTestModal.patientName} ({activeTestModal.patientMrn}) • {activeTestModal.testCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openPrintDocument({
                    type: 'lab_report',
                    data: activeTestModal,
                    title: t(`تقرير مخبري - ${activeTestModal.testNameAr || activeTestModal.testName}`, `Lab Report - ${activeTestModal.testName}`)
                  })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors shadow-xs"
                  title={t('طباعة التقرير المخبري المعتمد', 'Print Official Lab Report')}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('طباعة التقرير', 'Print')}</span>
                </button>
                <button onClick={() => setActiveTestModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
            </div>

            {/* Results Table */}
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[11px] tracking-wider">
                {t('مؤشرات الفحص المخبري والقيم المعيارية', 'Assay Parameters & Reference Intervals')}
              </h4>

              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">{t('المؤشر', 'Parameter')}</th>
                      <th className="p-3">{t('النتيجة المقاسة', 'Result')}</th>
                      <th className="p-3">{t('الوحدة', 'Unit')}</th>
                      <th className="p-3">{t('المدى الطبيعي', 'Reference Range')}</th>
                      <th className="p-3 text-center">{t('الحالة', 'Flag')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {resultsList.map((res, i) => (
                      <tr key={i}>
                        <td className="p-3 font-bold text-slate-800 dark:text-white">{res.parameter}</td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={res.value}
                            onChange={(e) => {
                              const val = e.target.value;
                              setResultsList(prev => prev.map((item, idx) => idx === i ? { ...item, value: val } : item));
                            }}
                            className="w-20 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold font-mono outline-none"
                          />
                        </td>
                        <td className="p-3 text-slate-500 font-mono">{res.unit}</td>
                        <td className="p-3 text-slate-500 font-mono">{res.referenceRange}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setResultsList(prev => prev.map((item, idx) => idx === i ? { ...item, isAbnormal: !item.isAbnormal } : item));
                            }}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              res.isAbnormal
                                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {res.isAbnormal ? 'ABNORMAL ⚠️' : 'NORMAL ✓'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {t('الملاحظات التشخيصية وتفسير الاستشاري المخبري', 'Consultant Pathologist Interpretation')}
                </label>
                <textarea
                  rows={3}
                  value={interpretation}
                  onChange={(e) => setInterpretation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTestModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-600 font-semibold"
                >
                  {t('إغلاق', 'Close')}
                </button>
                <button
                  type="button"
                  onClick={handleSaveResults}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/25"
                >
                  {t('اعتماد التقرير رسمياً', 'Verify & Sign Results')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
