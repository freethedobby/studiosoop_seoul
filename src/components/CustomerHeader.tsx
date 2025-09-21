"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
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

interface CustomerHeaderProps {
  variant?: "default" | "transparent";
}

export default function CustomerHeader({
  variant = "default",
}: CustomerHeaderProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

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
                    <span>{t("nav.myInfo")}</span>
                  </Button>

                  {user.kycStatus === "approved" && (
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/user/reserve")}
                      className="flex items-center space-x-1 text-sm"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>{t("nav.reserve")}</span>
                    </Button>
                  )}
                </nav>
              </>
            )}
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Language Switcher - Always visible */}

            {/* Universal Hamburger Menu for All Users */}
            <div className="flex items-center space-x-1 sm:space-x-2">
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
                      <DropdownMenuItem onClick={() => router.push("/cost")}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        {t("nav.cost")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/dashboard")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        {t("nav.myInfo")}
                      </DropdownMenuItem>
                      {user.kycStatus === "approved" && (
                        <DropdownMenuItem
                          onClick={() => router.push("/user/reserve")}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {t("nav.reserve")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("nav.logout")}
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => router.push("/login")}>
                        {t("nav.login")}
                      </DropdownMenuItem>
                    </>
                  )}
                  {/* Language Switcher */}
                  <div className="px-2 py-1">
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
