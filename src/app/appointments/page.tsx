'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Appointment, AppointmentStatus } from '@/lib/types';
import { QuickAppointmentModal } from '@/components/modals/QuickAppointmentModal';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [department, setDepartment] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [doctorName, setDoctorName] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAppointments = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (department !== 'ALL') params.set('department', department);
    if (status !== 'ALL') params.set('status', status);
    if (doctorName !== 'ALL') params.set('doctorName', doctorName);

    fetch(`/api/appointments?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAppointments(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [department, status, doctorName]);

  const handleStatusChange = async (aptId: string, newStatus: AppointmentStatus) => {
    setUpdatingId(aptId);
    try {
      const res = await fetch(`/api/appointments/${aptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
            Clinical Workflow
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Appointment Scheduling & Triage
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage practice intake, patient check-ins, and direct consultation routing
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Schedule New Appointment</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 clinical-card flex flex-wrap items-center gap-4">
        {/* Department Filter */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Departments (Specialties)</option>
            <option value="Cardiology">Cardiology</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Appointment Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Waiting Room / Confirmed</option>
            <option value="IN_CONSULTATION">In Consultation</option>
            <option value="COMPLETED">Completed</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Reset button */}
        {(department !== 'ALL' || status !== 'ALL' || doctorName !== 'ALL') && (
          <button
            onClick={() => {
              setDepartment('ALL');
              setStatus('ALL');
              setDoctorName('ALL');
            }}
            className="self-end px-3 py-1.5 text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Appointments Table / Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden clinical-card">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading practice schedule...</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No appointments match current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Appointment ID & Time</th>
                  <th className="py-3.5 px-4 font-semibold">Patient Information</th>
                  <th className="py-3.5 px-4 font-semibold">Department & Doctor</th>
                  <th className="py-3.5 px-4 font-semibold">Reason for Visit</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {appointments.map((apt) => {
                  const aptDate = new Date(apt.scheduledTime);
                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white font-mono">
                          {apt.id}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {aptDate.toLocaleDateString()} at{' '}
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {apt.patientName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          ID: {apt.patientId} • {apt.patientPhone}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {apt.doctorName}
                        </div>
                        <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                          {apt.department} • {apt.roomNumber}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                        {apt.reasonForVisit}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={apt.status}
                          disabled={updatingId === apt.id}
                          onChange={(e) => handleStatusChange(apt.id, e.target.value as any)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                            apt.status === 'IN_CONSULTATION'
                              ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300'
                              : apt.status === 'COMPLETED'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300'
                              : apt.status === 'CONFIRMED'
                              ? 'bg-sky-50 border-sky-300 text-sky-800 dark:bg-sky-950/60 dark:border-sky-800 dark:text-sky-300'
                              : 'bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="CONFIRMED">Waiting Room</option>
                          <option value="IN_CONSULTATION">In Consultation</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/consultation/${apt.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all shadow-2xs"
                        >
                          <span>Consult</span>
                          <span>→</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <QuickAppointmentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
}
