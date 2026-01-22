"use client";

import { Navbar } from "@/components/layout/Navbar";
import { SidebarLeft } from "@/components/layout/SidebarLeft";
import { SidebarRight } from "@/components/layout/SidebarRight";
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout component ensures auth changes are propagated
  // Users can access this page even without token (guest mode)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
