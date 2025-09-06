"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface KYCTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  showViewAgain?: boolean;
}

export default function KYCTermsModal({
  isOpen,
  onClose,
  onConfirm,
  showViewAgain = false,
}: KYCTermsModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewedPages, setViewedPages] = useState<Set<number>>(new Set([1]));
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const totalPages = 8;

  useEffect(() => {
    if (isOpen) {
      setIsFirstTimeUser(!showViewAgain);
      setCurrentPage(1);
      setViewedPages(new Set([1]));
    }
  }, [isOpen, showViewAgain]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      const nextPageNum = currentPage + 1;
      setCurrentPage(nextPageNum);
      setViewedPages((prev) => new Set([...prev, nextPageNum]));
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const allPagesViewed = viewedPages.size === totalPages;

  const termsContent = [
    {
      title: "1. 시술 전 주의사항 및 준비사항",
      content: `【시술 전 24시간 주의사항】
• 알코올 섭취 절대 금지 (혈액순환 촉진으로 출혈 위험)
• 아스피린, 이부프로펜 등 혈액응고 방해 약물 복용 금지
• 비타민E, 은행잎 추출물 등 혈액순환 촉진 보조제 복용 금지
• 카페인 섭취 최소화 (과도한 섭취 시 떨림 현상 발생 가능)

【시술 당일 준비사항】
• 충분한 수면 취하기 (최소 6시간 이상)
• 가벼운 식사 후 방문 (공복 상태 피하기)
• 편안한 복장 착용 (목 부분이 넉넉한 옷)
• 시술 부위 화장 완전 제거
• 스트레스 해소 및 안정된 마음가짐

【사전 상담 필수 대상】
• 임신 중이거나 수유 중인 경우
• 임신 계획이 있는 경우
• 심장질환, 당뇨, 고혈압 등 만성질환자
• 혈액응고장애가 있는 경우
• 면역력이 저하된 상태
• 시술 부위에 염증이나 상처가 있는 경우
• 과거 반영구 시술에서 부작용이 있었던 경우
• 알레르기 체질이거나 특이 체질인 경우`,
    },
    {
      title: "2. 시술 과정 및 소요시간 상세 안내",
      content: `【1단계: 상담 및 디자인 결정 (30-40분)】
• 개인별 얼굴형, 눈 모양, 피부톤 분석
• 원하는 스타일과 자연스러운 디자인 상담
• 시술 후 예상 결과 설명 및 사진 자료 제공
• 개인별 맞춤 디자인 그리기 및 확인
• 시술 과정 및 주의사항 상세 설명

【2단계: 마취 및 디자인 그리기 (20-30분)】
• 시술 부위 소독 및 마취제 도포
• 마취 효과 확인 (통증 테스트)
• 최종 디자인 그리기 및 고객 재확인
• 시술 도구 준비 및 소독

【3단계: 반영구 시술 진행 (60-120분)】
• 1차 시술: 기본 라인 작업 (30-40분)
• 2차 시술: 색상 작업 및 채색 (30-40분)
• 3차 시술: 마무리 작업 및 디테일 보완 (20-30분)
• 중간 중간 고객 상태 확인 및 휴식 제공

【4단계: 마무리 및 관리법 안내 (10-15분)】
• 시술 부위 소독 및 연고 도포
• 상세한 시술 후 관리법 설명
• 약물 사용법 및 주의사항 안내
• 재방문 일정 및 후속 관리 계획 수립

【총 소요시간: 약 2-3시간 (개인차 있음)】`,
    },
    {
      title: "3. 시술 후 관리법 상세 가이드",
      content: `【시술 직후 즉시 관리 (0-3시간)】
• 시술 부위를 절대 만지거나 긁지 말 것
• 얼음팩으로 부종 완화 (5분씩 간헐적으로)
• 처방된 연고를 얇게 도포 (하루 3-4회)
• 과도한 움직임이나 말하기 자제

【시술 후 3일간 관리 (중요)】
• 물에 절대 닿지 않도록 주의 (세안, 샤워 금지)
• 땀 흘리는 활동 금지 (운동, 사우나, 찜질방)
• 뜨거운 음식이나 음료 섭취 금지
• 술, 담배, 카페인 섭취 금지
• 처방된 연고를 규칙적으로 발라주세요

【시술 후 1주일간 관리】
• 사우나, 찜질방, 수영장 이용 절대 금지
• 과도한 운동이나 땀 흘리는 활동 금지
• 자외선 차단제 사용 (시술 부위 제외)
• 각질 제거제 사용 금지

【시술 후 2주일간 관리】
• 각질 제거제 사용 금지
• 스크럽이나 각질 제거 제품 사용 금지
• 과도한 마사지나 스킨케어 금지
• 자연스러운 각질 탈락 과정 기다리기

【장기 관리 (1개월 후)】
• 자외선 차단 필수 (SPF 30 이상)
• 과도한 자외선 노출 피하기
• 건강한 생활습관 유지
• 6개월 후 재시술 권장`,
    },
    {
      title: "4. 예상 부작용 및 정상적인 회복 과정",
      content: `【시술 직후 정상적인 반응】
• 부종 (2-3일간 지속, 개인차 있음)
• 발적 및 따가움 (1-2일간 지속)
• 가벼운 통증 (마취 해제 후 2-3시간)
• 멍이나 혈종 (1-2주 내 자연 회복)
• 색소 침착 (일시적, 1-2주 내 개선)

【1주일 내 정상적인 변화】
• 각질 탈락 시작 (자연스러운 과정)
• 색상이 진해 보이는 현상 (정상)
• 가려움증 (가벼운 수준, 긁지 말 것)
• 색상 불균일 (일시적, 회복 과정)

【2-4주 정상적인 회복 과정】
• 각질 탈락 완료
• 색상 안정화
• 자연스러운 눈썹 모양 형성
• 최종 색상 확인 가능

【주의해야 할 이상 증상】
• 심한 부종이나 통증 (3일 이상 지속)
• 발열이나 오한
• 심한 가려움증이나 발진
• 색소 침착이 심하거나 지속되는 경우
• 시술 부위 감염 의심 증상

【이상 증상 발생 시】
• 즉시 연락: 010-1234-5678
• 응급실 방문 권장
• 사진 촬영 후 전송 (상담 목적)`,
    },
    {
      title: "5. 금기사항 및 시술 불가 대상",
      content: `【절대 금기사항】
• 임신 중이거나 수유 중인 경우
• 임신 계획이 있는 경우 (시술 후 6개월 내)
• 18세 미만 미성년자
• 심한 당뇨병 환자 (혈당 조절 불량)
• 고혈압 환자 (약물 복용 중)
• 혈액응고장애가 있는 경우
• 심장질환자 (협심증, 심근경색 등)
• 간질환자 (간경화, 간염 등)
• 신장질환자 (신부전 등)

【상대적 금기사항 (사전 상담 필수)】
• 면역력이 저하된 상태
• 항암치료나 방사선치료 중
• 스테로이드 장기 복용 중
• 시술 부위에 염증이나 상처가 있는 경우
• 과거 반영구 시술에서 부작용이 있었던 경우
• 알레르기 체질이거나 특이 체질인 경우
• 켈로이드 체질인 경우
• 자가면역질환 환자
• 정신과적 질환으로 약물 복용 중인 경우

【일시적 금기사항】
• 감기나 몸살 증상이 있는 경우
• 피부과적 질환이 있는 경우
• 최근 1개월 내 다른 시술을 받은 경우
• 과도한 스트레스나 피로 상태
• 수면 부족이나 컨디션 불량

【상담 및 검사 필요 대상】
• 만성질환자 (사전 의사 상담 필요)
• 복용 중인 약물이 있는 경우
• 과거 수술 이력이 있는 경우
• 알레르기 이력이 있는 경우`,
    },
    {
      title: "6. 보증 및 A/S 정책 상세 안내",
      content: `【무상 보정 서비스】
• 시술 후 1개월 내 무상 보정 가능
• 색상 불균일이나 라인 보정
• 개인차에 따른 자연스러운 색상 변화는 정상
• 관리법 미준수로 인한 문제는 보증 범위 제외

【재시술 정책】
• 6개월 후 재시술 권장 (색상 유지 목적)
• 재시술 시 30% 할인 적용
• 1년 이내 재시술 시 50% 할인 적용
• 개인차에 따른 색상 변화는 정상 범위

【보증 범위】
• 시술 기법상 문제로 인한 색상 불균일
• 시술 도구 문제로 인한 라인 불완전
• 시술사 실수로 인한 디자인 오류
• 시술 후 1개월 내 자연스러운 각질 탈락 과정

【보증 제외 사항】
• 고객의 관리법 미준수로 인한 문제
• 개인차에 따른 자연스러운 색상 변화
• 시술 후 1개월 경과 후 발생한 문제
• 알레르기나 특이 체질로 인한 부작용
• 외부 요인으로 인한 손상 (사고, 상처 등)

【A/S 절차】
• 1단계: 전화 상담 (010-1234-5678)
• 2단계: 사진 전송 및 상태 확인
• 3단계: 재방문 일정 조율
• 4단계: 보정 시술 진행
• 5단계: 사후 관리 안내`,
    },
    {
      title: "7. 예약 및 취소 정책 상세 안내",
      content: `【예약 정책】
• 예약은 전화 또는 온라인으로만 가능
• 예약 확정은 입금 완료 후 처리
• 예약 시간 10분 이상 지각 시 예약 취소
• 예약 변경은 24시간 전까지 가능
• 예약 확인은 시술 1일 전 안내드립니다

【취소 및 환불 정책】
• 시술 3일 전 취소: 100% 환불
• 시술 1일 전 취소: 80% 환불
• 시술 당일 취소: 50% 환불 (위약금)
• 무단 노쇼: 환불 불가, 재예약 제한

【위약금 정책】
• 당일 취소: 시술비의 50%
• 무단 노쇼: 시술비의 100%
• 예약 시간 30분 이상 지각: 시술비의 30%
• 연속 2회 무단 노쇼: 영구 예약 제한

【예약 변경 정책】
• 예약 변경은 24시간 전까지 가능
• 변경 횟수: 1회에 한함
• 변경 시 추가 요금 없음
• 긴급 상황 시 개별 상담

【특별 상황 대응】
• 천재지변, 감염병 확산 등 불가피한 상황
• 개인 건강상 긴급한 상황
• 가족 사고나 응급상황
→ 위의 경우 개별 상담 후 조정 가능

【예약 확인 절차】
• 시술 1일 전 자동 안내 문자 발송
• 전화 확인: 시술 2시간 전
• 예약 변경 요청 시 즉시 처리
• 예약 취소 시 대기자에게 연락`,
    },
    {
      title: "8. 개인정보 및 동의사항 상세 안내",
      content: `【개인정보 수집 및 이용 동의】
• 수집 목적: 시술 상담, 예약 관리, 서비스 제공
• 수집 항목: 이름, 연락처, 생년월일, 성별, 시술 이력
• 이용 기간: 시술 완료 후 3년간 보관
• 제3자 제공: 원칙적으로 제공하지 않음

【사진 촬영 및 보관 동의】
• 시술 전후 사진 촬영 및 보관에 동의
• 촬영 목적: 시술 결과 비교, 상담 자료, 품질 관리
• 보관 기간: 시술 완료 후 3년간 보관
• 이용 범위: 내부 관리 목적으로만 사용
• 제3자 제공: 동의 없이 제공하지 않음

【마케팅 정보 수신 동의】
• 이벤트, 할인 정보, 신규 서비스 안내
• 문자, 이메일, 카카오톡 등을 통한 정보 제공
• 수신 거부: 언제든지 가능
• 수신 거부 시: 서비스 이용에 제한 없음

【개인정보 보호 정책】
• 개인정보는 암호화하여 안전하게 보관
• 접근 권한은 필요한 직원에게만 제한
• 정기적인 보안 점검 및 업데이트
• 개인정보 유출 시 즉시 고객에게 통보

【개인정보 삭제 및 열람 요청】
• 개인정보 삭제 요청 시 즉시 처리
• 개인정보 열람 요청 시 7일 내 제공
• 개인정보 정정 요청 시 즉시 처리
• 요청 방법: 전화 또는 이메일로 신청

【동의 철회 및 권리 행사】
• 개인정보 수집 동의 철회 가능
• 사진 촬영 동의 철회 가능
• 마케팅 정보 수신 동의 철회 가능
• 동의 철회 시에도 서비스 이용 가능

【문의 및 신고】
• 개인정보 보호 책임자: 김○○ (010-1234-5678)
• 개인정보 침해 신고: 개인정보보호위원회
• 개인정보 분쟁 조정: 개인정보 분쟁조정위원회`,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            필독사항 확인
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
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* 페이지 인디케이터 */}
          <div className="bg-black/50 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm text-white">
            {currentPage} / {totalPages}
          </div>
        </div>

        {/* 진행 상황 표시 */}
        {isFirstTimeUser && (
          <div className="text-center">
            <p className="text-gray-600 mb-2 text-sm">
              필독사항 확인 진행률: {viewedPages.size} / {totalPages} 페이지
            </p>
            <div className="bg-gray-200 h-2 w-full rounded-full">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(viewedPages.size / totalPages) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="flex flex-col items-center pt-4">
          {isFirstTimeUser && !allPagesViewed && (
            <p className="text-gray-600 mb-4 text-center text-sm">
              모든 필독사항을 확인한 후 예약을 진행할 수 있습니다.
            </p>
          )}

          {showViewAgain ? (
            <Button
              onClick={onClose}
              className="bg-gray-800 hover:bg-gray-900 rounded-lg px-6 py-2 font-medium text-white"
            >
              닫기
            </Button>
          ) : (
            <Button
              onClick={onConfirm}
              disabled={isFirstTimeUser && !allPagesViewed}
              className={`rounded-lg px-6 py-2 font-medium text-white ${
                isFirstTimeUser && !allPagesViewed
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
              }`}
            >
              {isFirstTimeUser && !allPagesViewed
                ? `필독사항 확인 중... (${viewedPages.size}/${totalPages})`
                : "필독사항을 확인했습니다"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
