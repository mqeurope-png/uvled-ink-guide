import { createContext, useContext, useState, ReactNode, type Context } from 'react';
import { Language, translations } from '@/lib/translations';

export type { Language };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

/**
 * Keep a stable Context instance across Vite HMR.
 *
 * Without this, hot updates can (rarely) create multiple instances of this module
 * where the Provider and consumers reference different Context objects, causing
 * `useLanguage must be used within a LanguageProvider` even though it is.
 */
const LanguageContext: Context<LanguageContextType | undefined> = (() => {
  // `import.meta.hot.data` survives module replacement.
  if (import.meta.hot) {
    const data = import.meta.hot.data as {
      languageContext?: Context<LanguageContextType | undefined>;
    };

    if (!data.languageContext) {
      data.languageContext = createContext<LanguageContextType | undefined>(undefined);
    }

    return data.languageContext;
  }

  return createContext<LanguageContextType | undefined>(undefined);
})();

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    const langTranslations = translations[language];
    return langTranslations?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
