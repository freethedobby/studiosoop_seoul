"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import CustomerHeader from "@/components/CustomerHeader";
import AnimatedText from "@/components/AnimatedText";
import Footer from "@/components/Footer";

export default function Home() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen">
      <div className="relative z-20">
        <CustomerHeader variant="transparent" />
      </div>

      <main className="relative z-10">
        {/* Mobile: Full video with overlay, Desktop: Split layout */}
        <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row md:justify-center">
          {/* Mobile: Full video background, Desktop: Text on left */}
          <div className="relative flex-1 md:w-1/2 md:max-w-2xl md:flex-none">
            {/* Mobile: Video background */}
            <div className="relative h-full md:hidden">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              >
                <source src="/studiosoop_seoul.mp4" type="video/mp4" />
              </video>
              {/* Dark overlay for text readability */}
              <div className="bg-black/50 absolute inset-0"></div>
            </div>

            {/* Desktop: Text content with default background */}
            <div className="hidden h-full md:flex md:items-center md:justify-center">
              <div className="w-full max-w-2xl px-8 py-16">
                <div className="text-left">
                  {/* Main Heading */}
                  <h1 className="text-gray-900 text-6xl font-black leading-tight tracking-tight lg:text-7xl">
                    <span className="text-[#A67B5B]">{t("studio.title")}</span>
                    <br />
                    <span className="text-gray-900">
                      <AnimatedText
                        text={t("studio.subtitle")}
                        delay={1000}
                        speed={100}
                        className="inline-block"
                      />
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-gray-600 mt-6 whitespace-pre-line text-xl font-medium leading-relaxed">
                    {t("studio.description")}
                  </p>

                  {/* CTA Button */}
                  <div className="mt-8 flex justify-start">
                    {loading ? (
                      <div className="w-48 animate-pulse bg-gray-200 h-14 rounded-2xl"></div>
                    ) : (
                      <Link href={user ? "/dashboard" : "/login"}>
                        <Button
                          size="lg"
                          className="shadow-2xl w-48 text-base group relative h-14 transform bg-[#A67B5B] font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[#A67B5B]/25"
                        >
                          <div className="absolute inset-0 rounded-2xl bg-[#8B6B4A] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                          <div className="relative flex items-center justify-center">
                            <ArrowRight className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                            <span>{t("studio.button")}</span>
                          </div>
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Title at very top */}
            <div className="absolute top-8 left-0 right-0 flex justify-center md:hidden">
              <div className="w-full max-w-2xl px-6">
                <div className="text-center">
                  <h1 className="text-3xl font-black leading-tight tracking-tight text-white drop-shadow-2xl">
                    <span className="text-[#A67B5B]">{t("studio.title")}</span>
                    <br />
                    <span className="text-white">
                      <AnimatedText
                        text={t("studio.subtitle")}
                        delay={1000}
                        speed={100}
                        className="inline-block"
                      />
                    </span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Mobile: Button at very bottom */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center md:hidden">
              {loading ? (
                <div className="w-40 animate-pulse h-12 rounded-2xl bg-white/20"></div>
              ) : (
                <Link href={user ? "/dashboard" : "/login"}>
                  <Button
                    size="lg"
                    className="shadow-2xl w-40 group relative h-12 transform bg-[#A67B5B] text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[#A67B5B]/25"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-[#8B6B4A] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative flex items-center justify-center">
                      <ArrowRight className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      <span>{t("studio.button")}</span>
                    </div>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Desktop: Video on right with original aspect ratio */}
          <div className="relative hidden md:flex md:w-1/2 md:max-w-2xl md:flex-none md:items-center md:justify-center">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="max-h-[80vh] max-w-full object-contain"
            >
              <source src="/studiosoop_seoul.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
