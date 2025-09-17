"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ImagePlus,
  X,
  Eye,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  serverTimestamp,
  setDoc,
  doc as firestoreDoc,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { event } from "@/lib/gtag";
import Image from "next/image";
import { createNotification } from "@/lib/notifications";
import SoopTermsModal from "./SoopTermsModal";

// KYC 스키마
const kycSchema = z
  .object({
    // 1. 희망 시술 항목
    desiredServices: z.string().min(1, "희망 시술 항목을 입력해주세요"),

    // 2. 성함 / 성별 / 연령대
    name: z.string().min(1, "성함을 입력해주세요"),
    gender: z.enum(["male", "female", "other"], {
      required_error: "성별을 선택해주세요",
    }),
    ageGroup: z.enum(["10s", "20s", "30s", "40s", "50s", "60s+"], {
      required_error: "연령대를 선택해주세요",
    }),

    // 3. 반영구 경험 유무, 마지막 반영구 시기
    hasPermanentExperience: z.enum(["yes", "no"], {
      required_error: "반영구 경험 유무를 선택해주세요",
    }),
    lastPermanentDate: z.string().optional(),
    eyebrowPhotos: z.array(z.string()).optional(),

    // 4. 예약 경로
    reservationSource: z.string().min(1, "예약 경로를 입력해주세요"),

    // 5. 필독사항 동의
    termsAgreed: z.boolean().refine((val) => val === true, {
      message: "필독사항에 동의해주세요",
    }),
  })
  .refine(
    (data) => {
      // 반영구 경험이 "있음"일 때 사진이 필수
      if (data.hasPermanentExperience === "yes") {
        return data.eyebrowPhotos && data.eyebrowPhotos.length > 0;
      }
      return true;
    },
    {
      message: "반영구 경험이 있으시면 눈썹 사진을 첨부해주세요",
      path: ["eyebrowPhotos"],
    }
  );

type KYCFormData = z.infer<typeof kycSchema>;

interface KYCFormNewProps {
  onSuccess?: () => void;
}

