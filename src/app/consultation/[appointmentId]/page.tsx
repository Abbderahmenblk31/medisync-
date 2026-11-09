'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Appointment, Patient, PrescriptionItem, Vitals } from '@/lib/types';
import { COMMON_ICD10, COMMON_CPT_CODES } from '@/lib/data/mock-clinical-data';
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

  // EPIC SYSTEMS SOAP STATE:
  // S - Subjective
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [hpiText, setHpiText] = useState('Onset 4 days ago, gradual progression without fever.');
  const [painLevel, setPainLevel] = useState(3); // 0 to 10

  // O - Objective
  const [examNormal, setExamNormal] = useState({
    heent: true,
    cardiac: true,
    pulmonary: true,
    abdominal: true,
  });

  // A - Assessment
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState('');
  const [icd10Code, setIcd10Code] = useState(COMMON_ICD10[0]);
  const [clinicalNotes, setClinicalNotes] = useState('');

  // P - Plan & AthenaHealth Billing
  const [selectedCpt, setSelectedCpt] = useState(COMMON_CPT_CODES[1].code); // 99214
  const [orderedLabs, setOrderedLabs] = useState<string[]>(['CBC with Differential']);
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
      const cptObj = COMMON_CPT_CODES.find((c) => c.code === selectedCpt);

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
          clinicalNotes: `HPI: ${hpiText} | Pain: ${painLevel}/10 | Notes: ${clinicalNotes}`,
          prescriptions,
          cptCode: selectedCpt,
          consultationFee: cptObj?.standardFee || 100.0,
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

  const getPainEmoji = (level: number) => {
    if (level === 0) return '😊 No Pain (0)';
    if (level <= 3) return '🙂 Mild Pain (1-3)';
    if (level <= 6) return '😐 Moderate Pain (4-6)';
    if (level <= 8) return '😣 Severe Pain (7-8)';
    return '😫 Worst Possible Pain (9-10)';
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
              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                Epic Hyperspace Format
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              DOB: {patient.dateOfBirth} • Sex: {patient.gender} • Phone: {patient.phone} • Attending: Dr. {appointment.doctorName} ({appointment.department})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Telehealth Call Shortcut (Doctolib style) */}
          <Link
            href={`/telehealth/${appointment.id}`}
            onClick={() => medicalAudio.playTactileClick()}
            className="no-print px-3.5 py-2 text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>📹</span>
            <span>Launch Video Call</span>
          </Link>

          <button
            onClick={handlePrint}
            className="no-print px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <span>🖨️</span>
            <span>Print Rx Certificate</span>
          </button>

          <button
            onClick={handleSaveConsultation}
            disabled={saving}
            className="no-print px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-all flex items-center gap-2"
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
        {/* EPIC SOAP SECTION 1: [S] - SUBJECTIVE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-sky-600 text-white text-xs font-black flex items-center justify-center">
                S
              </span>
              <span>Subjective (Patient Narrative & Pain Scale)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Epic Clinical Documentation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chief Complaint (Reported Symptoms)
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
                History of Present Illness (HPI)
              </label>
              <input
                type="text"
                value={hpiText}
                onChange={(e) => setHpiText(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Wong-Baker Pain Scale Slider */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Wong-Baker FACES® Pain Scale:
              </span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {getPainEmoji(painLevel)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={painLevel}
              onChange={(e) => {
                medicalAudio.playTactileClick();
                setPainLevel(Number(e.target.value));
              }}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 (None)</span>
              <span>2</span>
              <span>4</span>
              <span>6</span>
              <span>8</span>
              <span>10 (Severe)</span>
            </div>
          </div>
        </div>

        {/* EPIC SOAP SECTION 2: [O] - OBJECTIVE (Vitals HUD + Physical Exam) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-teal-600 text-white text-xs font-black flex items-center justify-center">
              O
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Objective Telemetry & Physical Examination
            </span>
          </div>

          <VitalsHud
            vitals={vitals}
            onChange={(newVitals) => setVitals(newVitals)}
          />

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Physical Systems Review Checklist
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={examNormal.heent}
                  onChange={(e) => setExamNormal({ ...examNormal, heent: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <span>HEENT Normal</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={examNormal.cardiac}
                  onChange={(e) => setExamNormal({ ...examNormal, cardiac: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <span>S1/S2 Regular (No Murmurs)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={examNormal.pulmonary}
                  onChange={(e) => setExamNormal({ ...examNormal, pulmonary: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <span>Clear Lung Fields</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={examNormal.abdominal}
                  onChange={(e) => setExamNormal({ ...examNormal, abdominal: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <span>Abdomen Soft / Non-tender</span>
              </label>
            </div>
          </div>
        </div>

        {/* EPIC SOAP SECTION 3: [A] - ASSESSMENT */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-500 text-white text-xs font-black flex items-center justify-center">
                A
              </span>
              <span>Assessment & Clinical Diagnosis (ICD-10 Coding)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Standard ICD-10 Clinical Diagnostic Classification
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Physician Diagnostic Notes
            </label>
            <textarea
              rows={2}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Clinical differential impressions, etiology assessment..."
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* EPIC SOAP SECTION 4: [P] - PLAN & ATHENAHEALTH CPT CODING */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                P
              </span>
              <span>Treatment Plan, e-Prescriptions & CPT Billing Code</span>
            </h3>

            <Link
              href="/labs"
              className="no-print text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
            >
              <span>🧪 Requisition Lab Workup →</span>
            </Link>
          </div>

          {/* AthenaHealth CPT Selection Bar */}
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                AthenaHealth CPT Medical Billing Procedure Code:
              </span>
              <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400">
                Fee: ${COMMON_CPT_CODES.find((c) => c.code === selectedCpt)?.standardFee.toFixed(2)}
              </span>
            </div>
            <select
              value={selectedCpt}
              onChange={(e) => {
                medicalAudio.playTactileClick();
                setSelectedCpt(e.target.value);
              }}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg text-slate-900 dark:text-white font-medium"
            >
              {COMMON_CPT_CODES.map((cpt) => (
                <option key={cpt.code} value={cpt.code}>
                  CPT {cpt.code} — {cpt.description} (${cpt.standardFee})
                </option>
              ))}
            </select>
          </div>

          {/* e-Prescription Items */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                Active Medications to Prescribe:
              </span>
              <button
                type="button"
                onClick={addPrescriptionItem}
                className="no-print px-3 py-1 text-xs font-bold bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-lg border border-sky-200 dark:border-sky-800"
              >
                + Add Medication
              </button>
            </div>

            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/30 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
              >
                <div className="md:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Medication
                  </label>
                  <input
                    type="text"
                    value={rx.medicationName}
                    onChange={(e) => updatePrescription(rx.id, 'medicationName', e.target.value)}
                    placeholder="e.g. Lisinopril"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
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
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Frequency
                  </label>
                  <input
                    type="text"
                    value={rx.frequency}
                    onChange={(e) => updatePrescription(rx.id, 'frequency', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Duration
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
                    className="no-print p-2 text-rose-500 hover:text-rose-700"
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
              Authorized by Dr. {appointment.doctorName}, License #MD-84920
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
