"use client";

import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Users,
  Share,
  Bell,
  Trash2,
  CheckCheck,
  Clock,
  Filter,
} from "lucide-react";
import MainLayout from "@/app/main/layout";
import { useState } from "react";

const mockNotifications = [
  {
    id: "n1",
    type: "like",
    user: { name: "Linh Nguyễn", avatar: "/userAvatar.png" },
    action: "đã thích bài viết của bạn",
    content: "Vừa hoàn thành việc xây dựng một ứng dụng mạng xã hội tuyệt vời...",
    timestamp: "2024-12-23T10:30:00Z",
    read: false,
  },
  {
    id: "n2",
    type: "comment",
    user: { name: "Minh Phạm", avatar: "/userAvatar.png" },
    action: "đã bình luận trên bài viết của bạn",
    content: "Thật tuyệt vời! Bạn dùng công nghệ gì vậy?",
    timestamp: "2024-12-23T09:15:00Z",
    read: false,
  },
  {
    id: "n3",
    type: "follow",
    user: { name: "Hà Anh", avatar: "/userAvatar.png" },
    action: "đã bắt đầu theo dõi bạn",
    timestamp: "2024-12-22T18:45:00Z",
    read: true,
  },
  {
    id: "n4",
    type: "share",
    user: { name: "Quốc Tuấn", avatar: "/userAvatar.png" },
    action: "đã chia sẻ bài viết của bạn",
    content: "Lập trình viên và người sáng tạo nội dung đầy đam mê...",
    timestamp: "2024-12-22T14:20:00Z",
    read: true,
  },
  {
    id: "n5",
    type: "system",
    user: { name: "Hệ thống", avatar: "/SocialzZz-Logo.png" },
    action: "Chào mừng bạn đến với SocialzZz",
    content: "Hãy cập nhật hồ sơ của bạn để mọi người biết đến bạn nhiều hơn nhé!",
    timestamp: "2024-12-20T08:00:00Z",
    read: true,
  },
];

function getNotificationIcon(type: string) {
  switch (type) {
    case "like":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 ring-2 ring-white shadow-sm">
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
        </div>
      );
    case "comment":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 ring-2 ring-white shadow-sm">
          <MessageCircle className="h-4 w-4 text-blue-500 fill-blue-500" />
        </div>
      );
    case "follow":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 ring-2 ring-white shadow-sm">
          <Users className="h-4 w-4 text-purple-500 fill-purple-500" />
        </div>
      );
    case "share":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 ring-2 ring-white shadow-sm">
          <Share className="h-4 w-4 text-green-500 fill-green-500" />
        </div>
      );
    case "system":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 ring-2 ring-white shadow-sm">
          <Bell className="h-4 w-4 text-[#f9622e] fill-[#f9622e]" />
        </div>
      );
    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white shadow-sm">
          <Bell className="h-4 w-4 text-gray-500" />
        </div>
      );
  }
}

function formatNotificationDate(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl py-2">
        <div className="mb-6 rounded-2xl bg-linear-to-r from-orange-50 to-white p-6 shadow-sm border border-orange-100/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-[#f9622e] rounded-xl shadow-lg shadow-[#f9622e]/20">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-extrabold text-[#f9622e] uppercase tracking-wider">
                  Thông báo
                </h1>
              </div>
              <p className="text-gray-500 font-medium ml-1">
                Cập nhật hoạt động mới nhất của bạn
              </p>
            </div>

            {notifications.some((n) => !n.read) && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-100/50 text-[#f9622e] hover:bg-[#f9622e] hover:text-white font-medium transition-all cursor-pointer group"
              >
                <CheckCheck className="h-4 w-4" />
                <span className="text-sm">Đánh dấu tất cả đã đọc</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 p-1 bg-gray-100/80 rounded-xl">
            <button
              onClick={() => setFilter("all")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${filter === "all"
                  ? "bg-white text-[#f9622e] shadow-md"
                  : "text-gray-500 hover:text-gray-900"
                }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${filter === "unread"
                  ? "bg-white text-[#f9622e] shadow-md"
                  : "text-gray-500 hover:text-gray-900"
                }`}
            >
              <Filter className="w-4 h-4" />
              Chưa đọc
            </button>
          </div>

        </div>

        <div className="space-y-5 pb-10">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-16 text-center shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-500">
              <div className="h-24 w-24 bg-orange-50/50 rounded-full flex items-center justify-center mb-6 ring-8 ring-orange-50/30">
                <Bell className="h-12 w-12 text-[#f9622e]/80" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Không có thông báo nào
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                Hiện tại bạn chưa có thông báo mới nào. Hãy kết nối thêm với mọi
                người để nhận được nhiều tương tác hơn nhé!
              </p>
            </div>
          ) : (
            filtered.map((notif, index) => (
              <div
                key={notif.id}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleMarkAsRead(notif.id)}
                className={`group relative flex gap-5 rounded-2xl p-5 transition-all duration-300 cursor-pointer border hover:shadow-lg hover:-translate-y-1 animate-in slide-in-from-bottom-2 fade-in ${notif.read
                    ? "bg-white border-gray-100 hover:border-orange-200 shadow-sm"
                    : "bg-orange-50/30 border-orange-100 hover:border-orange-200 shadow-md shadow-orange-100/50"
                  }`}
              >
                <div className="relative shrink-0 self-start mt-1">
                  <Image
                    src={notif.user.avatar}
                    alt={notif.user.name}
                    width={60}
                    height={60}
                    className="h-14 w-14 rounded-full object-cover ring-4 ring-white shadow-md transition-transform group-hover:scale-105"
                  />
                  <div className="absolute -bottom-2 -right-2 transform scale-90 group-hover:scale-110 transition-transform">
                    {getNotificationIcon(notif.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-10">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[15px] text-gray-800 leading-relaxed">
                      <span className="font-bold text-gray-900 duration-200 group-hover:text-[#f9622e] transition-colors text-base">
                        {notif.user.name}
                      </span>{" "}
                      <span className="text-gray-600">{notif.action}</span>
                    </p>

                    {notif.content && (
                      <div className="rounded-xl bg-gray-50/80 p-3 text-sm text-gray-600 italic border-l-4 border-[#f9622e]/50 group-hover:border-[#f9622e] group-hover:bg-orange-50/30 transition-all shadow-inner">
                        &quot;{notif.content}&quot;
                      </div>
                    )}

                    <p className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-wide pt-1">
                      <Clock className="h-3 w-3" />
                      {formatNotificationDate(notif.timestamp)}
                    </p>
                  </div>
                </div>

                {!notif.read && (
                  <div className="absolute top-6 right-6 h-3 w-3 rounded-full bg-[#f9622e] ring-4 ring-orange-100 shadow-sm animate-pulse" />
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notif.id);
                  }}
                  className="absolute cursor-pointer bottom-5 right-5 p-2 rounded-xl text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all transform hover:scale-110 shadow-sm border border-transparent hover:border-red-100"
                  title="Xóa thông báo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
