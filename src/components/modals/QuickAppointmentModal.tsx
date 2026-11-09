'use client';

import React, { useState, useEffect } from 'react';
import { Patient } from '@/lib/types';
import { DOCTORS_ROSTER } from '@/lib/data/mock-clinical-data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function QuickAppointmentModal({ isOpen, onClose, onSuccess }: Props) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [doctorName, setDoctorName] = useState(DOCTORS_ROSTER[0].name);
  const [department, setDepartment] = useState(DOCTORS_ROSTER[0].department);
  const [date, setDate] = useState('2026-11-10');
  const [time, setTime] = useState('10:00');
  const [reason, setReason] = useState('Routine Checkup & Assessment');
  const [fee, setFee] = useState(80);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/patients')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setPatients(data.data);
          setSelectedPatientId(data.data[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDoctorChange = (docName: string) => {
    setDoctorName(docName);
    const doc = DOCTORS_ROSTER.find((d) => d.name === docName);
    if (doc) {
      setDepartment(doc.department);
      setFee(doc.fee);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    setLoading(true);
    try {
      const scheduledIso = `${date}T${time}:00.000Z`;
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          patientName: patient.fullName,
          patientPhone: patient.phone,
          doctorName,
          department,
          scheduledTime: scheduledIso,
          reasonForVisit: reason,
          consultationFee: fee,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        alert(data.error || 'Failed to book appointment');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Schedule Clinical Appointment</h3>
              <p className="text-xs text-slate-500">Book slot with attending medical specialist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Patient
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/20"
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.id}) - Blood: {p.bloodGroup}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Attending Specialist
              </label>
              <select
                value={doctorName}
                onChange={(e) => handleDoctorChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {DOCTORS_ROSTER.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.department})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                disabled
                className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Time Slot
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reason for Visit / Symptoms
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Chest discomfort, annual review, skin rash"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
