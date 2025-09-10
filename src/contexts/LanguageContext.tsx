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
    // Home page
    "studio.title": "STUDIOSOOP",
    "studio.subtitle": "SEOUL",
    "studio.description":
      "Premium beauty service\nfor your own special style\nwe create for you",
    "studio.button": "Book Now",
    "footer.designed": "designed by",
    
    // Navigation
    "nav.myInfo": "My Info",
    "nav.reserve": "Reserve",
    "nav.cost": "Cost Info",
    "nav.logout": "Logout",
    "nav.login": "Login",
    "nav.userPage": "User Page",
    "nav.back": "Back",
    "nav.menu": "Menu",
    
    // Admin
    "admin.management": "Admin Management",
    "admin.kyc": "Customer Management",
    "admin.slots": "Reservation Management",
    "admin.admins": "Admin Management",
    "admin.addNew": "Add New Admin",
    "admin.emailPlaceholder": "Admin Email Address",
    "admin.add": "Add",
    "admin.list": "Admin List",
    "admin.totalAdmins": "Total {count} administrators",
    "admin.systemNote": "* System administrators cannot be removed",
    "admin.active": "Active",
    "admin.inactive": "Inactive",
    "admin.systemAdmin": "System Admin",
    "admin.currentUser": "Current User",
    "admin.registrationDate": "Registration Date:",
    "admin.noDate": "No date info",
    "admin.removeConfirm": "Are you sure you want to remove {email} from administrators?",
    "admin.addSuccess": "Admin successfully added",
    "admin.removeSuccess": "Admin successfully removed",
    "admin.addError": "Failed to add admin",
    "admin.removeError": "Failed to remove admin",
    "admin.configStatus": "Admin Configuration Status",
    "admin.configDescription": "Check Firebase Admin SDK configuration status",
    "admin.refresh": "Refresh",
    "admin.projectId": "Project ID",
    "admin.clientEmail": "Client Email",
    "admin.privateKey": "Private Key",
    "admin.connectionSuccess": "Firebase Connection Success",
    "admin.connectionFailed": "Firebase Connection Failed",
    "admin.connectionError": "Connection Error:",
    "admin.setupRequired": "Setup Required:",
    "admin.setupSteps": "1. Download service account key from Firebase Console\n2. Set environment variables:\nFIREBASE_PROJECT_ID=your-project-id\nFIREBASE_CLIENT_EMAIL=your-service-account-email\nFIREBASE_PRIVATE_KEY=\"-----BEGIN PRIVATE KEY-----\\nYour Private Key\\n-----END PRIVATE KEY-----\"\n3. Add environment variables to Vercel and redeploy",
    
    // KYC
    "kyc.title": "KYC Management",
    "kyc.pending": "Pending",
    "kyc.approved": "Approved",
    "kyc.rejected": "Rejected",
    "kyc.approve": "Approve",
    "kyc.reject": "Reject",
    "kyc.noData": "No KYC data available",
    "kyc.loading": "Loading...",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.close": "Close",
  },
  ko: {
    // Home page
    "studio.title": "STUDIOSOOP",
    "studio.subtitle": "SEOUL",
    "studio.description":
      "프리미엄 뷰티 서비스로\n당신만의 특별한 스타일을\n만들어드립니다",
    "studio.button": "예약하기",
    "footer.designed": "designed by",
    
    // Navigation
    "nav.myInfo": "내정보",
    "nav.reserve": "예약하기",
    "nav.cost": "비용안내",
    "nav.logout": "로그아웃",
    "nav.login": "로그인",
    "nav.userPage": "사용자 페이지",
    "nav.back": "뒤로",
    "nav.menu": "메뉴",
    
    // Admin
    "admin.management": "관리자 관리",
    "admin.kyc": "고객관리",
    "admin.slots": "예약관리",
    "admin.admins": "관리자 관리",
    "admin.addNew": "새 관리자 추가",
    "admin.emailPlaceholder": "관리자 이메일 주소",
    "admin.add": "추가",
    "admin.list": "관리자 목록",
    "admin.totalAdmins": "총 {count}명의 관리자가 있습니다",
    "admin.systemNote": "* 시스템 관리자는 제거할 수 없습니다",
    "admin.active": "활성",
    "admin.inactive": "비활성",
    "admin.systemAdmin": "시스템 관리자",
    "admin.currentUser": "현재 사용자",
    "admin.registrationDate": "등록일:",
    "admin.noDate": "날짜 정보 없음",
    "admin.removeConfirm": "정말로 {email}을(를) 관리자에서 제거하시겠습니까?",
    "admin.addSuccess": "관리자가 성공적으로 추가되었습니다",
    "admin.removeSuccess": "관리자가 성공적으로 제거되었습니다",
    "admin.addError": "관리자 추가에 실패했습니다",
    "admin.removeError": "관리자 제거에 실패했습니다",
    "admin.configStatus": "관리자 설정 상태",
    "admin.configDescription": "Firebase Admin SDK 설정 상태를 확인합니다",
    "admin.refresh": "새로고침",
    "admin.projectId": "Project ID",
    "admin.clientEmail": "Client Email",
    "admin.privateKey": "Private Key",
    "admin.connectionSuccess": "Firebase 연결 성공",
    "admin.connectionFailed": "Firebase 연결 실패",
    "admin.connectionError": "연결 오류:",
    "admin.setupRequired": "설정이 필요합니다:",
    "admin.setupSteps": "1. Firebase Console에서 서비스 계정 키를 다운로드하세요\n2. 환경 변수를 설정하세요:\nFIREBASE_PROJECT_ID=your-project-id\nFIREBASE_CLIENT_EMAIL=your-service-account-email\nFIREBASE_PRIVATE_KEY=\"-----BEGIN PRIVATE KEY-----\\nYour Private Key\\n-----END PRIVATE KEY-----\"\n3. Vercel에 환경 변수를 추가하고 재배포하세요",
    
    // KYC
    "kyc.title": "KYC 관리",
    "kyc.pending": "대기중",
    "kyc.approved": "승인됨",
    "kyc.rejected": "거부됨",
    "kyc.approve": "승인",
    "kyc.reject": "거부",
    "kyc.noData": "KYC 데이터가 없습니다",
    "kyc.loading": "로딩중...",
    
    // Common
    "common.loading": "로딩중...",
    "common.error": "오류",
    "common.success": "성공",
    "common.cancel": "취소",
    "common.confirm": "확인",
    "common.save": "저장",
    "common.edit": "편집",
    "common.delete": "삭제",
    "common.close": "닫기",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ko");

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][
      key as keyof (typeof translations)[typeof language]
    ] || key;
    
    // Handle string interpolation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value));
      });
    }
    
    return translation;
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
