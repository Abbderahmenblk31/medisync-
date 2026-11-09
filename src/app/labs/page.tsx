'use client';

import React, { useState, useEffect } from 'react';
import { LabOrder, LabOrderStatus, LabOrderUrgency, Patient } from '@/lib/types';
import { medicalAudio } from '@/lib/sound/medical-audio';

export default function LabsPage() {
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  // New Lab Order Form
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [testName, setTestName] = useState('Complete Blood Count (CBC) with Differential');
  const [category, setCategory] = useState<LabOrder['category']>('HEMATOLOGY');
  const [urgency, setUrgency] = useState<LabOrderUrgency>('ROUTINE');
  const [referenceRange, setReferenceRange] = useState('WBC: 4.5-11.0 x10^3/uL, RBC: 4.3-5.9 x10^6/uL');
  const [submitting, setSubmitting] = useState(false);

  // Result entry modal
  const [resultModalOrder, setResultModalOrder] = useState<LabOrder | null>(null);
  const [inputResult, setInputResult] = useState('');
  const [inputAbnormal, setInputAbnormal] = useState(false);

  const fetchLabs = () => {
    setLoading(true);
    fetch('/api/labs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLabOrders(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLabs();
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

  const handleStatusAdvance = async (orderId: string, currentStatus: LabOrderStatus) => {
    medicalAudio.playTactileClick();
    const nextStatusMap: Record<LabOrderStatus, LabOrderStatus> = {
      ORDERED: 'SAMPLE_COLLECTED',
      SAMPLE_COLLECTED: 'IN_ANALYSIS',
      IN_ANALYSIS: 'COMPLETED',
      COMPLETED: 'COMPLETED',
    };
    const nextStatus = nextStatusMap[currentStatus];

    try {
      const res = await fetch(`/api/labs/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLabOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultModalOrder) return;
    medicalAudio.playSuccessChime();

    try {
      const res = await fetch(`/api/labs/${resultModalOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          results: inputResult,
          abnormalFlag: inputAbnormal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLabOrders((prev) =>
          prev.map((o) =>
            o.id === resultModalOrder.id
              ? { ...o, status: 'COMPLETED', results: inputResult, abnormalFlag: inputAbnormal }
              : o
          )
        );
        setResultModalOrder(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === selectedPatientId);
    if (!patient) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          patientName: patient.fullName,
          testName,
          category,
          urgency,
          orderedByDoctor: 'Dr. Sarah Chen, MD',
          referenceRange,
        }),
      });
      const data = await res.json();
      if (data.success) {
        medicalAudio.playSuccessChime();
        setShowOrderModal(false);
        fetchLabs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOrders = labOrders.filter((o) => {
    if (selectedCategory !== 'ALL' && o.category !== selectedCategory) return false;
    if (selectedUrgency !== 'ALL' && o.urgency !== selectedUrgency) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span>Epic Orders Benchmark</span>
            <span>•</span>
            <span>Diagnostic Requisition Network</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Clinical Lab & Diagnostic Orders
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Pathology tests, biochemistry panels, radiology requisitions, and specimen tracking
          </p>
        </div>

        <button
          onClick={() => {
            medicalAudio.playTactileClick();
            setShowOrderModal(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>🧪</span>
          <span>Order Diagnostic Test</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'HEMATOLOGY', 'BIOCHEMISTRY', 'CARDIOLOGY', 'RADIOLOGY', 'IMMUNOLOGY'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => {
                  medicalAudio.playTactileClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-300 dark:border-sky-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Urgency:</span>
          {(['ALL', 'STAT', 'URGENT', 'ROUTINE'] as const).map((urg) => (
            <button
              key={urg}
              onClick={() => {
                medicalAudio.playTactileClick();
                setSelectedUrgency(urg);
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                selectedUrgency === urg
                  ? urg === 'STAT'
                    ? 'bg-rose-600 text-white'
                    : urg === 'URGENT'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {urg}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid / Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            Accessing pathology laboratory database...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            No lab orders match selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Patient Dossier</th>
                  <th className="py-3.5 px-4">Test & Category</th>
                  <th className="py-3.5 px-4">Urgency</th>
                  <th className="py-3.5 px-4">Specimen Status</th>
                  <th className="py-3.5 px-4">Results & Flags</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">{order.id}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(order.orderedAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {order.patientName}
                      </div>
                      <div className="text-[11px] text-sky-600 font-mono">{order.patientId}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {order.testName}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        {order.category}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          order.urgency === 'STAT'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : order.urgency === 'URGENT'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {order.urgency}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          order.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : order.status === 'IN_ANALYSIS'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            order.status === 'COMPLETED'
                              ? 'bg-emerald-500'
                              : order.status === 'IN_ANALYSIS'
                              ? 'bg-sky-500 animate-pulse'
                              : 'bg-amber-500'
                          }`}
                        ></span>
                        {order.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      {order.results ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {order.results}
                            </span>
                            {order.abnormalFlag && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500 text-white">
                                HIGH
                              </span>
                            )}
                          </div>
                          {order.referenceRange && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              Ref: {order.referenceRange}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Analysis in progress</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      {order.status !== 'COMPLETED' ? (
                        <>
                          <button
                            onClick={() => handleStatusAdvance(order.id, order.status)}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 transition-colors"
                          >
                            Advance ➔
                          </button>
                          <button
                            onClick={() => {
                              medicalAudio.playTactileClick();
                              setResultModalOrder(order);
                              setInputResult(order.results || '');
                              setInputAbnormal(order.abnormalFlag || false);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
                          >
                            Log Result
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            medicalAudio.playTactileClick();
                            window.print();
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"
                        >
                          Print Report
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Result Entry Modal */}
      {resultModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Log Laboratory Finding
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {resultModalOrder.id} • {resultModalOrder.testName}
                </p>
              </div>
              <button
                onClick={() => setResultModalOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResult} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantitative Finding / Outcome Value *
                </label>
                <input
                  type="text"
                  value={inputResult}
                  onChange={(e) => setInputResult(e.target.value)}
                  placeholder="e.g. 142 mg/dL or Normal sinus rhythm or No consolidation"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <input
                  type="checkbox"
                  id="abnormalCheckbox"
                  checked={inputAbnormal}
                  onChange={(e) => setInputAbnormal(e.target.checked)}
                  className="rounded text-rose-600"
                />
                <label
                  htmlFor="abnormalCheckbox"
                  className="text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  Flag as Clinically Abnormal / Out of Reference Range
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResultModalOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg"
                >
                  Authorize & Finalize Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Diagnostic Order Requisition Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 font-bold">
                  🧪
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Diagnostic Test Requisition
                  </h3>
                  <p className="text-xs text-slate-500">Order laboratory or radiological workup</p>
                </div>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Test / Panel Description *
                </label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Laboratory Discipline
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="HEMATOLOGY">Hematology</option>
                    <option value="BIOCHEMISTRY">Biochemistry</option>
                    <option value="CARDIOLOGY">Cardiology Diagnostics</option>
                    <option value="RADIOLOGY">Radiology / Imaging</option>
                    <option value="IMMUNOLOGY">Immunology & Serology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Clinical Priority
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="ROUTINE">Routine (24-48h)</option>
                    <option value="URGENT">Urgent (4-6h)</option>
                    <option value="STAT">STAT Emergency (&lt;1h)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Reference Range Baseline
                </label>
                <input
                  type="text"
                  value={referenceRange}
                  onChange={(e) => setReferenceRange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg shadow-sm"
                >
                  {submitting ? 'Transmitting Order...' : 'Dispatch Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
