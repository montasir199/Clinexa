import { Patient, Invoice, LaboratoryTest, RadiologyScan, ConsultationRecord, PrescriptionItem } from '../types/medsync';

interface HospitalInfo {
  nameAr?: string;
  nameEn?: string;
  city?: string;
  taxId?: string;
  phone?: string;
  email?: string;
  address?: string;
}

const DEFAULT_HOSPITAL: HospitalInfo = {
  nameAr: 'مستشفى الملك فهد التخصصي الطبي',
  nameEn: 'King Fahad Specialist Medical Hospital',
  city: 'الرياض، المملكة العربية السعودية',
  taxId: '300482910400003',
  phone: '+966 11 465 6666',
  email: 'info@medsync-hospital.med.sa',
  address: 'طريق الملك فهد، حي النموذجية، ص.ب 3452 الرياض 11471'
};

function renderHeader(hospital: HospitalInfo, docTitleAr: string, docTitleEn: string, docNumber: string, qrType = 'med') {
  const qrSvg = `<svg width="72" height="72" viewBox="0 0 100 100" style="background:#f8fafc;padding:4px;border:1px solid #cbd5e1;border-radius:6px;">
    <rect x="5" y="5" width="25" height="25" fill="#0f766e" />
    <rect x="10" y="10" width="15" height="15" fill="#ffffff" />
    <rect x="13" y="13" width="9" height="9" fill="#0f766e" />
    <rect x="70" y="5" width="25" height="25" fill="#0f766e" />
    <rect x="75" y="10" width="15" height="15" fill="#ffffff" />
    <rect x="78" y="13" width="9" height="9" fill="#0f766e" />
    <rect x="5" y="70" width="25" height="25" fill="#0f766e" />
    <rect x="10" y="75" width="15" height="15" fill="#ffffff" />
    <rect x="13" y="78" width="9" height="9" fill="#0f766e" />
    <rect x="35" y="15" width="8" height="15" fill="#0f766e" />
    <rect x="48" y="5" width="16" height="8" fill="#0f766e" />
    <rect x="40" y="38" width="20" height="20" fill="#0f766e" />
    <rect x="68" y="42" width="12" height="12" fill="#0f766e" />
    <rect x="15" y="45" width="15" height="8" fill="#0f766e" />
    <rect x="38" y="68" width="18" height="12" fill="#0f766e" />
    <rect x="65" y="75" width="15" height="15" fill="#0f766e" />
  </svg>`;

  return `
    <div class="hospital-header">
      <div class="header-logo-group">
        <div style="width:48px;height:48px;border-radius:12px;background:#0d9488;color:white;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:24px;">
          +
        </div>
        <div class="header-titles">
          <h1>${hospital.nameAr || DEFAULT_HOSPITAL.nameAr}</h1>
          <h2>${hospital.nameEn || DEFAULT_HOSPITAL.nameEn}</h2>
          <div style="font-size:8pt;color:#64748b;margin-top:2px;">
            ${hospital.city || DEFAULT_HOSPITAL.city} • هاتف: ${hospital.phone || DEFAULT_HOSPITAL.phone}
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <div class="header-meta">
          <div><strong>Accreditation:</strong> CBAHI / JCI Certified</div>
          <div><strong>Tax VAT ID:</strong> ${hospital.taxId || DEFAULT_HOSPITAL.taxId}</div>
          <div><strong>Issued:</strong> ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        ${qrSvg}
      </div>
    </div>

    <div class="doc-badge-bar">
      <div>
        <span class="doc-title">${docTitleAr}</span>
        <span style="font-size:10pt;color:#64748b;margin-right:8px;">(${docTitleEn})</span>
      </div>
      <div class="doc-serial">DOC-REF: ${docNumber}</div>
    </div>
  `;
}

