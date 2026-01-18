"use client";

import Link from "next/link";
import {
  type LucideIcon,
  User,
  Bookmark,
  Users2,
  Settings,
  LogOut,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const sidebarNavItems = [
  { href: "/profile", icon: User, label: "Trang cá nhân" },
  { href: "/groups", icon: Users2, label: "Nhóm" },
  { href: "/saved", icon: Bookmark, label: "Đã lưu" },
  { href: "/settings", icon: Settings, label: "Cài đặt" },
  { href: "/logout", icon: LogOut, label: "Đăng xuất", isDanger: true },
];

const trendingItems = [
    { href: "/trending/vietnam", label: "#SEAGames32" },
    { href: "/trending/suthat", label: "#SựThật" },
    { href: "/trending/congnghe", label: "#TechReview" },
    { href: "/trending/amnhac", label: "#HayTraoChoAnh" },
];

function SidebarItem({
  href,
  icon: Icon,
  label,
  active,
  isDanger = false,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  isDanger?: boolean;
}) {
  const activeClasses = "bg-[#f9622e]/20 text-[#f9622e]";
  const inactiveClasses = "hover:bg-gray-400/20 hover:text-[#f9622e]";
  const dangerClasses = "text-red-600 hover:bg-red-600/10";

  return (
    <li>
      <Link
        href={href}
        className={`group flex items-center gap-3 rounded-md px-3 py-2 hover:translate-x-1 text-sm text-gray-700 transition-all duration-200 ${
          active ? activeClasses : isDanger ? dangerClasses : inactiveClasses
        }`}
      >
        <Icon className={`h-5 w-5 transition-colors duration-200 ${active ? "text-[#f9622e]" : isDanger ? "text-red-600" : "text-gray-500 group-hover:text-[#f9622e]"}`} />
        <span className="font-medium">{label}</span>
      </Link>
    </li>
  );
}

/**
 * Định dạng số lớn thành dạng rút gọn (K, M).
 * Ví dụ: 1234 -> 1.2K, 2348300 -> 2.3M
 * @param num Số cần định dạng
 * @returns Chuỗi đã được định dạng
 */
function formatStatNumber(num: number): string {
  if (num >= 1000000) {
    // Làm tròn đến 1 chữ số thập phân và loại bỏ .0 nếu có
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export function SidebarLeft() {
  const pathname = usePathname();
  // Dữ liệu người dùng giả lập
  const user = {
    avatar: "/userAvatar.png",
    firstName: "Nice",
    lastName: "User",
    email: "test123@gmail.com",
    stats: {
      posts: 29,
      followers: 380, 
      following: 12800, 
    },
  };

  return (
    <aside className="custom-scrollbar sticky top-14 hidden h-[calc(100vh-3.5rem)] w-76 flex-col gap-4 overflow-y-auto bg-gray-50 p-4 md:flex">
      {/* Khối Profile và Chức năng */}
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4 ml-1">
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={64}
            height={64}
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-[#f9622e]/50 ring-offset-2"
          />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-gray-800">{`${user.firstName} ${user.lastName}`}</h2>
            <p className="truncate text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="flex w-full justify-around rounded-lg bg-gray-50 p-2">
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-800">{formatStatNumber(user.stats.posts)}</span>
            <span className="text-xs text-gray-500">Bài viết</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-800">{formatStatNumber(user.stats.followers)}</span>
            <span className="text-xs text-gray-500">Follower</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-800">{formatStatNumber(user.stats.following)}</span>
            <span className="text-xs text-gray-500">Đã follow</span>
          </div>
        </div>

        <nav className="w-full">
          <ul className="space-y-1">
            {sidebarNavItems.map((item) => (
              <SidebarItem
                key={item.href}
                {...item}
                active={
                  pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/")
                }
              />
            ))}
          </ul>
        </nav>
      </div>

      {/* Khối Trending */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#f9622e]" />
            <h3 className="font-bold text-gray-800">Đang thịnh hành</h3>
        </div>
        <ul className="space-y-2">
            {trendingItems.map(item => (
                <li key={item.href}>
                    <Link href={item.href} className="text-sm duration-200 text-gray-600 hover:text-[#f9622e] hover:underline">
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
      </div>
    </aside>
  );
}
