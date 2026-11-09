// =============================================================================
// MediSync Clinical Store - Real-World Mock Seed Data
// =============================================================================

import { Patient, Appointment, MedicalRecord, MedicalInvoice } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PT-1042',
    fullName: 'Leila Khemir',
    dateOfBirth: '1988-06-14',
    gender: 'FEMALE',
    bloodGroup: 'O+',
    phone: '+216 98 445 120',
    email: 'leila.khemir@gmail.com',
    nationalId: '08941235',
    allergies: ['Penicillin', 'Sulfa drugs'],
    chronicConditions: ['Type 2 Diabetes', 'Mild Asthma'],
    emergencyContact: {
      name: 'Walid Khemir',
      relation: 'Spouse',
      phone: '+216 22 110 994',
    },
    registeredAt: '2025-04-12T09:00:00Z',
  },
  {
    id: 'PT-1043',
    fullName: 'Tarek Ben Amor',
    dateOfBirth: '1974-11-22',
    gender: 'MALE',
    bloodGroup: 'A+',
    phone: '+216 55 889 301',
    email: 'tarek.ba@outlook.com',
    nationalId: '04512998',
    allergies: ['None known'],
    chronicConditions: ['Essential Hypertension'],
    emergencyContact: {
      name: 'Salma Ben Amor',
      relation: 'Sister',
      phone: '+216 97 334 112',
    },
    registeredAt: '2025-08-19T11:30:00Z',
  },
  {
    id: 'PT-1044',
    fullName: 'Youssef Trabelsi',
    dateOfBirth: '2016-03-08',
    gender: 'MALE',
    bloodGroup: 'B+',
    phone: '+216 24 551 092',
    email: 'mona.trabelsi@yahoo.com',
    allergies: ['Peanuts'],
    chronicConditions: ['Atopic Dermatitis'],
    emergencyContact: {
      name: 'Mona Trabelsi',
      relation: 'Mother',
      phone: '+216 24 551 092',
    },
    registeredAt: '2026-01-10T14:15:00Z',
  },
  {
    id: 'PT-1045',
    fullName: 'Nadia Chaabane',
    dateOfBirth: '1995-09-30',
    gender: 'FEMALE',
    bloodGroup: 'AB-',
    phone: '+216 50 123 789',
    email: 'nadia.ch@biotech.tn',
    allergies: ['Latex', 'Aspirin'],
    chronicConditions: ['None'],
    emergencyContact: {
      name: 'Amine Chaabane',
      relation: 'Brother',
      phone: '+216 50 998 776',
    },
    registeredAt: '2026-02-04T10:00:00Z',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-4091',
    patientId: 'PT-1042',
    patientName: 'Leila Khemir',
    patientPhone: '+216 98 445 120',
    doctorName: 'Dr. Sofiene Jaziri',
    department: 'General Medicine',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // in 30 mins
    durationMinutes: 30,
    status: 'IN_CONSULTATION',
    reasonForVisit: 'Follow-up blood glucose check and persistent dry cough',
    roomNumber: 'Room 102',
    consultationFee: 75.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'APT-4092',
    patientId: 'PT-1043',
    patientName: 'Tarek Ben Amor',
    patientPhone: '+216 55 889 301',
    doctorName: 'Dr. Mehdi Slim',
    department: 'Cardiology',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 90).toISOString(), // in 90 mins
    durationMinutes: 45,
    status: 'CONFIRMED',
    reasonForVisit: 'Quarterly cardiovascular review and ECG test',
    roomNumber: 'Cardio Suite A',
    consultationFee: 120.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'APT-4093',
    patientId: 'PT-1044',
    patientName: 'Youssef Trabelsi',
    patientPhone: '+216 24 551 092',
    doctorName: 'Dr. Ines Mahjoub',
    department: 'Pediatrics',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 180).toISOString(), // in 3 hours
    durationMinutes: 30,
    status: 'SCHEDULED',
    reasonForVisit: 'Seasonal skin eczema flare-up & allergy test review',
    roomNumber: 'Pediatric Clinic 3',
    consultationFee: 70.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'APT-4090',
    patientId: 'PT-1045',
    patientName: 'Nadia Chaabane',
    patientPhone: '+216 50 123 789',
    doctorName: 'Dr. Sarah Mansour',
    department: 'Dermatology',
    scheduledTime: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 mins ago
    durationMinutes: 30,
    status: 'COMPLETED',
    reasonForVisit: 'Facial acne treatment and topical prescription renewal',
    roomNumber: 'Derma Laser Lab',
    consultationFee: 90.0,
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
];

