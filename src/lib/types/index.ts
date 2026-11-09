// =============================================================================
// MediSync Clinical EMR & Practice Management - Core Domain Model (Epic/Athena Benchmark)
// =============================================================================

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type PaymentStatus = 'PAID' | 'PENDING' | 'INSURANCE_CLAIM' | 'CANCELLED';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface InsurancePolicy {
  provider: string; // e.g. "BlueCross BlueShield", "Aetna", "Cigna", "Medicare"
  policyNumber: string;
  groupNumber: string;
  copayAmount: number;
  coverageStatus: 'VERIFIED' | 'PENDING_VERIFICATION' | 'EXPIRED';
}

export interface Patient {
  id: string; // e.g. "PT-1042"
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  nationalId?: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: EmergencyContact;
  insurance?: InsurancePolicy;
  registeredAt: string;
}

export interface Vitals {
  bloodPressure: string; // e.g. "120/80"
  heartRate: number; // bpm
  temperature: number; // Celsius
  spo2: number; // percentage
  respiratoryRate: number; // breaths/min
  weightKg: number;
  heightCm: number;
  bmi: number;
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "Twice daily after meals"
  durationDays: number;
  instructions: string;
}

// --- EPIC SYSTEMS BENCHMARK: SOAP NOTES ---
export interface SoapSubjective {
  chiefComplaint: string;
  historyOfPresentIllness: string;
  painLevel: number; // 0 to 10
}

export interface SoapObjective {
  vitals: Vitals;
  generalAppearance: string;
  cardiovascularExam: string;
  respiratoryExam: string;
  abdominalExam: string;
}

export interface SoapAssessment {
  clinicalDiagnosis: string;
  icd10Code: string;
  differentialDiagnosis?: string;
}

export interface SoapPlan {
  prescriptions: PrescriptionItem[];
  labOrdersRequested: string[];
  lifestyleAdvice: string;
  followUpDate?: string;
}

export interface MedicalRecord {
  id: string; // e.g. "MR-9821"
  appointmentId: string;
  patientId: string;
  doctorName: string;
  consultationDate: string;
  chiefComplaint: string;
  vitals: Vitals;
  clinicalDiagnosis: string;
  icd10Code: string;
  clinicalNotes: string;
  prescriptions: PrescriptionItem[];
  soap?: {
    subjective: SoapSubjective;
    objective: SoapObjective;
    assessment: SoapAssessment;
    plan: SoapPlan;
  };
  followUpDate?: string;
  createdAt: string;
}

// --- ATHENAHEALTH BENCHMARK: CPT CODING & CLAIMS ---
export interface CptCodeItem {
  code: string; // e.g. "99213"
  description: string;
  standardFee: number;
}

// --- EPIC ORDERS BENCHMARK: LAB & DIAGNOSTIC ORDERS ---
export type LabOrderStatus = 'ORDERED' | 'SAMPLE_COLLECTED' | 'IN_ANALYSIS' | 'COMPLETED';
export type LabOrderUrgency = 'ROUTINE' | 'URGENT' | 'STAT';

export interface LabOrder {
  id: string; // e.g. "LAB-3012"
  appointmentId?: string;
  patientId: string;
  patientName: string;
  testName: string;
  category: 'HEMATOLOGY' | 'BIOCHEMISTRY' | 'CARDIOLOGY' | 'RADIOLOGY' | 'IMMUNOLOGY';
  urgency: LabOrderUrgency;
  status: LabOrderStatus;
  orderedByDoctor: string;
  orderedAt: string;
  results?: string;
  referenceRange?: string;
  abnormalFlag?: boolean;
}

export interface Appointment {
  id: string; // e.g. "APT-4091"
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  department: 'Cardiology' | 'General Medicine' | 'Pediatrics' | 'Orthopedics' | 'Dermatology';
  scheduledTime: string; // ISO String
  durationMinutes: number;
  status: AppointmentStatus;
  type?: 'IN_CLINIC' | 'TELEHEALTH';
  reasonForVisit: string;
  roomNumber: string;
  consultationFee: number;
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  cptCode?: string;
}

export interface MedicalInvoice {
  id: string; // e.g. "INV-7801"
  appointmentId: string;
  patientId: string;
  patientName: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  copayAmount?: number;
  insuranceClaimAmount?: number;
  totalAmount: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'INSURANCE' | 'ONLINE';
  paymentStatus: PaymentStatus;
  issuedAt: string;
}

export interface ClinicMetrics {
  totalPatientsRegistered: number;
  appointmentsToday: number;
  inWaitingRoom: number;
  completedConsultations: number;
  pendingLabOrders: number;
  todayRevenue: number;
  recentAppointments: Appointment[];
}
