'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClinicMetrics, Appointment } from '@/lib/types';
import { EcgliveMonitor } from '@/components/medical/EcgliveMonitor';
import { AnatomyMap, BodyZone } from '@/components/medical/AnatomyMap';
import { medicalAudio } from '@/lib/sound/medical-audio';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<ClinicMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeZone, setActiveZone] = useState<BodyZone>('ALL');

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics(data.data);
        }
      })
      .catch((err) => console.error('Failed to load metrics:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter appointments according to selected anatomical region
  const filterAppointmentsByZone = (list: Appointment[], zone: BodyZone) => {
    if (zone === 'ALL') return list;
    if (zone === 'CHEST') {
      return list.filter(
        (a) =>
          a.department === 'Cardiology' ||
          a.reasonForVisit.toLowerCase().includes('cardiac') ||
          a.reasonForVisit.toLowerCase().includes('cough') ||
          a.reasonForVisit.toLowerCase().includes('chest')
      );
    }
    if (zone === 'HEAD') {
      return list.filter(
        (a) =>
          a.department === 'General Medicine' ||
          a.reasonForVisit.toLowerCase().includes('cough') ||
          a.reasonForVisit.toLowerCase().includes('head')
      );
    }
    if (zone === 'ABDOMEN') {
      return list.filter(
        (a) =>
          a.reasonForVisit.toLowerCase().includes('glucose') ||
          a.reasonForVisit.toLowerCase().includes('stomach') ||
          a.reasonForVisit.toLowerCase().includes('digest')
      );
    }
    if (zone === 'SPINE' || zone === 'LIMBS') {
      return list.filter(
        (a) =>
          a.department === 'Orthopedics' ||
          a.department === 'Dermatology' ||
          a.reasonForVisit.toLowerCase().includes('rash') ||
          a.reasonForVisit.toLowerCase().includes('eczema') ||
          a.reasonForVisit.toLowerCase().includes('back')
      );
    }
    return list;
  };

  const filteredAppointments = filterAppointmentsByZone(
    metrics?.recentAppointments || [],
    activeZone
  );

  const getTriageStatusTag = (apt: Appointment) => {
    if (apt.department === 'Cardiology' || apt.status === 'IN_CONSULTATION') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Priority 1 • Triage Active
        </span>
      );
    }
    if (apt.status === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          ✓ Discharged
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
        Standard Intake
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Cockpit Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative medical cross watermark */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none text-9xl">
          ✚
        </div>

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Station Alpha • Ward B
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Clinic Live
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
            Clinical Command & Telemetry Deck
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Real-time biometric synthesis, anatomical symptom mapping, and immediate physician consultation dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-300">Wait Room</div>
            <div className="text-lg font-black font-mono text-amber-300">
              {loading ? '...' : metrics?.inWaitingRoom ?? 0}
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-300">Today's Revenue</div>
            <div className="text-lg font-black font-mono text-emerald-300">
              ${loading ? '...' : metrics?.todayRevenue?.toFixed(0) ?? '0'}
            </div>
          </div>

          <Link
            href="/consultation/APT-4091"
            onClick={() => medicalAudio.playTactileClick()}
            className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/30 transition-all flex items-center gap-2"
          >
            <span>🩺</span>
            <span>Launch Active EMR</span>
          </Link>
        </div>
      </div>

      {/* Grid: Live ECG Telemetry & Anatomical Body Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: ECG Monitor & Today's Vital Metrics */}
        <div className="lg:col-span-7 space-y-6">
          <EcgliveMonitor
            bpm={74}
            label="Live Cardiac Telemetry • Lead II"
            leadName="LEAD II - V5 / Ambulatory"
            isPulsingAudio={false}
          />

          {/* Quick Metrics Ribbon (Minimalist Medical Strip) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Patients
              </span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {metrics?.totalPatientsRegistered ?? 0}
              </div>
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
                Active dossiers
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Completed
              </span>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {metrics?.completedConsultations ?? 0}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">e-Rx dispatched</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Specialties
              </span>
              <div className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                5 Depts
              </div>
              <span className="text-[10px] text-slate-400 font-medium">100% On-Duty</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Anatomical Body Map */}
        <div className="lg:col-span-5">
          <AnatomyMap
            activeZone={activeZone}
            onSelectZone={(zone) => setActiveZone(zone)}
            zoneCounts={{
              HEAD: 1,
              CHEST: 2,
              ABDOMEN: 1,
              SPINE: 0,
              LIMBS: 1,
            }}
          />
        </div>
      </div>

      {/* Patient Triage Stream & Live Queue */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold text-sm">
              📋
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>Immediate Patient Encounter Queue</span>
                {activeZone !== 'ALL' && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    Filtered: {activeZone}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Sorted by appointment slot & vital severity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/appointments"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              Full Calendar →
            </Link>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex flex-col items-center justify-center font-mono font-bold shrink-0">
                    <span className="text-xs">
                      {new Date(apt.scheduledTime).getHours().toString().padStart(2, '0')}:
                      {new Date(apt.scheduledTime).getMinutes().toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase">Slot</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {apt.patientName}
                      </h4>
                      <span className="text-xs font-mono text-sky-600 dark:text-sky-400 font-bold">
                        {apt.patientId}
                      </span>
                      {getTriageStatusTag(apt)}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Chief Complaint:{' '}
                      <span className="font-medium text-slate-900 dark:text-white">
                        {apt.reasonForVisit}
                      </span>
                    </p>

                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                      <span>Attending: <strong>{apt.doctorName}</strong></span>
                      <span>•</span>
                      <span>{apt.department} ({apt.roomNumber})</span>
                      <span>•</span>
                      <span>Consult Fee: ${apt.consultationFee}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <Link
                    href={`/consultation/${apt.id}`}
                    onClick={() => medicalAudio.playTactileClick()}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-xs"
                  >
                    <span>Open Clinical Room</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">
              No active patients match the selected anatomical quadrant ({activeZone}).
              <button
                onClick={() => setActiveZone('ALL')}
                className="block mx-auto mt-2 text-sky-600 text-xs font-bold underline"
              >
                Reset Anatomical Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
