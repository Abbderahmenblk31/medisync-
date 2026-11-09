'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClinicMetrics, Appointment } from '@/lib/types';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<ClinicMetrics | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'IN_CONSULTATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            In Consultation
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
            Waiting Room
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            ✓ Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
            <span>Metropolitan Clinical Operating System</span>
            <span>•</span>
            <span>Real-Time Practice Flow</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Clinical Command Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Active patient triage, attending physician roster, and daily practice telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/appointments"
            className="px-4 py-2 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 shadow-xs"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Full Schedule</span>
          </Link>
          <Link
            href="/consultation/APT-4091"
            className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Launch Active Charting</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Patients */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 clinical-card transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Patients Registered</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              👥
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {loading ? '...' : metrics?.totalPatientsRegistered ?? 0}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <span>↑ +12%</span>
            <span className="text-slate-400 dark:text-slate-500">vs last month</span>
          </div>
        </div>

        {/* Appointments Today */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 clinical-card transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Roster</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              📅
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {loading ? '...' : metrics?.appointmentsToday ?? 0}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Confirmed consultations
          </div>
        </div>

        {/* Waiting Room */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40 clinical-card transition-all">
          <div className="flex items-center justify-between text-amber-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Waiting Room</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              ⏳
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {loading ? '...' : metrics?.inWaitingRoom ?? 0}
          </div>
          <div className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1 font-medium">
            Avg wait: 8 mins
          </div>
        </div>

        {/* Completed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 clinical-card transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              ✓
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {loading ? '...' : metrics?.completedConsultations ?? 0}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Discharged with Rx
          </div>
        </div>

        {/* Revenue Collected */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 clinical-card transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Practice Billing</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              💳
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ${loading ? '...' : metrics?.todayRevenue?.toFixed(2) ?? '0.00'}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Direct & Copay paid
          </div>
        </div>
      </div>

      {/* Main Grid: Queue & Quick Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Live Patient Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Appointment & Consultation Queue
              </h2>
              <span className="px-2 py-0.5 text-xs font-bold bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 rounded-full">
                {metrics?.recentAppointments?.length ?? 0} active
              </span>
            </div>
            <Link
              href="/appointments"
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden clinical-card">
            {metrics?.recentAppointments && metrics.recentAppointments.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {metrics.recentAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                        <span>{new Date(apt.scheduledTime).getHours().toString().padStart(2, '0')}</span>
                        <span className="text-[9px] text-slate-400 font-normal">
                          :{new Date(apt.scheduledTime).getMinutes().toString().padStart(2, '0')}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                            {apt.patientName}
                          </h4>
                          <span className="text-xs text-slate-400">({apt.patientId})</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {apt.reasonForVisit} • <span className="font-medium text-slate-700 dark:text-slate-300">{apt.department}</span> ({apt.roomNumber})
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                          Attending: {apt.doctorName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {getStatusBadge(apt.status)}

                      <Link
                        href={`/consultation/${apt.id}`}
                        className="px-3 py-1.5 text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <span>Open Chart</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-sm">
                No active appointments in queue. Use "Book Appointment" to add.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Clinical Specialty Status & Quick Tools */}
        <div className="space-y-6">
          {/* Department Utilization */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 clinical-card space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
              <span>Department Occupancy</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Nominal</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                  <span>Cardiology (Room 301)</span>
                  <span className="font-semibold">75%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                  <span>General Medicine (Room 102)</span>
                  <span className="font-semibold">40%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                  <span>Pediatrics (Room 205)</span>
                  <span className="font-semibold">20%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 mb-1">
                  <span>Dermatology (Room 401)</span>
                  <span className="font-semibold">50%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Doctor Protocol Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                🩺
              </div>
              <div>
                <h4 className="font-bold text-sm">Doctor Consultation Protocol</h4>
                <p className="text-xs text-slate-300">HIPAA & Clinical Safety Guidelines</p>
              </div>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-400 font-bold">✓</span>
                <span>Confirm patient identity and known drug allergies prior to medication prescription.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 font-bold">✓</span>
                <span>Record baseline vitals: BP, Heart Rate, and SpO2.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400 font-bold">✓</span>
                <span>Assign primary ICD-10 diagnosis code for reimbursement compliance.</span>
              </li>
            </ul>

            <Link
              href="/patients"
              className="block text-center py-2 px-3 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              Browse Patient Directory →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
