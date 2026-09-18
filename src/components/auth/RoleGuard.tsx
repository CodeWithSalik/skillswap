"use client";

import { useUser } from "@/context/UserContext";
import { UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  allowedRole: UserRole;
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const { role } = useUser();
  const router = useRouter();

  const isAuthorized = role === allowedRole;

  useEffect(() => {
    if (!isAuthorized) {
      router.replace("/");
    }
  }, [isAuthorized, router]);

  // If role is unauthorized, do not render children (prevents data fetching or form initialization)
  if (!isAuthorized) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center gap-2 font-mono text-xs text-[#847F75] animate-pulse">
          <span className="h-2 w-2 rounded-full bg-[#847F75]"></span>
          <span>Redirecting to workspace...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