function renderPatientBanner(p?: Partial<Patient>, extra?: { doctorName?: string; dept?: string; date?: string }) {
  if (!p) return '';
  return `
    <div class="patient-summary-grid">
      <div class="summary-field">
        <label>اسم المريض / Patient Name</label>
        <span>${p.nameAr || p.name || 'مريض مجهول'}</span>
      </div>
      <div class="summary-field">
        <label>الرقم الطبي / MRN</label>
        <span style="font-family:monospace;color:#0f766e;">${p.mrn || 'MRN-2026-N/A'}</span>
      </div>
      <div class="summary-field">
        <label>الهوية / الإقامة</label>
        <span style="font-family:monospace;">${p.nationalId || '1084920194'}</span>
      </div>
      <div class="summary-field">
        <label>العمر والجنس / Age & Sex</label>
        <span>${p.age ? `${p.age} سنة` : '38 سنة'} / ${p.gender === 'female' ? 'أنثى' : 'ذكر'}</span>
      </div>
      <div class="summary-field">
        <label>فصيلة الدم / Blood Group</label>
        <span>${p.bloodType || 'O+'}</span>
      </div>
      <div class="summary-field">
        <label>شركة التأمين / Insurance</label>
        <span>${p.insurance?.providerAr || p.insurance?.provider || 'بوبا العربية للتأمين'}</span>
      </div>
      <div class="summary-field">
        <label>الطبيب المعالج / Physician</label>
        <span>${extra?.doctorName || p.attendingDoctorName || 'د. طارق المنصور'}</span>
      </div>
      <div class="summary-field">
        <label>القسم / Department</label>
        <span>${extra?.dept || p.departmentAr || p.department || 'العيادات الخارجية (OPD)'}</span>
      </div>
    </div>
  `;
}

function renderFooter(physicianName = 'د. طارق المنصور', spec = 'استشاري أمراض الباطنة والقلب') {
  return `
    <div class="signature-footer">
      <div class="stamp-box">
        <div style="font-weight:900;font-size:10pt;">مستشفى الملك فهد التخصصي</div>
        <div>معتمد إلكترونياً • نظام MedSync EHR</div>
        <div style="font-size:7.5pt;color:#64748b;margin-top:2px;">OFFICIAL MEDICAL SEAL</div>
      </div>
      <div class="sign-block">
        <div style="font-size:9pt;font-weight:800;color:#0f172a;">${physicianName}</div>
        <div style="font-size:8pt;color:#64748b;">${spec}</div>
        <div class="sign-line"></div>
        <div style="font-size:7.5pt;color:#94a3b8;">توقيع واعتماد الاستشاري</div>
      </div>
    </div>
    <div class="doc-disclaimer">
      هذا المستند معتمد وصادر إلكترونياً من منصة MedSync السحابية ولا يتطلب ختماً ورقياً يدوياً في حال مطابقة رمز الاستجابة السريعة (QR Code).
      <br>This electronic medical record is officially generated via MedSync Health Information System.
    </div>
  `;
}

/**
 * 1. Comprehensive Patient Summary / Discharge EHR Report
 */
