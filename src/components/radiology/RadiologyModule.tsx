import React, { useState } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { RadiologyScan } from '../../types/medsync';
import { 
  Scan, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ZoomIn, 
  ZoomOut, 
  Sun, 
  RotateCw, 
  Maximize2, 
  Printer, 
  X,
  FileText,
  Activity
} from 'lucide-react';

export const RadiologyModule: React.FC = () => {
  const { radiologyScans, updateRadiologyReport, openPrintDocument, t, language } = useMedSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedScan, setSelectedScan] = useState<RadiologyScan | null>(radiologyScans[0] || null);
  const [findingsInput, setFindingsInput] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  const filteredScans = radiologyScans.filter(s => {
    const matchesSearch = 
      s.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.bodyPart.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.patientMrn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || s.scanType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSelectScan = (scan: RadiologyScan) => {
    setSelectedScan(scan);
    setFindingsInput(scan.findings || '');
    setZoomLevel(1);
    setBrightness(100);
    setContrast(100);
  };

  const handleSaveReport = () => {
    if (!selectedScan) return;
    updateRadiologyReport(selectedScan.id, findingsInput, findingsInput, 'Standard radiologic impression recorded');
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Scan className="w-6 h-6 text-teal-600" />
            <span>{t('الأشعة والتصوير الطبي (Radiology PACS)', 'Radiology Imaging & PACS Viewer')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('عرض صور الأشعة التشخيصية، تقارير الاستشاريين، وأدوات التحليل الرقمي', 'Diagnostic imaging workstation, contrast manipulation, and radiology reports')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-200 dark:border-teal-800">
            {radiologyScans.filter(s => s.status === 'pending').length} {t('فحوصات بانتظار التقرير', 'Pending Scans')}
          </span>
        </div>
      </div>

      {/* 2. Main Workspace (Split Grid: List on Left, Viewer on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scans List */}
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ابحث بالمريض أو الفحص...', 'Search scan or patient...')}
                className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['all', 'X-Ray', 'MRI', 'CT', 'Ultrasound'].map(type => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap ${
                    typeFilter === type ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Scans Cards */}
          <div className="space-y-2 max-h-[650px] overflow-y-auto">
            {filteredScans.map(scan => {
              const isSelected = selectedScan?.id === scan.id;
              return (
                <div
                  key={scan.id}
                  onClick={() => handleSelectScan(scan)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {scan.scanType}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      scan.status === 'reported' ? 'text-emerald-600' : 'text-amber-600 animate-pulse'
                    }`}>
                      {scan.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {scan.bodyPart}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {scan.patientName} • <span className="font-mono text-blue-600">{scan.patientMrn}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Diagnostic Imaging Viewer & Report Editor (2 Cols) */}
        {selectedScan ? (
          <div className="lg:col-span-2 space-y-4">
            {/* Viewer Stage */}
            <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
              {/* Viewer Controls Bar */}
              <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{selectedScan.scanType} - {selectedScan.bodyPart}</span>
                  <span className="text-slate-500 font-mono">DICOM 3.0</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.5))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setBrightness(prev => prev === 100 ? 130 : 100)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                    title="Toggle High Contrast"
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel(1);
                      setBrightness(100);
                      setContrast(100);
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-white"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Medical Image Canvas */}
              <div className="relative w-full h-80 rounded-2xl bg-black overflow-hidden flex items-center justify-center">
                {selectedScan.imageUrl ? (
                  <img
                    src={selectedScan.imageUrl}
                    alt={selectedScan.bodyPart}
                    style={{
                      transform: `scale(${zoomLevel})`,
                      filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                      transition: 'transform 0.2s ease, filter 0.2s ease'
                    }}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-slate-500">
                    <Scan className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                    <p className="text-xs">DICOM imaging scan pending acquisition</p>
                  </div>
                )}

                {/* DICOM Metadata Overlays */}
                <div className="absolute top-3 left-3 text-[10px] font-mono text-emerald-400 bg-black/60 p-2 rounded-lg pointer-events-none">
                  <p>PAT: {selectedScan.patientName}</p>
                  <p>MRN: {selectedScan.patientMrn}</p>
                  <p>MOD: {selectedScan.scanType}</p>
                </div>

                <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-400 bg-black/60 p-2 rounded-lg pointer-events-none">
                  <p>ZOOM: {(zoomLevel * 100).toFixed(0)}%</p>
                  <p>BRIGHTNESS: {brightness}%</p>
                </div>
              </div>
            </div>

            {/* Diagnostic Report Findings */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>{t('تقرير استشاري الأشعة التشخيصية', 'Radiology Consultant Diagnostic Report')}</span>
                </h3>
                <span className="text-xs text-slate-400">{selectedScan.radiologistName || 'Reporting Consultant'}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('النتائج والتوصيات الشعاعية (Radiological Findings)', 'Detailed Findings & Impression')}
                </label>
                <textarea
                  rows={4}
                  value={findingsInput}
                  onChange={(e) => setFindingsInput(e.target.value)}
                  placeholder={t('اكتب التقرير الشعاعي وملاحظات التشخيص...', 'Enter radiological report findings and impressions...')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (selectedScan) {
                      openPrintDocument({
                        type: 'radiology_report',
                        data: {
                          ...selectedScan,
                          findings: findingsInput || selectedScan.findings,
                          findingsAr: findingsInput || selectedScan.findingsAr
                        },
                        title: t(`تقرير أشعة - ${selectedScan.scanType} (${selectedScan.patientName})`, `Radiology Report - ${selectedScan.scanType}`)
                      });
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t('طباعة التقرير الشعاعي', 'Print Imaging Report')}</span>
                </button>

                <button
                  onClick={handleSaveReport}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all"
                >
                  {t('اعتماد وحفظ تقرير الأشعة', 'Sign & Finalize Imaging Report')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-12 text-center text-slate-400 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p>{t('اختر فحصاً من القائمة لعرض الأشعة والتقرير', 'Select a scan to inspect imaging and findings')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
