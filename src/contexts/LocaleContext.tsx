'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AppLocale = 'en' | 'fr';

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (l: AppLocale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<AppLocale>('en');

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? (localStorage.getItem('app_locale') as AppLocale | null) : null;
      if (saved === 'en' || saved === 'fr') setLocaleState(saved);
    } catch {}
  }, []);

  const setLocale = (l: AppLocale) => {
    setLocaleState(l);
    try { localStorage.setItem('app_locale', l); } catch {}
  };

  const toggleLocale = () => setLocale(locale === 'en' ? 'fr' : 'en');

  const value = useMemo(() => ({ locale, setLocale, toggleLocale }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useAppLocale = (): LocaleContextValue => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useAppLocale must be used within LocaleProvider');
  return ctx;
};


