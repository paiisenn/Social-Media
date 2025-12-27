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
  Users,
  UserPlus,
  MessageCircle,
  UserCheck,
  Globe,
  Lock,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { useRef, useState } from "react";
import MainLayout from "@/app/main/layout";
import { CreatePostProfile } from "@/components/post/CreatePostProfile";
import { PostCard } from "@/components/post/PostCard";

const userData = {
  id: "1",
  firstName: "Pure",
  lastName: "Phat",
  username: "@purephat",
  email: "phat123@gmail.com",
  bio: "Lập trình viên và người sáng tạo nội dung đầy đam mê 🚀 Yêu thích lập trình, nhiếp ảnh và chia sẻ kiến ​​thức ✨",
  avatar: "/userAvatar.png",
  coverImage:
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=400&fit=crop",
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
    author: {
      name: "Pure Phat",
      avatar: "/userAvatar.png",
      username: "@purephat",
    },
    content:
      "Vừa hoàn thành việc xây dựng một ứng dụng mạng xã hội tuyệt vời bằng Next.js 16! 🚀 Các tính năng mới thật đáng kinh ngạc.",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop",
    likes: 245,
    comments: 32,
    shares: 12,
    timestamp: "2 giờ trước",
  },
  {
    id: "2",
    author: {
      name: "Pure Phat",
      avatar: "/userAvatar.png",
      username: "@purephat",
    },
    content:
      "Hoàng hôn hôm nay thật đẹp! Đôi khi bạn cần nghỉ ngơi khỏi việc lập trình và tận hưởng thiên nhiên 🌅",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    likes: 156,
    comments: 18,
    shares: 8,
    timestamp: "1 ngày trước",
  },
  {
    id: "3",
    author: {
      name: "Pure Phat",
      avatar: "/userAvatar.png",
      username: "@purephat",
    },
    content: "Coding session với một tách cà phê ☕ Không có gì tuyệt vời hơn!",
    likes: 89,
    comments: 24,
    shares: 5,
    timestamp: "3 ngày trước",
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
  });
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
  const [activeTab, setActiveTab] = useState<
    "posts" | "about" | "friends" | "photos" | "videos"
  >("posts");
  const [isFollowing, setIsFollowing] = useState(userData.isFollowing);
  const [coverImage, setCoverImage] = useState(userData.coverImage);
  const [avatar, setAvatar] = useState(userData.avatar);
  const [posts, setPosts] = useState(mockPosts);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

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
    }
  };

  const handleCreatePost = (postData: {
    content: string;
    media: { url: string; type: "image" | "video" } | null;
    privacy: string;
  }) => {
    const newPost = {
      id: Date.now().toString(),
      author: {
        name: "Pure Phat",
        avatar: "/userAvatar.png",
        username: "@purephat",
      },
      content: postData.content,
      image: postData.media?.type === "image" ? postData.media.url : undefined,
      video: postData.media?.type === "video" ? postData.media.url : undefined,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: "Vừa xong",
    };
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      setPosts(posts.filter((post) => post.id !== postToDelete));
      setPostToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditPost = (postId: string, newContent: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, content: newContent } : post
      )
    );
  };

  const handleReportPost = (postId: string) => {
    alert("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét bài viết này.");
  };

  const tabs = [
    { key: "posts", label: "Posts", icon: null },
    { key: "about", label: "About", icon: null },
    {
      key: "friends",
      label: "Friends",
      icon: null,
      count: userData.stats.followers,
    },
    { key: "photos", label: "Photos", icon: null, count: 12 },
    { key: "videos", label: "Videos", icon: null, count: 3 },
  ];

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl">
        {/* Cover Photo Section */}
        <div className="relative mb-4 overflow-hidden rounded-lg bg-white shadow-sm">
          {/* Cover Image */}
          <div className="relative h-80 bg-gradient-to-r from-[#f9622e] to-[#ff8a50]">
            {coverImage && (
              <Image
                src={coverImage}
                alt="Cover"
                fill
                className="object-cover"
              />
            )}
            {userData.isOwnProfile && (
              <>
                <button
                  className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg transition-colors hover:bg-gray-50"
                  onClick={handleEditCoverClick}
                >
                  <Camera className="h-4 w-4" />
                  Edit cover photo
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

          {/* Profile Info Section */}
          <div className="relative bg-white px-6 pb-4">
            {/* Avatar */}
            <div className="relative -mt-20 mb-4 inline-block">
              <Image
                src={avatar}
                alt={`${userData.firstName} ${userData.lastName}`}
                width={160}
                height={160}
                className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-lg"
              />
              {userData.isOwnProfile && (
                <>
                  <button
                    className="absolute bottom-2 right-2 rounded-full bg-gray-100 p-2 text-gray-600 shadow-lg transition-colors hover:bg-gray-200"
                    onClick={handleEditAvatarClick}
                  >
                    <Camera className="h-5 w-5" />
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

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {userData.firstName} {userData.lastName}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  {userData.username}
                </p>

                <div className="mb-3 text-gray-600">
                  <span className="font-semibold">
                    {formatStatNumber(userData.stats.followers)}
                  </span>{" "}
                  followers •{" "}
                  <span className="font-semibold">
                    {formatStatNumber(userData.stats.following)}
                  </span>{" "}
                  following
                </div>

                {userData.bio && (
                  <p className="mb-3 max-w-2xl text-gray-700">{userData.bio}</p>
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
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {userData.isOwnProfile ? (
                  <>
                    <button className="flex items-center gap-2 rounded-lg bg-[#f9622e] px-4 py-2 font-medium text-white transition-colors hover:bg-[#e0501e]">
                      <Edit3 className="h-4 w-4" />
                      Edit Profile
                    </button>
                    <button className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200">
                      <Settings className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollow}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isFollowing
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-[#f9622e] text-white hover:bg-[#e0501e]"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="h-4 w-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          Follow
                        </>
                      )}
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200">
                      <MessageCircle className="h-4 w-4" />
                      Message
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

        {/* Navigation Tabs */}
        <div className="mb-6 rounded-lg bg-white shadow-sm">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
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

        {/* Content Area */}
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-80 shrink-0">
            <div className="space-y-4">
              {/* Intro Card */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Intro
                </h3>
                <div className="space-y-3 text-sm">
                  {userData.bio && (
                    <p className="text-gray-700">{userData.bio}</p>
                  )}
                  {userData.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      Lives in{" "}
                      <span className="font-medium">{userData.location}</span>
                    </div>
                  )}
                  {userData.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <LinkIcon className="h-4 w-4" />
                      <a
                        href={userData.website}
                        className="text-[#f9622e] hover:underline"
                      >
                        {userData.website.replace("https://", "")}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Joined {formatDate(userData.joinDate)}
                  </div>
                </div>
                {userData.isOwnProfile && (
                  <button className="mt-3 w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
                    Edit details
                  </button>
                )}
              </div>

              {/* Photos Preview */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Photos
                  </h3>
                  <button className="text-sm text-[#f9622e] hover:underline">
                    See all photos
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden rounded-lg bg-gray-100"
                    >
                      <Image
                        src={`https://images.unsplash.com/photo-${
                          1500000000000 + i
                        }?w=150&h=150&fit=crop`}
                        alt={`Photo ${i + 1}`}
                        width={150}
                        height={150}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Friends Preview */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Friends
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      {userData.stats.followers}
                    </span>
                  </h3>
                  <button className="text-sm text-[#f9622e] hover:underline">
                    See all friends
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      name: "Nguyễn Văn A",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenA",
                    },
                    {
                      name: "Trần Thị B",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=TranB",
                    },
                    {
                      name: "Lê Minh C",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=LeMinh",
                    },
                    {
                      name: "Phạm Thị D",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=PhamD",
                    },
                    {
                      name: "Hoàng Văn E",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=HoangE",
                    },
                    {
                      name: "Vũ Thị F",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=VuF",
                    },
                  ].map((friend, i) => (
                    <div key={i} className="text-center">
                      <Image
                        src={friend.avatar}
                        alt={friend.name}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <p className="mt-1 text-xs font-medium text-gray-900 line-clamp-2">
                        {friend.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "posts" && (
              <div className="space-y-4">
                {/* Create Post - Only show if own profile */}
                {userData.isOwnProfile && (
                  <CreatePostProfile onCreatePost={handleCreatePost} />
                )}

                {/* Posts Feed */}
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      {...post}
                      isOwner={userData.isOwnProfile}
                      onDelete={() => handleDeletePost(post.id)}
                      onEdit={(newContent) =>
                        handleEditPost(post.id, newContent)
                      }
                      onReport={() => handleReportPost(post.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  About {userData.firstName}
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">Bio</h3>
                    <p className="text-gray-700">{userData.bio}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">
                      Contact Info
                    </h3>
                    <div className="space-y-2">
                      {userData.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>Lives in {userData.location}</span>
                        </div>
                      )}
                      {userData.website && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <LinkIcon className="h-4 w-4" />
                          <a
                            href={userData.website}
                            className="text-[#f9622e] hover:underline"
                          >
                            {userData.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">
                      Basic Info
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(userData.joinDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "friends" && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Friends ({userData.stats.followers})
                </h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-3 text-center">
                      <Image
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Friend${i}`}
                        alt={`Friend ${i + 1}`}
                        width={80}
                        height={80}
                        className="mx-auto h-20 w-20 rounded-lg object-cover"
                      />
                      <p className="mt-2 font-medium text-gray-900">
                        Friend {i + 1}
                      </p>
                      <p className="text-sm text-gray-500">5 mutual friends</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "photos" && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Photos</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden rounded-lg bg-gray-100"
                    >
                      <Image
                        src={`https://images.unsplash.com/photo-${
                          1500000000000 + i
                        }?w=300&h=300&fit=crop`}
                        alt={`Photo ${i + 1}`}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "videos" && (
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Videos</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="relative aspect-video overflow-hidden rounded-lg bg-gray-100"
                    >
                      <Image
                        src={`https://images.unsplash.com/photo-${
                          1600000000000 + i
                        }?w=400&h=225&fit=crop`}
                        alt={`Video ${i + 1}`}
                        width={400}
                        height={225}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="rounded-full bg-white/90 p-3">
                          <Video className="h-6 w-6 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xác nhận xóa bài viết?
              </h3>
              <p className="text-gray-600 mb-6">
                Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn
                khỏi profile của bạn.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