export const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: 'MR-9820',
    appointmentId: 'APT-4090',
    patientId: 'PT-1045',
    doctorName: 'Dr. Sarah Mansour',
    consultationDate: new Date().toISOString().split('T')[0],
    chiefComplaint: 'Recurrent inflammatory facial lesions worsening over past 3 weeks',
    vitals: {
      bloodPressure: '118/76',
      heartRate: 72,
      temperature: 36.8,
      spo2: 99,
      respiratoryRate: 16,
      weightKg: 58.0,
      heightCm: 167,
      bmi: 20.8,
    },
    clinicalDiagnosis: 'Moderate Acne Vulgaris (Papulopustular type)',
    icd10Code: 'L70.0 - Acne vulgaris',
    clinicalNotes: 'Patient advised to discontinue irritating cosmetic oils. Prescribed combination topical therapy.',
    prescriptions: [
      {
        id: 'rx-01',
        medicationName: 'Adapalene Gel 0.1%',
        dosage: 'Pea-sized amount',
        frequency: 'Once nightly before bed',
        durationDays: 30,
        instructions: 'Apply to clean, dry skin. Avoid direct sunlight.',
      },
      {
        id: 'rx-02',
        medicationName: 'Doxycycline 100mg',
        dosage: '1 capsule',
        frequency: 'Once daily after breakfast',
        durationDays: 14,
        instructions: 'Take with full glass of water. Do not lie down for 30 mins.',
      },
    ],
    followUpDate: '2026-03-10',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_INVOICES: MedicalInvoice[] = [
  {
    id: 'INV-7801',
    appointmentId: 'APT-4090',
    patientId: 'PT-1045',
    patientName: 'Nadia Chaabane',
    items: [
      {
        description: 'Specialist Dermatology Consultation',
        quantity: 1,
        unitPrice: 90.0,
        totalPrice: 90.0,
      },
    ],
    subtotal: 90.0,
    discount: 0.0,
    tax: 0.0,
    totalAmount: 90.0,
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'PAID',
    issuedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

export const DOCTORS_ROSTER = [
  { name: 'Dr. Sarah Chen', department: 'Cardiology' as const, fee: 120 },
  { name: 'Dr. Sofiene Jaziri', department: 'General Medicine' as const, fee: 75 },
  { name: 'Dr. Ines Mahjoub', department: 'Pediatrics' as const, fee: 70 },
  { name: 'Dr. Sarah Mansour', department: 'Dermatology' as const, fee: 90 },
  { name: 'Dr. Mehdi Slim', department: 'Cardiology' as const, fee: 120 },
  { name: 'Dr. Alex Vance', department: 'Orthopedics' as const, fee: 110 },
];

export const COMMON_ICD10 = [
  'I10 - Essential (primary) hypertension',
  'E11.9 - Type 2 diabetes mellitus without complications',
  'J06.9 - Acute upper respiratory infection, unspecified',
  'M54.5 - Low back pain',
  'R07.9 - Chest pain, unspecified',
  'L70.0 - Acne vulgaris',
  'L20.9 - Atopic dermatitis, unspecified',
  'K21.9 - Gastro-esophageal reflux disease without esophagitis',
  'Z00.00 - General adult medical examination without abnormal findings',
];

export const COMMON_CPT_CODES = [
  { code: '99213', description: 'Office outpatient visit, low complexity, 20-29 mins', standardFee: 85.0 },
  { code: '99214', description: 'Office outpatient visit, moderate complexity, 30-39 mins', standardFee: 130.0 },
  { code: '99215', description: 'Office outpatient visit, high complexity, 40-54 mins', standardFee: 185.0 },
  { code: '93000', description: '12-lead electrocardiogram (ECG) with interpretation & report', standardFee: 50.0 },
  { code: '80061', description: 'Lipid panel blood diagnostic test', standardFee: 40.0 },
  { code: '85025', description: 'Complete Blood Count (CBC) with automated differential', standardFee: 28.0 },
  { code: '83036', description: 'Hemoglobin A1c (HbA1c) glycated protein test', standardFee: 32.0 },
  { code: '71046', description: 'Chest X-Ray radiological examination, 2 views', standardFee: 95.0 },
];

export const INITIAL_LAB_ORDERS = [
  {
    id: 'LAB-3011',
    appointmentId: 'APT-4091',
    patientId: 'PT-1042',
    patientName: 'Leila Khemir',
    testName: 'Hemoglobin A1c (HbA1c Glycated)',
    category: 'BIOCHEMISTRY' as const,
    urgency: 'ROUTINE' as const,
    status: 'COMPLETED' as const,
    orderedByDoctor: 'Dr. Sofiene Jaziri',
    orderedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    results: '6.4%',
    referenceRange: '< 5.7% (Normal), 5.7-6.4% (Prediabetes)',
    abnormalFlag: true,
  },
  {
    id: 'LAB-3012',
    appointmentId: 'APT-4092',
    patientId: 'PT-1043',
    patientName: 'Tarek Ben Amor',
    testName: 'Lipid Profile & Serum Electrolytes',
    category: 'BIOCHEMISTRY' as const,
    urgency: 'URGENT' as const,
    status: 'IN_ANALYSIS' as const,
    orderedByDoctor: 'Dr. Mehdi Slim',
    orderedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    results: 'Pending centrifuge separation',
    referenceRange: 'Total Cholesterol < 200 mg/dL',
    abnormalFlag: false,
  },
  {
    id: 'LAB-3013',
    appointmentId: 'APT-4090',
    patientId: 'PT-1045',
    patientName: 'Nadia Chaabane',
    testName: 'Serum Total IgE & Allergen Screen',
    category: 'IMMUNOLOGY' as const,
    urgency: 'ROUTINE' as const,
    status: 'SAMPLE_COLLECTED' as const,
    orderedByDoctor: 'Dr. Sarah Mansour',
    orderedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    referenceRange: '< 100 IU/mL',
    abnormalFlag: false,
  },
];


