"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Gọi logout function để xóa data
    logout();
    // Router sẽ redirect tới login tự động từ useAuth
  }, [logout]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Đang đăng xuất...</h1>
        <p className="text-gray-600">Vui lòng chờ</p>
      </div>
    </div>
  );
}
