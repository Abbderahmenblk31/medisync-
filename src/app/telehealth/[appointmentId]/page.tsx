'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Appointment, Patient, PrescriptionItem } from '@/lib/types';
import { medicalAudio } from '@/lib/sound/medical-audio';

function TelehealthContent() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.appointmentId as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  // Audio/Video Hardware toggles
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [callDuration, setCallDuration] = useState(142); // seconds
  const [isRecording, setIsRecording] = useState(true);

  // In-call quick charting
  const [quickNotes, setQuickNotes] = useState('');
  const [prescribedMed, setPrescribedMed] = useState('');
  const [rxPushed, setRxPushed] = useState(false);

  useEffect(() => {
    if (!appointmentId) return;

    fetch(`/api/appointments/${appointmentId}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success && data.data) {
          const apt: Appointment = data.data;
          setAppointment(apt);
          setQuickNotes(`Subjective review: ${apt.reasonForVisit}\nPatient reports mild symptoms.`);

          const patRes = await fetch(`/api/patients/${apt.patientId}`);
          const patData = await patRes.json();
          if (patData.success) {
            setPatient(patData.data);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Call duration timer
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [appointmentId]);

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePushRx = () => {
    if (!prescribedMed.trim()) return;
    medicalAudio.playSuccessChime();
    setRxPushed(true);
    setTimeout(() => setRxPushed(false), 3000);
  };

  const handleEndCall = () => {
    medicalAudio.playTactileClick();
    router.push(`/consultation/${appointmentId}`);
  };

  if (loading || !appointment || !patient) {
    return (
      <div className="p-16 text-center text-slate-400 text-sm">
        Establishing encrypted WebRTC Telehealth tunnel...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Telehealth Room Top Bar */}
      <div className="bg-slate-900 text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <span>Doctolib/SimplePractice Telehealth Suite</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full font-mono">
                256-bit AES Encrypted
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Consultation with <strong>{patient.fullName}</strong> ({patient.id}) • Attending: Dr. {appointment.doctorName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-mono text-xs text-slate-300 bg-white/10 px-3 py-1 rounded-lg">
            ⏱️ {formatDuration(callDuration)}
          </div>

          <button
            onClick={handleEndCall}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            End & Return to Chart
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stream (Left) + Clinical Sidecar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Video Room Viewport */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl overflow-hidden relative min-h-[480px] flex flex-col justify-between p-6 border border-slate-800 shadow-2xl">
          {/* Patient Simulated Video Backdrop */}
          <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none">
            {videoActive ? (
              <div className="text-center space-y-3">
                <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-5xl text-white font-bold shadow-2xl border-4 border-white/20">
                  {patient.fullName.charAt(0)}
                </div>
                <div className="text-white text-lg font-bold">
                  {patient.fullName} (Connected from Home)
                </div>
                <div className="text-xs text-emerald-400 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  HD 1080p • 60 FPS • 24ms Latency
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm">Patient Camera Muted</div>
            )}
          </div>

          {/* Top Video Overlay: Vitals HUD overlay */}
          <div className="z-10 flex justify-between items-start">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 text-white text-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Connected Biometrics
              </div>
              <div className="flex items-center gap-4 font-mono">
                <span>HR: <strong>72 bpm</strong></span>
                <span>SpO2: <strong>99%</strong></span>
                <span>BP: <strong>120/80</strong></span>
              </div>
            </div>

            {/* Doctor's Self View (Picture-in-Picture) */}
            <div className="w-36 h-28 bg-slate-900/90 rounded-2xl border-2 border-sky-500/60 overflow-hidden shadow-xl flex flex-col justify-between p-2">
              <div className="flex justify-between items-center text-[9px] text-slate-300">
                <span>Doctor Cam</span>
                <span className="text-emerald-400">● LIVE</span>
              </div>
              <div className="text-center font-bold text-xs text-white">
                Dr. {appointment.doctorName}
              </div>
              <div className="text-[9px] text-slate-400 text-center font-mono">
                Metropolitan Central
              </div>
            </div>
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="z-10 mx-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2.5 flex items-center gap-3 shadow-2xl">
            <button
              onClick={() => {
                medicalAudio.playTactileClick();
                setMicActive(!micActive);
              }}
              className={`p-3 rounded-xl transition-all ${
                micActive
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-rose-600 text-white'
              }`}
              title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micActive ? '🎙️ Mic Active' : '🔇 Muted'}
            </button>

            <button
              onClick={() => {
                medicalAudio.playTactileClick();
                setVideoActive(!videoActive);
              }}
              className={`p-3 rounded-xl transition-all ${
                videoActive
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-rose-600 text-white'
              }`}
              title={videoActive ? 'Disable Video' : 'Enable Video'}
            >
              {videoActive ? '📹 Cam Active' : '🚫 Cam Off'}
            </button>

            <button
              onClick={() => medicalAudio.playTactileClick()}
              className="p-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all text-xs font-semibold"
            >
              🖥️ Share Screen
            </button>

            <button
              onClick={handleEndCall}
              className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center gap-2"
            >
              <span>📞</span>
              <span>Hang Up</span>
            </button>
          </div>
        </div>

        {/* Right Column: In-Call Clinical Workspace (Athena/Epic Style) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Live In-Call Clinical Sidecar
                </h3>
                <p className="text-[11px] text-slate-400">Record notes without minimizing video</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950 text-sky-600 font-bold">
                SOAP Mode
              </span>
            </div>

            {/* Patient Allergy Warning */}
            {patient.allergies?.length > 0 && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300">
                <strong>⚠️ Known Allergies:</strong> {patient.allergies.join(', ')}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Real-Time Clinical Impressions
              </label>
              <textarea
                rows={6}
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
                placeholder="Type symptoms observed during the live video examination..."
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            {/* In-Call Instant Prescription Push */}
            <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/60 space-y-2">
              <label className="block text-xs font-bold text-sky-800 dark:text-sky-300">
                🚀 Instant e-Prescription Dispatch to Patient App
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prescribedMed}
                  onChange={(e) => setPrescribedMed(e.target.value)}
                  placeholder="e.g. Salbutamol Inhaler 100mcg"
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handlePushRx}
                  className="px-3 py-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-all"
                >
                  Send
                </button>
              </div>
              {rxPushed && (
                <div className="text-[11px] text-emerald-600 font-semibold animate-fade-in">
                  ✓ Prescription transmitted securely to patient portal!
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Session ID: TLS-9821</span>
            <Link
              href={`/consultation/${appointmentId}`}
              className="text-sky-600 font-semibold hover:underline"
            >
              Open Full Chart →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TelehealthPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-slate-400 text-sm">
          Loading Telehealth Suite...
        </div>
      }
    >
      <TelehealthContent />
    </Suspense>
  );
}
