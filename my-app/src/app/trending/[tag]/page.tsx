"use client";

import { use, useState } from "react";
import MainLayout from "@/app/main/layout";
import {
    TrendingUp,
    MessageCircle,
    Heart,
    Share,
    MoreHorizontal,
    ArrowLeft,
    Bookmark,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";
import { AuthPromptModal } from "@/components/ui/AuthPromptModal";
import { EyeOff, Flag, Check, Edit, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

// Mock data for posts
const initialMockPosts = [
    {
        id: 1,
        user: {
            name: "Tech Reviewer",
            avatar: "/userAvatar.png",
            username: "@techreview",
        },
        content:
            "Công nghệ AI đang thay đổi thế giới nhanh chóng! GPT-4 và Gemini đang dẫn đầu cuộc đua này. Bạn nghĩ sao về tương lai của AI? 🤔 #TechReview #AI #Future",
        image:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
        likes: 1205,
        comments: 45,
        shares: 12,
        timestamp: "2 giờ trước",
        tags: ["congnghe", "suthat"],
        isSaved: false,
        isLiked: false,
    },
    {
        id: 2,
        user: {
            name: "Music Lover",
            avatar: "/userAvatar.png",
            username: "@musicdaily",
        },
        content:
            "Bài hát mới của Sơn Tùng MTP thật sự đỉnh cao! Beat cực cuốn, MV đẹp lung linh. Mọi người đã nghe chưa? 🎵🔥 #HayTraoChoAnh #Music",
        image:
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60",
        likes: 8900,
        comments: 2304,
        shares: 1500,
        timestamp: "5 giờ trước",
        tags: ["amnhac", "vietnam"],
        isSaved: false,
        isLiked: false,
    },
    {
        id: 3,
        user: {
            name: "Vietnam News",
            avatar: "/userAvatar.png",
            username: "@vnnews",
        },
        content:
            "Đội tuyển Việt Nam đã giành huy chương vàng tại SEA Games 32! Tự hào quá Việt Nam ơi! 🇻🇳 Cảm ơn các chiến binh sao vàng đã nỗ lực hết mình. #SEAGames32 #Vietnam",
        image:
            "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=60",
        likes: 45000,
        comments: 3200,
        shares: 8000,
        timestamp: "1 ngày trước",
        tags: ["vietnam", "seagames32"],
        isSaved: false,
        isLiked: false,
    },
    {
        id: 4,
        user: {
            name: "Sự Thật Thú Vị",
            avatar: "/userAvatar.png",
            username: "@factdaily",
        },
        content:
            "Bạn có biết? Mật ong là loại thực phẩm duy nhất không bao giờ bị hỏng. Các nhà khảo cổ đã tìm thấy mật ong trong các lăng mộ Ai Cập cổ đại vẫn ăn được! 🍯😲 #SựThật #Facts",
        likes: 560,
        comments: 23,
        shares: 45,
        timestamp: "30 phút trước",
        tags: ["suthat"],
        isSaved: false,
        isLiked: false,
    },
    {
        id: 5,
        user: {
            name: "Gadget Pro",
            avatar: "/userAvatar.png",
            username: "@gadgetpro",
        },
        content:
            "Trên tay iPhone 15 Pro Max: Khung titan siêu nhẹ, nút Action Button mới cực tiện lợi! Camera zoom 5x quá đỉnh. 📱✨ #TechReview #Apple #iPhone15",
        image:
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60",
        likes: 3400,
        comments: 150,
        shares: 200,
        timestamp: "1 giờ trước",
        tags: ["congnghe"],
        isSaved: false,
        isLiked: false,
    },
    {
        id: 6,
        user: {
            name: "Indie Vibes",
            avatar: "/userAvatar.png",
            username: "@indievibes",
        },
        content:
            "Một chiều mưa nghe 'Lạ Lùng' của Vũ. Cảm giác thật bình yên... 🌧️🎸 Có ai thích nhạc Indie Việt không? #HayTraoChoAnh #IndieMusic",
        image:
            "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60",
        likes: 1500,
        comments: 89,
        shares: 30,
        timestamp: "3 giờ trước",
        tags: ["amnhac"],
        isSaved: true,
        isLiked: false,
    },
    {
        id: 7,
        user: {
            name: "Khoa Học Vui",
            avatar: "/userAvatar.png",
            username: "@khoahocvui",
        },
        content:
            "Bạch tuộc có tới 3 trái tim, 9 bộ não và máu màu xanh! Thiên nhiên thật kỳ diệu phải không? 🐙🌊 #SựThật #OceanLife",
        likes: 2100,
        comments: 110,
        shares: 500,
        timestamp: "4 giờ trước",
        tags: ["suthat"],
        isSaved: false,
        isLiked: true,
    },
    {
        id: 8,
        user: {
            name: "Thể Thao 247",
            avatar: "/userAvatar.png",
            username: "@thethao247",
        },
        content:
            "Khoảnh khắc lịch sử: Vận động viên Nguyễn Thị Oanh giành 2 HCV chỉ trong vòng 20 phút! Một nỗ lực phi thường tại SEA Games 32. 🥇🏃‍♀️ #SEAGames32 #VietnamPride",
        image:
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60",
        likes: 50000,
        comments: 4100,
        shares: 12000,
        timestamp: "2 ngày trước",
        tags: ["vietnam", "seagames32"],
        isSaved: false,
        isLiked: false,
    },
];

const getTagName = (slug: string) => {
    const map: Record<string, string> = {
        vietnam: "#SEAGames32",
        suthat: "#SựThật",
        congnghe: "#TechReview",
        amnhac: "#HayTraoChoAnh",
    };
    return map[slug] || `#${slug}`;
};

const getTagDescription = (slug: string) => {
    const map: Record<string, string> = {
        vietnam: "Cập nhật tin tức nóng hổi về đoàn thể thao Việt Nam tại SEA Games 32.",
        suthat: "Những sự thật thú vị có thể bạn chưa biết về thế giới tự nhiên và cuộc sống.",
        congnghe: "Đánh giá, review các sản phẩm công nghệ mới nhất và xu hướng AI.",
        amnhac: "Thảo luận về các bài hát, MV đang thịnh hành và gu âm nhạc của bạn.",
    };
    return map[slug] || "Khám phá các bài viết phổ biến liên quan đến chủ đề này.";
};

export default function TrendingPage({
    params,
}: {
    params: Promise<{ tag: string }>;
}) {
    // Unwrap params using use() hook
    const { tag } = use(params);
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();
    const [activeFilter, setActiveFilter] = useState("top");
    const [posts, setPosts] = useState(initialMockPosts);

    // Auth modal state
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalFeature, setAuthModalFeature] = useState("");

    // Dropdown state
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const tagName = getTagName(tag);
    const tagDesc = getTagDescription(tag);

    // Filter logic: Only show posts that actually contain the tag in their `tags` array
    const filteredPosts = posts.filter((p) => {
        // Check if the current page's tag exists in the post's tags list
        // Also handling the mapping logic if needed, but for simplicity assuming tags in data match url params or related concepts
        if (tag === "vietnam") return p.tags.includes("vietnam") || p.tags.includes("seagames32");
        if (tag === "congnghe") return p.tags.includes("congnghe");
        if (tag === "amnhac") return p.tags.includes("amnhac");
        if (tag === "suthat") return p.tags.includes("suthat");

        // Fallback for other potential tags
        return p.tags.includes(tag);
    });

    const handleActionWithAuth = (feature: string, action: () => void) => {
        if (!isAuthenticated) {
            setAuthModalFeature(feature);
            setShowAuthModal(true);
            return;
        }
        action();
    };

    const handleLike = (id: number) => {
        handleActionWithAuth("thích bài viết", () => {
            setPosts(prev => prev.map(post => {
                if (post.id === id) {
                    return {
                        ...post,
                        isLiked: !post.isLiked,
                        likes: post.isLiked ? post.likes - 1 : post.likes + 1
                    };
                }
                return post;
            }));
        });
    };

    const handleSave = (id: number) => {
        handleActionWithAuth("lưu bài viết", () => {
            setPosts(prev => prev.map(post => {
                if (post.id === id) {
                    return {
                        ...post,
                        isSaved: !post.isSaved
                    };
                }
                return post;
            }));
            toast("Đã cập nhật danh sách lưu trữ!", "success");
        });
    };

    const handleComment = (id: number) => {
        handleActionWithAuth("bình luận trên bài viết", () => {
            // Logic for opening comment section/page
            toast("Tính năng bình luận đang được phát triển!", "info");
        });
    };

    const handleShare = (id: number) => {
        // Share usually doesn't require login, but consistent with user request to fix "bug được share"
        handleActionWithAuth("chia sẻ bài viết", () => {
            // Logic for sharing
            toast("Đã sao chép liên kết bài viết!", "success");
        });
    };

    const handleHide = (id: number) => {
        handleActionWithAuth("ẩn bài viết", () => {
            setPosts(prev => prev.filter(post => post.id !== id));
            toast("Đã ẩn bài viết thành công!", "success");
            setOpenMenuId(null);
        });
    };

    const handleReport = (id: number) => {
        handleActionWithAuth("báo cáo bài viết", () => {
            toast("Đã gửi báo cáo vi phạm. Cảm ơn bạn đã phản hồi!", "success");
            setOpenMenuId(null);
        });
    };

    return (
        <MainLayout>
            <div className="mx-auto max-w-4xl py-2">
                {/* Header Section */}
                <div className="mb-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <TrendingUp className="w-64 h-64 text-[#f9622e]" />
                    </div>

                    <div className="relative z-10">
                        <button
                            onClick={() => router.back()}
                            className="group mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-[#f9622e] transition-colors cursor-pointer"
                        >
                            <div className="p-1 rounded-full bg-gray-100 group-hover:bg-orange-100 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            Quay lại
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-linear-to-br from-[#f9622e] to-[#ff8f6b] rounded-2xl shadow-lg shadow-orange-200 text-white">
                                <TrendingUp className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 mb-1">
                                    {tagName}
                                </h1>
                                <p className="text-gray-500 max-w-xl leading-relaxed">
                                    {tagDesc}
                                </p>
                                <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
                                    <span className="font-semibold text-gray-900">
                                        {filteredPosts.length * 152 + 1200}
                                    </span>{" "}
                                    bài viết
                                    <span className="h-1 w-1 rounded-full bg-gray-300 mx-2"></span>
                                    <span className="font-semibold text-gray-900">
                                        {(filteredPosts.length * 0.5 + 1.2).toFixed(1)}M
                                    </span>{" "}
                                    lượt xem
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="sticky top-14 z-30 bg-gray-100/95 backdrop-blur-md py-3  -mx-4 px-4 mb-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {["top", "latest", "people", "media"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${activeFilter === filter
                                ? "bg-[#f9622e] text-white shadow-md shadow-orange-200"
                                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                }`}
                        >
                            {filter === "top" && "Hàng đầu"}
                            {filter === "latest" && "Mới nhất"}
                            {filter === "people" && "Mọi người"}
                            {filter === "media" && "Hình ảnh & Video"}
                        </button>
                    ))}
                </div>

                {/* Posts Feed */}
                <div className="space-y-6 pb-10">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <p>Chưa có bài viết nào cho chủ đề này.</p>
                        </div>
                    ) : (
                        filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-4 duration-500"
                            >
                                {/* Post Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={post.user.avatar}
                                            alt={post.user.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full w-10 h-10 object-cover ring-2 ring-gray-50"
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-900 leading-none hover:text-[#f9622e] cursor-pointer transition-colors">
                                                {post.user.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {post.user.username} • {post.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative" ref={openMenuId === post.id ? menuRef : null}>
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                                            className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors cursor-pointer outline-none"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>

                                        {openMenuId === post.id && (
                                            <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-200">
                                                <button
                                                    onClick={() => handleHide(post.id)}
                                                    className="flex w-full items-center cursor-pointer gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left font-medium"
                                                >
                                                    <EyeOff size={16} />
                                                    Ẩn bài viết
                                                </button>
                                                <button
                                                    onClick={() => handleReport(post.id)}
                                                    className="flex w-full items-center cursor-pointer gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                                                >
                                                    <Flag size={16} />
                                                    Báo cáo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="mb-4">
                                    <p className="text-gray-800 whitespace-pre-line leading-relaxed mb-3 text-[15px]">
                                        {post.content}
                                    </p>
                                    {post.image && (
                                        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 mt-3">
                                            <img
                                                src={post.image}
                                                alt="Post content"
                                                className="w-full h-auto object-cover max-h-125"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
                                    <div className="flex items-center gap-6">
                                        {/* Like Button */}
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className={`flex items-center gap-2 transition-colors group cursor-pointer ${post.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
                                        >
                                            <div className={`p-2 rounded-full transition-colors ${post.isLiked ? "bg-red-50" : "group-hover:bg-red-50"}`}>
                                                <Heart className={`w-5 h-5 group-active:scale-90 transition-transform ${post.isLiked ? "fill-red-500" : ""}`} />
                                            </div>
                                            <span className="text-sm font-medium">
                                                {post.likes.toLocaleString()}
                                            </span>
                                        </button>

                                        {/* Comment Button */}
                                        <button
                                            onClick={() => handleComment(post.id)}
                                            className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors group cursor-pointer"
                                        >
                                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                                                <MessageCircle className="w-5 h-5 group-active:scale-90 transition-transform" />
                                            </div>
                                            <span className="text-sm font-medium">
                                                {post.comments.toLocaleString()}
                                            </span>
                                        </button>

                                        {/* Share Button (Updated Icon to Share) */}
                                        <button
                                            onClick={() => handleShare(post.id)}
                                            className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors group cursor-pointer"
                                        >
                                            <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                                                <Share className="w-5 h-5 group-active:scale-90 transition-transform" />
                                            </div>
                                            <span className="text-sm font-medium">
                                                {post.shares.toLocaleString()}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Bookmark Button (Right Side) */}
                                    <button
                                        onClick={() => handleSave(post.id)}
                                        className={`p-2 rounded-full transition-colors cursor-pointer group ${post.isSaved ? "text-[#f9622e] bg-orange-50" : "text-gray-500 hover:bg-gray-50 hover:text-[#f9622e]"}`}
                                    >
                                        <Bookmark className={`w-5 h-5 transition-transform group-active:scale-90 ${post.isSaved ? "fill-[#f9622e]" : ""}`} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <AuthPromptModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                feature={authModalFeature}
            />
        </MainLayout>
    );
}
