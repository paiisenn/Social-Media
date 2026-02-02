"use client";

import {
  Settings,
  Bell,
  Globe,
  Shield,
  Save,
  ChevronRight,
  User,
  HelpCircle,
  Smartphone,
  Lock,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [saveLoading, setSaveLoading] = useState(false);
  const [settings, setSettings] = useState({
    privacy: "public",
    language: "vi",
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      messages: true,
      email_updates: false,
    },
    visibility: {
      showEmail: false,
      showPhone: false,
      allowMessagesFromAnyone: true,
      onlineStatus: true,
    },
    darkMode: false,
    autoPlayVideos: true,
  });

  const [saved, setSaved] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const handleToggle = (path: string) => {
    setSettings((prev) => {
      const keys = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newSettings: any = JSON.parse(JSON.stringify(prev));
      let obj = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = !obj[keys[keys.length - 1]];
      return newSettings;
    });
    setSaved(false);
  };

  const handleSave = () => {
    setSaveLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSaveLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const tabs = [
    { id: "general", label: "Chung", icon: Settings },
    { id: "account", label: "Tài khoản", icon: User },
    { id: "privacy", label: "Quyền riêng tư", icon: Globe },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "security", label: "Bảo mật", icon: Shield },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#f9622e]" />
                Cài đặt chung
              </h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Giao diện tối</p>
                    <p className="text-sm text-gray-500">
                      Chuyển sang nền tối để bảo vệ mắt
                    </p>
                  </div>
                  <Toggle
                    checked={settings.darkMode}
                    onChange={() => handleToggle("darkMode")}
                  />
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Ngôn ngữ</p>
                    <p className="text-sm text-gray-500">
                      Chọn ngôn ngữ hiển thị
                    </p>
                  </div>
                  <select
                    value={settings.language}
                    onChange={(e) =>
                      setSettings({ ...settings, language: e.target.value })
                    }
                    className="rounded-lg border cursor-pointer border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#f9622e] focus:outline-none focus:ring-1 focus:ring-[#f9622e]"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                    <option value="jp">Japanese</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Tự động phát video
                    </p>
                    <p className="text-sm text-gray-500">
                      Video sẽ tự động phát khi lướt tin
                    </p>
                  </div>
                  <Toggle
                    checked={settings.autoPlayVideos}
                    onChange={() => handleToggle("autoPlayVideos")}
                  />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#f9622e]" />
                Hỗ trợ
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors text-left">
                  <span className="text-gray-700 font-medium">
                    Trung tâm trợ giúp
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors text-left">
                  <span className="text-gray-700 font-medium">
                    Báo cáo vấn đề
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-[#f9622e]" />
                Thông tin tài khoản
              </h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#f9622e] hover:bg-orange-50/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 group-hover:text-[#f9622e] transition-colors">
                        Pure Phat
                      </p>
                      <p className="text-sm text-gray-500">
                        phat123@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-lg cursor-pointer bg-gray-100 text-sm font-medium text-gray-700 group-hover:bg-[#f9622e] group-hover:text-white transition-all">
                    Chỉnh sửa
                  </div>
                </button>

                <div className="pt-4 space-y-3">
                  <button className="w-full flex items-center cursor-pointer justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                    <span className="text-gray-700 font-medium">
                      Lịch sử tải xuống
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center cursor-pointer justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                    <span className="text-gray-700 font-medium">
                      Các phiên đăng nhập
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-4 shadow-sm border bg-red-50/30 border-red-100">
              <h3 className="text-lg font-bold text-red-600 mb-2">Vùng nguy hiểm</h3>
              <p className="text-sm text-gray-600 mb-4">
                Các hành động này không thể hoàn tác, vui lòng cân nhắc kỹ.
              </p>
              <button className="px-4 py-2 rounded-lg cursor-pointer bg-white border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors text-sm shadow-sm">
                Xóa tài khoản vĩnh viễn
              </button>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#f9622e]" />
                Quyền riêng tư & Hiển thị
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Chế độ xem hồ sơ
                  </label>
                  <select
                    value={settings.privacy}
                    onChange={(e) =>
                      setSettings({ ...settings, privacy: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 transition-colors focus:border-[#f9622e] focus:outline-none focus:ring-1 focus:ring-[#f9622e]"
                  >
                    <option value="public">Công khai (Mọi người đều thấy)</option>
                    <option value="friends">Chỉ bạn bè (Người theo dõi)</option>
                    <option value="private">Riêng tư (Chỉ mình tôi)</option>
                  </select>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Hiển thị Email</p>
                      <p className="text-sm text-gray-500">
                        Cho phép người khác thấy email
                      </p>
                    </div>
                    <Toggle
                      checked={settings.visibility.showEmail}
                      onChange={() => handleToggle("visibility.showEmail")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Hiển thị SĐT
                      </p>
                      <p className="text-sm text-gray-500">
                        Cho phép người khác thấy số điện thoại
                      </p>
                    </div>
                    <Toggle
                      checked={settings.visibility.showPhone}
                      onChange={() => handleToggle("visibility.showPhone")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Trạng thái hoạt động
                      </p>
                      <p className="text-sm text-gray-500">
                        Hiển thị khi bạn đang online
                      </p>
                    </div>
                    <Toggle
                      checked={settings.visibility.onlineStatus}
                      onChange={() => handleToggle("visibility.onlineStatus")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#f9622e]" />
                Tùy chọn thông báo
              </h3>
              <div className="space-y-1">
                {[
                  {
                    key: "likes",
                    label: "Thông báo yêu thích",
                    sub: "Khi có người thích bài viết của bạn",
                  },
                  {
                    key: "comments",
                    label: "Thông báo bình luận",
                    sub: "Khi có người bình luận bài viết",
                  },
                  {
                    key: "follows",
                    label: "Thông báo theo dõi mới",
                    sub: "Khi có người bắt đầu theo dõi bạn",
                  },
                  {
                    key: "messages",
                    label: "Thông báo tin nhắn",
                    sub: "Khi bạn nhận được tin nhắn mới",
                  },
                  {
                    key: "email_updates",
                    label: "Email cập nhật",
                    sub: "Nhận tin tức mới nhất qua email",
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex cursor-pointer items-center justify-between rounded-xl p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.sub}</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={
                          settings.notifications[
                          item.key as keyof typeof settings.notifications
                          ]
                        }
                        onChange={() =>
                          handleToggle(`notifications.${item.key}`)
                        }
                      />
                      <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#f9622e] transition-colors peer-focus:ring-2 peer-focus:ring-[#f9622e] peer-focus:ring-offset-2"></div>
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#f9622e]" />
                Đăng nhập & Bảo mật
              </h3>
              <div className="space-y-3">
                <button className="flex w-full items-center cursor-pointer justify-between rounded-xl p-4 border border-gray-100 hover:border-[#f9622e] hover:bg-orange-50/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Đổi mật khẩu</p>
                      <p className="text-sm text-gray-500">
                        Cập nhật mật khẩu định kỳ để bảo mật
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                <button className="flex w-full items-center cursor-pointer justify-between rounded-xl p-4 border border-gray-100 hover:border-[#f9622e] hover:bg-orange-50/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        Xác thực hai yếu tố (2FA)
                      </p>
                      <p className="text-sm text-gray-500">
                        Thêm lớp bảo mật thứ hai
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>      {loading ? (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9622e] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    ) : (<div className="mx-auto max-w-5xl py-1">
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-[#f9622e] rounded-xl shadow-lg shadow-[#f9622e]/20">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-[#f9622e] uppercase tracking-wider">Cài đặt</span>
        </div>
        <p className="text-gray-500 mt-2">
          Quản lý tùy chọn cá nhân và bảo mật tài khoản
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-4">
            <div className="space-y-1 rounded-2xl bg-white p-3 shadow-sm border border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === tab.id
                    ? "bg-[#f9622e] text-white shadow-md shadow-orange-200 scale-[1.02]"
                    : "text-gray-600 cursor-pointer hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <tab.icon
                    className={`h-5 w-5 ${activeTab === tab.id ? "text-white" : "text-gray-500"
                      }`}
                  />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Save Button */}
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className="w-full flex items-center cursor-pointer justify-center gap-2 rounded-xl bg-[#f9622e] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-[#e0501e] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
              >
                {saveLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saved ? "Đã lưu!" : "Lưu cài đặt"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
    )}
    </>
  );
}

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`relative inline-flex cursor-pointer h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#f9622e] focus:ring-offset-2 ${checked ? "bg-[#f9622e]" : "bg-gray-200"
      }`}
  >
    <span
      className={`${checked ? "translate-x-6" : "translate-x-1"
        } inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200`}
    />
  </button>
);
