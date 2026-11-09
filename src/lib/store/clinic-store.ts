// =============================================================================
// MediSync Clinical Practice Engine - State & Repository Layer
// =============================================================================

import {
  Patient,
  Appointment,
  AppointmentStatus,
  MedicalRecord,
  MedicalInvoice,
  ClinicMetrics,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_RECORDS,
  INITIAL_INVOICES,
} from '../data/mock-clinical-data';

class ClinicStore {
  private patients: Patient[] = [...INITIAL_PATIENTS];
  private appointments: Appointment[] = [...INITIAL_APPOINTMENTS];
  private records: MedicalRecord[] = [...INITIAL_RECORDS];
  private invoices: MedicalInvoice[] = [...INITIAL_INVOICES];

  // --- PATIENT REGISTRY ---
  public listPatients(query?: string): Patient[] {
    if (!query || !query.trim()) {
      return [...this.patients];
    }
    const q = query.toLowerCase().trim();
    return this.patients.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }

  public getPatientById(id: string): Patient | null {
    return this.patients.find((p) => p.id === id) || null;
  }

  public registerPatient(dto: Omit<Patient, 'id' | 'registeredAt'>): Patient {
    const newId = `PT-${Math.floor(1050 + Math.random() * 8900)}`;
    const newPatient: Patient = {
      ...dto,
      id: newId,
      registeredAt: new Date().toISOString(),
    };
    this.patients.unshift(newPatient);
    return newPatient;
  }

  // --- APPOINTMENTS ENGINE ---
  public listAppointments(filters?: {
    department?: string;
    status?: string;
    doctorName?: string;
  }): Appointment[] {
    let list = [...this.appointments];

    if (filters?.department && filters.department !== 'ALL') {
      list = list.filter((a) => a.department === filters.department);
    }
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((a) => a.status === filters.status);
    }
    if (filters?.doctorName && filters.doctorName !== 'ALL') {
      list = list.filter((a) => a.doctorName === filters.doctorName);
    }

    return list.sort(
      (a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
    );
  }

  public getAppointmentById(id: string): Appointment | null {
    return this.appointments.find((a) => a.id === id) || null;
  }

  public bookAppointment(dto: {
    patientId: string;
    patientName: string;
    patientPhone: string;
    doctorName: string;
    department: Appointment['department'];
    scheduledTime: string;
    reasonForVisit: string;
    roomNumber?: string;
    consultationFee?: number;
  }): Appointment {
    const newId = `APT-${Math.floor(4100 + Math.random() * 5900)}`;
    const newApt: Appointment = {
      id: newId,
      patientId: dto.patientId,
      patientName: dto.patientName,
      patientPhone: dto.patientPhone,
      doctorName: dto.doctorName,
      department: dto.department,
      scheduledTime: dto.scheduledTime,
      durationMinutes: 30,
      status: 'CONFIRMED',
      reasonForVisit: dto.reasonForVisit,
      roomNumber: dto.roomNumber || 'Consultation Room 2',
      consultationFee: dto.consultationFee || 80.0,
      createdAt: new Date().toISOString(),
    };

    this.appointments.push(newApt);
    return newApt;
  }

  public updateAppointmentStatus(id: string, status: AppointmentStatus): Appointment {
    const apt = this.getAppointmentById(id);
    if (!apt) throw new Error(`Appointment ${id} not found.`);
    apt.status = status;
    return apt;
  }

  // --- MEDICAL RECORDS & CONSULTATION ---
  public getRecordByAppointment(appointmentId: string): MedicalRecord | null {
    return this.records.find((r) => r.appointmentId === appointmentId) || null;
  }

  public getRecordsByPatient(patientId: string): MedicalRecord[] {
    return this.records.filter((r) => r.patientId === patientId);
  }

  public saveMedicalRecord(dto: Omit<MedicalRecord, 'id' | 'createdAt'>): MedicalRecord {
    const existing = this.getRecordByAppointment(dto.appointmentId);
    if (existing) {
      Object.assign(existing, dto);
      return existing;
    }

    const newRecord: MedicalRecord = {
      ...dto,
      id: `MR-${Math.floor(9830 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    this.records.push(newRecord);

    // Update appointment to completed
    this.updateAppointmentStatus(dto.appointmentId, 'COMPLETED');

    return newRecord;
  }

  // --- INVOICES & BILLING ---
  public listInvoices(): MedicalInvoice[] {
    return [...this.invoices];
  }

  public createInvoice(dto: Omit<MedicalInvoice, 'id' | 'issuedAt'>): MedicalInvoice {
    const newInvoice: MedicalInvoice = {
      ...dto,
      id: `INV-${Math.floor(7810 + Math.random() * 2000)}`,
      issuedAt: new Date().toISOString(),
    };
    this.invoices.unshift(newInvoice);
    return newInvoice;
  }

  public payInvoice(id: string): MedicalInvoice {
    const inv = this.invoices.find((i) => i.id === id);
    if (!inv) throw new Error(`Invoice ${id} not found.`);
    inv.paymentStatus = 'PAID';
    return inv;
  }

  // --- CLINIC TELEMETRY & METRICS ---
  public getMetrics(): ClinicMetrics {
    const today = new Date().toISOString().split('T')[0];

    const appointmentsToday = this.appointments.length;
    const inWaitingRoom = this.appointments.filter(
      (a) => a.status === 'CONFIRMED' || a.status === 'SCHEDULED'
    ).length;
    const completedConsultations = this.appointments.filter(
      (a) => a.status === 'COMPLETED'
    ).length;

    const todayRevenue = this.invoices
      .filter((i) => i.paymentStatus === 'PAID')
      .reduce((sum, i) => sum + i.totalAmount, 0);

    return {
      totalPatientsRegistered: this.patients.length,
      appointmentsToday,
      inWaitingRoom,
      completedConsultations,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      recentAppointments: this.appointments.slice(0, 6),
    };
  }
}

export const clinicStore = new ClinicStore();
