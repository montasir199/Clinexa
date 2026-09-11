import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  HospitalTenant, 
  UserProfile, 
  UserRole, 
  Patient, 
  VitalSigns,
  Doctor, 
  Appointment, 
  ConsultationRecord, 
  MedicineInventory, 
  LaboratoryTest, 
  RadiologyScan, 
  Invoice, 
  SubscriptionPlan, 
  NotificationItem, 
  AuditLogItem 
} from '../types/medsync';
import { 
  INITIAL_HOSPITALS, 
  INITIAL_SUBSCRIPTION_PLANS, 
  INITIAL_USERS, 
  INITIAL_DOCTORS, 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_CONSULTATIONS, 
  INITIAL_MEDICINES, 
  INITIAL_LAB_TESTS, 
  INITIAL_RADIOLOGY_SCANS, 
  INITIAL_INVOICES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type PrintableDocumentType = 
  | 'patient_summary'
  | 'prescription'
  | 'invoice'
  | 'lab_report'
  | 'radiology_report'
  | 'performance_report';

export interface PrintableDocumentPayload {
  type: PrintableDocumentType;
  title?: string;
  data: any;
}

interface MedSyncContextType {
  // Localization & Theme
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  
  // Tenant & Role
  currentHospital: HospitalTenant | null; // null means platform-level super admin
  setCurrentHospitalId: (hospitalId: string) => void;
  currentUser: UserProfile;
  switchUserRole: (role: UserRole) => void;
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  selectedConsultationAptId: string | null;
  setSelectedConsultationAptId: (aptId: string | null) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;

  // Data Collections
  hospitals: HospitalTenant[];
  addHospital: (hospital: Omit<HospitalTenant, 'id'>) => void;
  updateHospitalStatus: (id: string, status: HospitalTenant['status']) => void;
  
  subscriptionPlans: SubscriptionPlan[];
  updateSubscriptionPlan: (id: string, updates: Partial<SubscriptionPlan>) => void;
  
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'mrn' | 'registeredAt'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  recordPatientVitals: (patientId: string, vitals: VitalSigns) => void;

  doctors: Doctor[];
  updateDoctorStatus: (id: string, status: Doctor['status']) => void;

  appointments: Appointment[];
  bookAppointment: (apt: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  consultations: ConsultationRecord[];
  saveConsultation: (record: Omit<ConsultationRecord, 'id'>) => void;

  medicines: MedicineInventory[];
  addMedicine: (med: Omit<MedicineInventory, 'id'>) => void;
  updateStock: (id: string, newStock: number) => void;
  dispensePrescription: (prescriptionId: string, medicineName: string, quantity: number) => void;

  labTests: LaboratoryTest[];
  addLabTest: (test: Omit<LaboratoryTest, 'id'>) => void;
  updateLabResult: (id: string, results: LaboratoryTest['results'], interpretation?: string) => void;

  radiologyScans: RadiologyScan[];
  addRadiologyScan: (scan: Omit<RadiologyScan, 'id'>) => void;
  updateRadiologyReport: (id: string, findings: string, findingsAr?: string, notes?: string) => void;

  invoices: Invoice[];
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  markInvoicePaid: (id: string, method: Invoice['paymentMethod']) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  auditLogs: AuditLogItem[];

  // Toasts
  toasts: ToastData[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Translation Helper
  t: (arText: string, enText: string) => string;

  // Hospital Performance KPIs
  hospitalKpis: {
    occupancyRate: number;
    totalBeds: number;
    occupiedBeds: number;
    totalRevenue: number;
    patientSatisfaction: number;
  };

  // Document Printing Engine
  printableDocument: PrintableDocumentPayload | null;
  openPrintDocument: (payload: PrintableDocumentPayload) => void;
  closePrintDocument: () => void;
}

const MedSyncContext = createContext<MedSyncContextType | undefined>(undefined);

// Helper to sanitize and deduplicate entity IDs loaded from localStorage or static data
const deduplicateEntities = <T extends { id: string }>(items: T[], prefix: string): T[] => {
  if (!Array.isArray(items)) return [];
  const seenIds = new Set<string>();
  let collisionCount = 0;
  return items.map((item) => {
    if (!item || !item.id || seenIds.has(item.id)) {
      collisionCount += 1;
      const cleanId = `${prefix}-${Date.now()}-${collisionCount}-${Math.random().toString(36).substring(2, 8)}`;
      seenIds.add(cleanId);
      return { ...item, id: cleanId };
    }
    seenIds.add(item.id);
    return item;
  });
};

export const MedSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language & Theme
  const [language, setLanguageState] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('medsync_lang') as 'ar' | 'en') || 'ar';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('medsync_dark') === 'true';
  });

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('medsync_lang', language);
  }, [language]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('medsync_dark', isDark ? 'true' : 'false');
  }, [isDark]);

  // 2. Tenants & Roles
  const [hospitals, setHospitals] = useState<HospitalTenant[]>(() => {
    try {
      const saved = localStorage.getItem('medsync_hospitals');
      const data = saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
      return deduplicateEntities(data, 'hosp');
    } catch {
      return deduplicateEntities(INITIAL_HOSPITALS, 'hosp');
    }
  });

  const [currentHospitalId, setCurrentHospitalIdState] = useState<string>(() => {
    return localStorage.getItem('medsync_active_hosp') || 'hosp-1';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[1]); // Default to Hospital Admin (Dr. Faisal)

  // 3. Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedConsultationAptId, setSelectedConsultationAptId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);

  // 4. Data States
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);
  
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem('medsync_patients');
      const data = saved ? JSON.parse(saved) : INITIAL_PATIENTS;
      return deduplicateEntities(data, 'pat');
    } catch {
      return deduplicateEntities(INITIAL_PATIENTS, 'pat');
    }
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem('medsync_doctors');
      const data = saved ? JSON.parse(saved) : INITIAL_DOCTORS;
      return deduplicateEntities(data, 'doc');
    } catch {
      return deduplicateEntities(INITIAL_DOCTORS, 'doc');
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('medsync_appointments');
      const data = saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
      return deduplicateEntities(data, 'apt');
    } catch {
      return deduplicateEntities(INITIAL_APPOINTMENTS, 'apt');
    }
  });

  const [consultations, setConsultations] = useState<ConsultationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('medsync_consultations');
      const data = saved ? JSON.parse(saved) : INITIAL_CONSULTATIONS;
      return deduplicateEntities(data, 'con');
    } catch {
      return deduplicateEntities(INITIAL_CONSULTATIONS, 'con');
    }
  });

  const [medicines, setMedicines] = useState<MedicineInventory[]>(() => {
    try {
      const saved = localStorage.getItem('medsync_medicines');
      const data = saved ? JSON.parse(saved) : INITIAL_MEDICINES;
      return deduplicateEntities(data, 'med');
    } catch {
      return deduplicateEntities(INITIAL_MEDICINES, 'med');
    }
  });

  const [labTests, setLabTests] = useState<LaboratoryTest[]>(() => {
    try {
      const saved = localStorage.getItem('medsync_lab');
      const data = saved ? JSON.parse(saved) : INITIAL_LAB_TESTS;
      return deduplicateEntities(data, 'lab');
    } catch {
      return deduplicateEntities(INITIAL_LAB_TESTS, 'lab');
    }
  });

  const [radiologyScans, setRadiologyScans] = useState<RadiologyScan[]>(() => {
    try {
      const saved = localStorage.getItem('medsync_radiology');
      const data = saved ? JSON.parse(saved) : INITIAL_RADIOLOGY_SCANS;
      return deduplicateEntities(data, 'rad');
    } catch {
      return deduplicateEntities(INITIAL_RADIOLOGY_SCANS, 'rad');
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('medsync_invoices');
      const data = saved ? JSON.parse(saved) : INITIAL_INVOICES;
      return deduplicateEntities(data, 'inv');
    } catch {
      return deduplicateEntities(INITIAL_INVOICES, 'inv');
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // 5. Toasts
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // 6. Document Printing Engine
  const [printableDocument, setPrintableDocument] = useState<PrintableDocumentPayload | null>(null);

  const openPrintDocument = (payload: PrintableDocumentPayload) => {
    setPrintableDocument(payload);
  };

  const closePrintDocument = () => {
    setPrintableDocument(null);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('medsync_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);
  useEffect(() => {
    localStorage.setItem('medsync_patients', JSON.stringify(patients));
  }, [patients]);
  useEffect(() => {
    localStorage.setItem('medsync_appointments', JSON.stringify(appointments));
  }, [appointments]);
  useEffect(() => {
    localStorage.setItem('medsync_medicines', JSON.stringify(medicines));
  }, [medicines]);
  useEffect(() => {
    localStorage.setItem('medsync_lab', JSON.stringify(labTests));
  }, [labTests]);
  useEffect(() => {
    localStorage.setItem('medsync_radiology', JSON.stringify(radiologyScans));
  }, [radiologyScans]);
  useEffect(() => {
    localStorage.setItem('medsync_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
  };

  const currentHospital = currentHospitalId === 'all' 
    ? null 
    : hospitals.find(h => h.id === currentHospitalId) || hospitals[0];

  const setCurrentHospitalId = (id: string) => {
    setCurrentHospitalIdState(id);
    localStorage.setItem('medsync_active_hosp', id);
    if (id === 'all') {
      switchUserRole('super_admin');
      setIsDark(true); // Super Admin auto-theme
    } else {
      if (currentUser.role === 'super_admin') {
        switchUserRole('hospital_admin');
      }
      setIsDark(false); // Hospital default light medical theme
    }
  };

  const switchUserRole = (role: UserRole) => {
    const found = INITIAL_USERS.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      if (role === 'super_admin') {
        setCurrentHospitalIdState('all');
        setIsDark(true);
        setActiveTab('super_dashboard');
      } else {
        if (currentHospitalId === 'all') {
          setCurrentHospitalIdState('hosp-1');
        }
        setIsDark(false);
        setActiveTab('dashboard');
      }
      showToast(
        language === 'ar' ? `تم التبديل إلى دور: ${found.nameAr}` : `Switched to role: ${found.name}`, 
        'info'
      );
    }
  };

  // Translation helper
  const t = (arText: string, enText: string) => {
    return language === 'ar' ? arText : enText;
  };

  // Safe unique ID generator preventing collisions in synchronous loops
  let localIdCounter = 0;
  const generateUniqueId = (prefix: string) => {
    localIdCounter += 1;
    return `${prefix}-${Date.now()}-${localIdCounter}-${Math.random().toString(36).substring(2, 8)}`;
  };

  // Data Mutations
  const addHospital = (newHosp: Omit<HospitalTenant, 'id'>) => {
    const id = generateUniqueId('hosp');
    const hospital: HospitalTenant = { ...newHosp, id };
    setHospitals(prev => [hospital, ...prev]);
    showToast(t(`تم إضافة مستشفى ${hospital.nameAr} بنجاح`, `Hospital ${hospital.name} registered successfully`));
  };

  const updateHospitalStatus = (id: string, status: HospitalTenant['status']) => {
    setHospitals(prev => prev.map(h => h.id === id ? { ...h, status } : h));
    showToast(t(`تم تحديث حالة المستشفى`, `Hospital status updated`));
  };

  const updateSubscriptionPlan = (id: string, updates: Partial<SubscriptionPlan>) => {
    setSubscriptionPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast(t(`تم حفظ تعديل الباقة`, `Subscription plan saved`));
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'mrn' | 'registeredAt'>) => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const mrn = `MRN-${year}-${randomNum}`;
    const id = generateUniqueId('pat');
    const newPatient: Patient = {
      ...patientData,
      id,
      mrn,
      registeredAt: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => [newPatient, ...prev]);
    showToast(t(`تم تسجيل المريض ${newPatient.nameAr} بنجاح (رقم الملف: ${mrn})`, `Patient ${newPatient.name} registered (${mrn})`));
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast(t(`تم تحديث بيانات المريض بنجاح`, `Patient record updated successfully`));
  };

  const recordPatientVitals = (patientId: string, vitalsData: VitalSigns) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const history = p.vitalsHistory && p.vitalsHistory.length > 0 
          ? p.vitalsHistory 
          : (p.vitals ? [p.vitals] : []);
        const updatedHistory = [...history, vitalsData];
        return {
          ...p,
          vitals: vitalsData,
          vitalsHistory: updatedHistory
        };
      }
      return p;
    }));
    showToast(t(`تم حفظ قراءات المؤشرات الحيوية للمريض`, `Patient vital signs logged successfully`));
  };

  const updateDoctorStatus = (id: string, status: Doctor['status']) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    showToast(t(`تم تحديث حالة الطبيب`, `Doctor availability status updated`));
  };

  const bookAppointment = (aptData: Omit<Appointment, 'id'>) => {
    const id = generateUniqueId('apt');
    const newApt: Appointment = { ...aptData, id };
    setAppointments(prev => [newApt, ...prev]);
    showToast(t(`تم تأكيد حجز الموعد بنجاح`, `Appointment booked successfully`));
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    showToast(t(`تم تحديث حالة الموعد`, `Appointment status updated`));
  };

  const saveConsultation = (record: Omit<ConsultationRecord, 'id'>) => {
    const id = generateUniqueId('con');
    const newRecord: ConsultationRecord = { ...record, id };
    setConsultations(prev => [newRecord, ...prev]);

    // Update appointment to completed if present
    if (record.appointmentId) {
      updateAppointmentStatus(record.appointmentId, 'completed');
    }

    // Auto-order lab tests if any
    if (record.orderedLabTests && record.orderedLabTests.length > 0) {
      record.orderedLabTests.forEach((testName, i) => {
        addLabTest({
          hospitalId: record.hospitalId,
          patientId: record.patientId,
          patientName: patients.find(p => p.id === record.patientId)?.name || 'Patient',
          patientMrn: patients.find(p => p.id === record.patientId)?.mrn || 'MRN-000',
          doctorId: record.doctorId,
          doctorName: record.doctorName,
          testName: testName,
          testNameAr: testName,
          testCode: `LAB-AUTO-${i + 1}`,
          category: 'Clinical Diagnostic',
          categoryAr: 'فحص سريري',
          specimenType: 'Serum / Blood',
          requestDate: new Date().toLocaleString(),
          status: 'pending',
          urgency: 'routine'
        });
      });
    }

    // Auto-order radiology scans if any
    if (record.orderedRadiologyScans && record.orderedRadiologyScans.length > 0) {
      record.orderedRadiologyScans.forEach((scanName) => {
        addRadiologyScan({
          hospitalId: record.hospitalId,
          patientId: record.patientId,
          patientName: patients.find(p => p.id === record.patientId)?.name || 'Patient',
          patientMrn: patients.find(p => p.id === record.patientId)?.mrn || 'MRN-000',
          doctorId: record.doctorId,
          doctorName: record.doctorName,
          scanType: scanName.includes('MRI') ? 'MRI' : scanName.includes('CT') ? 'CT' : scanName.includes('Echo') || scanName.includes('Ultrasound') ? 'Ultrasound' : 'X-Ray',
          bodyPart: scanName,
          bodyPartAr: scanName,
          requestDate: new Date().toLocaleString(),
          status: 'pending',
          urgency: 'routine'
        });
      });
    }

    // Add Audit Log
    const patientObj = patients.find(p => p.id === record.patientId);
    setAuditLogs(prev => [
      {
        id: generateUniqueId('log'),
        hospitalId: record.hospitalId,
        hospitalName: currentHospital?.name || 'Hospital',
        actorName: record.doctorName,
        actorRole: 'doctor',
        action: 'Completed Consultation',
        module: 'EHR Consultation',
        details: `Consultation saved for ${patientObj?.name || 'Patient'} (${record.icd10Code})`,
        ipAddress: '192.168.1.100',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        severity: 'info'
      },
      ...prev
    ]);

    showToast(t(`تم حفظ الاستشارة والوصفة الطبية بنجاح`, `Consultation & prescriptions recorded successfully`));
  };

  const addMedicine = (medData: Omit<MedicineInventory, 'id'>) => {
    const id = generateUniqueId('med');
    const newMed: MedicineInventory = { ...medData, id };
    setMedicines(prev => [newMed, ...prev]);
    showToast(t(`تم إضافة الدواء ${newMed.brandName} إلى الصيدلية`, `Medicine ${newMed.brandName} added to inventory`));
  };

  const updateStock = (id: string, newStock: number) => {
    setMedicines(prev => prev.map(m => {
      if (m.id === id) {
        let status: MedicineInventory['status'] = 'in_stock';
        if (newStock === 0) status = 'out_of_stock';
        else if (newStock <= m.minStockLevel) status = 'low_stock';
        return { ...m, stockQuantity: newStock, status };
      }
      return m;
    }));
    showToast(t(`تم تحديث رصيد المخزون`, `Stock quantity updated`));
  };

  const dispensePrescription = (prescriptionId: string, medicineName: string, quantity: number) => {
    setMedicines(prev => prev.map(m => {
      if (m.brandName.toLowerCase().includes(medicineName.toLowerCase()) || m.genericName.toLowerCase().includes(medicineName.toLowerCase())) {
        const remaining = Math.max(0, m.stockQuantity - quantity);
        let status: MedicineInventory['status'] = 'in_stock';
        if (remaining === 0) status = 'out_of_stock';
        else if (remaining <= m.minStockLevel) status = 'low_stock';
        return { ...m, stockQuantity: remaining, status };
      }
      return m;
    }));
    showToast(t(`تم صرف الدواء بنجاح للمريض`, `Medicine dispensed successfully`));
  };

  const addLabTest = (testData: Omit<LaboratoryTest, 'id'>) => {
    const id = generateUniqueId('lab');
    const newTest: LaboratoryTest = { ...testData, id };
    setLabTests(prev => [newTest, ...prev]);
    showToast(t(`تم إرسال طلب التحليل المخبري`, `Lab test order placed`));
  };

  const updateLabResult = (id: string, results: LaboratoryTest['results'], interpretation?: string) => {
    setLabTests(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          results,
          interpretation,
          completedDate: new Date().toLocaleString(),
          status: 'completed',
          technicianName: 'Lab Tech. Specialized'
        };
      }
      return t;
    }));
    showToast(t(`تم تسجيل نتائج التحليل واعتمادها`, `Lab results verified and recorded`));
  };

  const addRadiologyScan = (scanData: Omit<RadiologyScan, 'id'>) => {
    const id = generateUniqueId('rad');
    const newScan: RadiologyScan = { ...scanData, id };
    setRadiologyScans(prev => [newScan, ...prev]);
    showToast(t(`تم إنشاء طلب الفحص الإشعاعي`, `Radiology imaging request created`));
  };

  const updateRadiologyReport = (id: string, findings: string, findingsAr?: string, notes?: string) => {
    setRadiologyScans(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          findings,
          findingsAr: findingsAr || findings,
          radiologistNotes: notes,
          completedDate: new Date().toLocaleString(),
          status: 'reported',
          radiologistName: 'Dr. Zaid Al-Omari (Radiology Consultant)',
          imageUrl: r.imageUrl || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80'
        };
      }
      return r;
    }));
    showToast(t(`تم حفظ تقرير الأشعة التشخيصي بنجاح`, `Radiology imaging report finalized`));
  };

  const createInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${year}-${randomNum}`;
    const id = generateUniqueId('inv');
    const newInvoice: Invoice = { ...invData, id, invoiceNumber };
    setInvoices(prev => [newInvoice, ...prev]);
    showToast(t(`تم إنشاء الفاتورة رقم ${invoiceNumber}`, `Invoice ${invoiceNumber} generated`));
    return newInvoice;
  };

  const markInvoicePaid = (id: string, method: Invoice['paymentMethod'] = 'credit_card') => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          status: 'paid',
          paymentMethod: method,
          paidAt: new Date().toLocaleString()
        };
      }
      return inv;
    }));
    showToast(t(`تم سداد الفاتورة وإصدار سند القبض بنجاح`, `Invoice settled and receipt issued`));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast(t(`تم تعيين كافة الإشعارات كمقروءة`, `All notifications marked as read`));
  };

  const hospitalKpis = useMemo(() => {
    const totalBeds = currentHospital?.bedsCount || 240;
    const occupiedBeds = currentHospital?.occupiedBeds || 184;
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 76;
    return {
      occupancyRate,
      totalBeds,
      occupiedBeds,
      totalRevenue: currentHospital?.monthlyRevenue || 2860000,
      patientSatisfaction: 94.8,
    };
  }, [currentHospital]);

  return (
    <MedSyncContext.Provider
      value={{
        hospitalKpis,
        language,
        setLanguage,
        isDark,
        setIsDark,
        currentHospital,
        setCurrentHospitalId,
        currentUser,
        switchUserRole,
        activeTab,
        setActiveTab,
        selectedPatientId,
        setSelectedPatientId,
        selectedConsultationAptId,
        setSelectedConsultationAptId,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        hospitals,
        addHospital,
        updateHospitalStatus,
        subscriptionPlans,
        updateSubscriptionPlan,
        patients,
        addPatient,
        updatePatient,
        recordPatientVitals,
        doctors,
        updateDoctorStatus,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        consultations,
        saveConsultation,
        medicines,
        addMedicine,
        updateStock,
        dispensePrescription,
        labTests,
        addLabTest,
        updateLabResult,
        radiologyScans,
        addRadiologyScan,
        updateRadiologyReport,
        invoices,
        createInvoice,
        markInvoicePaid,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        auditLogs,
        toasts,
        showToast,
        removeToast,
        t,
        printableDocument,
        openPrintDocument,
        closePrintDocument
      }}
    >
      {children}
    </MedSyncContext.Provider>
  );
};

export const useMedSync = () => {
  const context = useContext(MedSyncContext);
  if (!context) {
    throw new Error('useMedSync must be used within a MedSyncProvider');
  }
  return context;
};
