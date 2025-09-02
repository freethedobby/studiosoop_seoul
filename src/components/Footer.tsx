"use client";

import Logo from "./Logo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-gray-100 border-t py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-center md:text-left">
            <Logo variant="footer" className="text-black" />
            <p className="text-gray-400 mt-2 text-xs">
              {t("footer.designed")}{" "}
              <a
                href="https://blacksheepwall.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600 underline transition-colors"
              >
                blacksheepwall
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
