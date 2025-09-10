"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function CompactLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "ko" ? "en" : "ko");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="hover:bg-gray-100 flex items-center space-x-1 text-sm"
      title={language === "ko" ? "Switch to English" : "한국어로 전환"}
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">
        {language === "ko" ? "EN" : "한국어"}
      </span>
      <span className="sm:hidden">{language === "ko" ? "🇺🇸" : "🇰🇷"}</span>
    </Button>
  );
}
