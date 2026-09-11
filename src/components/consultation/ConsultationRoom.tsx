import React, { useState, useEffect } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { 
  FileHeart, 
  User, 
  Stethoscope, 
  AlertTriangle, 
  HeartPulse, 
  Pill, 
  FlaskConical, 
  Scan, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Calendar,
  Clock,
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  Search,
  Printer
} from 'lucide-react';

export const ConsultationRoom: React.FC = () => {
  const { 
    patients, 
    doctors, 
    appointments, 
    medicines, 
    saveConsultation, 
    selectedConsultationAptId, 
    setSelectedConsultationAptId,
    setActiveTab,
    openPrintDocument,
    t, 
    language 
  } = useMedSync();

  // Find active appointment or default to first waiting/confirmed
  const activeAppointment = appointments.find(a => a.id === selectedConsultationAptId) 
    || appointments.find(a => a.status === 'in_progress' || a.status === 'waiting') 
    || appointments[0];

  const activePatient = patients.find(p => p.id === activeAppointment?.patientId) || patients[0];
  const activeDoctor = doctors.find(d => d.id === activeAppointment?.doctorId) || doctors[0];

  // Clinical Consultation Form States
  const [chiefComplaint, setChiefComplaint] = useState(activeAppointment?.notes || 'Persistent chest tightness and mild dyspnea upon moderate walking.');
  const [clinicalNotes, setClinicalNotes] = useState('Patient alert and oriented. Chest clear on auscultation. S1+S2 present, no murmurs. Mild peripheral edema noted.');
  const [diagnosis, setDiagnosis] = useState('Essential Primary Hypertension (Stage II) with mild angina');
  const [icd10Code, setIcd10Code] = useState('I10 / I20.9');

  // Prescriptions List
  const [prescriptions, setPrescriptions] = useState<Array<{
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>>([
    {
      medicineName: 'Amlodipine Besylate',
      dosage: '5mg Tablet',
      frequency: 'Once Daily (صباحاً)',
      duration: '30 Days',
      instructions: 'Take after breakfast with water'
    }
  ]);

  // Ordered Lab & Radiology
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>(['Lipid Profile Panel', 'Serum Creatinine & Urea']);
  const [selectedScans, setSelectedScans] = useState<string[]>(['Echocardiogram (Echo)']);
  const [followUpDate, setFollowUpDate] = useState('After 2 Weeks');

  // Quick Medicine Adder State
  const [selectedMedStockId, setSelectedMedStockId] = useState(medicines[0]?.id || '');
  const [rxDosage, setRxDosage] = useState('1 Tablet');
  const [rxFrequency, setRxFrequency] = useState('Twice Daily (مرتين يومياً)');
  const [rxDuration, setRxDuration] = useState('7 Days');

  const handleAddMedicine = () => {
    const med = medicines.find(m => m.id === selectedMedStockId);
    if (!med) return;

    setPrescriptions(prev => [
      ...prev,
      {
        medicineName: `${med.brandName} (${med.strength})`,
        dosage: rxDosage,
        frequency: rxFrequency,
        duration: rxDuration,
        instructions: 'As directed by physician'
      }
    ]);
  };

  const handleRemovePrescription = (idx: number) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleToggleLab = (testName: string) => {
    setSelectedLabTests(prev => 
      prev.includes(testName) ? prev.filter(t => t !== testName) : [...prev, testName]
    );
  };

  const handleToggleScan = (scanName: string) => {
    setSelectedScans(prev => 
      prev.includes(scanName) ? prev.filter(s => s !== scanName) : [...prev, scanName]
    );
  };

  const handleSaveAndFinalize = () => {
    if (!activePatient || !activeDoctor) return;

    saveConsultation({
      hospitalId: 'hosp-1',
      patientId: activePatient.id,
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      appointmentId: activeAppointment?.id,
      date: new Date().toISOString().split('T')[0],
      chiefComplaint,
      clinicalNotes,
      diagnosis,
      icd10Code,
      prescriptions,
      orderedLabTests: selectedLabTests,
      orderedRadiologyScans: selectedScans,
      followUpDate,
      vitalsAtVisit: activePatient.vitals
    });

    setActiveTab('patients');
  };

  const handlePrintPrescription = () => {
    if (!activePatient || !activeDoctor) return;
    openPrintDocument({
      type: 'prescription',
      data: {
        prescriptionNumber: `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        patient: activePatient,
        doctorName: activeDoctor.nameAr || activeDoctor.name,
        doctorSpecialty: activeDoctor.specialtyAr || activeDoctor.specialty,
        clinicName: activeDoctor.departmentAr || activeDoctor.department,
        date: new Date().toLocaleDateString('ar-SA'),
        diagnosis: `${icd10Code} - ${diagnosis}`,
        items: prescriptions
      },
      title: t(`الوصفة الطبية - ${activePatient.nameAr || activePatient.name}`, `Prescription - ${activePatient.name}`)
    });
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Active Patient Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs font-bold uppercase text-teal-600 dark:text-teal-400">
              {t('غرفة الكشف السريري الفعالة (Active Examination)', 'Active Clinical Examination Desk')}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileHeart className="w-6 h-6 text-teal-600" />
            <span>{t('كشف واستشارة طبية (EHR Examination)', 'Physician Consultation Desk')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('تسجيل الأعراض، الفحص السريري، التشخيص الدولي ICD-10، وطلب الفحوصات والوصفات الطبية', 'Clinical documentation, ICD-10 diagnosis, e-prescribing, and diagnostic test order entry')}
          </p>
        </div>

        {/* Action: Select Patient from Queue */}
        <div className="flex items-center gap-3">
          <select
            value={activeAppointment?.id || ''}
            onChange={(e) => setSelectedConsultationAptId(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-sm outline-none"
          >
            {appointments.map(apt => (
              <option key={apt.id} value={apt.id}>
                {language === 'ar' ? apt.patientNameAr : apt.patientName} ({apt.patientMrn}) - {apt.time} [{apt.status}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Patient Banner & Live Telemetry Vitals Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              {activePatient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {language === 'ar' ? activePatient.nameAr : activePatient.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-50 text-rose-600 border border-rose-200 dark:border-rose-900">
                  {activePatient.bloodType}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  {activePatient.age} {t('سنة', 'yrs')} • {activePatient.gender === 'male' ? t('ذكر', 'Male') : t('أنثى', 'Female')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                MRN: <strong className="text-blue-600">{activePatient.mrn}</strong> • {activePatient.phone} • {activePatient.insuranceProvider}
              </p>
            </div>
          </div>

          {/* Allergies / Contraindications Warning */}
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">{t('حساسية مسجلة:', 'Known Allergies:')}</p>
              <p className="text-[11px]">{activePatient.allergies.join(', ') || 'No known allergies'}</p>
            </div>
          </div>
        </div>

        {/* Live Vitals Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <span className="text-slate-500 font-medium">{t('ضغط الدم BP', 'BP')}</span>
            <span className="font-mono font-bold text-slate-800 dark:text-white">{activePatient.vitals.bloodPressure} mmHg</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <span className="text-slate-500 font-medium">{t('النبض HR', 'Pulse')}</span>
            <span className="font-mono font-bold text-teal-600">{activePatient.vitals.heartRate} bpm</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <span className="text-slate-500 font-medium">{t('الحرارة Temp', 'Temp')}</span>
            <span className="font-mono font-bold text-amber-600">{activePatient.vitals.temperature}°C</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
            <span className="text-slate-500 font-medium">{t('الأكسجين SpO2', 'SpO2')}</span>
            <span className="font-mono font-bold text-sky-600">{activePatient.vitals.oxygenSaturation}%</span>
          </div>
        </div>
      </div>

      {/* 3. Main Examination Form (Split Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Complaint & Physical Findings & ICD-10 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>{t('الشكوى السريرية والفحص الطبي', 'Chief Complaint & Clinical Findings')}</span>
          </h3>

          <div>
            <label className="block text-xs text-slate-700 dark:text-slate-300 font-bold mb-1">
              {t('الشكوى الرئيسية وتاريخ المرض الحالي (HPI)', 'Chief Complaint & History of Illness')} *
            </label>
            <textarea
              rows={3}
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-700 dark:text-slate-300 font-bold mb-1">
              {t('نتائج الفحص السريري والملاحظات الطبية', 'Physical Examination & Clinical Observations')}
            </label>
            <textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500"
            />
          </div>

          {/* ICD-10 Diagnosis */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {t('التشخيص الطبي النهائي', 'Clinical Diagnosis')} *
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-teal-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {t('كود ICD-10 الدولي', 'ICD-10 Code')}
                </label>
                <input
                  type="text"
                  value={icd10Code}
                  onChange={(e) => setIcd10Code(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-teal-600 outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 font-bold mb-1">
                {t('موعد المتابعة القادم', 'Follow-up Recommendation')}
              </label>
              <input
                type="text"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                placeholder="After 2 Weeks"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: E-Prescriptions & Diagnostic Orders */}
        <div className="space-y-6">
          {/* Prescription Writer */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-purple-600" />
                <span>{t('الوصفة الطبية الإلكترونية (E-Prescription)', 'E-Prescription Dispenser')}</span>
              </h3>
              <span className="text-[11px] text-slate-400">{prescriptions.length} {t('أدوية موصوفة', 'meds')}</span>
            </div>

            {/* Added Prescriptions Table */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {prescriptions.map((rx, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 text-xs">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">💊 {rx.medicineName}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {rx.dosage} • {rx.frequency} • {rx.duration}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePrescription(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Medicine Row */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">{t('اختر الدواء من الصيدلية', 'Medication Stock')}</label>
                  <select
                    value={selectedMedStockId}
                    onChange={(e) => setSelectedMedStockId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                  >
                    {medicines.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.brandName} ({m.strength}) - {m.stockQuantity} in stock
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">{t('الجرعة', 'Dosage')}</label>
                  <input
                    type="text"
                    value={rxDosage}
                    onChange={(e) => setRxDosage(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">{t('التكرار اليومي', 'Frequency')}</label>
                  <input
                    type="text"
                    value={rxFrequency}
                    onChange={(e) => setRxFrequency(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-0.5">{t('مدة العلاج', 'Duration')}</label>
                  <input
                    type="text"
                    value={rxDuration}
                    onChange={(e) => setRxDuration(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddMedicine}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('إضافة الدواء للوصفة', 'Add to Prescription')}</span>
              </button>
            </div>
          </div>

          {/* Diagnostic Order Entry (Lab & Scans) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-blue-600" />
              <span>{t('طلب الفحوصات المخبرية والإشعاعية المباشرة', 'Order Diagnostic Tests')}</span>
            </h3>

            {/* Quick Lab Checkboxes */}
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">{t('التحاليل المخبرية السريرية (Laboratory):', 'Clinical Laboratory Tests:')}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Complete Blood Count (CBC)',
                  'Lipid Profile Panel',
                  'Serum Creatinine & Urea',
                  'HbA1c Glycated Hemoglobin',
                  'Liver Function Panel',
                  'Cardiac Troponin I'
                ].map(test => {
                  const isChecked = selectedLabTests.includes(test);
                  return (
                    <button
                      type="button"
                      key={test}
                      onClick={() => handleToggleLab(test)}
                      className={`p-2 rounded-xl border text-right rtl:text-right ltr:text-left text-[11px] font-medium transition-all ${
                        isChecked
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {test}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Scans Checkboxes */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 mb-2">{t('فحوصات الأشعة والتصوير الطبي (Radiology):', 'Radiology Scans:')}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Chest X-Ray (PA View)',
                  'Echocardiogram (Echo)',
                  'Abdominal Ultrasound',
                  'Brain MRI Scan',
                  'CT Scan Angiography'
                ].map(scan => {
                  const isChecked = selectedScans.includes(scan);
                  return (
                    <button
                      type="button"
                      key={scan}
                      onClick={() => handleToggleScan(scan)}
                      className={`p-2 rounded-xl border text-right rtl:text-right ltr:text-left text-[11px] font-medium transition-all ${
                        isChecked
                          ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {scan}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Finalize & Sign Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold">{t('اعتماد الاستشارة الطبية وإصدار الأوامر', 'Finalize & Sign Clinical Consultation')}</h4>
            <p className="text-xs text-slate-400">
              {t(
                'سيتم توجيه الوصفة مباشرة لصيدلية المستشفى، وإرسال عينات التحاليل والأشعة للأقسام المعنية',
                'Instantly routes prescriptions to pharmacy, and notifies lab & radiology departments'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrintPrescription}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 font-bold text-xs transition-all cursor-pointer"
            title={t('طباعة الوصفة الطبية الرسمية للعميل أو الصيدلية', 'Print Official Prescription')}
          >
            <Printer className="w-4 h-4 text-purple-400" />
            <span>{t('طباعة الوصفة (Rx)', 'Print Rx')}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndFinalize}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>{t('حفظ واعتماد التقرير الطبي', 'Sign & Finalize Record')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
