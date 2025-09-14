import { useState, useEffect } from 'react';
import { translations } from '@/config/translations';
import type { Language } from './useLanguage';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('civic-language');
    return (stored as Language) || 'en';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('civic-language');
      setLanguage((stored as Language) || 'en');
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events
    const handleLanguageChange = () => {
      const stored = localStorage.getItem('civic-language');
      setLanguage((stored as Language) || 'en');
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);
  
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };
  
  return { t, language };
};