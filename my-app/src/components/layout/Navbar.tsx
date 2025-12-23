"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Home,
  PlaySquare,
  Users,
  Bell, // Thêm icon Bell
} from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

const mainNavLinks = [
  { href: "/", icon: Home, tooltip: "Trang chủ" },
  { href: "/watch", icon: PlaySquare, tooltip: "Xem video" },
  { href: "/groups", icon: Users, tooltip: "Nhóm" },
  { href: "/notifications", icon: Bell, tooltip: "Thông báo" },
];


export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Đặt container là relative để định vị cho nav ở giữa */}
      <div className="container relative mx-auto flex h-14 items-center justify-between gap-4 px-4">

        {/* === LEFT: Logo & Search === */}
        <div className="flex items-center gap-2">
          <Link href="/" className="shrink-0">
            <Image
              src="/socialzZz-logo.png"
              alt="SocialzZz Logo"
              width={40}
              height={40}
              priority
              className="h-10 w-10"
            />
          </Link>
          <Link href="/" className="hidden md:block">
            <h1 className="text-2xl font-bold text-[#f9622e]">SocialzZz</h1>
          </Link>
        </div>

        {/* === CENTER: Main Navigation === */}
        {/* Sử dụng absolute positioning để căn giữa một cách hoàn hảo */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-4 px-4 md:flex">
          {mainNavLinks.map((link) => (
            <MainNavLink key={link.href} href={link.href} active={pathname === link.href} tooltip={link.tooltip}>
              <link.icon className="h-6 w-6" />
            </MainNavLink>
          ))}
        </nav>

        {/* === RIGHT: Actions & Profile === */}
        <div className="flex items-center justify-end gap-4">
          {/* Search Bar */}
          <div className="relative hidden w-full max-w-75 md:block">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full rounded-full border-none bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F9622E]"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

// Component cho các link điều hướng chính ở giữa
function MainNavLink({ href, active, tooltip, children }: { href: string; active: boolean; tooltip: string; children: React.ReactElement }) {
  const activeClasses = "bg-[#F9622E] text-white";
  const inactiveClasses = "text-gray-500 hover:bg-gray-100 hover:text-[#F9622E]";
  return (
    <Link href={href} className="group relative" aria-label={tooltip}>
      <div className={`flex h-10 w-24 items-center justify-center rounded-lg transition-colors duration-200 ${active ? activeClasses : inactiveClasses}`}>
        {children}
      </div>
      <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">{tooltip}</div>
    </Link>
  );
}
