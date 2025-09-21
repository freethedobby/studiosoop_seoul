"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Clock,
  Lock,
  Menu,
  X,
  LogOut,
  AlertTriangle,
  Check,
  Eye,
  User,
  DollarSign,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { MembershipBadge } from "@/components/MembershipBadge";
import Logo from "@/components/Logo";
import NotificationCenter from "@/components/NotificationCenter";
import LocationDisplay from "@/components/LocationDisplay";
import TestNotificationButton from "@/components/TestNotificationButton";
import KYCTermsModal from "@/components/KYCTermsModal";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebase";
import { signOut as firebaseSignOut } from "firebase/auth";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import CountdownTimer from "@/components/CountdownTimer";
import { createNotification } from "@/lib/notifications";
import { isTestMode } from "@/lib/utils";

// KYC 데이터 타입 정의
interface KYCData {
  // 1. 희망 시술 항목
  desiredServices: string;

  // 2. 성함 / 성별 / 연령대
  name: string;
  gender: string;
  ageGroup: string;

  // 3. 반영구 경험 유무, 마지막 반영구 시기
  hasPermanentExperience: string;
  lastPermanentDate?: string;
  eyebrowPhotos?: string[];

  // 4. 예약 경로
  reservationSource: string;

  // 5. 필독사항 동의
  termsAgreed: boolean;

  // 시스템 필드
  status: string;
  submittedAt?: {
    toDate?: () => Date;
  };
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [reservation, setReservation] = useState<{
    id: string;
    date?: string;
    time?: string;
    status?: string;
    createdAt: Date;
    paymentDeadline?: Date;
  } | null>(null);

  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [showKycData, setShowKycData] = useState(false);
  const [showPrecautions, setShowPrecautions] = useState(false);
  const [kycOpenSettings, setKycOpenSettings] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [timeUntilOpen, setTimeUntilOpen] = useState<number | null>(null);
  const [timeUntilClose, setTimeUntilClose] = useState<number | null>(null);

