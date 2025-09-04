"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";
import { event } from "@/lib/gtag";
import Image from "next/image";
import { createNotification, notificationTemplates } from "@/lib/notifications";
import SoopTermsModal from "./SoopTermsModal";

// KYC 스키마
const kycSchema = z.object({
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
  
  // 5. 희망 예약 타임
  desiredTimes: z.string().min(1, "희망 예약 타임을 입력해주세요"),
  
  // 6. 필독사항 동의
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "필독사항에 동의해주세요",
  }),
});

type KYCFormData = z.infer<typeof kycSchema>;

interface KYCFormNewProps {
  onSuccess?: () => void;
}

export default function KYCFormNew({ onSuccess }: KYCFormNewProps) {
  const { user } = useAuth();
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

  // 이미지 업로드 함수
  const handleImageUpload = async (file: File): Promise<string> => {
    // 실제 구현에서는 Firebase Storage에 업로드
    // 여기서는 임시로 base64로 변환
    return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(handleImageUpload);
      const uploadedUrls = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...uploadedUrls]);
      setValue("eyebrowPhotos", [...uploadedImages, ...uploadedUrls]);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
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
      setSubmitError("로그인이 필요합니다.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Google Analytics 이벤트
      event("kyc_submit", {
        event_category: "engagement",
        event_label: "kyc_form_submit",
      });

      // Firestore에 데이터 저장
      const kycData = {
        ...data,
        email: user.email,
        submittedAt: serverTimestamp(),
        status: "pending",
      };

      await setDoc(firestoreDoc(db, "kyc", user.email), kycData);

      // 알림 생성
        await createNotification({
        userId: user.uid,
          type: "kyc_submitted",
          title: "KYC 신청 완료",
        message: "고객등록 신청이 완료되었습니다. 검토 후 결과를 알려드리겠습니다.",
        data: { kycId: user.email },
      });

      setSubmitSuccess(true);
      
      // 성공 콜백 실행
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      console.error("KYC 제출 실패:", error);
      setSubmitError("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
  return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              신청이 완료되었습니다!
                  </h3>
            <p className="text-green-700 text-sm">
              고객등록 신청이 완료되었습니다. 관리자 검토 후 결과를 알려드리겠습니다.
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
            <CardTitle className="text-lg">1. 희망 시술 항목</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="desiredServices">희망 시술 항목을 입력해주세요</Label>
              <Input
                id="desiredServices"
                placeholder="예: 자연 눈썹 + 속눈썹펌"
                {...register("desiredServices")}
                className={cn(errors.desiredServices && "border-red-500")}
              />
              {errors.desiredServices && (
                <p className="text-red-500 text-sm">{errors.desiredServices.message}</p>
              )}
                </div>
          </CardContent>
        </Card>

        {/* 2. 성함 / 성별 / 연령대 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. 성함 / 성별 / 연령대</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">성함</Label>
                  <Input
                    id="name"
                placeholder="성함을 입력해주세요"
                    {...register("name")}
                className={cn(errors.name && "border-red-500")}
                  />
                  {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>

            <div>
              <Label>성별</Label>
                  <RadioGroup
                onValueChange={(value) => setValue("gender", value as "male" | "female" | "other")}
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">남성</Label>
                    </div>
                <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">여성</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">기타</Label>
                    </div>
                  </RadioGroup>
                  {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
                  )}
                </div>

            <div>
              <Label>연령대</Label>
                  <RadioGroup
                onValueChange={(value) => setValue("ageGroup", value as any)}
                className="grid grid-cols-3 gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10s" id="10s" />
                  <Label htmlFor="10s">10대</Label>
                    </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="20s" id="20s" />
                  <Label htmlFor="20s">20대</Label>
                    </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30s" id="30s" />
                  <Label htmlFor="30s">30대</Label>
                    </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="40s" id="40s" />
                  <Label htmlFor="40s">40대</Label>
                    </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="50s" id="50s" />
                  <Label htmlFor="50s">50대</Label>
                    </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60s+" id="60s+" />
                  <Label htmlFor="60s+">60대 이상</Label>
                    </div>
                  </RadioGroup>
              {errors.ageGroup && (
                <p className="text-red-500 text-sm">{errors.ageGroup.message}</p>
                  )}
                </div>
          </CardContent>
        </Card>

        {/* 3. 반영구 경험 유무, 마지막 반영구 시기 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. 반영구 경험 유무, 마지막 반영구 시기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>반영구 경험 유무</Label>
                  <RadioGroup
                onValueChange={(value) => setValue("hasPermanentExperience", value as "yes" | "no")}
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="hasExperience" />
                  <Label htmlFor="hasExperience">있음</Label>
                    </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="noExperience" />
                  <Label htmlFor="noExperience">없음</Label>
                    </div>
                  </RadioGroup>
              {errors.hasPermanentExperience && (
                <p className="text-red-500 text-sm">{errors.hasPermanentExperience.message}</p>
                  )}
                </div>

            {hasPermanentExperience === "yes" && (
              <div>
                <Label htmlFor="lastPermanentDate">마지막 반영구 시기</Label>
                <Input
                  id="lastPermanentDate"
                  type="date"
                  {...register("lastPermanentDate")}
                  className="mt-2"
                  />
                </div>
            )}

            {/* 눈썹 사진 첨부 (경험 있음 또는 50대 이상) */}
            {(hasPermanentExperience === "yes" || ageGroup === "50s" || ageGroup === "60s+") && (
              <div>
                <Label>눈썹 고화질 사진 첨부 (필수)</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="eyebrow-photos"
                  />
                  <Label
                    htmlFor="eyebrow-photos"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ImagePlus className="h-4 w-4 mr-2" />
                    {isUploading ? "업로드 중..." : "사진 선택"}
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
                          className="object-cover rounded-lg"
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
            <CardTitle className="text-lg">4. 예약 경로</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="reservationSource">예약 경로를 입력해주세요</Label>
              <Input
                id="reservationSource"
                placeholder="예: 인스타 광고, 소개 등"
                {...register("reservationSource")}
                className={cn(errors.reservationSource && "border-red-500")}
              />
              {errors.reservationSource && (
                <p className="text-red-500 text-sm">{errors.reservationSource.message}</p>
                      )}
                    </div>
          </CardContent>
        </Card>

        {/* 5. 희망 예약 타임 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">5. 희망 예약 타임</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="desiredTimes">희망 예약 타임을 입력해주세요 (여러 후보 기재해주세요)</Label>
              <Textarea
                id="desiredTimes"
                placeholder="예: 월요일 오후 2시, 화요일 오전 10시, 수요일 오후 3시"
                rows={3}
                {...register("desiredTimes")}
                className={cn(errors.desiredTimes && "border-red-500")}
              />
              {errors.desiredTimes && (
                <p className="text-red-500 text-sm">{errors.desiredTimes.message}</p>
              )}
                </div>
          </CardContent>
        </Card>

        {/* 6. 필독사항 동의 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">6. 필독사항 동의</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAgreed"
                  checked={watch("termsAgreed")}
                  onCheckedChange={(checked) => setValue("termsAgreed", checked as boolean)}
                />
                <Label htmlFor="termsAgreed" className="text-sm">
                  필독사항을 모두 확인하고 동의합니다
                  </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTermsModal(true)}
                  className="ml-2"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  필독사항 읽기
                </Button>
                    </div>
              {errors.termsAgreed && (
                <p className="text-red-500 text-sm">{errors.termsAgreed.message}</p>
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                제출 중...
                  </>
                ) : (
              "신청하기"
                )}
              </Button>
            </div>

        {submitError && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span>{submitError}</span>
              </div>
            )}
          </form>
    </div>
  );
}