"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import NotificationCenter from "@/components/NotificationCenter";
import AdminModeToggle from "@/components/AdminModeToggle";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Calendar, LogOut, Menu, DollarSign } from "lucide-react";
import { signOutUser } from "@/lib/firebase";
import LanguageSwitcher from "./LanguageSwitcher";

interface CustomerHeaderProps {
  variant?: "default" | "transparent";
}

export default function CustomerHeader({
  variant = "default",
}: CustomerHeaderProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const headerClasses =
    variant === "transparent"
      ? "bg-transparent backdrop-blur-sm border-b border-white/20"
      : "shadow-sm border-b bg-white";

  if (loading) {
    return (
      <header className={headerClasses}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="animate-pulse bg-gray-200 w-32 h-8 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={headerClasses}>
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo variant="header" />

            {user && (
              <>
                <div className="w-px bg-gray-300 ml-4 hidden h-6 sm:block" />

                <nav className="ml-4 hidden items-center space-x-2 sm:flex">
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center space-x-1 text-sm"
                  >
                    <User className="h-4 w-4" />
                    <span>내정보</span>
                  </Button>

                  {user.kycStatus === "approved" && (
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/user/reserve")}
                      className="flex items-center space-x-1 text-sm"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>예약하기</span>
                    </Button>
                  )}
                </nav>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Universal Hamburger Menu for All Users */}
            <div className="flex items-center space-x-2">
              <NotificationCenter variant="customer" />
              <AdminModeToggle />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {user ? (
                    <>
                      <DropdownMenuItem
                        disabled
                        className="cursor-default opacity-100"
                      >
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/cost")}
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        비용안내
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/dashboard")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        내정보
                      </DropdownMenuItem>
                      {user.kycStatus === "approved" && (
                        <DropdownMenuItem
                          onClick={() => router.push("/user/reserve")}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          예약하기
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        로그아웃
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => router.push("/cost")}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        비용안내
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/login")}>
                        로그인
                      </DropdownMenuItem>
                    </>
                  )}
                  {/* Language Switcher */}
                  <div className="px-2 py-1">
                    <LanguageSwitcher />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
