import React, { useMemo } from 'react';
import { 
  Printer, 
  Download, 
  ExternalLink, 
  X, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { useMedSync } from '../../context/MedSyncContext';
import { 
  printHtmlDocument, 
  downloadDocumentAsHtml, 
  buildDocumentHtml 
} from '../../utils/printDocument';
import {
  generatePatientSummaryHtml,
  generatePrescriptionHtml,
  generateInvoiceHtml,
  generateLabReportHtml,
  generateRadiologyReportHtml,
  generateHospitalPerformanceHtml
} from '../../utils/documentTemplates';

export const DocumentPrintModal: React.FC = () => {
  const { 
    printableDocument, 
    closePrintDocument, 
    currentHospital, 
    consultations, 
    showToast, 
    t, 
    language 
  } = useMedSync();

  const hospitalInfo = useMemo(() => ({
    nameAr: currentHospital?.nameAr,
    nameEn: currentHospital?.nameEn,
    city: currentHospital?.city,
    taxId: '300482910400003',
    phone: '+966 11 465 6666',
    email: 'contact@medsync.med.sa'
  }), [currentHospital]);

  // Generate document HTML based on requested document type
  const { docHtml, defaultDocTitle } = useMemo(() => {
    if (!printableDocument) {
      return { docHtml: '', defaultDocTitle: 'Medical Document' };
    }

    const { type, data, title } = printableDocument;
    let html = '';
    let name = title || 'Medical Document';

    switch (type) {
      case 'patient_summary':
        html = generatePatientSummaryHtml(data, hospitalInfo, consultations);
        name = name || `تقرير_طبي_${data.nameAr || data.mrn}`;
        break;

      case 'prescription':
        html = generatePrescriptionHtml(data, hospitalInfo);
        name = name || `وصفة_طبية_${data.prescriptionNumber}`;
        break;

      case 'invoice':
        html = generateInvoiceHtml(data, hospitalInfo);
        name = name || `فاتورة_${data.invoiceNumber}`;
        break;

      case 'lab_report':
        html = generateLabReportHtml(data, hospitalInfo);
        name = name || `تقرير_مختبر_${data.testCode}`;
        break;

      case 'radiology_report':
        html = generateRadiologyReportHtml(data, hospitalInfo);
        name = name || `تقرير_أشعة_${data.patientMrn}`;
        break;

      case 'performance_report':
        html = generateHospitalPerformanceHtml(data, hospitalInfo);
        name = name || `تقرير_المستشفى_الشامل`;
        break;

      default:
        html = `<div style="padding:20px;text-align:center;">مستند طبي غير معروف</div>`;
    }

    return { docHtml: html, defaultDocTitle: name };
  }, [printableDocument, hospitalInfo, consultations]);

  if (!printableDocument) return null;

  // 1. Direct Print Action
  const handleDirectPrint = () => {
    showToast(t('جارِ إرسال المستند للطباعة المباشرة...', 'Sending document to printer...'), 'info');
    const ok = printHtmlDocument(docHtml, defaultDocTitle);
    if (ok) {
      showToast(t('تم فتح حوار الطباعة بنجاح', 'Print dialog initialized'), 'success');
    }
  };

  // 2. Open in New Window/Tab (bypasses iframe sandbox restrictions)
  const handleOpenInNewTab = () => {
    try {
      const fullHtml = buildDocumentHtml(docHtml, defaultDocTitle);
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        win.focus();
        showToast(t('تم فتح المستند في نافذة مستقلة للطباعة', 'Document opened in new tab for printing'), 'success');
      } else {
        showToast(t('تم حظر النافذة المنبثقة، جارِ تنزيل المستند مباشرة', 'Popup blocked, downloading document directly'), 'info');
        downloadDocumentAsHtml(docHtml, defaultDocTitle);
      }
    } catch (e) {
      downloadDocumentAsHtml(docHtml, defaultDocTitle);
    }
  };

  // 3. Download standalone HTML
  const handleDownloadHtml = () => {
    downloadDocumentAsHtml(docHtml, defaultDocTitle);
    showToast(t('تم تنزيل المستند بنجاح', 'Document downloaded successfully'), 'success');
  };

  return (
    <div 
      id="document-print-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6 bg-slate-900 border-b border-slate-800 text-white select-none">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white">
                  {t('مركز معاينة وطباعة المستندات الطبية', 'Medical Document Print Center')}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  {t('معتمد رسمياً', 'Verified EHR')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {defaultDocTitle} • {t('تنسيق A4 قياسي معتمد بالباركود والختم', 'Standard A4 Certified Layout')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct Print Button */}
            <button
              onClick={handleDirectPrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition-all cursor-pointer active:scale-95"
              title={t('طباعة فورية', 'Direct Print')}
            >
              <Printer className="w-4 h-4" />
              <span>{t('طباعة فورية', 'Print Document')}</span>
            </button>

            {/* Open in New Window */}
            <button
              onClick={handleOpenInNewTab}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
              title={t('فتح في نافذة مستقلة للطباعة بحجم الشاشة الكامل', 'Open in new window')}
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">{t('فتح كنافذة مستقلة', 'New Tab')}</span>
            </button>

            {/* Download File */}
            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
              title={t('حفظ المستند بصيغة HTML جاهزة للطباعة', 'Download File')}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t('حفظ المستند', 'Save')}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={closePrintDocument}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Banner for Frame Printing */}
        <div className="px-6 py-2 bg-teal-950/30 border-b border-teal-900/40 flex items-center justify-between text-[11px] text-teal-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>
              {t(
                'تم تصميم هذا المستند بدقة هندسية عالية ليتوافق مع طابعات الليزر وطابعات PDF ومقاس A4 القياسي.',
                'Engineered for laser printing, high-resolution PDF export, and standard A4 dimensions.'
              )}
            </span>
          </div>
          <span className="hidden md:inline text-[10px] text-teal-400/80 font-mono">
            {t('جاهز للإرسال • 300 DPI', 'Print-Ready • 300 DPI')}
          </span>
        </div>

        {/* Printable Paper Canvas Preview (Simulated A4 Paper) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center items-start">
          <div 
            id="printable-paper-sheet"
            className="w-full max-w-[210mm] bg-white text-slate-900 shadow-2xl rounded-sm p-6 sm:p-10 border border-slate-300 font-sans"
            style={{ minHeight: '297mm', direction: 'rtl' }}
            dangerouslySetInnerHTML={{ __html: docHtml }}
          />
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3 sm:px-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>{t('نظام الطباعة الآمن MedSync Print v2.4', 'MedSync Secure Print Engine active')}</span>
          </div>
          <button
            onClick={closePrintDocument}
            className="px-4 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {t('إغلاق المعاينة', 'Close Preview')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPrintModal;
