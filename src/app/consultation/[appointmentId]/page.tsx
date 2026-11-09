'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Appointment, Patient, PrescriptionItem, Vitals } from '@/lib/types';
import { COMMON_ICD10 } from '@/lib/data/mock-clinical-data';
import { VitalsHud } from '@/components/medical/VitalsHud';
import { medicalAudio } from '@/lib/sound/medical-audio';

function ConsultationContent() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.appointmentId as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);

  // Clinical Vitals State
  const [vitals, setVitals] = useState<Vitals>({
    bloodPressure: '120/80',
    heartRate: 72,
    temperature: 36.8,
    spo2: 99,
    respiratoryRate: 16,
    weightKg: 70,
    heightCm: 175,
    bmi: 22.9,
  });

  // Clinical Diagnosis State
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState('');
  const [icd10Code, setIcd10Code] = useState(COMMON_ICD10[0]);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-11-24');

  // e-Prescription state
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'rx-1',
      medicationName: 'Amoxicillin / Clavulanate',
      dosage: '625mg',
      frequency: 'Every 8 hours with meal',
      durationDays: 7,
      instructions: 'Complete full course. Avoid alcohol.',
    },
  ]);

  useEffect(() => {
    if (!appointmentId) return;

    fetch(`/api/appointments/${appointmentId}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success && data.data) {
          const apt: Appointment = data.data;
          setAppointment(apt);
          setChiefComplaint(apt.reasonForVisit);

          // Fetch patient details
          const patRes = await fetch(`/api/patients/${apt.patientId}`);
          const patData = await patRes.json();
          if (patData.success) {
            setPatient(patData.data);
          }

          // Check if record already exists
          const recRes = await fetch(`/api/records?appointmentId=${appointmentId}`);
          const recData = await recRes.json();
          if (recData.success && recData.data) {
            const r = recData.data;
            setVitals(r.vitals || vitals);
            setChiefComplaint(r.chiefComplaint || apt.reasonForVisit);
            setClinicalDiagnosis(r.clinicalDiagnosis || '');
            setIcd10Code(r.icd10Code || COMMON_ICD10[0]);
            setClinicalNotes(r.clinicalNotes || '');
            if (r.prescriptions?.length > 0) {
              setPrescriptions(r.prescriptions);
            }
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const addPrescriptionItem = () => {
    medicalAudio.playTactileClick();
    const newItem: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      medicationName: '',
      dosage: '',
      frequency: 'Once daily after breakfast',
      durationDays: 5,
      instructions: 'Take with plenty of water',
    };
    setPrescriptions([...prescriptions, newItem]);
  };

  const removePrescriptionItem = (id: string) => {
    medicalAudio.playTactileClick();
    setPrescriptions(prescriptions.filter((p) => p.id !== id));
  };

  const updatePrescription = (id: string, field: keyof PrescriptionItem, val: any) => {
    setPrescriptions(
      prescriptions.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleSaveConsultation = async () => {
    if (!appointment || !patient) return;
    if (!clinicalDiagnosis.trim()) {
      alert('Please enter a clinical diagnosis before finalizing the chart.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointment.id,
          patientId: patient.id,
          patientName: patient.fullName,
          doctorName: appointment.doctorName,
          consultationDate: new Date().toISOString(),
          chiefComplaint,
          vitals,
          clinicalDiagnosis,
          icd10Code,
          clinicalNotes,
          prescriptions,
          followUpDate,
        }),
      });

      const data = await res.json();
      if (data.success) {
        medicalAudio.playSuccessChime();
        setSuccessSaved(true);
        setTimeout(() => {
          router.push('/billing');
        }, 1500);
      } else {
        alert(data.error || 'Failed to save record');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred while saving consultation record');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    medicalAudio.playTactileClick();
    window.print();
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 text-sm">
        Initializing Doctor Charting Room...
      </div>
    );
  }

  if (!appointment || !patient) {
    return (
      <div className="p-16 text-center text-slate-400 text-sm">
        Appointment not found.{' '}
        <Link href="/appointments" className="text-sky-600 underline">
          Return to schedule
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner: Patient Info Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-sky-500/20">
            {patient.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                {patient.fullName}
              </h2>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                {patient.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                Blood: {patient.bloodGroup}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              DOB: {patient.dateOfBirth} • Sex: {patient.gender} • Phone: {patient.phone} • Attending: Dr. {appointment.doctorName} ({appointment.department})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="no-print px-4 py-2.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <span>🖨️</span>
            <span>Print Rx Certificate</span>
          </button>

          <button
            onClick={handleSaveConsultation}
            disabled={saving}
            className="no-print px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            {saving ? 'Finalizing Chart...' : successSaved ? '✓ Saved! Redirecting...' : 'Complete & Generate Bill →'}
          </button>
        </div>
      </div>

      {/* Allergies Warning Alert */}
      {patient.allergies && patient.allergies.length > 0 && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-center gap-3 text-rose-800 dark:text-rose-300 text-xs">
          <span className="text-2xl">⚠️</span>
          <div>
            <strong className="font-bold">CRITICAL PATIENT ALLERGY WARNING:</strong>{' '}
            {patient.allergies.join(', ')} — Exercise strict contraindication screening before pharmaceutical prescription.
          </div>
        </div>
      )}

      {/* Printable Area - Main Medical Form */}
      <div className="printable-area space-y-6">
        {/* Section 1: Tactical Biometrics HUD */}
        <VitalsHud
          vitals={vitals}
          onChange={(newVitals) => setVitals(newVitals)}
        />

        {/* Section 2: Clinical Assessment & ICD-10 Coding */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>📋</span>
              <span>Physician Assessment & ICD-10 Classification</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chief Complaint (Subjective Symptoms)
              </label>
              <input
                type="text"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Standard ICD-10 Clinical Diagnostic Code
              </label>
              <select
                value={icd10Code}
                onChange={(e) => {
                  setIcd10Code(e.target.value);
                  const diagnosisName = e.target.value.split(' - ')[1] || e.target.value;
                  if (!clinicalDiagnosis) setClinicalDiagnosis(diagnosisName);
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {COMMON_ICD10.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Primary Clinical Diagnosis Formulation *
            </label>
            <input
              type="text"
              value={clinicalDiagnosis}
              onChange={(e) => setClinicalDiagnosis(e.target.value)}
              placeholder="e.g. Stage 1 Essential Hypertension with mild peripheral edema"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Objective Clinical Findings & Progress Notes
            </label>
            <textarea
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Patient is alert and oriented x3. Normal heart sounds S1/S2 without murmurs. Lung fields clear bilaterally..."
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Section 3: e-Prescriptions (Rx) Suite */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>💊</span>
                <span>Electronic Prescription (e-Rx) Formulation</span>
              </h3>
              <p className="text-xs text-slate-500">Pharmacy-grade medication dispatch items</p>
            </div>

            <button
              type="button"
              onClick={addPrescriptionItem}
              className="no-print px-3.5 py-1.5 text-xs font-semibold bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 hover:bg-sky-100 rounded-lg transition-colors border border-sky-200 dark:border-sky-800 flex items-center gap-1.5"
            >
              <span>+ Add Medication</span>
            </button>
          </div>

          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/30 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
              >
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Medication / Generic Name
                  </label>
                  <input
                    type="text"
                    value={rx.medicationName}
                    onChange={(e) => updatePrescription(rx.id, 'medicationName', e.target.value)}
                    placeholder="e.g. Lisinopril, Metformin"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={rx.dosage}
                    onChange={(e) => updatePrescription(rx.id, 'dosage', e.target.value)}
                    placeholder="e.g. 10mg"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Frequency & Administration
                  </label>
                  <input
                    type="text"
                    value={rx.frequency}
                    onChange={(e) => updatePrescription(rx.id, 'frequency', e.target.value)}
                    placeholder="Once daily morning"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Days
                  </label>
                  <input
                    type="number"
                    value={rx.durationDays}
                    onChange={(e) => updatePrescription(rx.id, 'durationDays', Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removePrescriptionItem(rx.id)}
                    className="no-print p-2 text-rose-500 hover:text-rose-700 transition-colors"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Recommended Follow-Up Appointment:
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="text-right text-xs text-slate-400">
              Prescribed by Dr. {appointment.doctorName}, License #MD-84920
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-slate-400 text-sm">
          Loading Clinical Charting Room...
        </div>
      }
    >
      <ConsultationContent />
    </Suspense>
  );
}
