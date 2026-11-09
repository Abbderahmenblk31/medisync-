import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { ClinicShell } from '@/components/layout/ClinicShell';

export const metadata: Metadata = {
  title: 'MediSync | Clinical EMR & Practice Management SaaS',
  description: 'Enterprise Medical Records, Consultation Flow, and Healthcare Billing Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <ClinicShell>{children}</ClinicShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
