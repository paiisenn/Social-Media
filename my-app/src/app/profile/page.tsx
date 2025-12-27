"use client";

import Image from "next/image";
import {
  Camera,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Edit3,
  Settings,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
} from "lucide-react";
import { useRef, useState } from "react";
import MainLayout from "@/app/main/layout";

const userData = {
  id: "1",
  firstName: "Pure",
  lastName: "Phat",
  username: "@purephat",
  email: "phat123@gmail.com",
  bio: "Lập trình viên và người sáng tạo nội dung đầy đam mê 🚀 Yêu thích lập trình, nhiếp ảnh và chia sẻ kiến ​​thức ✨",
  avatar: "/userAvatar.png",
  coverImage: "/userAvatar.png",
  location: "TP.Ho Chi Minh, Vietnam",
  website: "https://purephat.dev",
  joinDate: "2023-01-15",
  stats: {
    posts: 29,
    followers: 380,
    following: 128,
  },
  isFollowing: false,
  isOwnProfile: true,
};

const mockPosts = [
  {
    id: "1",
    content:
      "Vừa hoàn thành việc xây dựng một ứng dụng mạng xã hội tuyệt vời bằng Next.js 16! 🚀 Các tính năng mới thật đáng kinh ngạc.",
    image: "/userAvatar.png",
    createdAt: "2024-12-19T10:30:00Z",
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: true,
  },
  {
    id: "2",
    content:
      "Hoàng hôn hôm nay thật đẹp! Đôi khi bạn cần nghỉ ngơi khỏi việc lập trình và tận hưởng thiên nhiên 🌅",
    createdAt: "2024-12-18T18:45:00Z",
    likes: 45,
    comments: 12,
    shares: 7,
    isLiked: false,
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
  });
}

