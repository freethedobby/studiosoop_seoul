"use client";

import { useAuth } from "@/contexts/AuthContext";
import LanguageSelectionModal from "./LanguageSelectionModal";

export default function LanguageSelectionWrapper() {
  const { showLanguageSelection, setShowLanguageSelection } = useAuth();

  return (
    <LanguageSelectionModal
      isOpen={showLanguageSelection}
      onClose={() => setShowLanguageSelection(false)}
    />
  );
}