export default function KYCFormNew({ onSuccess }: KYCFormNewProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      termsAgreed: false,
    },
  });

  const hasPermanentExperience = watch("hasPermanentExperience");
  const ageGroup = watch("ageGroup");

  // 이미지 압축 함수
  const compressImage = (
    file: File,
    maxWidth: number = 800,
    quality: number = 0.8
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new window.Image();

      img.onload = () => {
        // 이미지 크기 조정
        let { width, height } = img;
        const maxHeight = 600;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, width, height);

        // 압축된 이미지를 base64로 변환
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => reject(new Error("이미지 로드 실패"));
      img.src = URL.createObjectURL(file);
    });
  };

  // 이미지 업로드 함수
  const handleImageUpload = async (file: File): Promise<string> => {
    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("파일 크기는 5MB를 초과할 수 없습니다.");
    }

    // 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      throw new Error("이미지 파일만 업로드 가능합니다.");
    }

    try {
      const compressedImage = await compressImage(file);
      return compressedImage;
    } catch (error) {
      console.error("이미지 압축 실패:", error);
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 최대 2장 제한 체크
    if (uploadedImages.length + files.length > 2) {
      setSubmitError("눈썹 사진은 최대 2장까지 업로드 가능합니다.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(handleImageUpload);
      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...uploadedImages, ...uploadedUrls];
      setUploadedImages(newImages);
      setValue("eyebrowPhotos", newImages);
      setSubmitError(""); // 성공 시 에러 메시지 초기화
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      setSubmitError(
        error instanceof Error ? error.message : "이미지 업로드에 실패했습니다."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setValue("eyebrowPhotos", newImages);
  };

  const onSubmit = async (data: KYCFormData) => {
    if (!user?.email) {
      setSubmitError(t("kyc.loginRequired"));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log(t("kyc.submitStart"), { user: user.email, data });
      console.log(t("kyc.firebaseConnection"), { db, user: user.uid });

      // Google Analytics 이벤트
      event({
        action: "kyc_submit",
        category: "engagement",
        label: "kyc_form_submit",
      });

      // Firestore에 데이터 저장
      const kycData = {
        ...data,
        email: user.email,
        userId: user.uid,
        submittedAt: serverTimestamp(),
        status: "pending",
      };

      console.log("KYC 데이터 준비 완료:", kycData);

      // KYC 컬렉션에 데이터 저장
      console.log("KYC 컬렉션에 저장 중...");
      await setDoc(firestoreDoc(db, "kyc", user.email), kycData);
      console.log("KYC 컬렉션 저장 완료");

      // 사용자의 kycStatus도 업데이트 (문서가 없으면 생성)
      console.log("사용자 상태 업데이트 중...");
      await setDoc(
        firestoreDoc(db, "users", user.uid),
        {
          kycStatus: "pending",
          kycSubmittedAt: serverTimestamp(),
          email: user.email,
          name: data.name,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      ); // merge: true로 기존 문서가 있으면 업데이트, 없으면 생성
      console.log("사용자 상태 업데이트 완료");

      // 알림 생성
      console.log("알림 생성 중...");
      await createNotification({
        userId: user.uid,
        type: "kyc_submitted",
        title: t("kyc.submitComplete"),
        message: t("kyc.submitCompleteMessage"),
        data: { kycId: user.email },
      });
      console.log("알림 생성 완료");

      setSubmitSuccess(true);
      console.log("KYC 제출 성공!");

      // 성공 콜백 실행
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      console.error("KYC 제출 실패:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        code:
          error && typeof error === "object" && "code" in error
            ? (error as { code: string }).code
            : undefined,
        stack: error instanceof Error ? error.stack : undefined,
        user: user?.email,
        data: data,
      });
      setSubmitError(
        `${t("kyc.submitError")} ${
          error instanceof Error ? error.message : t("kyc.unknownError")
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="text-green-600 mx-auto mb-4 h-12 w-12" />
            <h3 className="text-green-800 mb-2 text-lg font-semibold">
              {t("kyc.applicationSuccess")}
            </h3>
            <p className="text-green-700 text-sm">
              {t("kyc.applicationSuccessDesc")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SoopTermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 1. 희망 시술 항목 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              1. {t("kyc.desiredServices")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="desiredServices">
                {t("kyc.desiredServicesPlaceholder")}
              </Label>
              <Input
                id="desiredServices"
                placeholder={t("kyc.desiredServicesExample")}
                {...register("desiredServices")}
                className={cn(errors.desiredServices && "border-red-500")}
              />
              {errors.desiredServices && (
                <p className="text-red-500 text-sm">
                  {errors.desiredServices.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2. 성함 / 성별 / 연령대 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              2. {t("kyc.nameGenderAge")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">{t("kyc.name")}</Label>
              <Input
                id="name"
                placeholder={t("kyc.namePlaceholder")}
                {...register("name")}
                className={cn(errors.name && "border-red-500")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label>{t("kyc.gender")}</Label>
              <RadioGroup
                onValueChange={(value) =>
                  setValue("gender", value as "male" | "female" | "other")
                }
                className="mt-2 flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">{t("dashboard.gender.male")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">{t("dashboard.gender.female")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">{t("dashboard.gender.other")}</Label>
                </div>
              </RadioGroup>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>

            <div>
              <Label>{t("kyc.ageGroup")}</Label>
              <RadioGroup
                onValueChange={(value) =>
                  setValue(
                    "ageGroup",
                    value as "10s" | "20s" | "30s" | "40s" | "50s" | "60s+"
                  )
                }
                className="mt-2 grid grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10s" id="10s" />
                  <Label htmlFor="10s">{t("dashboard.ageGroup.10s")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="20s" id="20s" />
                  <Label htmlFor="20s">{t("dashboard.ageGroup.20s")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30s" id="30s" />
                  <Label htmlFor="30s">{t("dashboard.ageGroup.30s")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="40s" id="40s" />
                  <Label htmlFor="40s">{t("dashboard.ageGroup.40s")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="50s" id="50s" />
                  <Label htmlFor="50s">{t("dashboard.ageGroup.50s")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60s+" id="60s+" />
                  <Label htmlFor="60s+">{t("dashboard.ageGroup.60s")}</Label>
                </div>
              </RadioGroup>
              {errors.ageGroup && (
                <p className="text-red-500 text-sm">
                  {errors.ageGroup.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 3. 반영구 경험 유무, 마지막 반영구 시기 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              3. {t("kyc.permanentExperience")}, {t("kyc.lastPermanentDate")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t("kyc.permanentExperience")}</Label>
              <RadioGroup
                onValueChange={(value) =>
                  setValue("hasPermanentExperience", value as "yes" | "no")
                }
                className="mt-2 flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="hasExperience" />
                  <Label htmlFor="hasExperience">
                    {t("kyc.treatment.yes")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="noExperience" />
                  <Label htmlFor="noExperience">{t("kyc.treatment.no")}</Label>
                </div>
              </RadioGroup>
              {errors.hasPermanentExperience && (
                <p className="text-red-500 text-sm">
                  {errors.hasPermanentExperience.message}
                </p>
              )}
            </div>

            {hasPermanentExperience === "yes" && (
              <div>
                <Label htmlFor="lastPermanentDate">
                  {t("kyc.lastPermanentDate")}
                </Label>
                <Input
                  id="lastPermanentDate"
                  type="date"
                  {...register("lastPermanentDate")}
                  className="mt-2"
                />
              </div>
            )}

            {/* 눈썹 사진 첨부 (경험 있음 또는 50대 이상) */}
            {(hasPermanentExperience === "yes" ||
              ageGroup === "50s" ||
              ageGroup === "60s+") && (
              <div>
                <Label>
                  눈썹 고화질 사진 첨부
                  {hasPermanentExperience === "yes" && " (필수)"}
                  <span className="text-gray-500 ml-2 text-sm">
                    (최대 2장, 5MB 이하)
                  </span>
                </Label>
                <div className="mt-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="eyebrow-photos"
                    disabled={isUploading || uploadedImages.length >= 2}
                  />
                  <Label
                    htmlFor="eyebrow-photos"
                    className={`border-gray-300 shadow-sm text-gray-700 hover:bg-gray-50 inline-flex cursor-pointer items-center rounded-md border bg-white px-4 py-2 text-sm font-medium ${
                      uploadedImages.length >= 2
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    {isUploading
                      ? "업로드 중..."
                      : uploadedImages.length >= 2
                      ? "최대 2장까지 업로드 가능"
                      : "사진 선택"}
                  </Label>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image}
                          alt={`눈썹 사진 ${index + 1}`}
                          width={200}
                          height={150}
                          className="rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. 예약 경로 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              4. {t("kyc.reservationRoute")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="reservationSource">
                {t("kyc.reservationRoutePlaceholder")}
              </Label>
              <Input
                id="reservationSource"
                placeholder={t("kyc.reservationRouteExample")}
                {...register("reservationSource")}
                className={cn(errors.reservationSource && "border-red-500")}
              />
              {errors.reservationSource && (
                <p className="text-red-500 text-sm">
                  {errors.reservationSource.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 5. 필독사항 동의 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              5. {t("kyc.termsAgreementTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAgreed"
                  checked={watch("termsAgreed")}
                  onCheckedChange={(checked) =>
                    setValue("termsAgreed", checked as boolean)
                  }
                />
                <Label htmlFor="termsAgreed" className="text-sm">
                  {t("kyc.termsAgreementText")}
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTermsModal(true)}
                  className="ml-2"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  {t("kyc.termsReadButton")}
                </Button>
              </div>
              {errors.termsAgreed && (
                <p className="text-red-500 text-sm">
                  {errors.termsAgreed.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {t("kyc.submitting")}
              </>
            ) : (
              t("kyc.apply")
            )}
          </Button>
        </div>

        {submitError && (
          <div className="text-red-600 bg-red-50 flex items-center space-x-2 rounded-lg p-4">
            <AlertCircle className="h-5 w-5" />
            <span>{submitError}</span>
          </div>
        )}
      </form>
    </div>
  );
}
