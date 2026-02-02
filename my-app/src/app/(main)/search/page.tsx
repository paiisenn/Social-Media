"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
    Search,
    User as UserIcon,
    Hash,
    Loader2,
    ArrowLeft,
    Users,
    MessageSquare,
    TrendingUp
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { friendsAPI } from "@/services/friends.service";
import { postAPI } from "@/services/post.service";
import { PostCard } from "@/components/post/PostCard";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";

interface SearchResultUser {
    id: string;
    name: string;
    avatarUrl?: string;
    email: string;
    bio?: string;
}

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user: currentUser } = useAuth();
    const { toast } = useToast();

    const query = searchParams.get("q") || "";
    const [activeTab, setActiveTab] = useState<"all" | "people" | "posts">("all");
    const [users, setUsers] = useState<SearchResultUser[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!query.trim()) return;

        const performSearch = async () => {
            setIsSearching(true);
            try {
                // Search for users
                const userResults = await friendsAPI.searchUsers(query, 10);
                setUsers(userResults);

                // Post Search Logic
                if (query.startsWith("#")) {
                    const tag = query.substring(1);
                    const postResults = await postAPI.searchByHashtag(tag);
                    const data = Array.isArray(postResults) ? postResults : (postResults as any).data || [];
                    setPosts(data);
                } else {
                    // Search by content: Fetch the feed and filter client-side
                    // (Since we only want to modify the frontend as requested)
                    const feedResults = await postAPI.getPosts(1, 100);
                    const allPosts = Array.isArray(feedResults) ? feedResults : (feedResults as any).data || [];

                    const filteredPosts = allPosts.filter((post: any) =>
                        post.content?.toLowerCase().includes(query.toLowerCase())
                    );
                    setPosts(filteredPosts);
                }
            } catch (error) {
                console.error("Search error:", error);
                toast("Có lỗi xảy ra khi tìm kiếm.", "error");
            } finally {
                setIsSearching(false);
            }
        };

        performSearch();
    }, [query, toast]);

    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim() || !text) return text;
        const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={i} className="text-[#f9622e] font-bold">{part}</span>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </>
        );
    };

    return (
        <div className="mx-auto max-w-4xl pb-10">
            {/* Header Section */}
            <div className="mb-3 rounded-2xl bg-white px-6 py-4 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Search className="w-64 h-64 text-[#f9622e]" />
                </div>

                <div className="relative z-10 text-center">
                    <button
                        onClick={() => router.back()}
                        className="group mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#f9622e] transition-colors cursor-pointer"
                    >
                        <div className="p-1 rounded-full bg-gray-100 group-hover:bg-orange-100 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Quay lại
                    </button>

                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        Kết quả tìm kiếm cho &quot;{query}&quot;
                    </h1>
                    <p className="text-gray-500">
                        Tìm thấy {users.length} người dùng {posts.length > 0 ? `và ${posts.length} bài viết` : ""}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-14 z-30 bg-gray-100/95 backdrop-blur-md py-3 mb-3 flex items-center justify-center gap-4">
                {[
                    { id: "all", label: "Tất cả", icon: Search },
                    { id: "people", label: "Mọi người", icon: Users },
                    { id: "posts", label: "Bài viết", icon: MessageSquare },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === tab.id
                            ? "bg-[#f9622e] text-white shadow-lg shadow-orange-200"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Results */}
            <div className="space-y-8">
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <Loader2 className="w-10 h-10 animate-spin text-[#f9622e] mb-4" />
                        <p className="font-medium">Đang tìm kiếm...</p>
                    </div>
                ) : (
                    <>
                        {/* Users Section */}
                        {(activeTab === "all" || activeTab === "people") && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Users className="w-5 h-5 text-[#f9622e]" />
                                    <h2 className="text-xl font-bold text-gray-800">Mọi người</h2>
                                </div>
                                {users.length === 0 ? (
                                    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
                                        <div className="mb-3 inline-flex p-3 rounded-full bg-orange-50">
                                            <Users className="w-6 h-6 text-orange-300" />
                                        </div>
                                        <p className="text-gray-500">Không tìm thấy người dùng nào phù hợp.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {users.map((user) => (
                                            <Link
                                                key={user.id}
                                                href={`/profile/${user.id}`}
                                                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 duration-200 transition-all group"
                                            >
                                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-transparent group-hover:ring-orange-200 transition-all">
                                                    <Image
                                                        src={user.avatarUrl || "/userAvatar.png"}
                                                        alt={user.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-900 truncate group-hover:text-[#f9622e] transition-colors">
                                                        {highlightText(user.name, query)}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                                    {user.bio && (
                                                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{user.bio}</p>
                                                    )}
                                                </div>
                                                <div className="p-2 rounded-full bg-gray-50 group-hover:bg-orange-50 text-gray-400 group-hover:text-[#f9622e] transition-all">
                                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Posts Section */}
                        {(activeTab === "all" || activeTab === "posts") && (
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-2 px-1">
                                    <TrendingUp className="w-5 h-5 text-[#f9622e]" />
                                    <h2 className="text-xl font-bold text-gray-800">Bài viết</h2>
                                </div>
                                {posts.length === 0 ? (
                                    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
                                        <div className="mb-3 inline-flex p-3 rounded-full bg-orange-50">
                                            <Hash className="w-6 h-6 text-orange-300" />
                                        </div>
                                        <p className="text-gray-500">
                                            {query.startsWith("#")
                                                ? "Không tìm thấy bài viết nào cho hashtag này."
                                                : "Thử tìm kiếm theo hashtag (ví dụ: #vietnam) để thấy bài viết."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {posts.map((post) => (
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
                                                isOwner={currentUser?.id === post.author?.id}
                                                reactionType={post.reactions?.[0]?.type || postAPI.getLocalReaction(post.id)}
                                                highlight={query}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-[#f9622e]" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
