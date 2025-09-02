"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage("ko")}
        className={`flex items-center space-x-1 rounded px-2 py-1 transition-colors ${
          language === "ko"
            ? "bg-white/20 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span className="text-lg">🇰🇷</span>
        <span className="text-xs font-medium">한국어</span>
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`flex items-center space-x-1 rounded px-2 py-1 transition-colors ${
          language === "en"
            ? "bg-white/20 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span className="text-lg">🇺🇸</span>
        <span className="text-xs font-medium">English</span>
      </button>
    </div>
  );
}
