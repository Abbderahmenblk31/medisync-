// =============================================================================
// MediSync Clinical EMR & Practice Management - Core Domain Model
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

export interface MedicalRecord {
  id: string; // e.g. "MR-9821"
  appointmentId: string;
  patientId: string;
  doctorName: string;
  consultationDate: string;
  chiefComplaint: string;
  vitals: Vitals;
  clinicalDiagnosis: string;
  icd10Code: string; // e.g. "I10 - Essential Hypertension"
  clinicalNotes: string;
  prescriptions: PrescriptionItem[];
  followUpDate?: string;
  createdAt: string;
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
  todayRevenue: number;
  recentAppointments: Appointment[];
}