  // 시간 포맷팅 함수
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}${t("common.days")} ${hours}${t(
        "common.hours"
      )} ${minutes}${t("common.minutes")} ${seconds}${t("common.seconds")}`;
    } else if (hours > 0) {
      return `${hours}${t("common.hours")} ${minutes}${t(
        "common.minutes"
      )} ${seconds}${t("common.seconds")}`;
    } else if (minutes > 0) {
      return `${minutes}${t("common.minutes")} ${seconds}${t(
        "common.seconds"
      )}`;
    } else {
      return `${seconds}${t("common.seconds")}`;
    }
  };

  console.log("user object in DashboardPage:", user);

  console.log(
    "DashboardPage render - user:",
    user?.email,
    "loading:",
    loading,
    "pathname:",
    typeof window !== "undefined" ? window.location.pathname : "Unknown"
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // KYC 오픈 기간 로드 및 타이머 관리
  useEffect(() => {
    const loadKycOpenSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "kycOpen"));
        if (settingsDoc.exists()) {
          const settings = settingsDoc.data();
          const newSettings = {
            startDate: settings.startDate || "",
            startTime: settings.startTime || "",
            endDate: settings.endDate || "",
            endTime: settings.endTime || "",
          };
          setKycOpenSettings(newSettings);
        }
      } catch (error) {
        console.error("Error loading KYC open settings:", error);
      }
    };

    loadKycOpenSettings();
  }, []);

  // KYC 오픈 상태 체크 및 타이머 업데이트
  useEffect(() => {
    if (!kycOpenSettings.startDate || !kycOpenSettings.endDate) return;

    const checkKycOpenStatus = () => {
      const now = new Date();
      const startDateTime = new Date(
        `${kycOpenSettings.startDate}T${kycOpenSettings.startTime}`
      );
      const endDateTime = new Date(
        `${kycOpenSettings.endDate}T${kycOpenSettings.endTime}`
      );

      const currentTime = now.getTime();
      const startTime = startDateTime.getTime();
      const endTime = endDateTime.getTime();

      if (currentTime < startTime) {
        // 아직 시작 전
        setIsKycOpen(false);
        setTimeUntilOpen(startTime - currentTime);
        setTimeUntilClose(null);
      } else if (currentTime >= startTime && currentTime <= endTime) {
        // 오픈 중
        setIsKycOpen(true);
        setTimeUntilOpen(null);
        setTimeUntilClose(endTime - currentTime);
      } else {
        // 마감됨
        setIsKycOpen(false);
        setTimeUntilOpen(null);
        setTimeUntilClose(null);
      }
    };

    checkKycOpenStatus();
    const interval = setInterval(checkKycOpenStatus, 1000);

    return () => clearInterval(interval);
  }, [kycOpenSettings]);

  // Fetch user's reservation
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "reservations"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setReservation(null);
      } else {
        // 모든 예약을 가져온 후 클라이언트에서 필터링
        const activeReservations = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              date: data.date,
              time: data.time,
              status: data.status,
              createdAt: data.createdAt?.toDate?.() || new Date(),
              paymentDeadline:
                data.paymentDeadline?.toDate?.() || data.paymentDeadline,
            };
          })
          .filter(
            (reservation) =>
              reservation.status !== "cancelled" &&
              reservation.status !== "rejected"
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        // 가장 최근의 활성 예약을 설정
        setReservation(
          activeReservations.length > 0 ? activeReservations[0] : null
        );
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Fetch KYC data
  useEffect(() => {
    const fetchKycData = async () => {
      if (user?.uid) {
        try {
          if (!user.email) {
            console.log("대시보드 - 사용자 이메일이 없음");
            return;
          }

          console.log(
            "대시보드 - KYC 데이터 조회 시작 (kyc 컬렉션):",
            user.email
          );
          const kycDoc = await getDoc(doc(db, "kyc", user.email));
          console.log("대시보드 - KYC 문서 존재 여부:", kycDoc.exists());
          if (kycDoc.exists()) {
            const data = kycDoc.data();
            console.log("대시보드 - KYC 데이터:", data);

            // KYC 데이터 형식에 맞게 변환
            const kycData: KYCData = {
              name: data.name || "",
              gender: data.gender || "",
              ageGroup: data.ageGroup || "",
              desiredServices: data.desiredServices || "",
              hasPermanentExperience: data.hasPermanentExperience || "",
              lastPermanentDate: data.lastPermanentDate || "",
              reservationSource: data.reservationSource || "",
              termsAgreed: data.termsAgreed || false,
              eyebrowPhotos: data.eyebrowPhotos || [],
              status: data.status || "pending",
              submittedAt: data.submittedAt,
            };

            console.log("대시보드 - 변환된 KYC 데이터:", kycData);
            setKycData(kycData);
            console.log("대시보드 - kycData 상태 설정 완료");
          } else {
            console.log("대시보드 - KYC 문서가 존재하지 않음");
            setKycData(null);
          }
        } catch (error) {
          console.error("KYC 데이터 조회 실패:", error);
          setKycData(null);
        }
      } else {
        console.log("대시보드 - user.uid가 없음");
      }
    };

    if (user?.uid) {
      fetchKycData();
    }
  }, [user?.uid, user?.email]);

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNoticeConfirm = async () => {
    if (!user?.uid) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        noticeConfirmed: true,
        noticeConfirmedAt: new Date(),
      });
      setShowNoticeModal(false);
      // 페이지 새로고침으로 상태 업데이트
      window.location.reload();
    } catch (error) {
      console.error("Error updating notice confirmation:", error);
    }
  };

  const handleReservationClick = () => {
    if (user?.kycStatus === "approved" && !user?.noticeConfirmed) {
      setShowNoticeModal(true);
    } else {
      router.push("/user/reserve");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin border-black h-8 w-8 rounded-full border-b-2"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isLocked =
    !user.kycStatus ||
    user.kycStatus === "none" ||
    user.kycStatus === "rejected";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="shadow-sm sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/")}
                className="mr-4 rounded-full p-2 transition-colors hover:bg-muted"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <Logo variant="header" />
            </div>

            {/* Universal Hamburger Menu */}
            <div className="flex items-center space-x-2">
              <NotificationCenter variant="customer" />

              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-1"
              >
                {isMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
                <span className="text-sm">{t("nav.menu")}</span>
              </Button>
            </div>
          </div>

          {/* Universal Menu */}
          {isMenuOpen && (
            <div className="border-t bg-card py-4">
              {/* User Profile Section */}
              <div className="mb-4 px-2">
                <div className="flex items-center space-x-3 rounded-lg bg-muted p-3">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 flex h-10 w-10 items-center justify-center rounded-full">
                    <span className="text-sm font-medium text-white">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 text-sm font-medium">
                      {user?.email}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {t(`dashboard.memberStatus.${user?.kycStatus || "none"}`)}
                    </span>
                  </div>
                </div>
              </div>

              <nav className="flex flex-col space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/cost")}
                  className="flex items-center justify-start space-x-2"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>{t("nav.cost")}</span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center justify-start space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>{t("nav.myInfo")}</span>
                </Button>

                {user?.kycStatus === "approved" && (
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/user/reserve")}
                    className="flex items-center justify-start space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{t("nav.reserve")}</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center justify-start space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t("nav.logout")}</span>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-gray-900 mb-2 text-2xl font-light">
              {t("dashboard.title")}
            </h2>
            <p className="text-gray-600">{t("dashboard.subtitle")}</p>
          </div>

          <div className="space-y-6">
            {/* User Info Card */}
            <div className="shadow-sm hover:shadow-md rounded-2xl border border-border bg-card p-6 transition-all duration-300">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {t("dashboard.basicInfo")}
                </h3>
                <MembershipBadge
                  kycStatus={user.kycStatus || "none"}
                  treatmentDone={user.treatmentDone || false}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("dashboard.email")}</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("dashboard.status")}</span>
                  <span className="font-medium">
                    {t(`dashboard.memberStatus.${user.kycStatus || "none"}`)}
                  </span>
                </div>
                {user.kycStatus === "rejected" && user.rejectReason && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("dashboard.rejectReason")}
                    </span>
                    <span className="text-red-600 font-medium">
                      {user.rejectReason}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* KYC Status Card */}
              <div className="shadow-sm hover:shadow-md rounded-2xl border border-border bg-card p-6 transition-all duration-300">
                <div className="mb-4 flex items-center">
                  <div className="bg-beige-800 mr-3 rounded-lg p-2">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {t("dashboard.kycApplicationTitle")}
                  </h3>
                </div>

                {/* KYC 오픈 상태에 따른 다른 UI 표시 - 테스트 모드에서는 항상 접근 가능 */}
                {!isKycOpen && timeUntilOpen && !isTestMode() ? (
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      {t("dashboard.kycSoonMessage")}
                    </p>
                    <div className="bg-beige-200 border-beige-300 rounded-lg border p-3">
                      <p className="text-beige-800 text-sm font-medium">
                        오픈까지: {formatTime(timeUntilOpen)}
                      </p>
                    </div>
                    <Button variant="default" className="w-full" disabled>
                      {t("dashboard.kycWaitingButton")}
                    </Button>
                  </div>
                ) : !isKycOpen &&
                  !timeUntilOpen &&
                  user.kycStatus !== "approved" &&
                  !isTestMode() ? (
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      {t("dashboard.kycClosedMessage")}
                    </p>
                    <Button variant="default" className="w-full" disabled>
                      {t("dashboard.kycClosedButton")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* 테스트 모드 표시 */}
                    {isTestMode() && (
                      <div className="bg-beige-200 border-beige-300 rounded-lg border p-3">
                        <p className="text-beige-800 text-xs font-medium">
                          🔧 개발 모드 - 시간 제한 비활성화
                        </p>
                      </div>
                    )}

                    {/* KYC 오픈 중 */}
                    {timeUntilClose && !isTestMode() && (
                      <div className="bg-beige-200 border-beige-300 rounded-lg border p-3">
                        <p className="text-beige-800 text-xs">
                          {t("common.untilClosing")}:{" "}
                          {formatTime(timeUntilClose)}
                        </p>
                      </div>
                    )}

                    <p className="text-gray-600 text-sm">
                      {kycData
                        ? t("dashboard.kycCompletedMessage")
                        : t("dashboard.kycRequiredMessage")}
                    </p>

                    {kycData ? (
                      <div className="space-y-3">
                        {/* KYC 신청 완료 상태 표시 */}
                        <div className="bg-green-50 border-green-200 flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center space-x-2">
                            <Check className="text-green-600 h-5 w-5" />
                            <span className="text-green-800 font-medium">
                              {t("dashboard.kycCompletedStatus")}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${
                              kycData.status === "approved"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : kycData.status === "rejected"
                                ? "bg-red-100 text-red-800 border-red-300"
                                : "bg-yellow-100 text-yellow-800 border-yellow-300"
                            }`}
                          >
                            {t(`dashboard.kycStatus.${kycData.status}`)}
                          </Badge>
                        </div>

                        {/* 신청내용보기 버튼 */}
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            // 신청내용보기 클릭 시 데이터 강제 새로고침
                            const fetchKycData = async () => {
                              if (user?.email) {
                                try {
                                  console.log(
                                    "대시보드 - KYC 데이터 새로고침 시작:",
                                    user.email
                                  );
                                  const kycDoc = await getDoc(
                                    doc(db, "kyc", user.email)
                                  );
                                  if (kycDoc.exists()) {
                                    const data = kycDoc.data();
                                    console.log(
                                      "대시보드 - 새로고침된 KYC 데이터:",
                                      data
                                    );

                                    // KYC 데이터 형식에 맞게 변환
                                    const kycData: KYCData = {
                                      name: data.name || "",
                                      gender: data.gender || "",
                                      ageGroup: data.ageGroup || "",
                                      desiredServices:
                                        data.desiredServices || "",
                                      hasPermanentExperience:
                                        data.hasPermanentExperience || "",
                                      lastPermanentDate:
                                        data.lastPermanentDate || "",
                                      reservationSource:
                                        data.reservationSource || "",
                                      termsAgreed: data.termsAgreed || false,
                                      eyebrowPhotos: data.eyebrowPhotos || [],
                                      status: data.status || "pending",
                                      submittedAt: data.submittedAt,
                                    };

                                    setKycData(kycData);
                                  }
                                } catch (error) {
                                  console.error(
                                    "대시보드 - KYC 데이터 새로고침 실패:",
                                    error
                                  );
                                }
                              }
                            };
                            fetchKycData();
                            setShowKycData(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("dashboard.kycViewApplicationButton")}
                        </Button>
                      </div>
                    ) : (
                      <Link href="/kyc">
                        <Button
                          variant="default"
                          className="w-full"
                          disabled={user.kycStatus === "pending"}
                        >
                          {user.kycStatus === "pending"
                            ? t("dashboard.kycChecking")
                            : t("dashboard.kycApply")}
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Reservation Card */}
              <div className="shadow-sm hover:shadow-md rounded-2xl border border-border bg-card p-6 transition-all duration-300">
                <div className="mb-4 flex items-center">
                  <div className="bg-beige-800 mr-3 rounded-lg p-2">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {t("dashboard.reservationTitle")}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  {isLocked
                    ? t("dashboard.reservationRequiredMessage")
                    : user.kycStatus === "approved" && !user.noticeConfirmed
                    ? t("dashboard.reservationNoticeMessage")
                    : reservation &&
                      reservation.status !== "cancelled" &&
                      reservation.status !== "rejected"
                    ? t("dashboard.reservationInProgressMessage")
                    : t("dashboard.reservationAvailableMessage")}
                </p>

                {user.kycStatus === "approved" && !user.noticeConfirmed && (
                  <button
                    onClick={() => setShowNoticeModal(true)}
                    className="bg-orange-50 hover:bg-orange-100 border-orange-200 group mb-4 w-full rounded-lg border p-3 text-left transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="text-orange-600 mt-0.5 h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      <div className="flex-1">
                        <p className="text-orange-800 group-hover:text-orange-900 text-sm font-medium transition-colors">
                          필독사항 확인 필수
                        </p>
                        <p className="text-orange-700 group-hover:text-orange-800 mt-1 text-xs transition-colors">
                          {t("dashboard.reservationNoticeDesc")}
                        </p>
                      </div>
                      <div className="text-orange-400 group-hover:text-orange-600 transition-colors">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                )}

                {user.kycStatus === "approved" && user.noticeConfirmed && (
                  <button
                    onClick={() => setShowNoticeModal(true)}
                    className="bg-beige-200 hover:bg-beige-300 border-beige-300 group mb-4 w-full rounded-lg border p-3 text-left transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-2">
                      <Check className="text-green-600 mt-0.5 h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      <div className="flex-1">
                        <p className="text-green-800 group-hover:text-green-900 text-sm font-medium transition-colors">
                          필독사항 확인 완료
                        </p>
                        <p className="text-green-700 group-hover:text-green-800 mt-1 text-xs transition-colors">
                          {t("dashboard.reservationAvailableDesc")}
                        </p>
                      </div>
                      <div className="text-green-400 group-hover:text-green-600 transition-colors">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                )}

                {reservation &&
                reservation.status !== "cancelled" &&
                reservation.status !== "rejected" ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push("/user/reserve")}
                      className="group w-full rounded-lg border border-border bg-muted p-3 text-left transition-colors duration-200 hover:bg-accent"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-gray-800 group-hover:text-gray-900 text-sm font-medium transition-colors">
                          {t("dashboard.reservationInfoTitle")}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              reservation.status === "approved"
                                ? "default"
                                : reservation.status === "payment_confirmed"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {t(
                              `dashboard.reservationStatus.${reservation.status}`
                            )}
                          </Badge>
                          <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-700 text-sm">
                        <div>
                          {reservation.date} {reservation.time}
                        </div>
                        {reservation.status === "payment_required" && (
                          <div className="text-gray-600 mt-1 text-xs">
                            {t("dashboard.paymentRequiredDesc")}
                          </div>
                        )}
                        {reservation.status === "payment_required" &&
                          reservation.paymentDeadline && (
                            <div className="mt-2">
                              <CountdownTimer
                                deadline={reservation.paymentDeadline}
                                onExpired={async () => {
                                  // 타이머 만료 시 예약 취소 처리
                                  console.log(
                                    t("dashboard.reservationTimerExpired")
                                  );

                                  if (!reservation) return;

                                  try {
                                    await updateDoc(
                                      doc(db, "reservations", reservation.id),
                                      {
                                        status: "cancelled",
                                      }
                                    );

                                    // Create admin notification
                                    await createNotification({
                                      userId: "admin",
                                      type: "admin_reservation_cancelled",
                                      title: "입금 시간 만료",
                                      message: `${
                                        user?.displayName || user?.email
                                      }{t("dashboard.reservationAutoCancelled")}`,
                                    });
                                  } catch (error) {
                                    console.error("자동 취소 실패:", error);
                                  }
                                }}
                                compact={true}
                                testMode={
                                  process.env.NODE_ENV === "development"
                                }
                              />
                            </div>
                          )}
                        {reservation.status === "payment_confirmed" && (
                          <div className="text-gray-600 mt-1 text-xs">
                            확인 요청 되었습니다.
                          </div>
                        )}
                        {reservation.status === "approved" && (
                          <div className="mt-4">
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 rounded-lg border p-4">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowPrecautions(!showPrecautions);
                                }}
                                className="hover:bg-amber-100/50 flex w-full cursor-pointer items-center justify-between rounded-lg p-2 text-left transition-colors duration-200"
                              >
                                <div className="flex items-center">
                                  <div className="bg-amber-100 mr-3 rounded-full p-2">
                                    <svg
                                      className="text-amber-600 h-5 w-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                      />
                                    </svg>
                                  </div>
                                  <h4 className="text-amber-800 text-sm font-semibold">
                                    ⚠️ 시술 전 주의사항 (클릭하여 확인)
                                  </h4>
                                </div>
                                <div className="text-amber-600">
                                  <svg
                                    className={`h-5 w-5 transition-transform duration-200 ${
                                      showPrecautions ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </div>
                              </div>

                              {showPrecautions && (
                                <div className="text-amber-700 border-amber-200 mt-4 space-y-4 border-t pt-4 text-xs">
                                  <div>
                                    <div className="mb-2 flex items-center">
                                      <div className="bg-beige-200 p-1.5 mr-2 rounded-full">
                                        <svg
                                          className="text-beige-700 h-4 w-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      </div>
                                      <p className="font-medium">
                                        시술 1개월 전 주의사항
                                      </p>
                                    </div>
                                    <p className="mb-2 ml-6">
                                      모량이 많이 부족할 경우 추가 비용이 발생될
                                      수 있습니다. 따라서 시술일 기준 최소 한 달
                                      전부터는 아래 사항을 꼭 지켜주세요:
                                    </p>
                                    <ul className="ml-6 space-y-1">
                                      <li>
                                        • 눈썹 정리 (뽑기, 깎기, 자르기) 금지
                                      </li>
                                      <li>• 브로우 리프트 펌 금지</li>
                                      <li>
                                        • 눈썹 탈색, 염색, 타투펜 사용 금지
                                      </li>
                                    </ul>
                                    <p className="text-amber-600 mt-2 ml-6 text-xs">
                                      ※ 위 내용은 리터치(재방문) 시에도 동일하게
                                      적용됩니다. 당일 메이크업은 가능하지만,
                                      브로우카라는 가급적 피해 주세요.
                                    </p>
                                  </div>

                                  <div className="border-amber-200 border-t pt-3">
                                    <div className="mb-2 flex items-center">
                                      <div className="bg-orange-100 p-1.5 mr-2 rounded-full">
                                        <svg
                                          className="text-orange-600 h-4 w-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                      </div>
                                      <p className="font-medium">
                                        시술 48시간 전 주의사항
                                      </p>
                                    </div>
                                    <ul className="ml-6 space-y-1">
                                      <li>• 과도한 피로</li>
                                      <li>• 음주</li>
                                      <li>• 카페인 섭취</li>
                                    </ul>
                                    <p className="text-amber-600 mt-1 ml-6 text-xs">
                                      → 위 세 가지는 시술 48시간 전부터
                                      삼가주세요.
                                    </p>
                                  </div>

                                  <div className="border-amber-200 border-t pt-3">
                                    <div className="mb-2 flex items-center">
                                      <div className="bg-beige-200 p-1.5 mr-2 rounded-full">
                                        <svg
                                          className="text-beige-700 h-4 w-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                          />
                                        </svg>
                                      </div>
                                      <p className="font-medium">
                                        오시는 길 안내
                                      </p>
                                    </div>
                                    <p className="mb-2 ml-6">
                                      용산 지역은 교통 체증이 잦습니다. → 택시나
                                      자차 이용 시 여유 있게 출발해 주시거나,
                                      대중교통 이용을 권장드립니다.
                                    </p>
                                    <p className="text-amber-600 ml-6 text-xs">
                                      10분 이상 지각 시 시술이 어려울 수 있으며,
                                      다음 예약자에게도 영향이 생길 수 있으니 꼭
                                      유의해주세요.
                                    </p>
                                  </div>

                                  <div className="border-amber-200 border-t pt-3">
                                    <div className="mb-2 flex items-center">
                                      <div className="bg-beige-200 p-1.5 mr-2 rounded-full">
                                        <svg
                                          className="text-beige-700 h-4 w-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                      </div>
                                      <p className="font-medium">
                                        방문 시간 안내
                                      </p>
                                    </div>
                                    <p className="mb-2 ml-6">
                                      예약 간격이 촘촘하게 운영되고 있어 10분
                                      이상 일찍 도착하시는 것은 어려워요.
                                      근처에서 시간을 보내신 후 맞춰 방문해
                                      주세요.
                                    </p>
                                    <p className="text-amber-600 ml-6 text-xs">
                                      ※ 간식, 음료 등은 고객님 것만 준비해주세요
                                      :) 저는 커피를 마시지 않아요!
                                    </p>
                                  </div>

                                  <div className="border-amber-200 border-t pt-3">
                                    <div className="mb-2 flex items-center">
                                      <div className="bg-beige-200 p-1.5 mr-2 rounded-full">
                                        <svg
                                          className="text-beige-700 h-4 w-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                          />
                                        </svg>
                                      </div>
                                      <p className="font-medium">
                                        동반 방문 관련 안내
                                      </p>
                                    </div>
                                    <p className="mb-2 ml-6">
                                      샵 내에 분리된 공간이 없어, 동반인과 함께
                                      방문하실 경우 작업 집중에 어려움이 있을 수
                                      있습니다. 가능한 한 예약자 단독 방문을
                                      부탁드리며, 부득이하게 동반이 필요하신
                                      경우 미리 말씀해주세요.
                                    </p>
                                  </div>

                                  <div className="border-amber-200 border-t pt-3">
                                    <div className="mb-2 flex items-center">
                                      <div className="bg-pink-100 p-1.5 mr-2 rounded-full">
                                        <svg
                                          className="text-pink-600 h-4 w-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                          />
                                        </svg>
                                      </div>
                                      <p className="font-medium">
                                        잔흔(남아 있는 흔적) 관련 안내
                                      </p>
                                    </div>
                                    <p className="mb-2 ml-6">
                                      잔흔이 남아 있는 경우,
                                      <span className="font-bold">
                                        시술일 기준 최소 6주 전(권장: 8주 전)
                                      </span>
                                      까지 최대한 깨끗이 제거해 주세요.
                                    </p>
                                    <p className="text-amber-600 ml-6 text-xs">
                                      잔흔 상태에 따라 당일 시술이 어려울 수
                                      있습니다.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {reservation.status === "rejected" && (
                          <div className="text-gray-600 mt-1 text-xs">
                            {t("dashboard.reservationRejectedDesc")}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Location Display - shows 1 day before procedure */}
                    <LocationDisplay reservation={reservation} />
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isLocked || user.kycStatus !== "approved"}
                    onClick={handleReservationClick}
                  >
                    {isLocked
                      ? t("dashboard.reservationNeededMessage")
                      : user.kycStatus === "approved" && !user.noticeConfirmed
                      ? t("dashboard.reservationNoticeCheckMessage")
                      : user.kycStatus === "approved"
                      ? t("dashboard.reservationBook")
                      : t("dashboard.reservationWaiting")}
                  </Button>
                )}
              </div>
            </div>

            {/* Treatment Status */}
            {user.treatmentDone && (
              <div className="shadow-sm hover:shadow-md rounded-2xl border border-border bg-card p-6 transition-all duration-300">
                <div className="mb-4 flex items-center">
                  <div className="bg-beige-800 mr-3 rounded-lg p-2">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">시술 완료</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  시술이 완료되었습니다. 감사합니다!
                </p>
              </div>
            )}

            {/* Test Notification Button (Development Only) */}
            <TestNotificationButton />
          </div>
        </div>
      </main>

      {/* KYC Terms Modal */}
      <KYCTermsModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        onConfirm={handleNoticeConfirm}
        showViewAgain={user?.noticeConfirmed || false}
      />

      {/* KYC Data Modal */}
      <Dialog open={showKycData} onOpenChange={setShowKycData}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("dashboard.kycViewApplicationTitle")}</DialogTitle>
          </DialogHeader>
          {kycData && <KYCDataViewer kycData={kycData} t={t} />}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

// KYC 데이터 뷰어 컴포넌트
function KYCDataViewer({
  kycData,
  t,
}: {
  kycData: KYCData;
  t: (key: string) => string;
}) {
  const getGenderText = (gender: string) => {
    return t(`dashboard.gender.${gender}`) || gender;
  };

  const getAgeGroupText = (ageGroup: string) => {
    return t(`dashboard.ageGroup.${ageGroup}`) || ageGroup;
  };

  return (
    <div className="space-y-4">
      {/* 기본 정보 */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 text-lg">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-gray-600 text-sm font-medium">성함</label>
              <p className="text-gray-900 text-base font-medium">
                {kycData.name}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-gray-600 text-sm font-medium">성별</label>
              <p className="text-gray-900 text-base">
                {getGenderText(kycData.gender)}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-gray-600 text-sm font-medium">
                연령대
              </label>
              <p className="text-gray-900 text-base">
                {getAgeGroupText(kycData.ageGroup)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 희망 시술 항목 */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 text-lg">
            희망 시술 항목
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-900 border-gray-200 text-base rounded-lg border bg-white p-4 font-medium">
            {kycData.desiredServices}
          </div>
        </CardContent>
      </Card>

      {/* 반영구 경험 */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 text-lg">반영구 경험</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-gray-600 text-sm font-medium">
                반영구 경험 유무
              </label>
              <p className="text-gray-900 text-base">
                {kycData.hasPermanentExperience === "yes" ? (
                  <span className="text-green-600 font-medium">있음</span>
                ) : (
                  <span className="text-gray-500">없음</span>
                )}
              </p>
            </div>
            {kycData.hasPermanentExperience === "yes" &&
              kycData.lastPermanentDate && (
                <div className="space-y-1">
                  <label className="text-gray-600 text-sm font-medium">
                    마지막 반영구 시기
                  </label>
                  <p className="text-gray-900 text-base font-medium">
                    {kycData.lastPermanentDate}
                  </p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      {/* 예약 경로 */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 text-lg">
            {t("dashboard.reservationSourceTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-900 border-gray-200 text-base rounded-lg border bg-white p-4 font-medium">
            {kycData.reservationSource}
          </div>
        </CardContent>
      </Card>

      {/* 눈썹 사진 */}
      {kycData.eyebrowPhotos && kycData.eyebrowPhotos.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-800 text-lg">
              눈썹 사진 ({kycData.eyebrowPhotos.length}장)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {kycData.eyebrowPhotos.map((photo, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-gray-600 text-sm font-medium">
                    사진 {index + 1}
                  </label>
                  <div className="bg-gray-50 border-gray-200 rounded-lg border p-2">
                    <Image
                      src={photo}
                      alt={`눈썹 사진 ${index + 1}`}
                      width={200}
                      height={128}
                      className="h-32 w-full rounded object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 제출 정보 */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-800 text-lg">제출 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-gray-600 text-sm font-medium">
                제출일
              </label>
              <p className="text-gray-900 text-base">
                {kycData.submittedAt?.toDate?.()?.toLocaleDateString() ||
                  t("dashboard.noDateInfo")}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-gray-600 text-sm font-medium">상태</label>
              <p className="text-gray-900 text-base">
                {kycData.status === "approved" ? (
                  <span className="text-green-600 font-medium">승인됨</span>
                ) : kycData.status === "rejected" ? (
                  <span className="text-red-500 font-medium">거절됨</span>
                ) : (
                  <span className="text-yellow-600 font-medium">검토중</span>
                )}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-gray-600 text-sm font-medium">
                필독사항 동의
              </label>
              <p className="text-gray-900 text-base">
                {kycData.termsAgreed ? (
                  <span className="text-green-600 font-medium">✓ 동의함</span>
                ) : (
                  <span className="text-red-500 font-medium">✗ 미동의</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