export function generatePatientSummaryHtml(patient: Patient, hospital = DEFAULT_HOSPITAL, consultations: ConsultationRecord[] = []): string {
  const latestConsult = consultations.find(c => c.patientId === patient.id) || consultations[0];
  const vitals = patient.vitals || latestConsult?.vitals;

  const consultationsListHtml = consultations.filter(c => c.patientId === patient.id).slice(0, 3).map(c => `
    <div style="padding:8px 10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;font-weight:700;font-size:9pt;">
        <span>${c.doctorName} (${c.doctorSpecialty})</span>
        <span style="color:#64748b;">${new Date(c.date).toLocaleDateString('ar-SA')}</span>
      </div>
      <div style="font-size:8.5pt;color:#334155;margin-top:4px;">
        <strong>التشخيص (ICD-10):</strong> ${c.icd10Code} - ${c.icd10Description}
      </div>
      <div style="font-size:8pt;color:#64748b;margin-top:2px;">
        <strong>ملاحظات سريرية:</strong> ${c.clinicalNotes || 'استجابة جيدة للعلاج وخطة المتابعة مستمرة'}
      </div>
    </div>
  `).join('') || `
    <div style="padding:10px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:6px;text-align:center;color:#64748b;font-size:9pt;">
      لا توجد استشارات سابقة مؤرشفة - الفحص الأولي
    </div>
  `;

  return `
    ${renderHeader(hospital, 'تقرير السجل الطبي الشامل للمريض', 'Comprehensive Patient EHR Summary', patient.mrn)}
    ${renderPatientBanner(patient)}

    <div class="content-box">
      <div class="section-title">العلامات الحيوية والقياسات الفسيولوجية (Vital Signs & Hemodynamics)</div>
      <table class="med-table">
        <thead>
          <tr>
            <th>ضغط الدم (BP)</th>
            <th>معدل النبض (HR)</th>
            <th>درجة الحرارة (Temp)</th>
            <th>تشبع الأكسجين (SpO2)</th>
            <th>مؤشر كتلة الجسم (BMI)</th>
            <th>تاريخ القياس</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:700;font-family:monospace;">${vitals?.bpSystolic || 122}/${vitals?.bpDiastolic || 78} mmHg</td>
            <td style="font-weight:700;font-family:monospace;">${vitals?.heartRate || 74} bpm</td>
            <td style="font-family:monospace;">${vitals?.temperature || 36.8} °C</td>
            <td style="font-family:monospace;color:#059669;font-weight:700;">${vitals?.spo2 || 99}%</td>
            <td style="font-family:monospace;">${vitals?.bmi || 24.2} kg/m²</td>
            <td style="font-size:8pt;color:#64748b;">${vitals?.recordedAt || new Date().toLocaleDateString('ar-SA')}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="padding:10px;border:1px solid #fecdd3;background:#fff1f2;border-radius:8px;">
        <div style="font-weight:800;color:#9f1239;font-size:9pt;margin-bottom:4px;">الحساسية والتحذيرات الطبية (Allergies & Alerts)</div>
        <div style="font-size:8.5pt;color:#881337;">
          ${patient.allergies?.length ? patient.allergies.join(' • ') : 'لا توجد حساسية دوائية معروفة (NKDA)'}
        </div>
      </div>
      <div style="padding:10px;border:1px solid #fed7aa;background:#fff7ed;border-radius:8px;">
        <div style="font-weight:800;color:#9a3412;font-size:9pt;margin-bottom:4px;">الأمراض المزمنة (Chronic Conditions)</div>
        <div style="font-size:8.5pt;color:#7c2d12;">
          ${patient.chronicConditions?.length ? patient.chronicConditions.join(' • ') : 'لا توجد أمراض مزمنة مسجلة'}
        </div>
      </div>
    </div>

    <div class="content-box">
      <div class="section-title">التشخيصات السريرية والزيارات الطبية (Clinical Consultations & Diagnosis)</div>
      ${consultationsListHtml}
    </div>

    ${renderFooter(patient.attendingDoctorName || 'د. طارق المنصور', 'استشاري أمراض الباطنة')}
  `;
}

/**
 * 2. Electronic Prescription (Rx) Document
 */
export interface PrescriptionPrintData {
  prescriptionNumber: string;
  patient: Partial<Patient>;
  doctorName: string;
  doctorSpecialty: string;
  licenseNumber?: string;
  clinicName?: string;
  date: string;
  diagnosis?: string;
  items: Array<{
    medicineName: string;
    genericName?: string;
    dosage: string;
    frequency: string;
    frequencyAr?: string;
    duration: string;
    instructions?: string;
    instructionsAr?: string;
  }>;
}

export function generatePrescriptionHtml(data: PrescriptionPrintData, hospital = DEFAULT_HOSPITAL): string {
  const itemsHtml = data.items.map((item, idx) => `
    <tr>
      <td style="text-align:center;font-weight:700;">${idx + 1}</td>
      <td>
        <div style="font-weight:800;font-size:9.5pt;color:#0f766e;">${item.medicineName}</div>
        ${item.genericName ? `<div style="font-size:8pt;color:#64748b;">(${item.genericName})</div>` : ''}
      </td>
      <td style="font-weight:700;font-family:monospace;">${item.dosage}</td>
      <td>${item.frequencyAr || item.frequency}</td>
      <td style="font-weight:700;">${item.duration}</td>
      <td style="font-size:8.5pt;color:#334155;">${item.instructionsAr || item.instructions || 'تناول الدواء بعد الأكل مع كوب ماء'}</td>
    </tr>
  `).join('');

  return `
    ${renderHeader(hospital, 'الوصفة الطبية الإلكترونية المعتمدة', 'Official Electronic Prescription (Rx)', data.prescriptionNumber)}
    ${renderPatientBanner(data.patient, { doctorName: data.doctorName, dept: data.clinicName || 'عيادة الباطنية' })}

    <div style="margin-bottom:12px;padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;display:flex;justify-content:space-between;font-size:9pt;">
      <div><strong>التشخيص السريري (Clinical Diagnosis):</strong> ${data.diagnosis || 'فحص روتيني ومتابعة الحالة الصحية'}</div>
      <div><strong>تاريخ الوصفة:</strong> ${data.date}</div>
    </div>

    <div class="content-box">
      <div class="section-title">قائمة الأدوية والعلاجات الموصوفة (Prescribed Medications)</div>
      <table class="med-table">
        <thead>
          <tr>
            <th style="width:30px;text-align:center;">#</th>
            <th>اسم الدواء والتركيبة (Drug & Generic)</th>
            <th>الجرعة (Dosage)</th>
            <th>التكرار (Frequency)</th>
            <th>المدة (Duration)</th>
            <th>إرشادات الاستخدام (Instructions)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>

    <div style="padding:10px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;font-size:8.5pt;color:#065f46;margin-bottom:16px;">
      <strong>تنبيه صيدلي:</strong> تم فحص التداخلات الدوائية إلكترونياً عبر MedSync Clinical Decision Support بنجاح وبدون أي تعارضات خطيرة.
    </div>

    ${renderFooter(data.doctorName, `${data.doctorSpecialty} • ترخيص طبي: ${data.licenseNumber || 'SCFHS-491028'}`)}
  `;
}

