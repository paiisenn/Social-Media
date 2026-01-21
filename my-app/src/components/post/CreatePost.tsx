"use client";

import {
  Image as ImageIcon,
  Video,
  Plus,
  X,
  Globe,
  ChevronDown,
  Smile,
  Users,
  Lock,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { AuthPromptModal } from "@/components/ui/AuthPromptModal";

interface CreatePostProps {
  onCreatePost?: (postData: {
    content: string;
    media: { url: string; type: "image" | "video" } | null;
    privacy: string;
  }) => void;
}

export function CreatePost({ onCreatePost }: CreatePostProps) {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFeature, setAuthFeature] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: "image" | "video";
  } | null>(null);
  const [privacy, setPrivacy] = useState<"public" | "friends" | "private">(
    "public"
  );
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Xử lý click outside để đóng emoji picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setAuthFeature("đăng ảnh/video");
      setShowAuthModal(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      setAuthFeature("tạo bài viết");
      setShowAuthModal(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video/") ? "video" : "image";
      setSelectedMedia({ url, type });
      setIsModalOpen(true);
    }
  };

  // Xử lý kéo thả
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith("video/") ? "video" : "image";
        setSelectedMedia({ url, type });
      }
    }
  };

  // Khóa cuộn trang khi modal mở
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const privacyOptions = {
    public: { label: "Công khai", icon: Globe },
    friends: { label: "Bạn bè", icon: Users },
    private: { label: "Chỉ mình tôi", icon: Lock },
  };

  const PrivacyIcon = privacyOptions[privacy].icon;

  const MAX_CHARS = 200;
  const remainingChars = MAX_CHARS - content.length;

  const getCounterColor = () => {
    if (remainingChars >= 100) return "text-green-500";
    if (remainingChars >= 20) return "text-yellow-500";
    return "text-red-500";
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    if (content.length + emojiData.emoji.length <= MAX_CHARS) {
      setContent((prev) => prev + emojiData.emoji);
    }
  };

  const handlePost = () => {
    if (!content.trim() && !selectedMedia) {
      toast("Nội dung bài viết không được để trống!", "info");
      return;
    }

    if (onCreatePost) {
      onCreatePost({
        content,
        media: selectedMedia,
        privacy,
      });
      toast("Đăng bài viết thành công!", "success");
    }
    // Reset form
    setContent("");
    setSelectedMedia(null);
    setPrivacy("public");
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Khu vực 1: Avatar + Input */}
        <div className="flex items-center gap-4 pb-4">
          {/* Avatar */}
          <div className="h-12 w-12 cursor-pointer shrink-0 rounded-full bg-linear-to-br from-blue-400 to-blue-600 overflow-hidden">
            <Image
              src={user?.avatar || "/userAvatar.png"}
              alt="User"
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Input Area với Icons ở cuối */}
          <div
            className="flex flex-1 items-center rounded-full border border-gray-300 bg-gray-100 px-4 py-2 duration-200 transition-all hover:bg-gray-200 cursor-pointer"
            onClick={handleOpenModal}
          >
            <span className="flex-1 text-gray-500 select-none">
              Bạn đang nghĩ gì?
            </span>
            <div className="flex items-center gap-2 pl-2">
              <button
                onClick={handleImageClick}
                className="rounded-full p-1 cursor-pointer text-blue-500 hover:bg-gray-300 transition-colors"
              >
                <ImageIcon size={20} />
              </button>
              <button
                onClick={handleImageClick}
                className="rounded-full p-1 cursor-pointer text-red-500 hover:bg-gray-300 transition-colors"
              >
                <Video size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Underline phân cách */}
        <div className="border-b border-gray-200" />

        {/* Khu vực 2: Tin (Stories) - Kéo ngang */}
        <div className="mt-4 flex gap-3 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#f9622e] [&::-webkit-scrollbar-button]:hidden">
          {/* Tạo tin */}
          <div className="relative h-48 w-32 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition hover:opacity-90">
            <div className="h-2/3 bg-linear-to-br from-blue-400 to-blue-600 opacity-80"></div>
            <div className="absolute bottom-0 flex h-1/3 w-full flex-col items-center justify-end pb-2 bg-white">
              <span className="text-xs font-medium text-gray-700">Tạo tin</span>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full border-4 border-white bg-blue-500 p-1 text-white">
              <Plus size={20} />
            </div>
          </div>

          {/* Tin của người khác (Mockup) */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="relative h-48 w-32 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-gray-200 transition hover:opacity-90"
            >
              <div
                className={`h-full w-full bg-linear-to-b ${i % 2 === 0
                  ? "from-purple-500 to-pink-500"
                  : "from-yellow-400 to-orange-500"
                  }`}
              />
              <div className="absolute top-3 left-3 h-10 w-10 rounded-full border-4 border-blue-500 bg-gray-300" />
              <div className="absolute bottom-3 left-3 text-xs font-medium text-white drop-shadow-md">
                Người dùng {i}
              </div>
            </div>
          ))}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*,video/*"
        onChange={handleFileChange}
      />

      {/* Modal Tạo bài viết */}
      {isModalOpen && (
        <div className="fixed -top-3 inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="relative border-b border-gray-200 py-4 text-center">
              <h2 className="text-xl font-bold text-gray-900">Tạo bài viết</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div
              className={`flex-1 overflow-y-auto p-4 ${isDragging
                ? "bg-blue-50 border-2 border-dashed border-blue-400"
                : ""
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* User Info */}
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={user?.avatar || "/userAvatar.png"}
                    alt="User"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.name || "Người dùng"}</h3>
                  <div className="relative mt-1">
                    <button
                      onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
                      className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
                    >
                      <PrivacyIcon size={12} />
                      {privacyOptions[privacy].label}
                      <ChevronDown size={12} />
                    </button>

                    {isPrivacyOpen && (
                      <div className="absolute left-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
                        {(
                          Object.keys(privacyOptions) as Array<
                            keyof typeof privacyOptions
                          >
                        ).map((key) => {
                          const OptionIcon = privacyOptions[key].icon;
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                setPrivacy(key);
                                setIsPrivacyOpen(false);
                              }}
                              className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${privacy === key
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700"
                                }`}
                            >
                              <OptionIcon size={14} />
                              {privacyOptions[key].label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                {/* Character Counter */}
                <div className="ml-auto flex flex-col items-end justify-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${remainingChars === 0
                      ? "border-red-500 bg-red-50"
                      : "border-gray-100"
                      }`}
                  >
                    <span className={`text-sm font-bold ${getCounterColor()}`}>
                      {remainingChars}
                    </span>
                  </div>
                </div>
              </div>

              {/* Input */}
              <textarea
                placeholder={`Bạn đang nghĩ gì thế, ${user?.name || "Người dùng"}?`}
                className="min-h-37.5 w-full resize-none bg-transparent text-lg text-gray-900 placeholder-gray-500 focus:outline-none"
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={MAX_CHARS}
              />

              {/* Image Preview */}
              {selectedMedia && (
                <div className="relative mt-3 rounded-xl border border-gray-200 p-2">
                  <div className="relative max-h-80 overflow-hidden rounded-lg bg-black">
                    {selectedMedia.type === "video" ? (
                      <video
                        src={selectedMedia.url}
                        controls
                        className="h-full w-full object-contain max-h-60"
                      />
                    ) : (
                      <img
                        src={selectedMedia.url}
                        alt="Preview"
                        className="h-full w-full object-contain"
                      />
                    )}
                    <button
                      onClick={() => setSelectedMedia(null)}
                      className="absolute cursor-pointer right-2 top-2 z-10 rounded-full bg-white/80 p-1 text-gray-600 hover:bg-white shadow-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to post */}
              <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 p-3 shadow-sm">
                <span className="text-sm font-medium text-gray-700">
                  Thêm vào bài viết
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={handleImageClick}
                    className="rounded-full cursor-pointer p-2 text-green-500 hover:bg-gray-100"
                    title="Ảnh/Video"
                  >
                    <ImageIcon size={24} />
                  </button>
                  <button
                    className="rounded-full cursor-pointer p-2 text-blue-500 hover:bg-gray-100"
                    title="Gắn thẻ người khác"
                  >
                    <Plus size={24} />
                  </button>
                  <div className="relative" ref={emojiPickerRef}>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="rounded-full cursor-pointer p-2 text-yellow-500 hover:bg-gray-100"
                      title="Cảm xúc/Hoạt động"
                    >
                      <Smile size={24} />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 z-50 mb-2">
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          width={300}
                          height={400}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-4">
              <button
                onClick={handlePost}
                className="w-full rounded-lg cursor-pointer bg-[#f9622e] py-2 font-semibold text-white transition-colors hover:bg-[#d84e1e] disabled:bg-gray-300 disabled:text-gray-500"
              >
                Đăng
              </button>
            </div>
          </div>
        </div>
      )}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        feature={authFeature}
      />
    </>
  );
}
