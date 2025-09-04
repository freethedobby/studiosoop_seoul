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

interface SoopTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SoopTermsModal({
  isOpen,
  onClose,
}: SoopTermsModalProps) {
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
      title: "1. 시술 전 주의사항",
      content: `• 시술 전 24시간 동안 알코올 섭취 금지
• 시술 당일 카페인 섭취 제한
• 혈액순환을 방해하는 약물 복용 시 사전 상담 필요
• 임신, 수유 중이거나 계획 중인 경우 사전 상담 필수
• 심장질환, 당뇨, 고혈압 등 만성질환자 사전 상담 필수`
    },
    {
      title: "2. 시술 과정 안내",
      content: `• 1단계: 상담 및 디자인 결정 (30분)
• 2단계: 마취 및 디자인 그리기 (20분)
• 3단계: 반영구 시술 진행 (60-90분)
• 4단계: 마무리 및 관리법 안내 (10분)
• 총 소요시간: 약 2-3시간`
    },
    {
      title: "3. 시술 후 관리법",
      content: `• 시술 후 3일간 물에 닿지 않도록 주의
• 1주일간 사우나, 찜질방, 수영장 이용 금지
• 2주일간 각질 제거제 사용 금지
• 시술 부위를 손으로 만지거나 긁지 말 것
• 처방된 연고를 규칙적으로 발라주세요`
    },
    {
      title: "4. 예상 부작용",
      content: `• 시술 직후 부종, 발적, 통증 (정상적인 반응)
• 멍이나 혈종 발생 가능 (1-2주 내 회복)
• 색소 침착이나 색소 탈색 가능성
• 개인차에 따른 회복 속도 차이
• 이상 증상 발생 시 즉시 연락 바람`
    },
    {
      title: "5. 금기사항",
      content: `• 임신 중이거나 수유 중인 경우
• 심한 당뇨, 고혈압 환자
• 혈액응고장애가 있는 경우
• 면역력이 저하된 상태
• 시술 부위에 염증이나 상처가 있는 경우
• 과거 반영구 시술에서 부작용이 있었던 경우`
    },
    {
      title: "6. 보증 및 A/S",
      content: `• 시술 후 1개월 내 무상 보정 가능
• 개인차에 따른 색상 변화는 정상
• 자연스러운 각질 탈락 과정 안내
• 6개월 후 재시술 권장
• 관리법 미준수 시 보증 범위에서 제외`
    },
    {
      title: "7. 예약 및 취소 정책",
      content: `• 예약 변경은 24시간 전까지 가능
• 당일 취소 시 위약금 발생 (시술비의 50%)
• 무단 노쇼 시 재예약 제한
• 예약 시간 10분 이상 지각 시 예약 취소
• 예약 확인은 시술 1일 전 안내드립니다`
    },
    {
      title: "8. 개인정보 및 동의",
      content: `• 시술 전후 사진 촬영 및 보관에 동의
• 개인정보는 시술 목적으로만 사용
• 제3자에게 개인정보 제공하지 않음
• 시술 관련 정보는 3년간 보관
• 개인정보 삭제 요청 시 즉시 처리`
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            필독사항
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          {/* 텍스트 컨테이너 */}
          <div className="bg-gray-50 relative h-[60vh] w-full overflow-y-auto rounded-lg p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">
                {termsContent[currentPage - 1].title}
              </h3>
              <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
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
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
