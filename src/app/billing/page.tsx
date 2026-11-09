'use client';

import React, { useState, useEffect } from 'react';
import { MedicalInvoice } from '@/lib/types';

export default function BillingPage() {
  const [invoices, setInvoices] = useState<MedicalInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'INSURANCE_CLAIM'>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<MedicalInvoice | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInvoices = () => {
    setLoading(true);
    fetch('/api/invoices')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInvoices(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePay = async (invoiceId: string) => {
    setProcessingId(invoiceId);
    try {
      const res = await fetch('/api/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: invoiceId }),
      });
      const data = await res.json();
      if (data.success) {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === invoiceId ? { ...inv, paymentStatus: 'PAID' } : inv))
        );
        if (selectedInvoice?.id === invoiceId) {
          setSelectedInvoice((prev) => (prev ? { ...prev, paymentStatus: 'PAID' } : null));
        }
      }
    } catch (err) {
      console.error('Failed to process payment', err);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredInvoices = invoices.filter((i) => {
    if (filter === 'ALL') return true;
    return i.paymentStatus === filter;
  });

  const totalBilled = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = invoices
    .filter((i) => i.paymentStatus === 'PAID')
    .reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPending = invoices
    .filter((i) => i.paymentStatus === 'PENDING')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            Revenue Cycle Management
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Medical Invoicing & Insurance Claims
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automated billing for clinical consultations, lab work, pharmacy dispensations, and copays
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="no-print px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <span>📄</span>
          <span>Print Financial Summary</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 clinical-card">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Total Billed Today
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ${totalBilled.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Across all clinical encounters</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 clinical-card">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            Total Revenue Collected
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ${totalPaid.toFixed(2)}
          </div>
          <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">
            Fully settled direct & copays
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/60 clinical-card">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            Outstanding / Pending
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            ${totalPending.toFixed(2)}
          </div>
          <div className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
            Awaiting checkout or claim remittance
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {(['ALL', 'PENDING', 'PAID', 'INSURANCE_CLAIM'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === tab
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab === 'ALL'
              ? 'All Invoices'
              : tab === 'PENDING'
              ? 'Pending Payment'
              : tab === 'PAID'
              ? 'Settled / Paid'
              : 'Insurance Claims'}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden clinical-card">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading billing records...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No invoices found matching "{filter}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Invoice ID & Date</th>
                  <th className="py-3.5 px-4 font-semibold">Patient & Encounter</th>
                  <th className="py-3.5 px-4 font-semibold">Itemized Summary</th>
                  <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Method</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">{inv.id}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(inv.issuedAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {inv.patientName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Patient: {inv.patientId} • Apt: {inv.appointmentId}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {inv.items.map((item, idx) => (
                        <div key={idx} className="truncate max-w-xs">
                          • {item.description} ({item.quantity}x ${item.unitPrice})
                        </div>
                      ))}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white text-sm">
                      ${inv.totalAmount.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {inv.paymentMethod}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          inv.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : inv.paymentStatus === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                        }`}
                      >
                        {inv.paymentStatus === 'PAID'
                          ? '✓ Settled'
                          : inv.paymentStatus === 'PENDING'
                          ? '⏳ Pending'
                          : '📋 Claim Remit'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      {inv.paymentStatus === 'PENDING' && (
                        <button
                          onClick={() => handlePay(inv.id)}
                          disabled={processingId === inv.id}
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-2xs"
                        >
                          {processingId === inv.id ? 'Processing...' : 'Collect Cash/Card'}
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
                      >
                        Receipt Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Official Medical Invoice
                </h3>
                <p className="text-xs text-slate-400 font-mono">{selectedInvoice.id}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedInvoice.patientName} ({selectedInvoice.patientId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span>{new Date(selectedInvoice.issuedAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600">
                  {selectedInvoice.paymentStatus}
                </span>
              </div>
            </div>

            <div className="border-t border-b border-slate-100 dark:border-slate-800 py-3 space-y-2 text-xs">
              {selectedInvoice.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {item.description} (x{item.quantity})
                  </span>
                  <span className="font-mono">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Subtotal:</span>
                <span>${selectedInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax & Service:</span>
                <span>${selectedInvoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-1">
                <span>Total Due:</span>
                <span>${selectedInvoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
              >
                🖨️ Print Slip
              </button>
              {selectedInvoice.paymentStatus === 'PENDING' && (
                <button
                  onClick={() => handlePay(selectedInvoice.id)}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                >
                  Mark Paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
