"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SoopTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SoopTermsModal({
  isOpen,
  onClose,
}: SoopTermsModalProps) {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  const termsContent = [
    {
      title: t("terms.page1.title"),
      content: t("terms.page1.content"),
    },
    {
      title: t("terms.page2.title"),
      content: t("terms.page2.content"),
    },
    {
      title: t("terms.page3.title"),
      content: t("terms.page3.content"),
    },
    {
      title: t("terms.page4.title"),
      content: t("terms.page4.content"),
    },
    {
      title: t("terms.page5.title"),
      content: t("terms.page5.content"),
    },
    {
      title: t("terms.page6.title"),
      content: t("terms.page6.content"),
    },
    {
      title: t("terms.page7.title"),
      content: t("terms.page7.content"),
    },
    {
      title: t("terms.page8.title"),
      content: t("terms.page8.content"),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {t("terms.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          {/* 텍스트 컨테이너 */}
          <div className="bg-gray-50 relative h-[60vh] w-full overflow-y-auto rounded-lg p-6">
            <div className="space-y-4">
              <h3 className="text-gray-800 text-lg font-bold">
                {termsContent[currentPage - 1].title}
              </h3>
              <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                {termsContent[currentPage - 1].content}
              </div>
            </div>
          </div>

          {/* 네비게이션 버튼 */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={prevPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={nextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* 페이지 인디케이터 */}
          <div className="bg-black/50 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm text-white">
            {currentPage} / {totalPages}
          </div>
        </div>

        {/* 닫기 버튼 */}
        <div className="flex justify-center pt-4">
          <Button onClick={onClose} className="w-32">
            {t("terms.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}