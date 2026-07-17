"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import authService from "@/services/auth.service";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-slate-500">
        Loading application...
      </p>
    </main>
  );
}