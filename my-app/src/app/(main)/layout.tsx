"use client";

import { Navbar } from "@/components/layout/Navbar";
import { SidebarLeft } from "@/components/layout/SidebarLeft";
import { SidebarRight } from "@/components/layout/SidebarRight";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Setup WebSocket connection
  useSocket(currentUserId);

  useEffect(() => {
    setMounted(true);

    // Get current user
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUserId(userData.id);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }

    // Listen for auth changes
    const handleAuthChange = () => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          setCurrentUserId(userData.id);
        } catch (e) {
          console.error("Error parsing user:", e);
          setCurrentUserId(null);
        }
      } else {
        setCurrentUserId(null);
      }
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 bg-gray-100">
        <SidebarLeft />
        <main className="flex-1 px-6 py-4">{children}</main>
        <SidebarRight />
      </div>
    </div>
  );
}