function formatPostDate(dateString: string) {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInHours = Math.floor(
    (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d`;
  return postDate.toLocaleDateString("vi-VN");
}

function formatStatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"posts" | "about" | "photos">(
    "posts"
  );
  const [isFollowing, setIsFollowing] = useState(userData.isFollowing);
  const [coverImage, setCoverImage] = useState(userData.coverImage);
  const [avatar, setAvatar] = useState(userData.avatar);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(
    userData.firstName + " " + userData.lastName
  );
  const [editBio, setEditBio] = useState(userData.bio);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleEditCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImage(url);
      // TODO: Gửi file lên server tại đây nếu muốn lưu lại
    }
  };

  const handleEditAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      // TODO: Gửi file lên server tại đây nếu muốn lưu lại
    }
  };

  return (
    <MainLayout>
      <div
        className={`mx-auto max-w-4xl ${
          theme === "dark" ? "dark bg-gray-900 text-white" : ""
        }`}
      >
        {/* Cover & Profile Section */}
        <div className="relative mb-6 overflow-hidden rounded-xl bg-white shadow-sm">
          {/* Cover Image */}
          <div className="relative h-48 bg-linear-to-r from-[#f9622e] to-[#ff8a50] md:h-64">
            {coverImage && (
              <Image
                src={coverImage}
                alt="Cover"
                fill
                className="object-cover opacity-20"
              />
            )}
            {userData.isOwnProfile && (
              <>
                <button
                  className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  onClick={handleEditCoverClick}
                >
                  <Camera className="h-4 w-4" />
                  Edit Cover Photo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={coverInputRef}
                  style={{ display: "none" }}
                  onChange={handleCoverChange}
                />
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4 inline-block">
              <Image
                src={avatar}
                alt={`${userData.firstName} ${userData.lastName}`}
                width={128}
                height={128}
                className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
              {userData.isOwnProfile && (
                <>
                  <button
                    className="absolute bottom-2 right-2 rounded-full bg-[#f9622e] p-2 text-white shadow-lg transition-colors hover:bg-[#e0501e]"
                    onClick={handleEditAvatarClick}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                </>
              )}
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userData.firstName} {userData.lastName}
                  </h1>
                  {userData.isOwnProfile && (
                    <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <p className="mb-3 text-gray-600">{userData.username}</p>

                {userData.bio && (
                  <p className="mb-4 whitespace-pre-line text-gray-700">
                    {userData.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {userData.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {userData.location}
                    </div>
                  )}
                  {userData.website && (
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <a
                        href={userData.website}
                        className="text-[#f9622e] hover:underline"
                      >
                        {userData.website.replace("https://", "")}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {formatDate(userData.joinDate)}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 flex gap-6">
                  <div className="text-center">
                    <div className="font-bold text-gray-900">
                      {formatStatNumber(userData.stats.posts)}
                    </div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">
                      {formatStatNumber(userData.stats.followers)}
                    </div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">
                      {formatStatNumber(userData.stats.following)}
                    </div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {userData.isOwnProfile ? (
                  <>
                    <button
                      className="flex items-center gap-2 rounded-lg bg-[#f9622e] px-4 py-2 text-white transition-colors hover:bg-[#e0501e]"
                      onClick={() => setShowEditProfile(true)}
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit Profile
                    </button>
                    <button
                      className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollow}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isFollowing
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-[#f9622e] text-white hover:bg-[#e0501e]"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                    <button className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 rounded-xl bg-white shadow-sm">
          <div className="flex border-b border-gray-200">
            {[
              { key: "about", label: "About" },
              { key: "photos", label: "Photos", count: 12 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveTab(tab.key as "posts" | "about" | "photos")
                }
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? "border-b-2 border-[#f9622e] text-[#f9622e]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.count && (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            {mockPosts.map((post) => (
              <div key={post.id} className="rounded-xl bg-white p-6 shadow-sm">
                {/* Post Header */}
                <div className="mb-4 flex items-center gap-3">
                  <Image
                    src={userData.avatar}
                    alt={userData.firstName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {userData.firstName} {userData.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPostDate(post.createdAt)}
                    </div>
                  </div>
                  <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-800">{post.content}</p>
                  {post.image && (
                    <div className="mt-3 overflow-hidden rounded-lg">
                      <Image
                        src={post.image}
                        alt="Post image"
                        width={600}
                        height={400}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-6">
                    <button
                      className={`flex items-center gap-2 transition-colors ${
                        post.isLiked
                          ? "text-red-500"
                          : "text-gray-500 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          post.isLiked ? "fill-current" : ""
                        }`}
                      />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 transition-colors hover:text-[#f9622e]">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 transition-colors hover:text-[#f9622e]">
                      <Share className="h-5 w-5" />
                      <span className="text-sm">{post.shares}</span>
                    </button>
                  </div>
                  <button className="text-gray-500 transition-colors hover:text-[#f9622e]">
                    <Bookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "about" && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">About</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Bio</h3>
                <p className="text-gray-600">{userData.bio}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Contact Information
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {userData.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={userData.website}
                      className="text-[#f9622e] hover:underline"
                    >
                      {userData.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "photos" && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Photos</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded-lg bg-gray-100"
                >
                  <Image
                    src={userData.avatar}
                    alt={`Photo ${i + 1}`}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {showEditProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="rounded-xl bg-white p-6 shadow-lg w-full max-w-md">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Edit Profile
              </h2>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Name</label>
                <input
                  className="w-full rounded border px-3 py-2"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Bio</label>
                <textarea
                  className="w-full rounded border px-3 py-2"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="rounded px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={() => setShowEditProfile(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded px-4 py-2 bg-[#f9622e] text-white hover:bg-[#e0501e]"
                  onClick={() => setShowEditProfile(false)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="rounded-xl bg-white p-6 shadow-lg w-full max-w-md dark:bg-gray-800 dark:text-white">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Settings
              </h2>
              {/* Các chức năng cài đặt */}
              <div className="mb-4 flex flex-col gap-3">
                <button className="w-full rounded bg-gray-100 px-4 py-2 text-left text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  Đổi mật khẩu
                </button>
                <button className="w-full rounded bg-gray-100 px-4 py-2 text-left text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  Thông báo
                </button>
                <button className="w-full rounded bg-gray-100 px-4 py-2 text-left text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  Ngôn ngữ
                </button>
                <button className="w-full rounded bg-red-100 px-4 py-2 text-left text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-700">
                  Đăng xuất
                </button>
              </div>
              <button
                className="mt-4 rounded px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={() => setShowSettings(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
