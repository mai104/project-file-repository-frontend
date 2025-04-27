import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    const font = language === 'ar' ? 'arabic' : 'english';
    
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(dir);
    document.body.classList.remove('font-arabic', 'font-english');
    document.body.classList.add(`font-${font}`);
    
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [language, i18n]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
