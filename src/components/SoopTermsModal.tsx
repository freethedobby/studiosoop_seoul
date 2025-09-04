"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

interface SoopTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SoopTermsModal({ isOpen, onClose }: SoopTermsModalProps) {
  const [currentImage, setCurrentImage] = useState(1);
  const totalImages = 8;

  const nextImage = () => {
    setCurrentImage((prev) => (prev < totalImages ? prev + 1 : 1));
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev > 1 ? prev - 1 : totalImages));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            필독사항
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {/* 이미지 컨테이너 */}
          <div className="relative w-full h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={`/soop${currentImage}.jpg`}
              alt={`필독사항 ${currentImage}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* 네비게이션 버튼 */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* 페이지 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImage} / {totalImages}
          </div>
        </div>

        {/* 닫기 버튼 */}
        <div className="flex justify-center pt-4">
          <Button onClick={onClose} className="w-32">
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
