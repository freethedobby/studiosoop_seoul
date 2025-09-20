"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface MembershipBadgeProps {
  kycStatus: "pending" | "approved" | "rejected" | "none";
  treatmentDone?: boolean;
}

const createMembershipInfo = (t: (key: string) => string) => ({
  traveler: {
    icon: "🔓",
    label: t("membership.unverifiedCustomer"),
    description: t("membership.verifyDescription"),
    variant: "secondary" as const,
  },
  private: {
    icon: "✅",
    label: t("membership.reservableMember"),
    description: t("membership.verifiedDescription"),
    variant: "outline" as const,
  },
  signature: {
    icon: "🌟",
    label: t("membership.signatureMember"),
    description: t("membership.vipDescription"),
    variant: "default" as const,
  },
});

export function MembershipBadge({
  kycStatus,
  treatmentDone = false,
}: MembershipBadgeProps) {
  const { t } = useLanguage();

  const membershipInfoMap = createMembershipInfo(t);

  const getMembershipInfo = () => {
    if (treatmentDone && kycStatus === "approved") {
      return membershipInfoMap.signature;
    }
    if (kycStatus === "approved") {
      return membershipInfoMap.private;
    }
    return membershipInfoMap.traveler;
  };

  const membershipInfo = getMembershipInfo();

  return (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-2">
        <Badge variant={membershipInfo.variant} className="text-sm">
          {membershipInfo.icon} {membershipInfo.label}
        </Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0 hover:bg-transparent"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{membershipInfo.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {(kycStatus === "none" || kycStatus === "rejected") && (
        <Link href="/kyc">
          <Button variant="default" size="sm" className="whitespace-nowrap">
            {t("membership.verify")}
          </Button>
        </Link>
      )}
    </div>
  );
}
