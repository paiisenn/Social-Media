"use client";

import Image from "next/image";
import {
  MapPin,
  Calendar,
  Mail,
  Link as LinkIcon,
  MoreHorizontal,
  UserPlus,
  MessageCircle,
  UserCheck,
  Video,
  Flag,
  Ban,
  Share2,
  Copy,
  ChevronDown,
  UserMinus,
  Clock,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useRef, useState, useEffect } from "react";
import MainLayout from "@/app/main/layout";
import { PostCard } from "@/components/post/PostCard";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { UnfriendModal } from "@/components/ui/UnfriendModal";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthPromptModal } from "@/components/ui/AuthPromptModal";
import { userAPI } from "@/services/user.service";
import { postAPI } from "@/services/post.service";
import { userStatsAPI } from "@/services/user-stats.service";
import { friendsAPI } from "@/services/friends.service";
import { friendshipStatusAPI } from "@/services/friendship-status.service";

// No mock data needed

function generateUsername(name: string): string {
  return (
    "@" +
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
  });
}

function formatJoinDate(dateString: string | undefined | null) {
  if (!dateString) return "Chưa cập nhật";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Chưa cập nhật";
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `Tháng ${month} năm ${year}`;
  } catch (e) {
    return "Chưa cập nhật";
  }
}

