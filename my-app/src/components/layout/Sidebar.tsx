"use client";

import Link from "next/link";
import {
  type LucideIcon,
  Home,
  User,
  Users,
  FileText,
  Bookmark,
  TrendingUp,
  Users2,
  CalendarDays,
  Store,
  Settings,
  History,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

const navItems = [
  { href: "/", icon: Home, label: "Trang chủ" },
  { href: "/profile", icon: User, label: "Trang cá nhân" },
  { href: "/friends", icon: Users, label: "Bạn bè" },
  { href: "/pages", icon: FileText, label: "Trang" },
  { href: "/saved", icon: Bookmark, label: "Đã lưu" },
  { href: "/explore", icon: TrendingUp, label: "Khám phá" },
];

const secondaryNavItems = [
  { href: "/groups", icon: Users2, label: "Nhóm" },
  { href: "/events", icon: CalendarDays, label: "Sự kiện" },
  { href: "/marketplace", icon: Store, label: "Marketplace" },
  { href: "/settings", icon: Settings, label: "Cài đặt" },
  { href: "/activity", icon: History, label: "Nhật ký hoạt động" },
];

function SidebarItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
}) {
  const activeClasses = "bg-[#f9622e] text-primary-foreground";
  const inactiveClasses = "hover:bg-[#f9622e]/10 hover:text-[#f9622e]";

  return (
    <li>
      <Link
        href={href}
        className={`group flex items-center gap-4 rounded-lg px-3 py-2 text-foreground transition-all duration-300 ${
          active ? activeClasses : inactiveClasses
        }`}
      >
        <Icon className={`h-5 w-5 transition-colors duration-300 ${active ? "" : "group-hover:text-[#f9622e]"}`} />
        <span className="font-medium">{label}</span>
      </Link>
    </li>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r bg-background py-4 pl-4 md:flex">
      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full flex-1 overflow-y-auto pr-3 pt-2 py-1">
        <nav className="flex flex-1 flex-col gap-2">
          <button className="flex w-[80%] ml-5 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#f9622e] px-3 py-3 font-semibold text-primary-foreground transition-all hover:scale-105 hover:bg-[#f9622e]/90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-plus"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            <span>Đăng bài</span>
          </button>
          <div className="my-2 h-px bg-gray-300" />
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <SidebarItem
                key={index}
                {...item}
                active={pathname === item.href}
              />
            ))}
          </ul>
          <div className="h-px bg-gray-300" />
          <ul className="space-y-2">
            {secondaryNavItems.map((item, index) => (
              <SidebarItem
                key={index}
                {...item}
                active={pathname === item.href}
              />
            ))}
          </ul>
        </nav>
      </div>
      <Footer />
    </aside>
  );
}
