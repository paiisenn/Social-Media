"use client";

import MainLayout from "@/app/main/layout";
import MessagesContent from "@/app/main/messages/page";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MessagesPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9622e]"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <MessagesContent />
    </MainLayout>
  );
}