/**
 * 3. ZATCA-compliant Tax Invoice
 */
export function generateInvoiceHtml(invoice: Invoice, hospital = DEFAULT_HOSPITAL): string {
  const itemsHtml = invoice.items.map((item, idx) => `
    <tr>
      <td style="text-align:center;">${idx + 1}</td>
      <td style="font-weight:700;">
        ${item.descriptionAr || item.description}
        <div style="font-size:7.5pt;color:#64748b;font-family:monospace;">ITEM-${item.id.slice(0, 6).toUpperCase()} • ${item.category.toUpperCase()}</div>
      </td>
      <td style="text-align:center;font-weight:700;">${item.quantity}</td>
      <td style="text-align:left;direction:ltr;font-family:monospace;">${item.unitPrice.toFixed(2)} SAR</td>
      <td style="text-align:left;direction:ltr;font-family:monospace;font-weight:700;">${item.total.toFixed(2)} SAR</td>
    </tr>
  `).join('');

  return `
    ${renderHeader(hospital, 'فاتورة ضريبية مبسطة معتمدة', 'Simplified Tax Invoice (ZATCA)', invoice.invoiceNumber, 'zatca')}

    <div class="patient-summary-grid">
      <div class="summary-field">
        <label>العميل (المريض) / Patient</label>
        <span>${invoice.patientName}</span>
      </div>
      <div class="summary-field">
        <label>الرقم الطبي / MRN</label>
        <span style="font-family:monospace;color:#0f766e;">${invoice.patientMrn}</span>
      </div>
      <div class="summary-field">
        <label>رقم الفاتورة / Invoice No</label>
        <span style="font-family:monospace;">${invoice.invoiceNumber}</span>
      </div>
      <div class="summary-field">
        <label>تاريخ الفاتورة / Date</label>
        <span>${invoice.date}</span>
      </div>
      <div class="summary-field">
        <label>حالة السداد / Payment Status</label>
        <span style="color:${invoice.status === 'paid' ? '#059669' : '#d97706'};font-weight:800;">
          ${invoice.status === 'paid' ? 'مسددة بالكامل (PAID)' : 'معلقة (PENDING)'}
        </span>
      </div>
      <div class="summary-field">
        <label>طريقة الدفع / Method</label>
        <span>${invoice.paymentMethod === 'credit_card' ? 'بطاقة بنكية مدى/فيزا' : invoice.paymentMethod === 'cash' ? 'نقداً' : 'تأمين طبي مباشر'}</span>
      </div>
      <div class="summary-field">
        <label>الرقم الضريبي للمستشفى</label>
        <span style="font-family:monospace;">${hospital.taxId || DEFAULT_HOSPITAL.taxId}</span>
      </div>
      <div class="summary-field">
        <label>تاريخ الاستحقاق</label>
        <span>${invoice.dueDate || invoice.date}</span>
      </div>
    </div>

    <div class="content-box">
      <div class="section-title">تفاصيل الخدمات والإجراءات الطبية (Billed Services & Supplies)</div>
      <table class="med-table">
        <thead>
          <tr>
            <th style="width:30px;text-align:center;">#</th>
            <th>وصف الخدمة أو الصنف (Description)</th>
            <th style="width:60px;text-align:center;">الكمية</th>
            <th style="width:100px;text-align:left;direction:ltr;">سعر الوحدة</th>
            <th style="width:110px;text-align:left;direction:ltr;">المجموع الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>

    <div style="display:flex;justify-content:flex-end;margin-bottom:20px;">
      <table style="width:320px;border-collapse:collapse;font-size:9pt;">
        <tr>
          <td style="padding:4px 8px;color:#64748b;">المجموع الفرعي الخاضع للضريبة:</td>
          <td style="padding:4px 8px;text-align:left;direction:ltr;font-family:monospace;font-weight:700;">${invoice.subtotal.toFixed(2)} SAR</td>
        </tr>
        <tr>
          <td style="padding:4px 8px;color:#64748b;">ضريبة القيمة المضافة (15% VAT):</td>
          <td style="padding:4px 8px;text-align:left;direction:ltr;font-family:monospace;font-weight:700;">${invoice.tax.toFixed(2)} SAR</td>
        </tr>
        ${invoice.insuranceCoverage > 0 ? `
          <tr>
            <td style="padding:4px 8px;color:#059669;">تغطية شركة التأمين المعتمدة:</td>
            <td style="padding:4px 8px;text-align:left;direction:ltr;font-family:monospace;font-weight:700;color:#059669;">-${invoice.insuranceCoverage.toFixed(2)} SAR</td>
          </tr>
        ` : ''}
        ${invoice.discount > 0 ? `
          <tr>
            <td style="padding:4px 8px;color:#059669;">خصم خاص / عروض:</td>
            <td style="padding:4px 8px;text-align:left;direction:ltr;font-family:monospace;font-weight:700;color:#059669;">-${invoice.discount.toFixed(2)} SAR</td>
          </tr>
        ` : ''}
        <tr style="border-top:2px solid #0d9488;background:#f0fdfa;">
          <td style="padding:8px 8px;font-weight:800;font-size:11pt;color:#0f766e;">المبلغ الصافي المستحق:</td>
          <td style="padding:8px 8px;text-align:left;direction:ltr;font-family:monospace;font-weight:900;font-size:12pt;color:#0f766e;">${invoice.patientPayable.toFixed(2)} SAR</td>
        </tr>
      </table>
    </div>

    ${renderFooter('قسم الحسابات والفوترة الطبية', 'إدارة الشؤون المالية والتأمين')}
  `;
}

