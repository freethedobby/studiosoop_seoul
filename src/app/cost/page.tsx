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
    <div className="min-h-screen">
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

            <h1 className="text-gray-900 text-3xl font-bold">시술 비용 안내</h1>
            <p className="text-gray-600 mt-2">
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
                className="h-auto w-full rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
