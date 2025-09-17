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
    "admin.removeConfirm":
      "Are you sure you want to remove {email} from administrators?",
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
    "admin.setupSteps":
      '1. Download service account key from Firebase Console\n2. Set environment variables:\nFIREBASE_PROJECT_ID=your-project-id\nFIREBASE_CLIENT_EMAIL=your-service-account-email\nFIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour Private Key\\n-----END PRIVATE KEY-----"\n3. Add environment variables to Vercel and redeploy',

    // KYC
    "kyc.title": "KYC Management",
    "kyc.pending": "Pending",
    "kyc.approved": "Approved",
    "kyc.rejected": "Rejected",
    "kyc.approve": "Approve",
    "kyc.reject": "Reject",
    "kyc.noData": "No KYC data available",
    "kyc.loading": "Loading...",

    // Dashboard
    "dashboard.title": "My Info",
    "dashboard.subtitle":
      "Check your registration status and reservation status.",
    "dashboard.basicInfo": "Basic Information",
    "dashboard.email": "Email",
    "dashboard.status": "Status",
    "dashboard.rejectReason": "Rejection Reason",
    "dashboard.kycApplication": "Customer Registration Application",
    "dashboard.kycSoon": "Customer registration application will start soon.",
    "dashboard.kycOpenIn": "Opens in:",
    "dashboard.kycWaiting": "Waiting for customer registration application",
    "dashboard.kycClosed":
      "Customer registration application period has ended.",
    "dashboard.kycClosedButton": "Customer registration application closed",
    "dashboard.kycCompleted":
      "Customer registration application has been completed.",
    "dashboard.kycRequired":
      "Complete customer registration application to make reservations.",
    "dashboard.kycViewApplication": "View Application",
    "dashboard.kycApply": "Apply for Customer Registration",
    "dashboard.kycChecking": "Checking",
    "dashboard.reservation": "Reservation",
    "dashboard.reservationRequired":
      "Customer registration application required for reservations.",
    "dashboard.reservationNotice":
      "Reservations available after reading required notices.",
    "dashboard.reservationInProgress": "Reservation in progress.",
    "dashboard.reservationAvailable":
      "Reservations available after customer registration approval.",
    "dashboard.noticeRequired": "Required Notice Confirmation",
    "dashboard.noticeRequiredDesc":
      "Please read the required notices before making a reservation.",
    "dashboard.noticeCompleted": "Notice Confirmation Completed",
    "dashboard.noticeCompletedDesc": "Reservations are now available.",
    "dashboard.reservationInfo": "Reservation Information",
    "dashboard.reservationConfirmed": "Confirmed",
    "dashboard.reservationPaymentConfirmed": "Payment Confirmed",
    "dashboard.reservationPaymentRequired": "Payment Required",
    "dashboard.reservationRejected": "❌ Reservation was rejected",
    "dashboard.reservationWaiting": "Waiting for approval",
    "dashboard.paymentRequired": "💰 200,000 KRW deposit required",
    "dashboard.paymentConfirmed": "Confirmation requested.",
    "dashboard.reservationNeeded": "Customer registration application required",
    "dashboard.reservationNoticeCheck": "Check required notices",
    "dashboard.reservationBook": "Make Reservation",
    "dashboard.treatmentCompleted": "Treatment Completed",
    "dashboard.treatmentCompletedDesc":
      "Treatment has been completed. Thank you!",
    "dashboard.kycCompletedMessage":
      "Customer registration application has been completed.",
    "dashboard.kycRequiredMessage":
      "Complete customer registration application to make reservations.",
    "dashboard.reservationRequiredMessage":
      "Customer registration application required for reservations.",
    "dashboard.reservationNoticeMessage":
      "Reservations available after reading required notices.",
    "dashboard.reservationInProgressMessage": "Reservation in progress.",
    "dashboard.reservationAvailableMessage":
      "Reservations available after customer registration approval.",
    "dashboard.reservationNeededMessage":
      "Customer registration application required",
    "dashboard.reservationNoticeCheckMessage": "Check required notices",
    "dashboard.noDateInfo": "No date information",
    "dashboard.kycApplicationTitle": "Customer Registration Application",
    "dashboard.kycSoonMessage":
      "Customer registration application will start soon.",
    "dashboard.kycWaitingButton":
      "Waiting for customer registration application",
    "dashboard.kycClosedMessage":
      "Customer registration application period has ended.",
    "dashboard.kycCompletedStatus": "Application Completed",
    "dashboard.kycViewApplicationButton": "View Application",
    "dashboard.kycRefreshData": "View Application clicked - force refresh data",
    "dashboard.reservationTitle": "Reservation",
    "dashboard.reservationNoticeDesc":
      "Please read the required notices before making a reservation.",
    "dashboard.reservationAvailableDesc": "Reservations are now available.",
    "dashboard.reservationInfoTitle": "Reservation Information",
    "dashboard.paymentRequiredDesc": "💰 200,000 KRW deposit required",
    "dashboard.reservationTimerExpired": "Reservation timer expired",
    "dashboard.reservationAutoCancelled":
      "님의 예약이 입금 시간 만료로 자동 취소되었습니다.",
    "dashboard.reservationRejectedDesc": "❌ Reservation was rejected",
    "dashboard.kycViewApplicationTitle": "Application Details",
    "dashboard.reservationSourceTitle": "Reservation Source",
    "kyc.applicationCompleted": "Application Completed",
    "kyc.applicationCompletedDesc":
      "Customer registration application has been completed. We will notify you of the results after admin review.",
    "kyc.viewApplicationContent": "View Application Content",
    "kyc.applicationContentTitle": "Application Content Review",
    "kyc.applicationContentDesc":
      "You can review the customer registration application content you submitted.",
    "kyc.gender": "Gender",
    "kyc.previousTreatmentExperience": "Previous Treatment Experience",
    "kyc.applicationOpenSoon": "Customer registration application opening soon",
    "kyc.applicationClosed": "Customer registration application closed",
    "kyc.applicationOpenSoonDesc":
      "Customer registration application will start soon. Time remaining until opening:",
    "kyc.applicationClosedDesc":
      "Customer registration application period has ended.",
    "kyc.applicationPeriod": "Application Period",
    "kyc.applicationOpenActive": "Customer registration application is open",
    "login.title": "Login",
    "login.subtitle": "Please log in to use studiosoop.seoul services.",
    "login.googleLogin": "Login with Google",
    "login.loggingIn": "Logging in...",
    "login.loginFailed": "Login failed. Please try again.",
    "login.privacyNotice":
      "By logging in, you agree to the privacy policy and terms of service",
    "reservation.title": "Make Reservation",
    "reservation.alreadyActiveReservation":
      "You already have an active reservation. Please cancel your existing reservation before making a new one.",
    "reservation.cancelConfirm":
      "Are you sure you want to cancel your reservation?",
    "reservation.cancelSuccess": "Reservation cancelled successfully",
    "reservation.cancelFailed":
      "Failed to cancel reservation. Please try again.",
    "reservation.autoCancelled":
      "님의 예약이 입금 시간 만료로 자동 취소되었습니다.",
    "reservation.cancelTitle": "Reservation Cancelled",
    "reservation.cancelMessage": "님이 예약을 취소했습니다.",
    "reservation.confirmTitle": "Confirm Reservation",
    "reservation.confirmMessage": "확정하시겠습니까?",
    "reservation.reserving": "Making reservation...",
    "reservation.confirm": "Confirm",
    "reservation.cancel": "Cancel",
    "reservation.canceling": "Cancelling...",
    "reservation.cancelReservation": "Cancel Reservation",
    "reservation.hasApprovedReservation": "확정된 예약이 있습니다.",
    "reservation.bookedByOthers": "다른 사용자가 예약했습니다.",
    "reservation.makeReservation": "예약하기",
    "reservation.paymentConfirmationRequired": "입금확인요청",
    "reservation.adminConfirmationWaiting": "관리자 확인 대기",
    "reservation.adminConfirmationDesc": "관리자 확인 후 예약이 확정됩니다",
    "reservation.reservationConfirmed": "예약 확정",
    "reservation.reservationConfirmedDesc": "예약이 확정되었습니다",
    "reservation.paymentNameMatch":
      "신청자명과 입금자명이 같아야 입금처리 확정됩니다",
    "reservation.reservationDate": "예약일",
    "reservation.reservationTime": "시간",
    "reservation.notSet": "미정",
    "common.untilClosing": "Until closing",
    "kyc.basicInfo": "Basic Information",
    "kyc.name": "Name",
    "kyc.contact": "Contact",
    "kyc.address": "Address",
    "kyc.treatmentInfo": "Treatment Information",
    "kyc.desiredServices": "Desired Treatment Items",
    "kyc.desiredServicesPlaceholder": "Please enter desired treatment items",
    "kyc.desiredServicesExample": "Ex: Natural eyebrows + eyelash perm",
    "kyc.nameGenderAge": "Name/Gender/Age Group",
    "kyc.namePlaceholder": "Please enter your name",
    "kyc.genderSelection": "Please select gender",
    "kyc.ageGroupSelection": "Please select age group",
    "kyc.permanentExperience": "Permanent Makeup Experience",
    "kyc.permanentExperienceSelection":
      "Please select permanent makeup experience",
    "kyc.lastPermanentDate": "Last Permanent Makeup Date",
    "kyc.reservationRoute": "Reservation Route",
    "kyc.reservationRoutePlaceholder": "Please enter reservation route",
    "kyc.termsAgreement": "Please agree to the terms and conditions",
    "kyc.termsAgreementTitle": "Terms and Conditions Agreement",
    "kyc.termsAgreementText":
      "I have checked all terms and conditions and agree",
    "kyc.termsReadButton": "Read Terms",
    "kyc.treatment.yes": "Yes",
    "kyc.treatment.no": "No",
    "kyc.reservationRouteExample": "Ex: Instagram ad, referral, etc.",
    "kyc.photoRequired":
      "Please attach eyebrow photos if you have permanent makeup experience",
    "common.days": "days",
    "common.hours": "hours",
    "common.minutes": "minutes",
    "common.seconds": "seconds",
    "common.urgent": "⚠️ Urgent: Payment deadline is about to expire!",
    "common.timeRunningOut": "⏰ Payment time is running out.",
    "dashboard.memberStatus": {
      approved: "Verified Member",
      pending: "Under Review",
      rejected: "Rejected",
      none: "Not Applied",
    },
    "dashboard.kycStatus": {
      approved: "Approved",
      pending: "Under Review",
      rejected: "Rejected",
    },
    "dashboard.reservationStatus": {
      approved: "Confirmed",
      payment_confirmed: "Payment Confirmed",
      payment_required: "Payment Required",
      rejected: "Rejected",
      waiting: "Waiting",
    },
    "dashboard.gender.male": "Male",
    "dashboard.gender.female": "Female", 
    "dashboard.gender.other": "Other",
    "dashboard.ageGroup.10s": "10s",
    "dashboard.ageGroup.20s": "20s",
    "dashboard.ageGroup.30s": "30s",
    "dashboard.ageGroup.40s": "40s",
    "dashboard.ageGroup.50s": "50s",
    "dashboard.ageGroup.60s": "60+",
    "kyc.skinType": {
      oily: "Oily",
      dry: "Dry",
      normal: "Normal",
      combination: "Combination",
      unknown: "Unknown",
      other: "Other",
    },
    "kyc.treatment": {
      yes: "Yes",
      no: "No",
    },

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
    "admin.setupSteps":
      '1. Firebase Console에서 서비스 계정 키를 다운로드하세요\n2. 환경 변수를 설정하세요:\nFIREBASE_PROJECT_ID=your-project-id\nFIREBASE_CLIENT_EMAIL=your-service-account-email\nFIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour Private Key\\n-----END PRIVATE KEY-----"\n3. Vercel에 환경 변수를 추가하고 재배포하세요',

    // KYC
    "kyc.title": "KYC 관리",
    "kyc.pending": "대기중",
    "kyc.approved": "승인됨",
    "kyc.rejected": "거부됨",
    "kyc.approve": "승인",
    "kyc.reject": "거부",
    "kyc.noData": "KYC 데이터가 없습니다",
    "kyc.loading": "로딩중...",

    // Dashboard
    "dashboard.title": "내 정보",
    "dashboard.subtitle": "고객 등록 상태와 예약 현황을 확인하세요.",
    "dashboard.basicInfo": "기본 정보",
    "dashboard.email": "이메일",
    "dashboard.status": "상태",
    "dashboard.rejectReason": "반려 사유",
    "dashboard.kycApplication": "고객등록 신청",
    "dashboard.kycSoon": "고객등록 신청이 곧 시작됩니다.",
    "dashboard.kycOpenIn": "오픈까지:",
    "dashboard.kycWaiting": "고객등록 신청 대기중",
    "dashboard.kycClosed": "고객등록 신청 기간이 마감되었습니다.",
    "dashboard.kycClosedButton": "고객등록 신청 마감",
    "dashboard.kycCompleted": "고객등록 신청이 완료되었습니다.",
    "dashboard.kycRequired": "고객등록 신청을 완료하면 예약이 가능합니다.",
    "dashboard.kycViewApplication": "신청내용보기",
    "dashboard.kycApply": "고객등록 신청하기",
    "dashboard.kycChecking": "확인중",
    "dashboard.reservation": "예약",
    "dashboard.reservationRequired": "고객등록 신청 후 예약이 가능합니다.",
    "dashboard.reservationNotice": "필독사항 확인 후 예약이 가능합니다.",
    "dashboard.reservationInProgress": "예약이 진행 중입니다.",
    "dashboard.reservationAvailable": "고객 등록 승인 후 예약이 가능합니다.",
    "dashboard.noticeRequired": "필독사항 확인 필수",
    "dashboard.noticeRequiredDesc":
      "예약하기 전에 반드시 필독사항을 확인해주세요.",
    "dashboard.noticeCompleted": "필독사항 확인 완료",
    "dashboard.noticeCompletedDesc": "예약이 가능합니다.",
    "dashboard.reservationInfo": "예약 정보",
    "dashboard.reservationConfirmed": "확정",
    "dashboard.reservationPaymentConfirmed": "입금확인중",
    "dashboard.reservationPaymentRequired": "입금대기",
    "dashboard.reservationRejected": "❌ 예약이 거절되었습니다",
    "dashboard.reservationWaiting": "승인 대기 중",
    "dashboard.paymentRequired": "💰 예약금 20만원 입금 필요",
    "dashboard.paymentConfirmed": "확인 요청 되었습니다.",
    "dashboard.reservationNeeded": "고객등록 신청 필요",
    "dashboard.reservationNoticeCheck": "필독사항 확인하기",
    "dashboard.reservationBook": "예약하기",
    "dashboard.treatmentCompleted": "시술 완료",
    "dashboard.treatmentCompletedDesc": "시술이 완료되었습니다. 감사합니다!",
    "dashboard.kycCompletedMessage": "고객등록 신청이 완료되었습니다.",
    "dashboard.kycRequiredMessage":
      "고객등록 신청을 완료하면 예약이 가능합니다.",
    "dashboard.reservationRequiredMessage":
      "고객등록 신청 후 예약이 가능합니다.",
    "dashboard.reservationNoticeMessage": "필독사항 확인 후 예약이 가능합니다.",
    "dashboard.reservationInProgressMessage": "예약이 진행 중입니다.",
    "dashboard.reservationAvailableMessage":
      "고객 등록 승인 후 예약이 가능합니다.",
    "dashboard.reservationNeededMessage": "고객등록 신청 필요",
    "dashboard.reservationNoticeCheckMessage": "필독사항 확인하기",
    "dashboard.noDateInfo": "날짜 정보 없음",
    "dashboard.kycApplicationTitle": "고객등록 신청",
    "dashboard.kycSoonMessage": "고객등록 신청이 곧 시작됩니다.",
    "dashboard.kycWaitingButton": "고객등록 신청 대기중",
    "dashboard.kycClosedMessage": "고객등록 신청 기간이 마감되었습니다.",
    "dashboard.kycCompletedStatus": "신청 완료",
    "dashboard.kycViewApplicationButton": "신청내용보기",
    "dashboard.kycRefreshData": "신청내용보기 클릭 시 데이터 강제 새로고침",
    "dashboard.reservationTitle": "예약",
    "dashboard.reservationNoticeDesc":
      "예약하기 전에 반드시 필독사항을 확인해주세요.",
    "dashboard.reservationAvailableDesc": "예약이 가능합니다.",
    "dashboard.reservationInfoTitle": "예약 정보",
    "dashboard.paymentRequiredDesc": "💰 예약금 20만원 입금 필요",
    "dashboard.reservationTimerExpired": "예약 타이머 만료",
    "dashboard.reservationAutoCancelled":
      "님의 예약이 입금 시간 만료로 자동 취소되었습니다.",
    "dashboard.reservationRejectedDesc": "❌ 예약이 거절되었습니다",
    "dashboard.kycViewApplicationTitle": "신청 내용 확인",
    "dashboard.reservationSourceTitle": "예약 경로",
    "kyc.applicationCompleted": "신청 완료",
    "kyc.applicationCompletedDesc":
      "고객등록 신청이 완료되었습니다. 관리자 검토 후 결과를 알려드리겠습니다.",
    "kyc.viewApplicationContent": "신청 내용 보기",
    "kyc.applicationContentTitle": "신청 내용 확인",
    "kyc.applicationContentDesc":
      "제출하신 고객등록 신청 내용을 확인하실 수 있습니다.",
    "kyc.gender": "성별",
    "kyc.previousTreatmentExperience": "이전 시술 경험",
    "kyc.applicationOpenSoon": "고객등록 신청 오픈 예정",
    "kyc.applicationClosed": "고객등록 신청 마감",
    "kyc.applicationOpenSoonDesc":
      "고객등록 신청이 곧 시작됩니다. 오픈까지 남은 시간:",
    "kyc.applicationClosedDesc": "고객등록 신청 기간이 마감되었습니다.",
    "kyc.applicationPeriod": "신청 기간",
    "kyc.applicationOpenActive": "고객등록 신청 오픈 중",
    "login.title": "로그인",
    "login.subtitle":
      "studiosoop.seoul의 서비스를 이용하시려면 로그인해주세요.",
    "login.googleLogin": "Google로 로그인",
    "login.loggingIn": "로그인 중...",
    "login.loginFailed": "로그인에 실패했습니다. 다시 시도해주세요.",
    "login.privacyNotice":
      "로그인 시 개인정보처리방침 및 서비스 약관에 동의하는 것으로 간주됩니다",
    "reservation.title": "예약하기",
    "reservation.alreadyActiveReservation":
      "이미 활성 예약이 있습니다. 기존 예약을 취소한 후 새로운 예약을 진행해주세요.",
    "reservation.cancelConfirm": "정말로 예약을 취소하시겠습니까?",
    "reservation.cancelSuccess": "예약이 취소되었습니다",
    "reservation.cancelFailed": "예약 취소에 실패했습니다. 다시 시도해주세요.",
    "reservation.autoCancelled":
      "님의 예약이 입금 시간 만료로 자동 취소되었습니다.",
    "reservation.cancelTitle": "예약 취소",
    "reservation.cancelMessage": "님이 예약을 취소했습니다.",
    "reservation.confirmTitle": "예약 확정",
    "reservation.confirmMessage": "확정하시겠습니까?",
    "reservation.reserving": "예약중...",
    "reservation.confirm": "확정",
    "reservation.cancel": "취소",
    "reservation.canceling": "취소 중...",
    "reservation.cancelReservation": "예약 취소",
    "reservation.hasApprovedReservation": "확정된 예약이 있습니다.",
    "reservation.bookedByOthers": "다른 사용자가 예약했습니다.",
    "reservation.makeReservation": "예약하기",
    "reservation.paymentConfirmationRequired": "입금확인요청",
    "reservation.adminConfirmationWaiting": "관리자 확인 대기",
    "reservation.adminConfirmationDesc": "관리자 확인 후 예약이 확정됩니다",
    "reservation.reservationConfirmed": "예약 확정",
    "reservation.reservationConfirmedDesc": "예약이 확정되었습니다",
    "reservation.paymentNameMatch":
      "신청자명과 입금자명이 같아야 입금처리 확정됩니다",
    "reservation.reservationDate": "예약일",
    "reservation.reservationTime": "시간",
    "reservation.notSet": "미정",
    "common.untilClosing": "마감까지",
    "kyc.basicInfo": "기본 정보",
    "kyc.name": "이름",
    "kyc.contact": "연락처",
    "kyc.address": "주소",
    "kyc.treatmentInfo": "시술 정보",
    "kyc.desiredServices": "희망 시술 항목",
    "kyc.desiredServicesPlaceholder": "희망 시술 항목을 입력해주세요",
    "kyc.desiredServicesExample": "예: 자연 눈썹 + 속눈썹펌",
    "kyc.nameGenderAge": "성함/성별/연령대",
    "kyc.namePlaceholder": "성함을 입력해주세요",
    "kyc.genderSelection": "성별을 선택해주세요",
    "kyc.ageGroupSelection": "연령대를 선택해주세요",
    "kyc.permanentExperience": "반영구 경험",
    "kyc.permanentExperienceSelection": "반영구 경험 유무를 선택해주세요",
    "kyc.lastPermanentDate": "마지막 반영구 시기",
    "kyc.reservationRoute": "예약 경로",
    "kyc.reservationRoutePlaceholder": "예약 경로를 입력해주세요",
    "kyc.termsAgreement": "필독사항에 동의해주세요",
    "kyc.termsAgreementTitle": "필독사항 동의",
    "kyc.termsAgreementText": "필독사항을 모두 확인하고 동의합니다",
    "kyc.termsReadButton": "필독사항 읽기",
    "kyc.treatment.yes": "있음",
    "kyc.treatment.no": "없음",
    "kyc.reservationRouteExample": "예: 인스타 광고, 소개 등",
    "kyc.photoRequired": "반영구 경험이 있으시면 눈썹 사진을 첨부해주세요",
    "common.days": "일",
    "common.hours": "시간",
    "common.minutes": "분",
    "common.seconds": "초",
    "common.urgent": "⚠️ 긴급: 입금 시간이 곧 만료됩니다!",
    "common.timeRunningOut": "⏰ 입금 시간이 얼마 남지 않았습니다.",
    "kyc.ageGroup": "연령대",
    "kyc.ageGroup.10s": "10대",
    "kyc.ageGroup.20s": "20대",
    "kyc.ageGroup.30s": "30대",
    "kyc.ageGroup.40s": "40대",
    "kyc.ageGroup.50s": "50대",
    "kyc.ageGroup.60s": "60대 이상",
    "dashboard.memberStatus": {
      approved: "인증멤버",
      pending: "검토 중",
      rejected: "거절됨",
      none: "미신청",
    },
    "dashboard.kycStatus": {
      approved: "승인됨",
      pending: "검토중",
      rejected: "거절됨",
    },
    "dashboard.reservationStatus": {
      approved: "확정",
      payment_confirmed: "입금확인중",
      payment_required: "입금대기",
      rejected: "거절",
      waiting: "대기",
    },
    "dashboard.gender.male": "남성",
    "dashboard.gender.female": "여성",
    "dashboard.gender.other": "기타",
    "dashboard.ageGroup.10s": "10대",
    "dashboard.ageGroup.20s": "20대",
    "dashboard.ageGroup.30s": "30대",
    "dashboard.ageGroup.40s": "40대",
    "dashboard.ageGroup.50s": "50대",
    "dashboard.ageGroup.60s": "60대 이상",
    "kyc.skinType": {
      oily: "지성",
      dry: "건성",
      normal: "중성",
      combination: "복합성",
      unknown: "모르겠음",
      other: "기타",
    },
    "kyc.treatment": {
      yes: "있음",
      no: "없음",
    },

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
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language");
      return (saved as Language) || "ko";
    }
    return "ko";
  });

  // Save language to localStorage when it changes
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const rawTranslation =
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key;

    // Ensure translation is a string before interpolation
    if (typeof rawTranslation !== "string") {
      return String(rawTranslation);
    }

    let translation: string = rawTranslation;

    // Handle string interpolation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value));
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
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