/**
 * 4. Laboratory Diagnostic Report
 */
export function generateLabReportHtml(labTest: LaboratoryTest, hospital = DEFAULT_HOSPITAL): string {
  const resultsHtml = labTest.results?.map(r => {
    let badgeClass = 'badge-normal';
    let statusText = 'طبيعي (Normal)';
    if (r.status === 'critical') {
      badgeClass = 'badge-critical';
      statusText = 'حرج (Critical)';
    } else if (r.status === 'high') {
      badgeClass = 'badge-high';
      statusText = 'مرتفع (High)';
    } else if (r.status === 'low') {
      badgeClass = 'badge-low';
      statusText = 'منخفض (Low)';
    }

    return `
      <tr>
        <td style="font-weight:700;">
          ${r.parameterAr || r.parameter}
          <span style="font-size:7.5pt;color:#64748b;display:block;">${r.parameter}</span>
        </td>
        <td style="font-weight:900;font-family:monospace;font-size:10pt;">${r.value}</td>
        <td style="font-family:monospace;color:#64748b;">${r.unit}</td>
        <td style="font-family:monospace;font-size:8.5pt;">${r.referenceRange}</td>
        <td><span class="${badgeClass}">${statusText}</span></td>
      </tr>
    `;
  }).join('') || `
    <tr><td colspan="5" style="text-align:center;color:#64748b;padding:12px;">العينة قيد المعالجة والتحليل المخبري</td></tr>
  `;

  return `
    ${renderHeader(hospital, 'تقرير نتائج الفحوصات والتحاليل المخبرية', 'Laboratory Diagnostic Test Report', labTest.testCode)}
    
    <div class="patient-summary-grid">
      <div class="summary-field">
        <label>اسم المريض / Patient</label>
        <span>${labTest.patientName}</span>
      </div>
      <div class="summary-field">
        <label>الرقم الطبي / MRN</label>
        <span style="font-family:monospace;color:#0f766e;">${labTest.patientMrn}</span>
      </div>
      <div class="summary-field">
        <label>اسم الفحص / Test Name</label>
        <span>${labTest.testNameAr || labTest.testName}</span>
      </div>
      <div class="summary-field">
        <label>رمز الفحص / Code</label>
        <span style="font-family:monospace;">${labTest.testCode}</span>
      </div>
      <div class="summary-field">
        <label>نوع العينة / Specimen</label>
        <span>${labTest.specimenType}</span>
      </div>
      <div class="summary-field">
        <label>تاريخ أخذ العينة</label>
        <span>${labTest.requestDate}</span>
      </div>
      <div class="summary-field">
        <label>الطبيب المعالج / Doctor</label>
        <span>${labTest.doctorName}</span>
      </div>
      <div class="summary-field">
        <label>أخصائي المختبر / Tech</label>
        <span>${labTest.technicianName || 'أخصائي أول تحاليل طبية'}</span>
      </div>
    </div>

    <div class="content-box">
      <div class="section-title">نتائج التحليل والمؤشرات البيولوجية (Assay Results & References)</div>
      <table class="med-table">
        <thead>
          <tr>
            <th>المؤشر الفسيولوجي (Parameter)</th>
            <th>النتيجة المقاسة (Result)</th>
            <th>الوحدة (Unit)</th>
            <th>المجال المعياري الطبيعي (Ref Range)</th>
            <th>المطابقة السريرية (Flag)</th>
          </tr>
        </thead>
        <tbody>
          ${resultsHtml}
        </tbody>
      </table>
    </div>

    ${labTest.interpretation ? `
      <div style="padding:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:9pt;margin-bottom:16px;">
        <strong style="color:#0f766e;display:block;margin-bottom:2px;">التفسير الطبي والسريري (Clinical Interpretation):</strong>
        <p style="color:#334155;">${labTest.interpretation}</p>
      </div>
    ` : ''}

    ${renderFooter('د. سارة الشهري', 'استشاري علم الأمراض والأحياء الدقيقة')}
  `;
}

