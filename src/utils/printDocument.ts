/**
 * Medical Document Print Engine
 * Handles printing in web apps and sandboxed iframes reliably.
 * Provides fallback to new tab and standalone document download.
 */

export interface PrintDocumentOptions {
  title?: string;
  autoPrint?: boolean;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}

/**
 * Builds standard hospital document HTML with full CSS styles
 */
export function buildDocumentHtml(contentHtml: string, title = 'Medical Document'): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      background-color: #ffffff;
      color: #0f172a;
      line-height: 1.5;
      font-size: 11pt;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print-sheet {
      width: 100%;
      max-width: 210mm;
      margin: 0 auto;
      padding: 4mm 0;
      background: white;
    }
    .hospital-header {
      border-bottom: 2.5px solid #0d9488;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-logo-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-titles h1 {
      font-size: 16pt;
      font-weight: 900;
      color: #0f766e;
      line-height: 1.2;
    }
    .header-titles h2 {
      font-size: 10.5pt;
      font-weight: 700;
      color: #475569;
    }
    .header-meta {
      text-align: left;
      font-size: 8.5pt;
      color: #64748b;
      line-height: 1.4;
      direction: ltr;
    }
    .doc-badge-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f0fdfa;
      border: 1px solid #ccfbf1;
      padding: 8px 14px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .doc-title {
      font-size: 12.5pt;
      font-weight: 800;
      color: #115e59;
    }
    .doc-serial {
      font-family: monospace;
      font-size: 9.5pt;
      font-weight: 700;
      color: #0d9488;
      background: white;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #99f6e4;
      direction: ltr;
    }
    .patient-summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
    }
    .summary-field label {
      display: block;
      font-size: 7.5pt;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
    }
    .summary-field span {
      display: block;
      font-size: 9.5pt;
      color: #0f172a;
      font-weight: 700;
    }
    .content-box {
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 10.5pt;
      font-weight: 800;
      color: #0f766e;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    table.med-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      margin-bottom: 12px;
    }
    table.med-table th {
      background-color: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-align: right;
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
    }
    table.med-table td {
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
      color: #1e293b;
    }
    table.med-table tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .badge-normal {
      display: inline-block;
      padding: 1px 6px;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
      border-radius: 4px;
      font-weight: 700;
      font-size: 7.5pt;
    }
    .badge-critical, .badge-high {
      display: inline-block;
      padding: 1px 6px;
      background: #fff1f2;
      color: #e11d48;
      border: 1px solid #fecdd3;
      border-radius: 4px;
      font-weight: 700;
      font-size: 7.5pt;
    }
    .badge-low {
      display: inline-block;
      padding: 1px 6px;
      background: #fefce8;
      color: #ca8a04;
      border: 1px solid #fef08a;
      border-radius: 4px;
      font-weight: 700;
      font-size: 7.5pt;
    }
    .signature-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 28px;
      padding-top: 14px;
      border-top: 1.5px dashed #cbd5e1;
      page-break-inside: avoid;
    }
    .stamp-box {
      border: 2px dashed #0d9488;
      border-radius: 12px;
      padding: 8px 16px;
      text-align: center;
      color: #0f766e;
      font-size: 8.5pt;
      font-weight: 800;
      background: #f0fdfa;
      display: inline-block;
    }
    .sign-block {
      text-align: center;
      min-width: 140px;
    }
    .sign-line {
      width: 140px;
      border-bottom: 1.5px solid #64748b;
      margin: 8px auto 4px auto;
    }
    .doc-disclaimer {
      font-size: 7.5pt;
      color: #94a3b8;
      text-align: center;
      margin-top: 14px;
      border-top: 1px solid #f1f5f9;
      padding-top: 6px;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-sheet">
    ${contentHtml}
  </div>
</body>
</html>`;
}

/**
 * Robust Direct Print using an isolated hidden iframe.
 * If iframe printing is blocked by sandbox, falls back to opening in a new tab or triggering download.
 */
export function printHtmlDocument(htmlContent: string, title = 'Document'): boolean {
  try {
    const fullHtml = buildDocumentHtml(htmlContent, title);

    // 1. Attempt Hidden Iframe Printing (cleanest, doesn't leave stray windows)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(fullHtml);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          // Clean up iframe after printing dialog closes
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 3000);
        } catch (printErr) {
          console.warn('Iframe print failed or was restricted, falling back to new window:', printErr);
          fallbackOpenWindowOrDownload(fullHtml, title);
        }
      }, 500);

      return true;
    }
  } catch (err) {
    console.error('Error in printHtmlDocument:', err);
    fallbackOpenWindowOrDownload(buildDocumentHtml(htmlContent, title), title);
    return false;
  }

  return false;
}

/**
 * Fallback to opening printable HTML in a new tab or prompting download
 */
function fallbackOpenWindowOrDownload(fullHtml: string, title: string) {
  try {
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Try opening new tab
    const newWin = window.open(url, '_blank');
    if (newWin) {
      newWin.focus();
      setTimeout(() => {
        try {
          newWin.print();
        } catch {
          // Ignore
        }
      }, 700);
    } else {
      // If popup blocker intervened, trigger direct download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } catch (err) {
    console.error('Failed to open or download print document:', err);
  }
}

/**
 * Exports document as a standalone downloadable HTML/PDF-ready file
 */
export function downloadDocumentAsHtml(htmlContent: string, title = 'Medical_Document') {
  const fullHtml = buildDocumentHtml(htmlContent, title);
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/[\s/\\:]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
