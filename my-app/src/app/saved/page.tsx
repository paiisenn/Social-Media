"use client";

import Image from "next/image";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Share,
  Trash2,
  Search,
  Grid,
  List,
  Clock,
  FolderOpen
} from "lucide-react";
import MainLayout from "@/app/main/layout";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { postAPI } from "@/services/post.service";
import { useToast } from "@/context/ToastContext";

// --- Helper for conditional classes ---
function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

type SavedPost = {
  id: string;
  author: { id: string; name: string; avatar: string; username: string };
  content: string;
  image?: string;
  createdAt: string;
  savedAt: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  type: "post" | "image" | "video";
  reactionType?: string | null;
};

function generateUsername(name: string): string {
  return "@" + name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

// --- Utilities ---
function formatPostDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function formatRelativeTime(dateString: string) {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  return formatPostDate(dateString);
}


export default function SavedPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { loading, isAuthenticated } = useAuth();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeTypeTab, setActiveTypeTab] = useState<"all" | "post" | "image" | "video">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSavedPosts = async () => {
    try {
      setIsPageLoading(true);
      const data = await postAPI.getSavedPosts();

      const mapped = data.map((p: any) => ({
        id: p.id,
        author: {
          id: p.author?.id,
          name: p.author?.name || "Người dùng",
          avatar: p.author?.avatarUrl || "/userAvatar.png",
          username: generateUsername(p.author?.name || "user")
        },
        content: p.content,
        image: p.mediaUrls?.[0],
        type: p.mediaUrls?.[0]?.endsWith('.mp4') ? "video" : (p.mediaUrls?.length > 0 ? "image" : "post"),
        createdAt: p.createdAt,
        savedAt: p.createdAt,
        likes: p._count?.reactions || 0,
        comments: p._count?.comments || 0,
        shares: 0,
        reactionType: (() => {
          const lr = postAPI.getLocalReaction(p.id);
          if (lr === "NONE") return null;
          return lr || (p.reactions?.[0]?.type || null);
        })(),
        isLiked: (() => {
          const lr = postAPI.getLocalReaction(p.id);
          if (lr === "NONE") return false;
          return !!(lr || p.reactions?.[0]);
        })(),
      }));

      setSavedPosts(mapped);
    } catch (error) {
      console.error("Failed to fetch saved posts:", error);
      toast("Không thể tải danh sách bài viết đã lưu", "error");
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        fetchSavedPosts();
      }
    }
  }, [loading, isAuthenticated, router]);

  const handleRemove = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await postAPI.toggleSavePost(id);
    setSavedPosts((prev) => prev.filter((p) => p.id !== id));
    toast("Đã bỏ lưu bài viết", "success");
  };

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const post = savedPosts.find(p => p.id === id);
      if (!post) return;

      const isRemove = post.isLiked;
      const newReaction = isRemove ? null : "LIKE";

      await postAPI.toggleReaction(id, "LIKE");

      // Save locally
      postAPI.setLocalReaction(id, newReaction);

      setSavedPosts((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              isLiked: !p.isLiked,
              reactionType: newReaction,
              likes: p.isLiked ? Math.max(0, p.likes - 1) : p.likes + 1
            };
          }
          return p;
        })
      );
    } catch (error) {
      toast("Có lỗi xảy ra", "error");
    }
  };

  const filteredPosts = useMemo(() => {
    let filtered = savedPosts;

    if (activeTypeTab !== "all") {
      filtered = filtered.filter(post => post.type === activeTypeTab);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [savedPosts, activeTypeTab, searchQuery]);

  return (
    <MainLayout>
      {isPageLoading || loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f9622e] mx-auto mb-4"></div>
            <p className="text-gray-600 font-bold">Đang tải nội dung...</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl pb-1 px-4">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-[#f9622e] rounded-xl shadow-lg shadow-[#f9622e]/20">
                  <Bookmark className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-bold text-[#f9622e] uppercase tracking-wider">Mục đã lưu</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                Kho lưu trữ của bạn
              </h1>
              <p className="mt-2 text-gray-500 font-medium text-sm max-w-lg">
                Xem lại những khoảnh khắc đáng nhớ • {savedPosts.length} mục đã lưu
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-80">
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-[#f9622e]/20 to-[#f9622e]/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-[#f9622e]/30 transition-colors">
                  <Search className="h-5 w-5 ml-3 text-gray-400 group-focus-within:text-[#f9622e] transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm nội dung đã lưu..."
                    className="w-full border-none outline-none bg-transparent py-3 pl-2 pr-4 text-gray-800 placeholder:text-gray-400 focus:ring-0 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="sticky top-14 z-20 bg-white/95 backdrop-blur-sm rounded-2xl p-3 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100/50">
            <div className="flex p-1 bg-gray-100/80 gap-1.5 rounded-xl overflow-x-auto max-w-full no-scrollbar w-full sm:w-auto">
              {[
                { id: "all", label: "Tất cả" },
                { id: "post", label: "Bài viết" },
                { id: "image", label: "Media" },
                { id: "video", label: "Video" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTypeTab(tab.id as typeof activeTypeTab)}
                  className={classNames(
                    "px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                    activeTypeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                      : "text-gray-500 hover:text-gray-900 cursor-pointer hover:bg-white/50"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
              <button
                onClick={() => setViewMode("list")}
                className={classNames(
                  "p-2.5 rounded-xl transition-all",
                  viewMode === "list" ? "bg-[#f9622e]/10 text-[#f9622e]" : "text-gray-400 cursor-pointer hover:text-gray-600 hover:bg-gray-50"
                )}
                title="Danh sách"
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={classNames(
                  "p-2.5 rounded-xl transition-all",
                  viewMode === "grid" ? "bg-[#f9622e]/10 text-[#f9622e]" : "text-gray-400 cursor-pointer hover:text-gray-600 hover:bg-gray-50"
                )}
                title="Lưới"
              >
                <Grid className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="min-h-[40vh]">
            {filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-500 text-center">
                <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <FolderOpen className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa tìm thấy nội dung</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  {searchQuery
                    ? `Không có kết quả nào cho "${searchQuery}"`
                    : "Danh sách trống. Hãy lưu lại những nội dung thú vị nhé!"}
                </p>
              </div>
            ) : (
              <div className={classNames(
                "grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" : "grid-cols-1"
              )}>
                {filteredPosts.map((post, index) => (
                  <div
                    key={post.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => router.push(`/#post-${post.id}`)}
                    className={classNames(
                      "group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300 ease-out cursor-pointer",
                      viewMode === "list" ? "flex flex-col md:flex-row gap-0" : "flex flex-col"
                    )}
                  >
                    {/* Image Section */}
                    {(post.image || viewMode === "grid") && (
                      <div className={classNames(
                        "relative overflow-hidden bg-gray-100",
                        viewMode === "list" && post.image ? "md:w-64 shrink-0 h-48 md:h-auto" : "w-full h-56",
                        viewMode === "list" && !post.image ? "hidden" : "block"
                      )}>
                        {post.image ? (
                          <>
                            <Image
                              src={post.image}
                              alt="Post Media"
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                            {post.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-xl">
                                  <Bookmark className="w-8 h-8 text-white fill-white" />
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-6 text-center">
                            <p className="text-gray-400 text-sm font-medium line-clamp-4 italic">
                              &quot;{post.content.substring(0, 150)}...&quot;
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="flex-1 p-5 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-50"
                          />
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#f9622e] transition-colors">{post.author.name}</h3>
                            <div className="flex items-center text-xs text-gray-500 gap-1">
                              <span>{formatRelativeTime(post.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleRemove(post.id, e)}
                          className="p-2 text-gray-300 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                          title="Bỏ lưu"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className={classNames(
                        "text-gray-700 leading-relaxed mb-4 text-sm",
                        viewMode === "grid" ? "line-clamp-3" : ""
                      )}>
                        {post.content}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleLike(post.id, e)}
                            className={classNames(
                              "flex items-center cursor-pointer gap-1.5 px-2 py-1 rounded-lg transition-all duration-200",
                              post.isLiked ? "text-[#f9622e] bg-orange-50" : "text-gray-400 hover:text-[#f9622e] hover:bg-orange-50"
                            )}
                          >
                            {post.reactionType === "LOVE" ? (
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            ) : post.reactionType === "HAHA" ? (
                              <span className="text-sm scale-90">😆</span>
                            ) : post.reactionType === "WOW" ? (
                              <span className="text-sm scale-90">😮</span>
                            ) : post.reactionType === "SAD" ? (
                              <span className="text-sm scale-90">😢</span>
                            ) : post.reactionType === "ANGRY" ? (
                              <span className="text-sm scale-90">😡</span>
                            ) : (
                              <Heart className={classNames("h-4 w-4", post.isLiked && "fill-current")} />
                            )}
                            <span className="text-xs font-semibold">{post.likes}</span>
                          </button>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-gray-400">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-xs font-semibold">{post.comments}</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-gray-400">
                            <Share className="h-4 w-4" />
                            <span className="text-xs font-semibold">{post.shares}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatRelativeTime(post.savedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
