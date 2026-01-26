"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { friendsAPI } from "@/services/friends.service";
import MainLayout from "@/app/main/layout";
import { PostCard } from "@/components/post/PostCard";
import Image from "next/image";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthPromptModal } from "@/components/ui/AuthPromptModal";
import { postAPI } from "@/services/post.service";

// No mock data needed, results fetched from API

interface SearchResultUser {
    id: string;
    name: string;
    avatarUrl?: string;
    email: string;
}

interface SearchGroup {
    id: string;
    name: string;
    cover: string;
    members: number;
    privacy: string;
}

interface SearchPost {
    id: string;
    content: string;
    mediaUrls?: string[];
    video?: string;
    type?: string;
    _count?: {
        reactions: number;
        comments: number;
    };
    likes?: number;
    comments?: number;
    shares?: number;
    createdAt: string;
    author: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";

    const lowerQuery = query.toLowerCase();

    const { isAuthenticated } = useAuth();
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

    const [activeTab, setActiveTab] = useState<"all" | "posts" | "people" | "videos" | "groups">("all");
    const [users, setUsers] = useState<SearchResultUser[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [posts, setPosts] = useState<SearchPost[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);

    useEffect(() => {
        if (query) {
            const fetchUsers = async () => {
                setIsLoadingUsers(true);
                try {
                    const results = await friendsAPI.searchUsers(query);
                    setUsers(results);
                } catch (error) {
                    console.error("Failed to fetch users:", error);
                    setUsers([]);
                } finally {
                    setIsLoadingUsers(false);
                }
            };

            const fetchPosts = async () => {
                setIsLoadingPosts(true);
                try {
                    let result;
                    if (query.startsWith('#')) {
                        result = await postAPI.searchByHashtag(query.substring(1));
                    } else {
                        // Fallback: search by text in latest posts if backend doesn't support specific search
                        // In a real app, backend would handle this. 
                        // For now we use getPosts and filter for the demo.
                        result = await postAPI.getPosts(1, 50);
                        if (result.data) {
                            result.data = result.data.filter((p: SearchPost) =>
                                p.content.toLowerCase().includes(query.toLowerCase()) ||
                                p.author.name.toLowerCase().includes(query.toLowerCase())
                            );
                        }
                    }
                    setPosts(result.data || []);
                } catch (error) {
                    console.error("Failed to fetch posts:", error);
                    setPosts([]);
                } finally {
                    setIsLoadingPosts(false);
                }
            };

            fetchUsers();
            fetchPosts();
        } else {
            setUsers([]);
            setPosts([]);
        }
    }, [query]);

    const filteredPosts = posts;
    const filteredVideos = posts.filter(p => p.type === 'video');
    const filteredUsers = users;
    const filteredGroups: SearchGroup[] = [];

    const renderUsers = () => (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Mọi người</h2>
            {isLoadingUsers ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f9622e]"></div>
                </div>
            ) : filteredUsers.length > 0 ? (
                <div className="space-y-4">
                    {filteredUsers.map(user => (
                        <div
                            key={user.id}
                            onClick={() => router.push(`/profile/${user.id}`)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                        >
                            <Image src={user.avatarUrl || "/userAvatar.png"} alt={user.name} width={48} height={48} className="rounded-full bg-gray-100 ring-2 ring-gray-50" />
                            <div>
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/profile/${user.id}`);
                                }}
                                className="ml-auto text-sm cursor-pointer font-medium text-[#f9622e] bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors"
                            >
                                Xem trang cá nhân
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4">Không tìm thấy người dùng nào.</p>
            )}
        </div>
    );

    const renderGroups = () => (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Nhóm</h2>
            {filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGroups.map(group => (
                        <div key={group.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 duration-200 bg-white">
                            <div className="h-24 relative bg-gray-100">
                                <Image src={group.cover} alt={group.name} fill className="object-cover" />
                            </div>
                            <div className="p-3">
                                <h3 className="font-semibold text-gray-900 truncate" title={group.name}>{group.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 mb-2">
                                    <Users className="h-3 w-3" />
                                    <span>{group.members.toLocaleString()} thành viên</span>
                                    <span>•</span>
                                    <span>{group.privacy}</span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleProtectedAction("tham gia nhóm", () => {
                                            // Mock join action
                                            console.log("Joined group", group.id);
                                        });
                                    }}
                                    className="w-full mt-2 cursor-pointer py-2.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-[#f9622e]/10 hover:text-[#f9622e] transition-colors"
                                >
                                    Tham gia nhóm
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                    <p className="text-lg text-gray-500">
                        Không tìm thấy nhóm nào phù hợp.
                    </p>
                </div>
            )}
        </div>
    );

    const renderPosts = (items: SearchPost[], title: string = "Bài viết") => (
        <div className="space-y-4">
            {activeTab !== 'all' && <h2 className="text-lg font-bold text-gray-800 mb-3">{title}</h2>}
            {isLoadingPosts ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f9622e]"></div>
                        <p className="text-sm text-gray-500">Đang tìm bài viết...</p>
                    </div>
                </div>
            ) : items.length > 0 ? (
                items.map((post) => (
                    <PostCard
                        key={post.id}
                        {...post}
                        author={{
                            id: post.author.id,
                            name: post.author.name,
                            avatar: post.author.avatarUrl || "/userAvatar.png"
                        }}
                        image={post.mediaUrls?.[0]}
                        likes={post.likes ?? post._count?.reactions ?? 0}
                        comments={post.comments ?? post._count?.comments ?? 0}
                        shares={post.shares ?? 0}
                        timestamp={new Date(post.createdAt).toLocaleString("vi-VN")}
                        isOwner={false}
                    />
                ))
            ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                    <p className="text-lg text-gray-500">
                        Không tìm thấy kết quả nào.
                    </p>
                </div>
            )}
        </div>
    );

    return (
        <MainLayout>
            <div className="mx-auto max-w-2xl min-h-screen pb-10">
                <div className="mb-3.5">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Kết quả tìm kiếm cho: <span className="text-[#f9622e]">&quot;{query}&quot;</span>
                    </h1>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {([
                            { id: 'all', label: 'Tất cả' },
                            { id: 'posts', label: 'Bài viết' },
                            { id: 'people', label: 'Mọi người' },
                            { id: 'groups', label: 'Nhóm' },
                            { id: 'videos', label: 'Video' },
                        ] as const).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap duration-200 transition-all ${activeTab === tab.id
                                    ? 'bg-[#f9622e] text-white shadow-md shadow-orange-200'
                                    : 'bg-white text-gray-600 cursor-pointer hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content based on Active Tab */}
                <div className="space-y-4">
                    {activeTab === 'all' && (
                        <>
                            {(filteredUsers.length > 0 || isLoadingUsers) && renderUsers()}
                            {filteredGroups.length > 0 && renderGroups()}
                            <div>
                                <h2 className="text-lg font-bold mb-3 text-gray-800">Bài viết & Video</h2>
                                {(filteredPosts.length > 0 || filteredVideos.length > 0 || isLoadingPosts)
                                    ? renderPosts([...filteredPosts, ...filteredVideos])
                                    : (
                                        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                                            <p className="text-lg text-gray-500">
                                                Không tìm thấy bài viết hoặc video nào.
                                            </p>
                                        </div>
                                    )
                                }
                            </div>
                        </>
                    )}

                    {activeTab === 'people' && renderUsers()}

                    {activeTab === 'groups' && renderGroups()}

                    {activeTab === 'posts' && renderPosts(filteredPosts)}

                    {activeTab === 'videos' && renderPosts(filteredVideos, "Video")}
                </div>
                <AuthPromptModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    feature={authFeature}
                />
            </div>
        </MainLayout>
    );
}