function formatStatNumber(num: number): string {
  if (num === null || num === undefined) return "0";
  if (num >= 1000000)
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

export default function UserProfilePage() {
  const params = useParams(); // Get ID from URL
  const router = useRouter();
  const userId = params.id as string;
  const { toast } = useToast();
  const { user: currentUser, isAuthenticated } = useAuth();

  // State
  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [friendshipStatus, setFriendshipStatus] = useState<
    "none" | "pending_sent" | "pending_received" | "friends"
  >("none");
  const [activeTab, setActiveTab] = useState<
    "posts" | "friends" | "photos" | "videos"
  >("posts");
  const [isLoading, setIsLoading] = useState(true);

  // Unfriend modal state
  const [showUnfriendModal, setShowUnfriendModal] = useState(false);

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFeature, setAuthFeature] = useState("");

  const handleProtectedAction = (feature: string, action: () => void) => {
    if (!isAuthenticated) {
      setAuthFeature(feature);
      setShowAuthModal(true);
      return;
    }
    action();
  };

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    if (isOwnProfile) {
      router.replace("/profile");
    }
  }, [isOwnProfile, router]);

  // Refs for tab underline
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [tabUnderlineStyle, setTabUnderlineStyle] = useState({
    left: 0,
    width: 0,
  });

  // Menu dropdown state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast("Đã sao chép liên kết trang cá nhân!", "success");
        setIsMenuOpen(false);
      })
      .catch(() => {
        toast("Không thể sao chép liên kết.", "error");
      });
  };

  const handleMessage = () => {
    handleProtectedAction("nhắn tin", () => {
      router.push(
        `/main/messages?userId=${userId}&name=${encodeURIComponent(userData?.name || "")}&avatar=${encodeURIComponent(userData?.avatar || "/userAvatar.png")}`,
      );
    });
  };

  const handleReportUser = () => {
    handleProtectedAction("báo cáo người dùng", () => {
      setIsMenuOpen(false);
      alert("Đã gửi báo cáo người dùng. Chúng tôi sẽ xem xét.");
    });
  };

  const handleBlockUser = () => {
    handleProtectedAction("chặn người dùng", () => {
      setIsMenuOpen(false);
      alert(`Đã chặn người dùng ${userData?.name}.`);
    });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!userId || isOwnProfile) return;

      setIsLoading(true);
      try {
        // Fetch User Info, Stats, Posts, Friends, and Friendship Status in parallel
        const [
          userDataResult,
          statsResult,
          postsResult,
          friendsResult,
          friendshipResult,
        ] = await Promise.all([
          userAPI.getUserById(userId),
          userStatsAPI.getUserStats(userId),
          postAPI.getUserPosts(userId, 1, 20),
          friendsAPI.getUserFriends(userId),
          friendshipStatusAPI.checkFriendshipStatus(userId),
        ]);

        if (!isMounted) return;

        const actualUserData = userDataResult.data || userDataResult;
        setUserData({
          ...actualUserData,
          stats: statsResult.data || statsResult,
          username:
            actualUserData.username ||
            generateUsername(actualUserData.name || "user"),
          joinDate: actualUserData.createdAt,
          avatar: actualUserData.avatarUrl || "/userAvatar.png",
        });

        // Set friendship status
        setFriendshipStatus(friendshipResult.status);

        // Set friends list
        setFriends(
          Array.isArray(friendsResult)
            ? friendsResult
            : friendsResult?.data || [],
        );

        const mappedPosts = (postsResult.data || postsResult).map((p: any) => ({
          id: p.id,
          author: {
            id: p.author.id,
            name: p.author.name,
            avatar: p.author.avatarUrl || "/userAvatar.png",
            username: generateUsername(p.author.name || "user"),
          },
          content: p.content,
          image:
            p.mediaUrls &&
            p.mediaUrls.length > 0 &&
            !p.mediaUrls[0].endsWith(".mp4")
              ? p.mediaUrls[0]
              : undefined,
          video:
            p.mediaUrls &&
            p.mediaUrls.length > 0 &&
            p.mediaUrls[0].endsWith(".mp4")
              ? p.mediaUrls[0]
              : undefined,
          likes: p._count?.reactions || 0,
          comments: p._count?.comments || 0,
          shares: 0,
          timestamp: new Date(p.createdAt).toLocaleString("vi-VN"),
        }));

        setPosts(mappedPosts);

        // Extract photos and videos from posts
        const extractedPhotos: string[] = [];
        const extractedVideos: string[] = [];

        mappedPosts.forEach((post: any) => {
          if (post.image) extractedPhotos.push(post.image);
          if (post.video) extractedVideos.push(post.video);
        });

        setPhotos(extractedPhotos);
        setVideos(extractedVideos);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (isMounted) setUserData(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [userId, isOwnProfile]);

  useEffect(() => {
    const activeTabIndex = ["posts", "friends", "photos", "videos"].indexOf(
      activeTab,
    );
    const currentTab = tabsRef.current[activeTabIndex];
    if (currentTab) {
      setTabUnderlineStyle({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
      });
    }
  }, [activeTab]);

  const handleFriendAction = async () => {
    handleProtectedAction("kết bạn", async () => {
      try {
        if (friendshipStatus === "none") {
          // Gửi lời mời kết bạn
          await friendsAPI.sendFriendRequest(userId);
          setFriendshipStatus("pending_sent");
          toast("Đã gửi lời mời kết bạn!", "success");
        } else if (friendshipStatus === "pending_sent") {
          // Hủy lời mời (cần API)
          toast("Đã hủy lời mời kết bạn", "success");
          setFriendshipStatus("none");
        } else if (friendshipStatus === "pending_received") {
          // Chấp nhận lời mời
          await friendsAPI.acceptFriendRequest(userId);
          setFriendshipStatus("friends");
          toast("Đã chấp nhận lời mời kết bạn!", "success");

          // Reload friends list để cập nhật count
          const friendsData = await friendsAPI.getUserFriends(userId);
          setFriends(
            Array.isArray(friendsData) ? friendsData : friendsData?.data || [],
          );

          window.dispatchEvent(new Event("friends-updated"));
        } else if (friendshipStatus === "friends") {
          // Hiển thị modal xác nhận hủy kết bạn
          setShowUnfriendModal(true);
        }
      } catch (error: any) {
        toast(error.message || "Có lỗi xảy ra", "error");
      }
    });
  };

  const handleConfirmUnfriend = async () => {
    try {
      await friendsAPI.removeFriend(userId);
      setFriendshipStatus("none");
      toast("Đã hủy kết bạn", "success");

      // Reload friends list để cập nhật count
      const friendsData = await friendsAPI.getUserFriends(userId);
      setFriends(
        Array.isArray(friendsData) ? friendsData : friendsData?.data || [],
      );

      window.dispatchEvent(new Event("friends-updated"));
    } catch (error: any) {
      toast(error.message || "Có lỗi xảy ra", "error");
    }
  };

  const tabs = [
    {
      key: "posts",
      label: "Bài viết",
      icon: null,
      count: userData?.stats?.postsCount || posts.length || 0,
    },
    {
      key: "friends",
      label: "Bạn bè",
      icon: null,
      count: friends.length || userData?.stats?.friendsCount || 0,
    },
    {
      key: "photos",
      label: "Ảnh",
      icon: null,
      count: userData?.stats?.photosCount || photos.length || 0,
    },
    {
      key: "videos",
      label: "Video",
      icon: null,
      count: userData?.stats?.videosCount || videos.length || 0,
    },
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9622e]"></div>
        </div>
      </MainLayout>
    );
  }

  if (!userData) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy người dùng
          </h2>
          <p className="text-gray-500">
            Người dùng này không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 cursor-pointer text-[#f9622e] hover:underline"
          >
            Quay lại
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl">
        {/* Cover Photo Section */}
        <div className="relative mb-4 overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="relative h-80 bg-linear-to-r from-[#f9622e] to-[#ff8a50]">
            {userData.coverImage && (
              <Image
                src={userData.coverImage}
                alt="Cover Photo"
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Profile Info Section */}
          <div className="relative bg-white px-6 pb-4">
            {/* Avatar */}
            <div className="relative -mt-20 mb-4 inline-block">
              <Image
                src={userData.avatar}
                alt={userData.name || "User Avatar"}
                width={160}
                height={160}
                className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-lg bg-white"
              />
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {userData.name}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  {userData.username}
                </p>

                <div className="mb-3 text-gray-600">
                  <span className="font-semibold">
                    {formatStatNumber(userData.stats.followersCount)}
                  </span>{" "}
                  followers •{" "}
                  <span className="font-semibold">
                    {formatStatNumber(userData.stats.followingCount)}
                  </span>{" "}
                  following
                </div>

                {userData.bio && (
                  <p className="mb-3 max-w-2xl text-gray-700">{userData.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 flex-col">
                  {userData.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {userData.location}
                    </div>
                  )}
                  {userData.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {userData.email}
                    </div>
                  )}
                  {userData.website && (
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <a
                        href={userData.website}
                        className="text-[#f9622e] hover:underline"
                        target="_blank"
                      >
                        {userData.website.replace("https://", "")}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Đã tham gia từ{" "}
                    {formatJoinDate(userData.joinDate || userData.createdAt)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleFriendAction}
                  className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    friendshipStatus === "friends"
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : friendshipStatus === "pending_sent"
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : friendshipStatus === "pending_received"
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-[#f9622e] text-white hover:bg-[#e0501e]"
                  }`}
                >
                  {friendshipStatus === "friends" ? (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Bạn bè
                    </>
                  ) : friendshipStatus === "pending_sent" ? (
                    <>
                      <Clock className="h-4 w-4" />
                      Đã gửi lời mời
                    </>
                  ) : friendshipStatus === "pending_received" ? (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Chấp nhận kết bạn
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Kết bạn
                    </>
                  )}
                </button>
                {friendshipStatus === "friends" && (
                  <button
                    onClick={handleMessage}
                    className="flex items-center cursor-pointer gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Nhắn tin
                  </button>
                )}

                {/* More Options Dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 cursor-pointer h-full flex items-center justify-center"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="py-1">
                        <button
                          onClick={handleCopyLink}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          <Copy className="mr-3 h-4 w-4 text-gray-500" />
                          Sao chép liên kết
                        </button>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            toast("Tính năng chia sẻ đang phát triển", "info");
                          }}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          <Share2 className="mr-3 h-4 w-4 text-gray-500" />
                          Chia sẻ trang cá nhân
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleReportUser}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          <Flag className="mr-3 h-4 w-4 text-gray-500" />
                          Báo cáo trang cá nhân
                        </button>
                        <button
                          onClick={handleBlockUser}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <Ban className="mr-3 h-4 w-4 text-red-500" />
                          Chặn người dùng
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 rounded-lg bg-white shadow-sm">
          <div className="relative flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                ref={(el) => {
                  tabsRef.current[index] = el;
                }}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`relative z-10 flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap hover:bg-gray-50 ${
                  activeTab === tab.key
                    ? "text-[#f9622e]"
                    : "text-gray-500 cursor-pointer hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-1 text-xs transition-colors duration-300 ${
                      activeTab === tab.key
                        ? "bg-orange-100 text-[#f9622e]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {formatStatNumber(tab.count as number)}
                  </span>
                )}
              </button>
            ))}
            <div
              className="absolute bottom-0 h-0.5 bg-[#f9622e] transition-all duration-300 ease-in-out z-20"
              style={{
                left: tabUnderlineStyle.left,
                width: tabUnderlineStyle.width,
              }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div
          className={`flex gap-6 ${activeTab !== "posts" ? "flex-col" : "flex-row items-start"}`}
        >
          <div className={activeTab === "posts" ? "flex-1 min-w-0" : "w-full"}>
            {activeTab === "posts" && (
              <div className="space-y-4">
                {/* Post Creation Hidden for Visitor */}

                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      {...post}
                      isOwner={false} // Visitor is not owner
                    />
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-2xl text-center border border-gray-100 shadow-sm">
                    <p className="text-gray-500">Chưa có bài viết nào.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "friends" && (
              <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Bạn bè ({friends.length})
                </h2>
                {friends.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="rounded-lg border border-gray-100 p-3 text-center transition-shadow hover:shadow-md cursor-pointer"
                        onClick={() => router.push(`/profile/${friend.id}`)}
                      >
                        <Image
                          src={
                            friend.avatarUrl ||
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                          }
                          alt={friend.name || "Friend Avatar"}
                          width={100}
                          height={100}
                          className="mx-auto h-24 w-24 rounded-full object-cover bg-gray-50"
                        />
                        <p className="mt-3 font-semibold text-gray-900 line-clamp-2">
                          {friend.name}
                        </p>
                        {friend.id !== currentUser?.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProtectedAction("nhắn tin", () => {
                                router.push(
                                  `/main/messages?userId=${friend.id}&name=${friend.name}&avatar=${friend.avatarUrl || "/userAvatar.png"}`,
                                );
                              });
                            }}
                            className="mt-3 w-full rounded-md bg-blue-50 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            Nhắn tin
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Người dùng này chưa có bạn bè nào.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "photos" && (
              <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Ảnh ({photos.length})
                </h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {photos.length > 0 ? (
                    photos.map((photoUrl, i) => (
                      <div
                        key={i}
                        className="aspect-square overflow-hidden rounded-lg bg-gray-100 border border-gray-200 cursor-pointer group"
                        onClick={() => {
                          setSelectedImageIndex(i);
                          setIsLightboxOpen(true);
                        }}
                      >
                        <Image
                          src={photoUrl}
                          alt={`Photo ${i + 1}`}
                          width={300}
                          height={300}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      Người dùng này chưa có ảnh nào được chia sẻ.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "videos" && (
              <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Video ({videos.length})
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {videos.length > 0 ? (
                    videos.map((videoUrl, i) => (
                      <div
                        key={i}
                        className="aspect-video overflow-hidden rounded-lg bg-gray-100 border border-gray-200 cursor-pointer group"
                      >
                        <video
                          src={videoUrl}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          controls
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      Người dùng này chưa có video nào được chia sẻ.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        feature={authFeature}
      />

      {/* Unfriend Modal */}
      <UnfriendModal
        isOpen={showUnfriendModal}
        onClose={() => setShowUnfriendModal(false)}
        onConfirm={handleConfirmUnfriend}
        userName={userData?.name || ""}
        userAvatar={userData?.avatar || "/userAvatar.png"}
      />

      {/* Image Lightbox */}
      <ImageLightbox
        images={photos}
        initialIndex={selectedImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </MainLayout>
  );
}
