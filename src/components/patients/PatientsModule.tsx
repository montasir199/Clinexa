import React, { useState } from 'react';
import { useMedSync } from '../../context/MedSyncContext';
import { Patient } from '../../types/medsync';
import { VitalSignsChart } from './VitalSignsChart';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  HeartPulse, 
  FileText, 
  Pill, 
  FlaskConical, 
  Receipt, 
  Printer, 
  Phone, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  Check, 
  ChevronRight,
  Activity,
  Calendar,
  Thermometer,
  Weight,
  Clock,
  ExternalLink,
  TrendingUp
} from 'lucide-react';

export const PatientsModule: React.FC = () => {
  const { 
    patients, 
    addPatient, 
    consultations, 
    medicines, 
    labTests, 
    radiologyScans, 
    invoices, 
    selectedPatientId, 
    setSelectedPatientId, 
    setActiveTab, 
    setSelectedConsultationAptId, 
    openPrintDocument,
    t, 
    language 
  } = useMedSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [bloodFilter, setBloodFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'vitals' | 'trends' | 'consultations' | 'prescriptions' | 'lab' | 'billing'>('vitals');

  // Form State for New Patient
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [dateOfBirth, setDateOfBirth] = useState('1990-05-15');
  const [age, setAge] = useState(34);
  const [bloodType, setBloodType] = useState('O+');
  const [phone, setPhone] = useState('+966 50 ');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('الرياض، المملكة العربية السعودية');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('Bupa Arabia (بوبا العربية)');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('POL-');
  const [allergies, setAllergies] = useState('None');
  const [chronicConditions, setChronicConditions] = useState('None');

  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameAr.includes(searchQuery) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);
    const matchesBlood = bloodFilter === 'all' || p.bloodType === bloodFilter;
    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
    return matchesSearch && matchesBlood && matchesGender;
  });

  const selectedPatient = selectedPatientId ? patients.find(p => p.id === selectedPatientId) : null;

  // Selected Patient Associated Records
  const patientConsultations = consultations.filter(c => c.patientId === selectedPatientId);
  const patientLabs = labTests.filter(l => l.patientId === selectedPatientId);
  const patientScans = radiologyScans.filter(r => r.patientId === selectedPatientId);
  const patientInvoices = invoices.filter(inv => inv.patientId === selectedPatientId);

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nameAr) return;

    const newPat = addPatient({
      hospitalId: 'hosp-1',
      name,
      nameAr,
      nationalId: nationalId || '1098765432',
      gender,
      dateOfBirth,
      age: Number(age) || 30,
      bloodType,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address,
      emergencyContact: emergencyContact || 'Family Member',
      insuranceProvider,
      insurancePolicyNumber,
      insuranceCoveragePercent: 80,
      allergies: allergies.split(',').map(s => s.trim()),
      chronicConditions: chronicConditions.split(',').map(s => s.trim()),
      vitals: {
        bloodPressure: '120/80',
        heartRate: 75,
        temperature: 37.0,
        respiratoryRate: 16,
        oxygenSaturation: 99,
        weight: 72,
        height: 175,
        bmi: 23.5,
        recordedAt: new Date().toLocaleDateString()
      }
    });

    setIsAddPatientOpen(false);
    setSelectedPatientId(newPat.id);
  };

  const handlePrintPatientReport = () => {
    if (selectedPatient) {
      openPrintDocument({
        type: 'patient_summary',
        data: selectedPatient,
        title: t(`التقرير الطبي - ${selectedPatient.nameAr}`, `Medical Report - ${selectedPatient.name}`)
      });
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Title and Add Patient Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>{t('سجل المرضى الإلكتروني (EHR Registry)', 'Electronic Health Records (EHR)')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('الملفات الطبية الشاملة، العلامات الحيوية، التاريخ المرضي، والتشخيصات', 'Comprehensive medical histories, vitals telemetry, diagnoses, and insurance')}
          </p>
        </div>

        <button
          onClick={() => setIsAddPatientOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('تسجيل ملف مريض جديد', 'Register New Patient')}</span>
        </button>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ابحث بالاسم، رقم الملف MRN، أو الهاتف...', 'Search by patient name, MRN, phone...')}
            className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {/* Blood Type Filter */}
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-700 dark:text-slate-200 outline-none font-bold"
          >
            <option value="all">{t('فصيلة الدم (الكل)', 'Blood Type (All)')}</option>
            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-700 dark:text-slate-200 outline-none font-bold"
          >
            <option value="all">{t('الجنس (الكل)', 'Gender (All)')}</option>
            <option value="male">{t('ذكر', 'Male')}</option>
            <option value="female">{t('أنثى', 'Female')}</option>
          </select>

          <span className="text-xs text-slate-400 font-bold">
            {filteredPatients.length} {t('مرضى', 'patients')}
          </span>
        </div>
      </div>

      {/* 3. Patients Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-4">{t('المريض ورقم الملف (MRN)', 'Patient & MRN')}</th>
                <th className="p-4">{t('العمر والجنس', 'Age & Gender')}</th>
                <th className="p-4">{t('فصيلة الدم', 'Blood')}</th>
                <th className="p-4">{t('الهاتف والتواصل', 'Contact Phone')}</th>
                <th className="p-4">{t('شركة التأمين', 'Insurance Provider')}</th>
                <th className="p-4">{t('تاريخ التسجيل', 'Registration Date')}</th>
                <th className="p-4 text-center">{t('الملف السريري', 'Clinical EHR')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredPatients.map(pat => (
                <tr key={pat.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {pat.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {language === 'ar' ? pat.nameAr : pat.name}
                        </p>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold">
                          {pat.mrn} • ID: {pat.nationalId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    <p className="font-bold">{pat.age} {t('سنة', 'years')}</p>
                    <p className="text-[10px] text-slate-400">{pat.gender === 'male' ? t('ذكر', 'Male') : t('أنثى', 'Female')}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                      {pat.bloodType}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    <p className="font-bold font-mono">{pat.phone}</p>
                    <p className="text-[10px] text-slate-400">{pat.email}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{pat.insuranceProvider}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">{pat.insuranceCoveragePercent}% {t('تغطية', 'Coverage')}</p>
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">
                    {pat.registeredAt}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedPatientId(pat.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-all text-xs"
                    >
                      {t('عرض الملف الطبي', 'View EHR')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Rich Patient Detail Profile View / Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {language === 'ar' ? selectedPatient.nameAr : selectedPatient.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {selectedPatient.bloodType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {selectedPatient.mrn} • {selectedPatient.gender === 'male' ? t('ذكر', 'Male') : t('أنثى', 'Female')} • {selectedPatient.age} {t('سنة', 'yrs')} • {selectedPatient.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPatientReport}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t('طباعة التقرير الطبي', 'Print Summary')}</span>
                </button>
                <button
                  onClick={() => setSelectedPatientId(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900 text-xs font-bold overflow-x-auto">
              {[
                { id: 'vitals', labelAr: 'العلامات الحيوية والمسار البياني', labelEn: 'Vitals & Trends', icon: Activity },
                { id: 'trends', labelAr: 'مخططات الرصد التفاعلية', labelEn: 'Recharts Vitals Analytics', icon: TrendingUp },
                { id: 'consultations', labelAr: 'سجل الكشوفات الطبية', labelEn: 'Consultations', icon: HeartPulse, count: patientConsultations.length },
                { id: 'lab', labelAr: 'المختبر والأشعة', labelEn: 'Lab & Diagnostics', icon: FlaskConical, count: patientLabs.length + patientScans.length },
                { id: 'billing', labelAr: 'الفواتير والتأمين', labelEn: 'Billing & Invoices', icon: Receipt, count: patientInvoices.length }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeProfileTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProfileTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 1. Vitals & Trends Tab */}
              {activeProfileTab === 'vitals' && (
                <div className="space-y-6">
                  {/* Vitals Telemetry Grid */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      {t('آخر قراءات العلامات الحيوية المسجلة', 'Latest Vital Signs Recorded')} {selectedPatient.vitals?.recordedAt ? `(${selectedPatient.vitals.recordedAt})` : ''}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900">
                        <p className="text-[10px] font-bold text-rose-600 uppercase">{t('ضغط الدم BP', 'Blood Pressure')}</p>
                        <p className="text-xl font-black text-slate-800 dark:text-white mt-1 font-mono">
                          {selectedPatient.vitals?.bpSystolic 
                            ? `${selectedPatient.vitals.bpSystolic}/${selectedPatient.vitals.bpDiastolic}`
                            : (selectedPatient.vitals?.bloodPressure || '120/80')}
                        </p>
                        <p className="text-[10px] text-slate-400">mmHg (Normal)</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900">
                        <p className="text-[10px] font-bold text-teal-600 uppercase">{t('النبض HR', 'Heart Rate')}</p>
                        <p className="text-xl font-black text-slate-800 dark:text-white mt-1 font-mono">
                          {selectedPatient.vitals?.heartRate || 75} <span className="text-xs font-normal">bpm</span>
                        </p>
                        <p className="text-[10px] text-slate-400">Rhythm regular</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900">
                        <p className="text-[10px] font-bold text-amber-600 uppercase">{t('درجة الحرارة Temp', 'Temperature')}</p>
                        <p className="text-xl font-black text-slate-800 dark:text-white mt-1 font-mono">
                          {selectedPatient.vitals?.temperature || 36.8}°C
                        </p>
                        <p className="text-[10px] text-slate-400">Oral probe</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900">
                        <p className="text-[10px] font-bold text-sky-600 uppercase">{t('الأكسجين SpO2', 'Oxygen Saturation')}</p>
                        <p className="text-xl font-black text-slate-800 dark:text-white mt-1 font-mono">
                          {selectedPatient.vitals?.spo2 || selectedPatient.vitals?.oxygenSaturation || 98}%
                        </p>
                        <p className="text-[10px] text-slate-400">Room air</p>
                      </div>
                    </div>
                  </div>

                  {/* Recharts Data Visualization for Historical Vital Signs Trends */}
                  <VitalSignsChart 
                    patient={selectedPatient} 
                    consultations={patientConsultations} 
                  />

                  {/* Chronic Diseases & Allergies */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>{t('الحساسية الدوائية والغذائية', 'Allergies & Contraindications')}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map(a => (
                          <span key={a} className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-xs">
                            ⚠️ {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                      <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-xs mb-2">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>{t('الأمراض المزمنة المسجلة', 'Chronic Medical Conditions')}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.chronicConditions.map(c => (
                          <span key={c} className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-xs">
                            📋 {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Insurance Details */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">{t('بيانات التغطية التأمينية', 'Insurance Policy Details')}</h5>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-slate-400">{t('الشركة الضامنة', 'Insurer')}</p>
                        <p className="font-bold text-slate-800 dark:text-white">{selectedPatient.insurance?.provider || (selectedPatient as any).insuranceProvider || 'Bupa Arabia'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{t('رقم البوليصة', 'Policy #')}</p>
                        <p className="font-bold font-mono text-slate-800 dark:text-white">{selectedPatient.insurance?.policyNumber || (selectedPatient as any).insurancePolicyNumber || 'POL-88492'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{t('نسبة التغطية', 'Coverage %')}</p>
                        <p className="font-bold text-emerald-600">{100 - (selectedPatient.insurance?.copayPercentage || 10)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dedicated Trends Analytics Tab */}
              {activeProfileTab === 'trends' && (
                <div className="space-y-6">
                  <VitalSignsChart 
                    patient={selectedPatient} 
                    consultations={patientConsultations} 
                  />
                </div>
              )}

              {/* 2. Consultations History */}
              {activeProfileTab === 'consultations' && (
                <div className="space-y-4">
                  {patientConsultations.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <HeartPulse className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p>{t('لا توجد استشارات سابقة مسجلة لهذا المريض', 'No consultation notes found for this patient.')}</p>
                    </div>
                  ) : (
                    patientConsultations.map(con => (
                      <div key={con.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{con.diagnosis}</p>
                            <p className="text-[10px] text-blue-600 font-mono font-bold">{con.icd10Code}</p>
                          </div>
                          <div className="text-right rtl:text-right ltr:text-left text-xs">
                            <p className="font-bold text-slate-700 dark:text-slate-300">{con.doctorName}</p>
                            <p className="text-[10px] text-slate-400">{con.date}</p>
                          </div>
                        </div>
                        <div className="text-xs space-y-1">
                          <p><strong className="text-slate-500">{t('الشكوى الرئيسية:', 'Chief Complaint:')}</strong> {con.chiefComplaint}</p>
                          <p><strong className="text-slate-500">{t('الفحص السريري:', 'Clinical Notes:')}</strong> {con.clinicalNotes}</p>
                        </div>
                        {con.prescriptions && con.prescriptions.length > 0 && (
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-[11px] font-bold text-slate-400 mb-1">{t('الأدوية الموصوفة:', 'Prescribed Medications:')}</p>
                            <div className="space-y-1">
                              {con.prescriptions.map((rx, idx) => (
                                <p key={idx} className="text-xs font-mono text-teal-700 dark:text-teal-400">
                                  💊 {rx.medicineName} — {rx.dosage} ({rx.frequency}) for {rx.duration}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 3. Lab & Diagnostics */}
              {activeProfileTab === 'lab' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('التحاليل المخبرية والأشعة', 'Laboratory & Imaging Orders')}</h4>
                  {patientLabs.length === 0 && patientScans.length === 0 ? (
                    <p className="text-xs text-slate-400 py-8 text-center">{t('لم يتم طلب فحوصات مخبرية لهذا المريض حتى الآن', 'No lab tests or imaging scans recorded')}</p>
                  ) : (
                    <div className="space-y-2">
                      {patientLabs.map((lab, index) => (
                        <div key={`${lab.id}-${index}`} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">{lab.testName}</p>
                            <p className="text-[10px] text-slate-400">{lab.testCode} • {lab.category}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            lab.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {lab.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                      {patientScans.map((scan, index) => (
                        <div key={`${scan.id}-${index}`} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">{scan.scanType} - {scan.bodyPart}</p>
                            <p className="text-[10px] text-slate-400">{scan.requestDate}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            scan.status === 'reported' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {scan.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Billing & Invoices */}
              {activeProfileTab === 'billing' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('الفواتير وسندات القبض', 'Financial Invoices & Receipts')}</h4>
                  {patientInvoices.length === 0 ? (
                    <p className="text-xs text-slate-400 py-8 text-center">{t('لا توجد فواتير مسجلة للمريض', 'No invoices found for this patient')}</p>
                  ) : (
                    patientInvoices.map((inv, index) => (
                      <div key={`${inv.id}-${index}`} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100 font-mono">{inv.invoiceNumber}</p>
                          <p className="text-[10px] text-slate-400">{inv.date} • {inv.items.map(i => i.description).join(', ')}</p>
                        </div>
                        <div className="text-right rtl:text-right ltr:text-left">
                          <p className="font-bold text-emerald-600">{inv.subtotal} SAR</p>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer with Action */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">MedSync HIPAA Verified Profile</span>
              <button
                onClick={() => {
                  setSelectedPatientId(null);
                  setActiveTab('consultation');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>{t('فتح الكشف السريري والوصفة', 'Open Clinical Consultation')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal: Register New Patient Form */}
      {isAddPatientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-600 text-white">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('تسجيل ملف مريض جديد (New Patient)', 'Register New Patient Record')}
                  </h3>
                  <p className="text-xs text-slate-400">{t('إصدار رقم ملف طبي جديد MRN وتسجيل البيانات الديموغرافية والتأمينية', 'Create verified MRN and demographic profile')}</p>
                </div>
              </div>
              <button onClick={() => setIsAddPatientOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleRegisterPatient} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('الاسم الكامل (عربي)', 'Full Name (Arabic)')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: عبد الله أحمد السالم"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('الاسم الكامل (إنجليزي)', 'Full Name (English)')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abdullah Ahmed Al-Salem"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('الهوية الوطنية / الإقامة', 'National ID / Iqama')}</label>
                  <input
                    type="text"
                    placeholder="1098765432"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('الجنس', 'Gender')}</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="male">{t('ذكر', 'Male')}</option>
                    <option value="female">{t('أنثى', 'Female')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('فصيلة الدم', 'Blood Type')}</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('رقم الهاتف للتواصل', 'Phone Number')} *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('العمر (سنة)', 'Age (Years)')}</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('شركة التأمين الطبي', 'Insurance Provider')}</label>
                  <select
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="Bupa Arabia (بوبا العربية)">Bupa Arabia (بوبا العربية)</option>
                    <option value="Tawuniya (التعاونية للتأمين)">Tawuniya (التعاونية للتأمين)</option>
                    <option value="Medgulf (ميدغلف)">Medgulf (ميدغلف)</option>
                    <option value="Self Pay / Cash (نقدي)">Self Pay / Cash (نقدي)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('رقم بطاقة التأمين', 'Policy Number')}</label>
                  <input
                    type="text"
                    placeholder="POL-99281-KSA"
                    value={insurancePolicyNumber}
                    onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('الحساسية الدوائية (إن وجدت)', 'Allergies')}</label>
                  <input
                    type="text"
                    placeholder="مثال: Penicillin, Sulfa"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">{t('الأمراض المزمنة (إن وجدت)', 'Chronic Conditions')}</label>
                  <input
                    type="text"
                    placeholder="مثال: Hypertension, Type 2 Diabetes"
                    value={chronicConditions}
                    onChange={(e) => setChronicConditions(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPatientOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-600 font-semibold"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/25"
                >
                  {t('إنشاء وتأكيد تسجيل الملف', 'Save & Register')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