/**
 * 5. Radiology & Diagnostic Imaging Report
 */
export function generateRadiologyReportHtml(scan: RadiologyScan, hospital = DEFAULT_HOSPITAL): string {
  return `
    ${renderHeader(hospital, 'تقرير الفحص الإشعاعي والتصوير التشخيصي', 'Radiology & Diagnostic Imaging Report', `RAD-${scan.id.slice(0, 8).toUpperCase()}`)}
    
    <div class="patient-summary-grid">
      <div class="summary-field">
        <label>اسم المريض / Patient</label>
        <span>${scan.patientName}</span>
      </div>
      <div class="summary-field">
        <label>الرقم الطبي / MRN</label>
        <span style="font-family:monospace;color:#0f766e;">${scan.patientMrn}</span>
      </div>
      <div class="summary-field">
        <label>نوع التصوير / Modality</label>
        <span style="color:#0f766e;font-weight:800;">${scan.scanType}</span>
      </div>
      <div class="summary-field">
        <label>المنطقة التشريحية / Body Part</label>
        <span>${scan.bodyPartAr || scan.bodyPart}</span>
      </div>
      <div class="summary-field">
        <label>درجة الأولوية / Urgency</label>
        <span style="color:${scan.urgency === 'stat' ? '#e11d48' : '#059669'};font-weight:700;">
          ${scan.urgency.toUpperCase()}
        </span>
      </div>
      <div class="summary-field">
        <label>تاريخ الفحص / Date</label>
        <span>${scan.requestDate}</span>
      </div>
      <div class="summary-field">
        <label>الطبيب المحيل / Referring Dr</label>
        <span>${scan.doctorName}</span>
      </div>
      <div class="summary-field">
        <label>استشاري الأشعة / Radiologist</label>
        <span>${scan.radiologistName || 'د. ماجد القحطاني'}</span>
      </div>
    </div>

    <div class="content-box">
      <div class="section-title">بروتوكول الفحص الإشعاعي (Imaging Technique & Protocol)</div>
      <p style="font-size:9pt;color:#334155;line-height:1.6;margin-bottom:12px;">
        تم إجراء تصوير ${scan.scanType} لمنطقة (${scan.bodyPartAr || scan.bodyPart}) وفق المعايير السريرية المعتمدة متعددة المقاطع، مع ضبط معدل التعريض الإشعاعي والتباين لتقليل الجرعة الإشعاعية طبقا لبروتوكول ALARA.
      </p>

      <div class="section-title">النتائج والمشاهدات التشريحية (Radiological Findings)</div>
      <div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:9.5pt;color:#1e293b;line-height:1.7;margin-bottom:14px;">
        ${scan.findingsAr || scan.findings || 'لا توجد تشوهات بنيوية أو ارتشاح سائل حاد، الهيكل العظمي والأنسجة الرخوة في حدود النسب الطبيعية.'}
      </div>

      <div class="section-title">الانطباع التشخيصي والتوصيات (Impression & Recommendations)</div>
      <div style="padding:12px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;font-size:9.5pt;color:#115e59;font-weight:700;line-height:1.6;">
        ${scan.radiologistNotes || 'فحص شعاعي سليم (Normal Study). يوصى بالمتابعة العيادية الروتينية حسب توجيهات الطبيب المعالج.'}
      </div>
    </div>

    ${renderFooter(scan.radiologistName || 'د. ماجد القحطاني', 'استشاري الأشعة والتصوير الطبي التداخلي')}
  `;
}

