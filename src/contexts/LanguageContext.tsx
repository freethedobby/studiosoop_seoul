"use client";

import React, { createContext, useContext, useState } from "react";

type Language = "en" | "ko";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations = {
  en: {
    "studio.title": "STUDIOSOOP",
    "studio.subtitle": "SEOUL",
    "studio.description":
      "Premium beauty service\nfor your own special style\nwe create for you",
    "studio.button": "Book Now",
    "footer.designed": "designed by",
  },
  ko: {
    "studio.title": "STUDIOSOOP",
    "studio.subtitle": "SEOUL",
    "studio.description":
      "프리미엄 뷰티 서비스로\n당신만의 특별한 스타일을\n만들어드립니다",
    "studio.button": "예약하기",
    "footer.designed": "designed by",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ko");

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
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
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
