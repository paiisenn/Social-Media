"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f9622e] border-t-transparent shadow-lg" />
                    <p className="text-gray-500 font-medium animate-pulse">Đang tải...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
