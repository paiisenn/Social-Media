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
  const activeClasses = "bg-primary text-primary-foreground";
  const inactiveClasses = "hover:bg-accent hover:text-accent-foreground";

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-4 rounded-lg px-3 py-2 text-foreground transition-colors duration-200 ${
          active ? activeClasses : inactiveClasses
        }`}
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
      </Link>
    </li>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
      <div className="flex flex-1 flex-col gap-4">
        <button className="flex w-4/5 ml-4 cursor-pointer items-center bg-[#F9622E] justify-center gap-2 rounded-lg bg-primary px-3 py-3 font-semibold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90">
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
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <SidebarItem
                key={index}
                {...item}
                active={pathname === item.href}
              />
            ))}
          </ul>
          <div className="my-4 h-px bg-border bg-gray-400" />
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
    </aside>
  );
}
