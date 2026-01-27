"use client"

import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Bookmark,
  Trash2,
  Edit,
  X,
  Check,
  EyeOff,
  Flag,
  Send,
  Undo2,
  ThumbsUp,
  Loader2,
  Clock,
  ArrowUpLeft,
  ChevronDown,
  Filter
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { AuthPromptModal } from "@/components/ui/AuthPromptModal";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { postAPI } from "@/services/post.service";

interface PostCardProps {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    username?: string;
  };
  content: string;
  image?: string;
  video?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  initialIsLiked?: boolean; // Keep for compatibility, but prefer reaction type if available
  reactionType?: "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY" | null;
  initialIsSaved?: boolean;
  isOwner?: boolean;
  onDelete?: () => void;
  onEdit?: (newContent: string) => void;
  onReport?: () => void;
}

interface Comment {
  id: string;
  author: { id?: string; name: string; avatar: string };
  content: string;
  timestamp: string;
  createdAt: string; // ISO string for sorting
  likes: number;
  isLiked?: boolean;
  reactionType?: "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY" | null;
}

// Helper function to generate username from name
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

export function PostCard({
  id,
  author,
  content,
  image,
  video,
  likes: initialLikes,
  comments,
  shares,
  timestamp,
  initialIsLiked = false,
  initialIsSaved = false,
  isOwner = false,
  onDelete,
  onEdit,
  onReport,
  reactionType: initialReactionType = null,
}: PostCardProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  // If API only returns boolean isLiked, default to "LIKE" if true
  const [currentReaction, setCurrentReaction] = useState<string | null>(
    initialReactionType || (initialIsLiked ? "LIKE" : null)
  );
  const [isSaved, setIsSaved] = useState(false); // Initialized in useEffect
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [commentCount, setCommentCount] = useState(comments);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isHidden, setIsHidden] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalFeature, setAuthModalFeature] = useState("");

  // Modals state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("spam");

  // Comment states
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentSortOrder, setCommentSortOrder] = useState<"newest" | "oldest">("newest");

  const menuRef = useRef<HTMLDivElement>(null);

  // Initialize saved state and local reaction status
  useEffect(() => {
    setIsSaved(postAPI.isPostSaved(id));

    // Check for local reaction override
    const localReaction = postAPI.getLocalReaction(id);
    if (localReaction) {
      setCurrentReaction(localReaction === "NONE" ? null : localReaction);
    }
  }, [id]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch comments from API when opened
  useEffect(() => {
    if (showComments && commentsList.length === 0 && commentCount > 0) {
      const fetchComments = async () => {
        setIsLoadingComments(true);
        try {
          const response = await postAPI.getComments(id);
          const data = Array.isArray(response) ? response : (response as any).data || [];

          const mappedComments = data.map((c: any) => ({
            id: c.id,
            author: {
              id: c.author?.id,
              name: c.author?.name || "Người dùng",
              avatar: c.author?.avatarUrl || "/userAvatar.png"
            },
            content: c.content,
            createdAt: c.createdAt,
            timestamp: new Date(c.createdAt).toLocaleString("vi-VN"),
            likes: c._count?.reactions || 0,
            reactionType: c.reactions?.[0]?.type || null,
            isLiked: !!c.reactions?.[0]
          }));
          setCommentsList(mappedComments);
        } catch (error) {
          console.error("Error fetching comments:", error);
        } finally {
          setIsLoadingComments(false);
        }
      };
      fetchComments();
    }
  }, [showComments, id, commentCount]);

  // Sort comments when order changes
  const sortedComments = [...commentsList].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return commentSortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const [isReacting, setIsReacting] = useState(false);

  const handleReaction = async (type: string = "LIKE") => {
    if (!isAuthenticated) {
      setAuthModalFeature("bày tỏ cảm xúc");
      setShowAuthModal(true);
      return;
    }

    if (isReacting) return;
    setIsReacting(true);

    const previousReaction = currentReaction;
    const isRemove = previousReaction === type;
    const newReaction = isRemove ? null : type;

    try {
      // Optimistic update
      setCurrentReaction(newReaction);

      // Update count logic
      if (isRemove) {
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else if (!previousReaction) {
        setLikeCount((prev) => prev + 1);
      }
      // If changing reaction type (e.g. LIKE -> LOVE), count stays same

      // Call API
      await postAPI.toggleReaction(id, isRemove ? type : newReaction!);

      // Save locally
      postAPI.setLocalReaction(id, newReaction);

    } catch (error) {
      // Revert on error
      setCurrentReaction(previousReaction);
      if (isRemove) {
        setLikeCount((prev) => prev + 1);
      } else if (!previousReaction) {
        setLikeCount((prev) => Math.max(0, prev - 1));
      }
      console.error("Error reacting to post:", error);
      toast("Có lỗi xảy ra. Vui lòng thử lại.", "error");
    } finally {
      setIsReacting(false);
    }
  };


  const handleSave = async () => {
    if (!isAuthenticated) {
      setAuthModalFeature("lưu bài viết");
      setShowAuthModal(true);
      return;
    }

    try {
      const newSavedState = await postAPI.toggleSavePost(id);
      setIsSaved(newSavedState);
      toast(newSavedState ? "Đã lưu bài viết" : "Đã bỏ lưu bài viết", "success");
    } catch (error) {
      toast("Có lỗi xảy ra khi lưu bài viết", "error");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContent(content);
    setIsMenuOpen(false);
  };

  const handleSaveEdit = async () => {
    if (onEdit) {
      setIsSavingEdit(true);
      try {
        await onEdit(editedContent);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save edit:", error);
      } finally {
        setIsSavingEdit(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(content);
  };

  const handleHidePost = () => {
    if (!isAuthenticated) {
      setAuthModalFeature("ẩn bài viết");
      setShowAuthModal(true);
      return;
    }
    setIsHidden(true);
    setIsMenuOpen(false);
  };


  const handleUndoHide = () => {
    setIsHidden(false);
  };

  const handleReportClick = () => {
    if (!isAuthenticated) {
      setAuthModalFeature("báo cáo bài viết");
      setShowAuthModal(true);
      return;
    }
    setIsMenuOpen(false);
    setShowReportModal(true);
  };

  const confirmReport = () => {
    onReport?.();
    setShowReportModal(false);
    toast("Đã gửi báo cáo vi phạm thành công! Chúng tôi sẽ xem xét lại bài viết này.", "success");
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (onDelete) {
      setIsDeletingPost(true);
      try {
        await onDelete();
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Failed to delete post:", error);
      } finally {
        setIsDeletingPost(false);
      }
    } else {
      setShowDeleteModal(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      setAuthModalFeature("bình luận trên bài viết");
      setShowAuthModal(true);
      return;
    }
    if (!commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await postAPI.addComment(id, commentText);

      const newComment: Comment = {
        id: response?.id || Date.now().toString(),
        author: { name: "Bạn", avatar: "/userAvatar.png" },
        content: commentText,
        createdAt: new Date().toISOString(),
        timestamp: "Vừa xong",
        likes: 0,
        isLiked: false,
        reactionType: null
      };

      setCommentsList((prev) => [newComment, ...prev]);
      setCommentCount((prev) => prev + 1);
      setCommentText("");
      toast("Bình luận thành công!", "success");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast("Không thể thêm bình luận. Vui lòng thử lại.", "error");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentReaction = async (commentId: string, type: string) => {
    toast("Tính năng này đang được phát triển", "info");
  };

  const getCommentReactionIcon = (reactionType: string | null | undefined, size = "w-4 h-4") => {
    if (reactionType === "LOVE") return <Heart className={`${size} fill-red-500 text-red-500`} />;
    if (reactionType === "HAHA") return <span className="text-sm">😆</span>;
    if (reactionType === "WOW") return <span className="text-sm">😮</span>;
    if (reactionType === "SAD") return <span className="text-sm">😢</span>;
    if (reactionType === "ANGRY") return <span className="text-sm">😡</span>;
    return <ThumbsUp className={`${size} ${reactionType ? "fill-[#f9622e] text-[#f9622e]" : "text-gray-400"}`} />;
  };

  const getCommentReactionLabel = (type: string | null | undefined) => {
    switch (type) {
      case "LIKE": return "Thích";
      case "LOVE": return "Yêu thích";
      case "HAHA": return "Haha";
      case "WOW": return "Wow";
      case "SAD": return "Buồn";
      case "ANGRY": return "Phẫn nộ";
      default: return "Thích";
    }
  };

  // Generate a username if not provided
  const username = author.username || generateUsername(author.name);

  if (isHidden) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between animate-in fade-in duration-300">
        <div className="flex items-center gap-3 text-gray-500">
          <EyeOff size={20} />
          <span className="font-medium">Bài viết đã bị ẩn</span>
        </div>
        <button
          onClick={handleUndoHide}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          <Undo2 size={16} />
          Hoàn tác
        </button>
      </div>
    );
  }

  // Helper to get the main reaction icon
  const getMainReactionIcon = () => {
    if (currentReaction === "LOVE") {
      return <Heart className="w-5 h-5 fill-red-500 text-red-500" />;
    }
    if (currentReaction === "HAHA") {
      return <span className="text-xl leading-none">😆</span>;
    }
    if (currentReaction === "WOW") {
      return <span className="text-xl leading-none">😮</span>;
    }
    if (currentReaction === "SAD") {
      return <span className="text-xl leading-none">😢</span>;
    }
    if (currentReaction === "ANGRY") {
      return <span className="text-xl leading-none">😡</span>;
    }
    // Default to ThumbsUp for LIKE and others (or no reaction)
    const colorClass = currentReaction ? "fill-[#f9622e] text-[#f9622e]" : "text-gray-500 group-hover:text-[#f9622e]";
    return <ThumbsUp className={`w-5 h-5 ${colorClass}`} />;
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image
              src={author.avatar || "/userAvatar.png"}
              alt={author.name}
              width={40}
              height={40}
              onClick={() => router.push(`/profile/${author.id}`)}
              className="rounded-full object-cover ring-2 ring-gray-50 cursor-pointer hover:opacity-80 transition-opacity"
            />
            <div>
              <h4
                onClick={() => router.push(`/profile/${author.id}`)}
                className="font-bold text-gray-900 leading-none hover:text-[#f9622e] cursor-pointer transition-colors"
              >
                {author.name}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {username} • {timestamp}
              </p>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-200">
                {isOwner ? (
                  <>
                    <button
                      onClick={handleEditClick}
                      className="flex w-full items-center cursor-pointer gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Edit size={16} />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="flex w-full items-center cursor-pointer gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <Trash2 size={16} />
                      Xóa bài
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleHidePost}
                      className="flex w-full items-center cursor-pointer gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <EyeOff size={16} />
                      Ẩn bài viết
                    </button>
                    <button
                      onClick={handleReportClick}
                      className="flex w-full items-center cursor-pointer gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <Flag size={16} />
                      Báo cáo
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          {isEditing ? (
            <div className="mb-3">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-[15px] text-gray-800 focus:border-[#f9622e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f9622e]/10"
                rows={3}
                autoFocus
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center cursor-pointer gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X size={14} /> Hủy
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSavingEdit}
                  className="flex items-center cursor-pointer gap-1 rounded-lg bg-[#f9622e] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#d84e1e] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Check size={14} /> Lưu
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 whitespace-pre-line leading-relaxed mb-3 text-[15px]">
              {content.split(/(#[\p{L}\d_]+)/u).map((part, index) => {
                if (part.startsWith("#")) {
                  const tag = part.slice(1);
                  return (
                    <span
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/trending/${encodeURIComponent(tag)}`);
                      }}
                      className="text-[#f9622e] font-semibold hover:underline cursor-pointer"
                    >
                      {part}
                    </span>
                  );
                }
                return part;
              })}
            </p>
          )}

          {image && (
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 mt-3">
              <Image
                src={image}
                alt="Post content"
                width={600}
                height={400}
                className="w-full h-auto object-cover max-h-125"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          )}
          {video && (
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 mt-3">
              <video
                src={video}
                controls
                className="w-full h-auto object-cover max-h-125"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-300 pt-3 mt-2">
          <div className="flex items-center gap-6">
            {/* Like Button with Reactions */}
            <div className="relative group/reaction">
              <button
                onClick={() => handleReaction(currentReaction || "LIKE")}
                className={`flex items-center gap-2 transition-colors cursor-pointer ${currentReaction ? "text-[#f9622e]" : "text-gray-500"
                  }`}
              >
                <div
                  className={`p-2 rounded-full transition-colors ${currentReaction ? "bg-orange-50" : "group-hover/reaction:bg-orange-50"
                    }`}
                >
                  {getMainReactionIcon()}
                </div>
                <span className="text-sm font-medium">
                  {likeCount > 0 ? likeCount.toLocaleString() : "Thích"}
                </span>
              </button>

              {/* Reaction Popup */}
              <div className="absolute bottom-full left-0 pb-2 hidden group-hover/reaction:flex animate-in fade-in slide-in-from-bottom-2 duration-200 z-10">
                <div className="bg-white rounded-full shadow-lg border border-gray-100 p-1 gap-1 flex">
                  {[
                    { type: "LIKE", icon: "👍", label: "Thích" },
                    { type: "LOVE", icon: "❤️", label: "Yêu thích" },
                    { type: "HAHA", icon: "😆", label: "Haha" },
                    { type: "WOW", icon: "😮", label: "Wow" },
                    { type: "SAD", icon: "😢", label: "Buồn" },
                    { type: "ANGRY", icon: "😡", label: "Phẫn nộ" },
                  ].map((reaction) => (
                    <div key={reaction.type} className="relative group/item">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReaction(reaction.type);
                        }}
                        className="p-2 text-xl hover:scale-125 transition-transform cursor-pointer hover:bg-gray-50 rounded-full"
                      >
                        {reaction.icon}
                      </button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {reaction.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comment Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 transition-colors group cursor-pointer ${showComments ? "text-blue-500" : "text-gray-500 hover:text-blue-500"}`}
              title="Bình luận"
            >
              <div className={`p-2 rounded-full transition-colors ${showComments ? "bg-blue-50" : "group-hover:bg-blue-50"}`}>
                <MessageCircle className={`w-5 h-5 group-active:scale-90 transition-transform ${showComments ? "fill-blue-500" : ""}`} />
              </div>
              <span className="text-sm font-medium">
                {commentCount.toLocaleString()}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthModalFeature("chia sẻ bài viết");
                  setShowAuthModal(true);
                }
              }}
              className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors group cursor-pointer"
              title="Chia sẻ"
            >
              <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <Share className="w-5 h-5 group-active:scale-90 transition-transform" />
              </div>
              <span className="text-sm font-medium">
                {shares.toLocaleString()}
              </span>
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleSave}
            className={`p-2 rounded-full transition-colors cursor-pointer group ${isSaved
              ? "text-[#f9622e] bg-orange-50"
              : "text-gray-500 hover:bg-gray-50 hover:text-[#f9622e]"
              }`}
            title={`${isSaved ? "Bỏ lưu bài viết" : "Lưu bài viết"}`}
          >
            <Bookmark
              className={`w-5 h-5 transition-transform group-active:scale-90 ${isSaved ? "fill-[#f9622e]" : ""
                }`}
            />
          </button>
        </div >

        {/* Comment Section */}
        {
          showComments && (
            <div className="mt-3.5 pt-3.5 border-t border-gray-300 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Comment Input */}
              <div className="flex gap-3 mb-6">
                <Image
                  src="/userAvatar.png"
                  alt="Current User"
                  width={32}
                  height={32}
                  className="rounded-full object-cover w-8 h-8 ring-2 ring-gray-50"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                    placeholder="Viết bình luận..."
                    className="w-full bg-gray-50 border-none outline-none rounded-xl py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-[#f9622e] focus:bg-white transition-all"
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || isSubmittingComment}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#f9622e] hover:bg-orange-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-100 hover:cursor-pointer disabled:hover:bg-transparent transition-colors"
                  >
                    {isSubmittingComment ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Comment Controls (Sort) */}
              {commentsList.length > 0 && (
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-sm font-bold text-gray-700">Tất cả bình luận</span>
                  <div className="flex items-center gap-2 relative">
                    <button
                      onClick={() => setCommentSortOrder(commentSortOrder === "newest" ? "oldest" : "newest")}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#f9622e] transition-colors bg-gray-50 px-2 py-1 rounded-lg cursor-pointer"
                    >
                      <Filter size={12} />
                      Sắp xếp: {commentSortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}
                    </button>
                  </div>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {isLoadingComments ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-[#f9622e]" />
                    <span className="text-sm font-medium">Đang tải bình luận...</span>
                  </div>
                ) : sortedComments.length > 0 ? (
                  sortedComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                      <Image
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover w-8 h-8 ring-2 ring-gray-50 shrink-0"
                      />
                      <div className="flex-1">
                        <div className="relative inline-block max-w-[90%]">
                          <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2">
                            <h5
                              onClick={() => router.push(`/profile/${comment.author.id || '#'}`)}
                              className="text-[13px] font-bold text-gray-900 hover:underline hover:text-[#f9622e] transition-colors duration-150 cursor-pointer"
                            >
                              {comment.author.name}
                            </h5>
                            <p className="text-sm text-gray-800 mt-0.5 leading-relaxed">{comment.content}</p>
                          </div>

                          {/* Comment Reaction Badge */}
                          {comment.likes > 0 && (
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full shadow-sm border border-gray-100 px-1.5 py-0.5 flex items-center gap-1 scale-90">
                              {getCommentReactionIcon(comment.reactionType, "w-3 h-3")}
                              <span className="text-[10px] font-bold text-gray-500">{comment.likes}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-1.5 ml-2">
                          <span className="text-xs text-gray-500 font-medium">{comment.timestamp}</span>

                          {/* Comment Like/Reaction Button */}
                          <div className="relative group/comment-react">
                            <button
                              onClick={() => handleCommentReaction(comment.id, comment.reactionType || "LIKE")}
                              className={`text-xs mb-1 font-bold transition-colors hover:underline cursor-pointer ${comment.reactionType ? "text-[#f9622e]" : "text-gray-500 hover:text-gray-700"}`}
                            >
                              {getCommentReactionLabel(comment.reactionType)}
                            </button>

                            {/* Comment Reaction Popup */}
                            <div className="absolute bottom-full left-0 pb-2 hidden group-hover/comment-react:flex animate-in fade-in slide-in-from-bottom-1 duration-200 z-20">
                              <div className="bg-white rounded-full shadow-xl border border-gray-100 p-1 gap-0.5 flex scale-90 origin-bottom-left">
                                {[
                                  { type: "LIKE", icon: "👍" },
                                  { type: "LOVE", icon: "❤️" },
                                  { type: "HAHA", icon: "😆" },
                                  { type: "WOW", icon: "😮" },
                                  { type: "SAD", icon: "😢" },
                                  { type: "ANGRY", icon: "😡" },
                                ].map((reaction) => (
                                  <button
                                    key={reaction.type}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCommentReaction(comment.id, reaction.type);
                                    }}
                                    className="p-1.5 text-base hover:scale-125 transition-transform cursor-pointer hover:bg-gray-50 rounded-full"
                                  >
                                    {reaction.icon}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <button className="text-xs font-bold text-gray-500 hover:text-gray-700 hover:underline transition-colors cursor-pointer">
                            Phản hồi
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-gray-400">
                    <p className="text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                  </div>
                )}
              </div>
            </div>
          )
        }
      </div >

      {/* Delete Confirmation Modal */}
      < Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)
        }
        title="Xóa bài viết?"
        footer={
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setShowDeleteModal(false); }}
              className="rounded-xl px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); confirmDelete(); }}
              disabled={isDeletingPost}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeletingPost ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </button>
          </>
        }
      >
        <p className="text-gray-600">
          Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.
        </p>
      </Modal >

      {/* Report Modal */}
      < Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Báo cáo vi phạm"
        footer={
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setShowReportModal(false); }}
              className="rounded-xl px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); confirmReport(); }}
              className="rounded-xl bg-[#f9622e] px-4 py-2 text-sm font-bold text-white hover:bg-[#d84e1e] transition-colors shadow-lg shadow-orange-500/30 cursor-pointer"
            >
              Gửi báo cáo
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-2">Vui lòng chọn lý do báo cáo:</p>
          {[
            { id: "spam", label: "Spam hoặc lừa đảo" },
            { id: "inappropriate", label: "Nội dung không phù hợp" },
            { id: "violence", label: "Bạo lực hoặc nguy hiểm" },
            { id: "fake", label: "Tin giả hoặc thông tin sai lệch" },
          ].map((reason) => (
            <label key={reason.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="reportReason"
                value={reason.id}
                checked={reportReason === reason.id}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-4 h-4 text-[#f9622e] border-gray-300 focus:ring-[#f9622e]"
              />
              <span className="text-sm font-medium text-gray-700">{reason.label}</span>
            </label>
          ))}
        </div>
      </Modal >

      {/* Auth Prompt Modal */}
      < AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        feature={authModalFeature}
      />
    </>
  );
}
