'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Locale, TRANSLATIONS } from '../i18n/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  toggleLocale: () => void;
  t: typeof TRANSLATIONS.ar;
  formatCurrency: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'ar',
  setLocale: () => {},
  toggleLocale: () => {},
  t: TRANSLATIONS.ar,
  formatCurrency: (a) => `${a} د.ت`,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar'); // Default to Arabic / Tunisian
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('medisync-locale') as Locale | null;
      if (saved === 'ar' || saved === 'en') {
        setLocaleState(saved);
        applyDirection(saved);
      } else {
        setLocaleState('ar');
        applyDirection('ar');
      }
    } catch {}
    setMounted(true);
  }, []);

  const applyDirection = (loc: Locale) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', loc);
      document.documentElement.setAttribute('dir', loc === 'ar' ? 'rtl' : 'ltr');
      if (loc === 'ar') {
        document.body.classList.add('rtl-layout');
      } else {
        document.body.classList.remove('rtl-layout');
      }
    }
  };

  const setLocale = (newLoc: Locale) => {
    setLocaleState(newLoc);
    applyDirection(newLoc);
    try {
      localStorage.setItem('medisync-locale', newLoc);
    } catch {}
  };

  const toggleLocale = () => {
    const next = locale === 'ar' ? 'en' : 'ar';
    setLocale(next);
  };

  const formatCurrency = (amount: number) => {
    if (locale === 'ar') {
      return `${amount.toFixed(2)} د.ت`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const t = TRANSLATIONS[locale] || TRANSLATIONS.ar;

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t,
        formatCurrency,
      }}
    >
      <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
