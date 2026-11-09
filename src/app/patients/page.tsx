'use client';

import React, { useState, useEffect } from 'react';
import { Patient, MedicalRecord } from '@/lib/types';
import { QuickPatientModal } from '@/components/modals/QuickPatientModal';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<(Patient & { medicalHistory?: MedicalRecord[] }) | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [dossierLoading, setDossierLoading] = useState(false);

  const fetchPatients = () => {
    setLoading(true);
    const url = searchQuery ? `/api/patients?q=${encodeURIComponent(searchQuery)}` : '/api/patients';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPatients(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPatients();
  }, [searchQuery]);

  const openDossier = async (patientId: string) => {
    setDossierLoading(true);
    try {
      const res = await fetch(`/api/patients/${patientId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedPatient(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDossierLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            Electronic Medical Records
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Patient Registry & Clinical Dossiers
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Searchable central database of registered patients, critical allergies, and past consultation histories
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 clinical-card flex items-center gap-3">
        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by patient name, phone number, MRN (e.g. PT-1042), or email..."
          className="w-full text-xs md:text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Patients Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Searching patient registry...</div>
      ) : patients.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          No patients found matching "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {patients.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 clinical-card hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {p.fullName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono font-medium text-sky-600 dark:text-sky-400">
                        {p.id}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {p.gender.toLowerCase()}, DOB {p.dateOfBirth}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                    🩸 {p.bloodGroup}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">📞</span>
                    <span>{p.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">✉️</span>
                    <span className="truncate">{p.email}</span>
                  </div>
                </div>

                {/* Allergies Badge Warning */}
                {p.allergies && p.allergies.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">
                      ⚠️ Known Drug Allergies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.allergies.map((allergy, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chronic Conditions */}
                {p.chronicConditions && p.chronicConditions.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      Chronic Conditions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.chronicConditions.map((cond, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Em: {p.emergencyContact.name} ({p.emergencyContact.relation})
                </span>
                <button
                  onClick={() => openDossier(p.id)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors"
                >
                  View Dossier →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Patient Dossier Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <div>
                <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                  {selectedPatient.id}
                </span>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  {selectedPatient.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  Registered: {new Date(selectedPatient.registeredAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-6 text-xs md:text-sm">
              {/* Demographics Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Blood Group</div>
                  <div className="font-bold text-slate-900 dark:text-white text-base">
                    {selectedPatient.bloodGroup}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">DOB & Age</div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {selectedPatient.dateOfBirth}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Biological Sex</div>
                  <div className="font-semibold text-slate-900 dark:text-white capitalize">
                    {selectedPatient.gender.toLowerCase()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Phone</div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {selectedPatient.phone}
                  </div>
                </div>
              </div>

              {/* Consultation Medical History */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>📜 Historical Consultations & Diagnostic Encounters</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal">
                    {selectedPatient.medicalHistory?.length || 0} records
                  </span>
                </h4>

                {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPatient.medicalHistory.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-600 dark:text-sky-400">
                            {rec.id} • {new Date(rec.consultationDate).toLocaleDateString()}
                          </span>
                          <span className="text-slate-500 font-medium">Dr. {rec.doctorName}</span>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Chief Complaint:
                          </span>{' '}
                          <span className="text-slate-600 dark:text-slate-400">{rec.chiefComplaint}</span>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Diagnosis:
                          </span>{' '}
                          <span className="text-slate-900 dark:text-white font-medium">
                            {rec.clinicalDiagnosis} ({rec.icd10Code})
                          </span>
                        </div>

                        {rec.vitals && (
                          <div className="flex flex-wrap gap-2 text-xs pt-1 text-slate-600 dark:text-slate-300">
                            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                              BP: {rec.vitals.bloodPressure}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                              HR: {rec.vitals.heartRate} bpm
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                              Temp: {rec.vitals.temperature}°C
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                              SpO2: {rec.vitals.spo2}%
                            </span>
                          </div>
                        )}

                        {rec.prescriptions && rec.prescriptions.length > 0 && (
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 mt-2">
                            <div className="text-[11px] font-bold text-slate-500 uppercase mb-1">
                              Prescribed Medications:
                            </div>
                            <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                              {rec.prescriptions.map((rx) => (
                                <li key={rx.id}>
                                  <strong>{rx.medicationName}</strong> ({rx.dosage}) - {rx.frequency} for {rx.durationDays} days. Note: {rx.instructions}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No previous consultation records found for this patient.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <QuickPatientModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            setShowRegisterModal(false);
            fetchPatients();
          }}
        />
      )}
    </div>
  );
}
