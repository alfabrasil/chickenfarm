import React, { createContext, useContext, useState, useEffect } from 'react';
import pt from '../locales/pt.json';
import en from '../locales/en.json';
import es from '../locales/es.json';

const translations = { pt, en, es };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('app_language');
    if (saved && translations[saved]) return saved;
    
    // Auto-detect browser language
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'pt';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  /**
   * Traduz uma chave e substitui placeholders {0}, {1}, etc.
   * @param {string} key - A chave da tradução
   * @param {Array|string|number} params - Parâmetros para substituir placeholders
   */
  const t = (key, params = []) => {
    let text = translations[language]?.[key] || translations['pt']?.[key] || key;
    
    if (params && (Array.isArray(params) ? params.length > 0 : true)) {
      const paramArray = Array.isArray(params) ? params : [params];
      paramArray.forEach((param, index) => {
        text = text.split(`{${index}}`).join(param);
      });
    }
    
    return text;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage, languages }}>
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
