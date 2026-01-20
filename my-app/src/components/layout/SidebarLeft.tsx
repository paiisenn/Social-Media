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
  X,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

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
  onClick,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  isDanger?: boolean;
  onClick?: () => void;
}) {
  const activeClasses = "bg-[#f9622e]/20 text-[#f9622e]";
  const inactiveClasses = "hover:bg-gray-400/20 hover:text-[#f9622e]";
  const dangerClasses = "text-red-600 hover:bg-red-600/10";

  return (
    <li>
      {onClick ? (
        <button
          onClick={onClick}
          className={`w-full group cursor-pointer flex items-center gap-3 rounded-md px-3 py-2 hover:translate-x-1 text-sm text-gray-700 transition-all duration-200 ${isDanger ? dangerClasses : inactiveClasses
            }`}
        >
          <Icon className={`h-5 w-5 transition-colors duration-200 ${isDanger ? "text-red-600" : "text-gray-500 group-hover:text-[#f9622e]"}`} />
          <span className="font-medium">{label}</span>
        </button>
      ) : (
        <Link
          href={href}
          className={`group flex items-center gap-3 rounded-md px-3 py-2 hover:translate-x-1 text-sm text-gray-700 transition-all duration-200 ${active ? activeClasses : isDanger ? dangerClasses : inactiveClasses
            }`}
        >
          <Icon className={`h-5 w-5 transition-colors duration-200 ${active ? "text-[#f9622e]" : isDanger ? "text-red-600" : "text-gray-500 group-hover:text-[#f9622e]"}`} />
          <span className="font-medium">{label}</span>
        </Link>
      )}
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
  const router = useRouter();
  const { toast } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // Dữ liệu người dùng giả lập
  const { user, isAuthenticated, loading, logout } = useAuth();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    logout();
    setShowLogoutModal(false);
    toast("Bạn đã đăng xuất thành công!", "success");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <aside className="custom-scrollbar sticky top-14 hidden h-[calc(100vh-3.5rem)] w-76 flex-col gap-4 overflow-y-auto bg-gray-50 p-4 md:flex">
        {/* Khối Profile và Chức năng */}
        {/* Khối Profile và Chức năng */}
        {!loading && (
          <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-4 ml-1">
                  <Image
                    src={user.avatar || "/userAvatar.png"}
                    alt="User Avatar"
                    width={64}
                    height={64}
                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-[#f9622e]/50 ring-offset-2"
                  />
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold text-gray-800">{user.name}</h2>
                    <p className="truncate text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex w-full justify-around rounded-lg bg-gray-50 p-2">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-800">{formatStatNumber(29)}</span>
                    <span className="text-xs text-gray-500">Bài viết</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-800">{formatStatNumber(380)}</span>
                    <span className="text-xs text-gray-500">Follower</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-800">{formatStatNumber(12800)}</span>
                    <span className="text-xs text-gray-500">Đã follow</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center space-y-3 py-2">
                <div className="rounded-full bg-orange-50 p-3">
                  <User className="h-8 w-8 text-[#f9622e]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Bạn chưa đăng nhập?</h3>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    Đăng nhập để kết nối với bạn bè và chia sẻ những khoảnh khắc thú vị!
                  </p>
                </div>
                <Link
                  href="/login"
                  className="w-full rounded-lg bg-[#f9622e] py-2 text-sm font-bold text-white transition-all hover:bg-[#ff7240] hover:shadow-lg hover:shadow-orange-500/30"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <nav className="w-full">
                <ul className="space-y-1">
                  {sidebarNavItems.map((item) => (
                    <SidebarItem
                      onClick={item.label === "Đăng xuất" ? handleLogoutClick : undefined}
                      key={item.href}
                      {...item}
                      active={
                        pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/")
                      }
                    />
                  ))}
                </ul>
              </nav>
            )}
          </div>
        )}

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

      {/* Logout Confirmation Modal - Rendered at top level */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleLogoutCancel}
          />

          {/* Modal */}
          <div className="relative z-100000 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-full">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Xác nhận đăng xuất</h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">
                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không? Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 px-4 py-2.5 cursor-pointer text-sm duration-200 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-2.5 cursor-pointer text-sm duration-200 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-lg shadow-red-600/30"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
