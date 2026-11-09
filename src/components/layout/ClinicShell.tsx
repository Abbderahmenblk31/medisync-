'use client';

import React, { useState } from 'react';
import { ClinicSidebar } from './ClinicSidebar';
import { ClinicHeader } from './ClinicHeader';
import { QuickAppointmentModal } from '../modals/QuickAppointmentModal';
import { QuickPatientModal } from '../modals/QuickPatientModal';

export function ClinicShell({ children }: { children: React.ReactNode }) {
  const [showAptModal, setShowAptModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <ClinicSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <ClinicHeader
          onQuickBook={() => setShowAptModal(true)}
          onNewPatient={() => setShowPatientModal(true)}
        />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>

      {/* Global Quick Action Modals */}
      {showAptModal && (
        <QuickAppointmentModal
          isOpen={showAptModal}
          onClose={() => setShowAptModal(false)}
          onSuccess={() => {
            setShowAptModal(false);
            window.location.reload();
          }}
        />
      )}

      {showPatientModal && (
        <QuickPatientModal
          isOpen={showPatientModal}
          onClose={() => setShowPatientModal(false)}
          onSuccess={() => {
            setShowPatientModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
