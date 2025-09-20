"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Globe } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageSelectionModal({
  isOpen,
  onClose,
}: LanguageSelectionModalProps) {
  const { user } = useAuth();
  const { setLanguage } = useLanguage();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<"ko" | "en" | null>(null);

  const handleLanguageSelect = async (language: "ko" | "en") => {
    if (!user?.uid) return;

    setSelectedLanguage(language);

    try {
      // Save language preference to user document
      await setDoc(
        doc(db, "users", user.uid),
        {
          languagePreference: language,
          languageSetAt: serverTimestamp(),
          isKoreanResident: language === "ko",
        },
        { merge: true }
      );

      // Update the language context
      setLanguage(language);

      // Close modal and redirect to dashboard
      onClose();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving language preference:", error);
      setSelectedLanguage(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to Studio Soop Seoul
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Are you a Korean resident?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedLanguage === "ko"
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleLanguageSelect("ko")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🇰🇷</div>
                  <div>
                    <h3 className="text-lg font-semibold">Yes, I am Korean</h3>
                    <p className="text-sm text-gray-600">
                      Korean pricing and language
                    </p>
                  </div>
                </div>
                {selectedLanguage === "ko" && (
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedLanguage === "en"
                ? "ring-2 ring-blue-500 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleLanguageSelect("en")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🌍</div>
                  <div>
                    <h3 className="text-lg font-semibold">No, I am not Korean</h3>
                    <p className="text-sm text-gray-600">
                      International pricing and English
                    </p>
                  </div>
                </div>
                {selectedLanguage === "en" && (
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-500">
          <Globe className="inline h-4 w-4 mr-1" />
          This setting can only be changed by an administrator
        </div>
      </DialogContent>
    </Dialog>
  );
}
