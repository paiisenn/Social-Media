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
  MapPin,
  UserPlus,
  FileDigit as GifIcon,
  Search,
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
    media: { url: string; type: "image" | "video" }[];
    privacy: string;
    feeling?: string;
    location?: string;
    taggedUserIds?: string[];
    gifUrl?: string;
  }) => Promise<void> | void;
}

const feelings = [
  { value: "HAPPY", label: "Hạnh phúc", emoji: "😊" },
  { value: "SAD", label: "Buồn", emoji: "😔" },
  { value: "EXCITED", label: "Hào hứng", emoji: "🤩" },
  { value: "TIRED", label: "Mệt mỏi", emoji: "😫" },
  { value: "GRATEFUL", label: "Biết ơn", emoji: "🙏" },
  { value: "LOVED", label: "Được yêu", emoji: "🥰" },
  { value: "ANGRY", label: "Tức giận", emoji: "😡" },
  { value: "BLESSED", label: "Cảm kích", emoji: "😇" },
  { value: "MOTIVATED", label: "Động lực", emoji: "💪" },
  { value: "RELAXED", label: "Thư giãn", emoji: "😌" },
];

const provinces = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
].sort();

export function CreatePost({ onCreatePost }: CreatePostProps) {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFeature, setAuthFeature] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMediaList, setSelectedMediaList] = useState<{
    url: string;
    type: "image" | "video";
  }[]>([]);
  const [privacy, setPrivacy] = useState<"public" | "friends" | "private">(
    "public",
  );
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<
    (typeof feelings)[0] | null
  >(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [showFeelingSelector, setShowFeelingSelector] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [showTagFriendsSelector, setShowTagFriendsSelector] = useState(false);
  const [searchFriend, setSearchFriend] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const feelingRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const tagFriendsRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Xử lý click outside để đóng emoji picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        feelingRef.current &&
        !feelingRef.current.contains(event.target as Node)
      ) {
        setShowFeelingSelector(false);
      }
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setShowLocationSelector(false);
      }
      if (
        tagFriendsRef.current &&
        !tagFriendsRef.current.contains(event.target as Node)
      ) {
        setShowTagFriendsSelector(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Tự động điều chỉnh chiều cao textarea theo nội dung
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

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
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      toast("Hiện tại chưa hỗ trợ tải ảnh/video. Bài viết sẽ chỉ có nội dung văn bản.", "info");
      const newMedia = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : ("image" as "image" | "video")
      }));
      setSelectedMediaList(prev => [...prev, ...newMedia]);
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
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      const newMedia = files
        .filter(file => file.type.startsWith("image/") || file.type.startsWith("video/"))
        .map(file => ({
          url: URL.createObjectURL(file),
          type: file.type.startsWith("video/") ? "video" : ("image" as "image" | "video")
        }));
      setSelectedMediaList(prev => [...prev, ...newMedia]);
      setIsModalOpen(true);
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

  const MAX_CHARS = 300;
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

  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim() && selectedMediaList.length === 0) {
      toast("Nội dung bài viết không được để trống!", "info");
      return;
    }

    if (onCreatePost) {
      try {
        setIsLoading(true);
        // Note: Backend currently doesn't support image/video uploads
        // Only send text content for now
        await onCreatePost({
          content,
          media: [], // Don't send media - backend doesn't support it yet
          privacy,
          feeling: selectedFeeling?.value,
          location: selectedLocation || undefined,
          taggedUserIds: taggedUsers.map((u) => u.id),
        });
        toast("Đăng bài viết thành công! (Ảnh/video sẽ được hỗ trợ sớm)", "success");
        // Reset form only on success
        setContent("");
        setSelectedMediaList([]);
        setPrivacy("public");
        setSelectedFeeling(null);
        setSelectedLocation(null);
        setTaggedUsers([]);
        setIsModalOpen(false);
      } catch (error) {
        console.error(error);
        toast("Lỗi khi đăng bài viết. Vui lòng thử lại!", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Khu vực 1: Avatar + Input */}
        <div className="flex items-center gap-4 pb-4">
          {/* Avatar */}
          <div className="h-12 w-12 cursor-pointer shrink-0 rounded-full bg-linear-to-br from-[#fb923c] to-[#f9622e] overflow-hidden">
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(e);
                }}
                className="rounded-full p-1 cursor-pointer text-[#f9622e] hover:bg-gray-300 transition-colors"
              >
                <ImageIcon size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(e);
                }}
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
            <div className="h-2/3 bg-linear-to-br from-[#fb923c] to-[#f9622e] opacity-80"></div>
            <div className="absolute bottom-0 flex h-1/3 w-full flex-col items-center justify-end pb-2 bg-white">
              <span className="text-xs font-medium text-gray-700">Tạo tin</span>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full border-4 border-white bg-[#f9622e] p-1 text-white">
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
              <div className="absolute top-3 left-3 h-10 w-10 rounded-full border-4 border-[#f9622e] bg-gray-300" />
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
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />

      {/* Modal Tạo bài viết */}
      {isModalOpen && (
        <div className="fixed -top-3 inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-in fade-in duration-200">
          <div className="flex mt-2 min-h-125 max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
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
                ? "bg-[#fef2ee] border-2 border-dashed border-[#fb923c]"
                : ""
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* User Info */}
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={user?.avatar || "/userAvatar.png"}
                    alt="User"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {user?.name || "Người dùng"}
                    </h3>
                    {selectedFeeling && (
                      <span className="text-gray-600 text-sm">
                        đang cảm thấy {selectedFeeling.emoji}{" "}
                        <span className="font-medium text-gray-900">
                          {selectedFeeling.label}
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative mt-0.5">
                      {selectedLocation && (
                        <div className="mb-1 flex items-center gap-1 text-xs text-[#f9622e] font-medium">
                          <MapPin size={12} />ở {selectedLocation}
                          <button
                            onClick={() => setSelectedLocation(null)}
                            className="ml-1 cursor-pointer rounded-full p-0.5 hover:bg-gray-100 text-gray-400"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}

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
                                  ? "bg-[#fef2ee] text-[#f9622e]"
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
                </div>
                {/* Character Counter */}
                <div className="ml-auto shrink-0">
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

              {/* Tagged Users List */}
              {taggedUsers.length > 0 && (
                <div className="mb-2.5 flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-2 text-sm text-gray-700 border border-gray-100">
                  <span className="font-medium">
                    Cùng với {taggedUsers.length} người khác:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {taggedUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center gap-1 rounded-full bg-[#f9622e]/10 px-2 py-1 text-[#f9622e]"
                      >
                        <span className="text-xs">{u.name}</span>
                        <button
                          onClick={() =>
                            setTaggedUsers((prev) =>
                              prev.filter((user) => user.id !== u.id),
                            )
                          }
                          className="mt-0.5 cursor-pointer rounded-full hover:bg-[#f9622e]/20 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <textarea
                ref={textareaRef}
                placeholder={`Bạn đang nghĩ gì thế, ${user?.name || "Người dùng"
                  }?`}
                className="w-full resize-none border border-gray-200 rounded-lg p-2 bg-transparent text-lg text-gray-900 placeholder-gray-500 focus:outline-none overflow-hidden min-h-20"
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={MAX_CHARS}
              />

              {/* Image Preview Grid */}
              {selectedMediaList.length > 0 && (
                <div className="relative mt-3">
                  <div className={`grid gap-1.5 overflow-hidden rounded-xl border border-gray-200 ${selectedMediaList.length === 1 ? "grid-cols-1" :
                    selectedMediaList.length === 2 ? "grid-cols-2 h-72" :
                      selectedMediaList.length === 3 ? "grid-cols-2 grid-rows-2 h-96" :
                        "grid-cols-2 grid-rows-2 h-96"
                    }`}>
                    {selectedMediaList.slice(0, 4).map((media, index) => (
                      <div
                        key={index}
                        className={`relative bg-black group ${selectedMediaList.length === 3 && index === 0 ? "row-span-2 h-full" : ""
                          }`}
                      >
                        {media.type === "video" ? (
                          <video src={media.url} className="h-full w-full object-cover" />
                        ) : (
                          <img src={media.url} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                        )}

                        <button
                          onClick={() => setSelectedMediaList(prev => prev.filter((_, i) => i !== index))}
                          className="absolute right-2 cursor-pointer top-2 z-10 hidden group-hover:flex rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 shadow-sm transition-all"
                        >
                          <X size={14} />
                        </button>

                        {index === 3 && selectedMediaList.length > 4 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-2xl font-bold text-white">
                            +{selectedMediaList.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedMediaList([])}
                    className="absolute cursor-pointer -top-2 -right-2 z-20 rounded-full bg-white p-1 text-gray-500 shadow-lg hover:text-red-500"
                    title="Xóa hết ảnh"
                  >
                    <X size={20} />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 cursor-pointer flex items-center duration-200 gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <Plus size={16} /> Thêm ảnh/video
                  </button>
                </div>
              )}
            </div>

            {/* Add to post */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-1.5 shadow-sm">
                <span className="text-sm font-medium text-gray-700">
                  Thêm vào bài viết
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={handleImageClick}
                    className="rounded-full cursor-pointer p-2 text-green-500 hover:bg-gray-100"
                    title="Thư viện"
                  >
                    <ImageIcon size={24} />
                  </button>

                  <div className="relative" ref={tagFriendsRef}>
                    <button
                      onClick={() =>
                        setShowTagFriendsSelector(!showTagFriendsSelector)
                      }
                      className="rounded-full cursor-pointer p-2 text-[#f9622e] hover:bg-gray-100"
                      title="Gắn thẻ người khác"
                    >
                      <UserPlus size={24} />
                    </button>
                    {showTagFriendsSelector && (
                      <div className="absolute bottom-full right-0 z-50 mb-2 w-72 rounded-xl border border-gray-200 bg-white p-2.5 shadow-xl">
                        <div className="mb-2 relative">
                          <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <input
                            type="text"
                            placeholder="Tìm kiếm bạn bè..."
                            className="w-full rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none"
                            value={searchFriend}
                            onChange={(e) => setSearchFriend(e.target.value)}
                            autoFocus
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto pt-1">
                          {[
                            "Anh Tuấn",
                            "Bảo Ngọc",
                            "Công Thành",
                            "Duy Mạnh",
                            "Minh Anh",
                            "Quỳnh Chi",
                            "Thanh Thảo",
                            "Hoàng Nam",
                            "Phương Linh"
                          ]
                            .filter((name) =>
                              name
                                .toLowerCase()
                                .includes(searchFriend.toLowerCase()),
                            )
                            .map((name, i) => {
                              const isTagged = taggedUsers.find((u) => u.name === name);
                              return (
                                <button
                                  key={i}
                                  onClick={() => {
                                    if (isTagged) {
                                      setTaggedUsers(prev => prev.filter(u => u.name !== name));
                                    } else {
                                      setTaggedUsers([
                                        ...taggedUsers,
                                        { id: `mock-${name}-${i}`, name },
                                      ]);
                                    }
                                  }}
                                  className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-[#fef2ee] flex items-center justify-center text-[#f9622e] text-xs font-bold shrink-0">
                                      {name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 truncate">
                                      {name}
                                    </span>
                                  </div>
                                  <div className={`h-5 w-5 cursor-pointer rounded-full border flex items-center justify-center transition-colors ${isTagged ? "bg-[#f9622e] border-[#f9622e]" : "border-gray-300"
                                    }`}>
                                    {isTagged && <Users size={12} className="text-white" />}
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                        <div className="mt-2 border-t border-gray-100 pt-2 flex justify-end">
                          <button
                            onClick={() => setShowTagFriendsSelector(false)}
                            className="bg-[#f9622e] text-white px-4 py-1.5 cursor-pointer rounded-lg text-sm font-semibold hover:bg-[#d84e1e]"
                          >
                            Xong
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={feelingRef}>
                    <button
                      onClick={() =>
                        setShowFeelingSelector(!showFeelingSelector)
                      }
                      className="rounded-full cursor-pointer p-2 text-yellow-500 hover:bg-gray-100"
                      title="Cảm xúc"
                    >
                      <Smile size={24} />
                    </button>
                    {showFeelingSelector && (
                      <div className="absolute bottom-full right-0 z-50 mb-2 grid w-72 grid-cols-2 gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                        {feelings.map((f) => (
                          <button
                            key={f.value}
                            onClick={() => {
                              setSelectedFeeling(f);
                              setShowFeelingSelector(false);
                            }}
                            className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-xl">{f.emoji}</span>
                            <span className="text-sm text-gray-700">
                              {f.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={locationRef}>
                    <button
                      onClick={() =>
                        setShowLocationSelector(!showLocationSelector)
                      }
                      className="rounded-full cursor-pointer p-2 text-red-500 hover:bg-gray-100"
                      title="Vị trí"
                    >
                      <MapPin size={24} />
                    </button>
                    {showLocationSelector && (
                      <div className="absolute bottom-full right-0 z-50 mb-2 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                        <div className="flex items-center p-2 border-b border-gray-100 mb-2 justify-between">
                          <h4 className="font-semibold text-sm">
                            Chọn tỉnh/thành phố
                          </h4>
                        </div>
                        <div className="px-2 pb-2">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                              type="text"
                              placeholder="Tìm kiếm vị trí..."
                              className="w-full rounded-lg bg-gray-100 py-1.5 pl-8 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#f9622e]"
                              value={searchLocation}
                              onChange={(e) => setSearchLocation(e.target.value)}
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto px-1">
                          {provinces
                            .filter(p => p.toLowerCase().includes(searchLocation.toLowerCase()))
                            .map((p) => (
                              <button
                                key={p}
                                onClick={() => {
                                  setSelectedLocation(p);
                                  setShowLocationSelector(false);
                                  setSearchLocation("");
                                }}
                                className="w-full text-left rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                              >
                                <MapPin size={14} className="text-gray-400" />
                                {p}
                              </button>
                            ))}
                          {provinces.filter(p => p.toLowerCase().includes(searchLocation.toLowerCase())).length === 0 && (
                            <div className="p-4 text-center text-xs text-gray-500">
                              Không tìm thấy vị trí nào
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    className="rounded-full cursor-pointer p-2 text-pink-500 hover:bg-gray-100"
                    title="GIF"
                  >
                    <GifIcon size={24} />
                  </button>

                  <div className="relative" ref={emojiPickerRef}>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="rounded-full cursor-pointer p-2 text-gray-500 hover:bg-gray-100"
                      title="Emoji"
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
                {isLoading ? "Đang đăng..." : "Đăng"}
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
