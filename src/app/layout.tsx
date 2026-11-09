import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import { ClinicShell } from '@/components/layout/ClinicShell';

export const metadata: Metadata = {
  title: 'MediSync | ميدي سينك لإدارة العيادات والملفات الطبية',
  description: 'نظام إدارة العيادات، الفحص السريري، بطاقة الكنام CNAM، والوصفات الطبية الإلكترونية',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <LanguageProvider>
          <ThemeProvider>
            <ClinicShell>{children}</ClinicShell>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
