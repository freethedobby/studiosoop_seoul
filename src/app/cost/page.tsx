"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import CustomerHeader from "@/components/CustomerHeader";
import Footer from "@/components/Footer";

export default function CostPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <CustomerHeader />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>뒤로가기</span>
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900">시술 비용 안내</h1>
            <p className="mt-2 text-gray-600">
              STUDIOSOOP SEOUL의 시술 비용을 확인해보세요
            </p>
          </div>

          {/* Cost Image */}
          <div className="relative">
            <div className="bg-gray-100 rounded-lg p-4">
              <Image
                src="/soop_cost.jpg"
                alt="시술 비용 안내"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              비용 안내 사항
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>• 모든 가격은 부가세 포함 가격입니다</p>
              <p>• 시술 전 상담을 통해 정확한 비용을 안내해드립니다</p>
              <p>• 개인별 맞춤 디자인에 따라 추가 비용이 발생할 수 있습니다</p>
              <p>• 재시술 시 할인 혜택이 적용됩니다</p>
              <p>• 예약 및 문의: 010-1234-5678</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
