export type UserRole = 
  | 'super_admin' 
  | 'hospital_admin' 
  | 'doctor' 
  | 'receptionist' 
  | 'pharmacist' 
  | 'accountant' 
  | 'nurse';

export type TriageLevel = 'critical' | 'urgent' | 'standard' | 'non_urgent';

export interface HospitalTenant {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  logo: string;
  city: string;
  cityAr: string;
  country: string;
  countryAr: string;
  lat: number;
  lng: number;
  status: 'active' | 'pending' | 'suspended' | 'maintenance';
  planId: 'free' | 'basic' | 'pro' | 'enterprise';
  bedsCount: number;
  occupiedBeds: number;
  activeDoctors: number;
  activePatients: number;
  monthlyRevenue: number;
  contactEmail: string;
  phone: string;
  establishedYear: number;
  accreditations: string[];
}

export interface UserProfile {
  id: string;
  hospitalId: string;
  name: string;
  nameAr: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  departmentAr?: string;
  phone?: string;
  specialty?: string;
  specialtyAr?: string;
  status: 'active' | 'offline' | 'on_duty' | 'in_consultation';
}

export interface VitalSigns {
  bpSystolic: number;
  bpDiastolic: number;
  bloodPressure?: string;
  heartRate: number;
  temperature: number;
  spo2: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  bloodGlucose?: number;
  recordedAt: string;
  notes?: string;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  frequencyAr: string;
  duration: string;
  instructions: string;
  instructionsAr: string;
  status: 'pending' | 'dispensed' | 'cancelled';
}

export interface Patient {
  id: string;
  hospitalId: string;
  mrn: string; // Medical Record Number e.g. MRN-2026-0842
  nationalId: string;
  name: string;
  nameAr: string;
  gender: 'male' | 'female';
  genderAr: string;
  age: number;
  dateOfBirth: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  insurance: {
    provider: string;
    providerAr: string;
    policyNumber: string;
    copayPercentage: number;
    validUntil: string;
  };
  triageLevel: TriageLevel;
  admitted: boolean;
  department?: string;
  departmentAr?: string;
  bedNumber?: string;
  roomNumber?: string;
  attendingDoctorId?: string;
  attendingDoctorName?: string;
  allergies: string[];
  chronicConditions: string[];
  vitals?: VitalSigns;
  vitalsHistory?: VitalSigns[];
  registeredAt: string;
}

export interface Doctor {
  id: string;
  hospitalId: string;
  userId: string;
  name: string;
  nameAr: string;
  specialty: string;
  specialtyAr: string;
  department: string;
  departmentAr: string;
  opdRoom: string;
  consultationFee: number;
  phone: string;
  email: string;
  rating: number;
  patientsCount: number;
  availableDays: string[];
  shiftHours: string;
  status: 'on_duty' | 'in_consultation' | 'on_leave' | 'off_duty';
  avatar: string;
}

export interface Appointment {
  id: string;
  hospitalId: string;
  patientId: string;
  patientName: string;
  patientNameAr: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  doctorNameAr: string;
  department: string;
  departmentAr: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  type: 'opd' | 'followup' | 'emergency' | 'telehealth';
  status: 'confirmed' | 'waiting' | 'in_consultation' | 'completed' | 'cancelled';
  symptoms: string;
  priority: 'routine' | 'urgent' | 'emergency';
  notes?: string;
}

export interface ConsultationRecord {
  id: string;
  hospitalId: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  vitals: VitalSigns;
  chiefComplaint: string;
  symptoms: string[];
  examinationFindings: string;
  icd10Code: string;
  icd10Description: string;
  clinicalNotes: string;
  prescriptions: PrescriptionItem[];
  orderedLabTests: string[];
  orderedRadiologyScans: string[];
  followUpDate?: string;
}

export interface MedicineInventory {
  id: string;
  hospitalId: string;
  code: string;
  brandName: string;
  genericName: string;
  category: string;
  categoryAr: string;
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'IV Infusion';
  strength: string;
  stockQuantity: number;
  minStockLevel: number;
  unitPrice: number;
  purchasePrice: number;
  expiryDate: string;
  supplierName: string;
  batchNumber: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
}

export interface LabTestResultParam {
  parameter: string;
  parameterAr: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
}

export interface LaboratoryTest {
  id: string;
  hospitalId: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  testName: string;
  testNameAr: string;
  testCode: string;
  category: string;
  categoryAr: string;
  specimenType: string;
  requestDate: string;
  completedDate?: string;
  status: 'pending' | 'sample_collected' | 'processing' | 'completed';
  urgency: 'routine' | 'urgent' | 'stat';
  results?: LabTestResultParam[];
  interpretation?: string;
  technicianName?: string;
}

export interface RadiologyScan {
  id: string;
  hospitalId: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  scanType: 'X-Ray' | 'CT' | 'MRI' | 'Ultrasound' | 'Echocardiogram';
  bodyPart: string;
  bodyPartAr: string;
  requestDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'reported';
  urgency: 'routine' | 'urgent' | 'stat';
  findings?: string;
  findingsAr?: string;
  radiologistNotes?: string;
  radiologistName?: string;
  imageUrl?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  descriptionAr: string;
  quantity: number;
  unitPrice: number;
  category: 'consultation' | 'pharmacy' | 'laboratory' | 'radiology' | 'room' | 'procedure';
  total: number;
}

export interface Invoice {
  id: string;
  hospitalId: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId?: string;
  doctorName?: string;
  date: string;
  dueDate: string;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  discount: number;
  insuranceCoverage: number;
  patientPayable: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paymentMethod?: 'cash' | 'credit_card' | 'insurance' | 'bank_transfer';
  paidAt?: string;
}

export interface SubscriptionPlan {
  id: 'free' | 'basic' | 'pro' | 'enterprise';
  name: string;
  nameAr: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxDoctors: number;
  maxUsers: number;
  maxPatients: number;
  storageGB: number;
  features: string[];
  featuresAr: string[];
  popular?: boolean;
}

export interface NotificationItem {
  id: string;
  hospitalId: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: 'appointment' | 'alert' | 'lab' | 'pharmacy' | 'billing' | 'system';
  read: boolean;
  timestamp: string;
  linkTab?: string;
}

export interface AuditLogItem {
  id: string;
  hospitalId?: string;
  hospitalName?: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}