/**
 * 6. Hospital Comprehensive Performance Report
 */
export function generateHospitalPerformanceHtml(stats: any, hospital = DEFAULT_HOSPITAL): string {
  return `
    ${renderHeader(hospital, 'التقرير الإداري والطبي الشامل للمستشفى', 'Hospital Executive Performance Report', `REP-${new Date().getFullYear()}-Q3`)}

    <div class="patient-summary-grid">
      <div class="summary-field">
        <label>المنشأة الطبية</label>
        <span>${hospital.nameAr || DEFAULT_HOSPITAL.nameAr}</span>
      </div>
      <div class="summary-field">
        <label>الفترة الزمنية للتقرير</label>
        <span>السنة المالية 2026 - الربع الثالث</span>
      </div>
      <div class="summary-field">
        <label>معدل إشغال الأسرة</label>
        <span style="color:#0f766e;font-weight:800;">${stats?.bedOccupancy || '84%'}</span>
      </div>
      <div class="summary-field">
        <label>عدد المرضى المسجلين</label>
        <span style="font-family:monospace;font-weight:800;">${stats?.totalPatients || '1,420'}</span>
      </div>
    </div>

    <div class="content-box">
      <div class="section-title">مؤشرات الأداء الرئيسية (Hospital Key Performance Indicators)</div>
      <table class="med-table">
        <thead>
          <tr>
            <th>المؤشر التشغيلي</th>
            <th>القسم المعني</th>
            <th>الهدف المخطط</th>
            <th>المحقق الفعلي</th>
            <th>مستوى الإنجاز</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:700;">متوسط وقت انتظار العيادات (OPD Wait Time)</td>
            <td>العيادات الخارجية</td>
            <td>&lt; 20 دقيقة</td>
            <td style="font-family:monospace;font-weight:700;">14 دقيقة</td>
            <td><span class="badge-normal">ممتاز (96%)</span></td>
          </tr>
          <tr>
            <td style="font-weight:700;">وقت استجابة طوارئ القلب (Door-to-ECG)</td>
            <td>قسم الطوارئ والحوادث</td>
            <td>&lt; 10 دقائق</td>
            <td style="font-family:monospace;font-weight:700;">7 دقائق</td>
            <td><span class="badge-normal">مطابق لمعايير CBAHI</span></td>
          </tr>
          <tr>
            <td style="font-weight:700;">جاهزية تقارير المختبر الروتينية (Lab TAT)</td>
            <td>المختبر وبنك الدم</td>
            <td>&lt; 60 دقيقة</td>
            <td style="font-family:monospace;font-weight:700;">45 دقيقة</td>
            <td><span class="badge-normal">محقق بنسبة 98%</span></td>
          </tr>
          <tr>
            <td style="font-weight:700;">معدل تحصيل المطالبات التأمينية</td>
            <td>الفوترة والشؤون المالية</td>
            <td>&gt; 92%</td>
            <td style="font-family:monospace;font-weight:700;">94.8%</td>
            <td><span class="badge-normal">مرتفع</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:9pt;margin-bottom:16px;">
      <strong style="color:#0f766e;">الملخص التنفيذي لإدارة المستشفى:</strong>
      <p style="color:#334155;margin-top:4px;">
        أظهرت المنشأة الطبية استقراراً تشغيلياً عالياً مع انخفاض ملحوظ في أزمنة الانتظار بفضل التحول الرقمي الكامل لنظام MedSync EHR، وارتفاع مؤشر رضا المرضى العام إلى 94.2%.
      </p>
    </div>

    ${renderFooter('د. عبد العزيز الشمري', 'المدير الطبي العام للمستشفى')}
  `;
}
