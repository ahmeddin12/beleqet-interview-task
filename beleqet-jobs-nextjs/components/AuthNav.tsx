"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthNav() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="hidden sm:block h-9 w-24 rounded-full bg-border/60 animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brandGreen/10 text-brandGreen">
            <User className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium text-ink max-w-[120px] truncate">
            {user.firstName}
          </span>
        </div>
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-medium text-ink hover:border-brandGreen hover:text-brandGreen transition-colors"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden sm:inline-block text-sm font-medium text-ink hover:text-brandGreen transition-colors"
    >
      Login / Sign Up
    </Link>
  );
}
