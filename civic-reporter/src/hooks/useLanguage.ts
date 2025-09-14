import { useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('civic-language');
    return (stored as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('civic-language', language);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('languageChange'));
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  return { language, toggleLanguage };
};