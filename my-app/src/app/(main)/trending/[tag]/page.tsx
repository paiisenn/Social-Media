"use client";

import { use, useState, useEffect } from "react";

import {
    TrendingUp,
    ArrowLeft,
    Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";
import { AuthPromptModal } from "@/components/ui/AuthPromptModal";
import { postAPI } from "@/services/post.service";
import { PostCard } from "@/components/post/PostCard";

export default function TrendingPage({
    params,
}: {
    params: Promise<{ tag: string }>;
}) {
    // Unwrap params using use() hook
    const { tag } = use(params);
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const [activeFilter, setActiveFilter] = useState("top");
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Auth modal state (keeping these as they might be needed for some actions if PostCard doesn't handle them all, but PostCard usually does)
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalFeature, setAuthModalFeature] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await postAPI.searchByHashtag(tag);
                const data = Array.isArray(response) ? response : (response as any).data || [];
                setPosts(data);
            } catch (error) {
                console.error("Error fetching trending posts:", error);
                toast("Không thể tải bài viết. Vui lòng thử lại.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [tag, toast]);

    const tagName = `#${tag}`;
    const tagDesc = `Khám phá các bài viết phổ biến liên quan đến #${tag}.`;

    return (
        <>
            <div className="mx-auto max-w-4xl pb-2">
                {/* Header Section */}
                <div className="mb-4 rounded-2xl bg-white px-6 py-4 shadow-sm border border-gray-100 relative overflow-hidden">
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
                                <h1 className="text-2xl font-black text-gray-900 mb-0.5">
                                    {tagName}
                                </h1>
                                <p className="text-gray-500 max-w-xl leading-relaxed">
                                    {tagDesc}
                                </p>
                                <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
                                    <span className="font-semibold text-gray-900">
                                        {posts.length}
                                    </span>{" "}
                                    bài viết
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="sticky top-14 z-30 bg-gray-100/95 backdrop-blur-md py-1.5 -mx-4 px-4 mb-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
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
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <Loader2 className="w-10 h-10 animate-spin text-[#f9622e] mb-4" />
                            <p className="font-medium">Đang tải bài viết...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="mb-4 inline-flex p-4 rounded-full bg-gray-50">
                                <TrendingUp className="w-10 h-10 text-gray-300" />
                            </div>
                            <p className="text-lg font-medium">Chưa có bài viết nào cho hashtag này.</p>
                            <p className="text-sm text-gray-400 mt-1">Hãy là người đầu tiên đăng bài với #{tag}!</p>
                        </div>
                    ) : (
                        posts
                            .filter(post => {
                                if (activeFilter === "media") {
                                    return post.image || post.video || (post.media && post.media.length > 0);
                                }
                                return true;
                            })
                            .map((post) => (
                                <PostCard
                                    key={post.id}
                                    id={post.id}
                                    author={{
                                        id: post.author?.id,
                                        name: post.author?.name || "Người dùng",
                                        avatar: post.author?.avatarUrl || "/userAvatar.png",
                                        username: post.author?.username
                                    }}
                                    content={post.content}
                                    image={post.image || (post.media && post.media[0]?.type === 'IMAGE' ? post.media[0].url : undefined)}
                                    video={post.video || (post.media && post.media[0]?.type === 'VIDEO' ? post.media[0].url : undefined)}
                                    likes={post._count?.reactions || 0}
                                    comments={post._count?.comments || 0}
                                    shares={0}
                                    timestamp={new Date(post.createdAt).toLocaleDateString("vi-VN")}
                                    initialIsLiked={post.reactions && post.reactions.length > 0}
                                    initialIsSaved={postAPI.isPostSaved(post.id)}
                                    isOwner={user?.id === post.author?.id}
                                    reactionType={post.reactions?.[0]?.type || postAPI.getLocalReaction(post.id)}
                                />
                            ))
                    )}
                </div>
            </div>

            <AuthPromptModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                feature={authModalFeature}
            />
        </>
    );
}
