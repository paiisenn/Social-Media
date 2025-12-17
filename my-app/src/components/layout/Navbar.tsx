"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Home,
  PlaySquare,
  Users,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  User,
  Bookmark, 
  Globe,  
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";


export function Navbar() {
  const pathname = usePathname();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  const closeProfileMenu = () => setProfileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Sử dụng flexbox để dễ dàng quản lý và responsive hơn */}
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">

        {/* === LEFT: Logo & Search === */}
        <div className="flex flex-1 items-center gap-2 md:flex-none">
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
          <div className="relative hidden w-full max-w-xs lg:block">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm trên SocialzZz..."
              className="w-full rounded-full border-none bg-gray-100 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F9622E]"
            />
          </div>
        </div>

        {/* === CENTER: Main Navigation === */}
        <nav className="hidden flex-1 items-center justify-center md:flex h-full">
          <MainNavLink href="/" active={pathname === "/"} tooltip="Trang chủ">
            <Home className="h-7 w-7" strokeWidth={pathname === "/" ? 2.5 : 2} />
          </MainNavLink>
          <MainNavLink href="/watch" active={pathname === "/watch"} tooltip="Xem Video">
            <PlaySquare className="h-7 w-7" strokeWidth={pathname === "/watch" ? 2.5 : 2} />
          </MainNavLink>
          <MainNavLink href="/friends" active={pathname === "/friends"} tooltip="Bạn bè">
            <Users className="h-7 w-7" strokeWidth={pathname === "/friends" ? 2.5 : 2} />
          </MainNavLink>
        </nav>

        {/* === RIGHT: Actions & Profile === */}
        <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
          <ActionIcon href="/messages" tooltip="Tin nhắn">
            <MessageSquare className="h-6 w-6" />
          </ActionIcon>
          <ActionIcon href="/notifications" tooltip="Thông báo">
            <Bell className="h-6 w-6" />
          </ActionIcon>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} // Toggle menu on click
              className={`group relative cursor-pointer flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:bg-gray-200 ${isProfileMenuOpen ? "ring-2 ring-[#F9622E]" : ""}`}
              aria-label="Mở menu người dùng"
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
            >
              <Image
                src="/userAvatar.png"
                alt="User Avatar"
                width={40} 
                height={40}
                className="rounded-full object-cover"
              />
            </button>

            {/* Dropdown Menu */}
            <div // Thêm z-index để đảm bảo dropdown hiển thị trên các phần tử khác
              className={`absolute right-0 top-full mt-2 w-60 origin-top-right transform rounded-lg bg-white p-1 shadow-xl ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-in-out z-50
                ${isProfileMenuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
            >
              {/* User Info Section */}
              <Link href="/profile" onClick={closeProfileMenu} className="block w-full rounded-md p-2 text-left transition-colors duration-150 hover:bg-gray-100">
                <p className="font-bold flex items-center gap-2">
                  <span className="text-left ml-0.5">Nguyễn Văn A</span> 
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="text-left ml-0.5">nguyenvana@gmail.com</span>
                </p>
              </Link>
              <div className="my-1 h-px bg-gray-200" />

              {/* Main Menu Items Section */}
              <Link href="/profile" onClick={closeProfileMenu} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100">
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
              <Link href="/saved-posts" onClick={closeProfileMenu} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100">
                <Bookmark className="h-4 w-4" />
                <span>Saved Posts</span>
              </Link>
              <Link href="/settings" onClick={closeProfileMenu} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <Link href="/language" onClick={closeProfileMenu} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100">
                <Globe className="h-4 w-4" />
                <span>Language</span>
              </Link>
              <div className="my-1 h-px bg-gray-200" />

              {/* Logout Section */}
              <Link href="/logout" onClick={closeProfileMenu} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors duration-150 hover:bg-red-100 hover:text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Overlay to close menu on outside click */}
        {isProfileMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={closeProfileMenu}
          />
        )}
      </div>
    </header>
  );
}

// Component cho các link điều hướng chính ở giữa
function MainNavLink({ href, active, tooltip, children }: { href: string; active: boolean; tooltip: string; children: React.ReactElement }) {
  const activeClasses = "text-[#F9622E]";
  const inactiveClasses = "text-gray-500 hover:bg-gray-100 hover:text-gray-700";
  return (
    <Link href={href} className="group relative flex h-full w-28 items-center justify-center" aria-label={tooltip}>
      <div className={`relative flex h-full w-full items-center justify-center rounded-lg transition-colors duration-200 ${active ? activeClasses : inactiveClasses}`}>
        {children}
      </div>
      {active && <span className="absolute bottom-0 h-1 w-full rounded-t-full bg-[#F9622E]"></span>}
      <div className="absolute top-full mt-2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">{tooltip}</div>
    </Link>
  );
}

// Component cho các icon hành động bên phải
function ActionIcon({ href, tooltip, children }: { href: string; tooltip: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:bg-gray-200" aria-label={tooltip}>
      {children}
      <div className="absolute top-full mt-2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">{tooltip}</div>
    </Link>
  );
}
