"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import MainLayout from "@/app/main/layout";
import { PostCard } from "@/components/post/PostCard";
import Image from "next/image";

// Mock Data (Shared with Home/Navbar for consistency in this demo)
const mockPosts = [
    {
        id: "1",
        author: {
            name: "Nguyễn Văn A",
            avatar: "/userAvatar.png",
            username: "@nguyenvana",
        },
        content: "Hôm nay thời tiết thật đẹp! Đi chơi với bạn bè tại công viên.",
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop",
        likes: 245,
        comments: 32,
        shares: 12,
        timestamp: "2 giờ trước",
        type: "post"
    },
    {
        id: "2",
        author: {
            name: "Trần Thị B",
            avatar: "/userAvatar.png",
            username: "@tranthib",
        },
        content: "Vừa hoàn thành một dự án quan trọng! Cảm thấy rất tự hào về kết quả.",
        likes: 156,
        comments: 18,
        shares: 8,
        timestamp: "4 giờ trước",
        type: "post"
    },
    {
        id: "3",
        author: {
            name: "Lê Minh C",
            avatar: "/userAvatar.png",
            username: "@leminhc",
        },
        content: "Ai muốn đi ăn cơm tối nay không? Có quán ngon gần đây! 🍜",
        likes: 89,
        comments: 24,
        shares: 5,
        timestamp: "6 giờ trước",
        type: "post"
    },
    {
        id: "4",
        author: {
            name: "Phạm Văn D",
            avatar: "/userAvatar.png",
            username: "@phamvand",
        },
        content: "Mọi người nghĩ sao về việc học lập trình AI? Tớ thấy nó rất thú vị!",
        likes: 45,
        comments: 10,
        shares: 2,
        timestamp: "1 ngày trước",
        type: "post"
    },
];

const mockVideos = [
    {
        id: "v1",
        author: {
            name: "Nguyễn Văn A",
            avatar: "/userAvatar.png",
            username: "@nguyenvana",
        },
        content: "Vlog du lịch Đà Nẵng - Ngày đầu tiên khám phá thành phố!",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        likes: 542,
        comments: 87,
        shares: 45,
        timestamp: "1 giờ trước",
        type: "video"
    },
    {
        id: "v2",
        author: {
            name: "Trần Thị B",
            avatar: "/userAvatar.png",
            username: "@tranthib",
        },
        content: "Hướng dẫn nấu ăn: Cách làm bánh mì thơm ngon kiểu Việt Nam 👨‍🍳",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        likes: 893,
        comments: 156,
        shares: 234,
        timestamp: "3 giờ trước",
        type: "video"
    },
];

const mockUsers = [
    { id: "u1", name: "Nguyễn Văn A", username: "@nguyenvana", avatar: "/userAvatar.png" },
    { id: "u2", name: "Trần Thị B", username: "@tranthib", avatar: "/userAvatar.png" },
    { id: "u3", name: "Lê Minh C", username: "@leminhc", avatar: "/userAvatar.png" },
    { id: "u4", name: "Phạm Văn D", username: "@phamvand", avatar: "/userAvatar.png" },
];


export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";

    const lowerQuery = query.toLowerCase();

    const [activeTab, setActiveTab] = useState<"all" | "posts" | "people" | "videos">("all");

    const filteredPosts = query
        ? mockPosts.filter((post) =>
            post.content.toLowerCase().includes(lowerQuery) ||
            post.author.name.toLowerCase().includes(lowerQuery)
        )
        : [];

    const filteredVideos = query
        ? mockVideos.filter((video) =>
            video.content.toLowerCase().includes(lowerQuery) ||
            video.author.name.toLowerCase().includes(lowerQuery)
        )
        : [];

    const filteredUsers = query
        ? mockUsers.filter((user) =>
            user.name.toLowerCase().includes(lowerQuery) ||
            user.username.toLowerCase().includes(lowerQuery)
        )
        : [];

    const renderUsers = () => (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Mọi người</h2>
            {filteredUsers.length > 0 ? (
                <div className="space-y-4">
                    {filteredUsers.map(user => (
                        <div
                            key={user.id}
                            onClick={() => router.push(`/profile/${user.id}`)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                        >
                            <Image src={user.avatar} alt={user.name} width={48} height={48} className="rounded-full bg-gray-100 ring-2 ring-gray-50" />
                            <div>
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.username}</p>
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

    const renderPosts = (items: typeof mockPosts, title: string = "Bài viết") => (
        <div className="space-y-5">
            {activeTab !== 'all' && <h2 className="text-lg font-bold text-gray-800">{title}</h2>}
            {items.length > 0 ? (
                items.map((post) => (
                    <PostCard
                        key={post.id}
                        {...post}
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
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Kết quả tìm kiếm cho: <span className="text-[#f9622e]">&quot;{query}&quot;</span>
                    </h1>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {[
                            { id: 'all', label: 'Tất cả' },
                            { id: 'posts', label: 'Bài viết' },
                            { id: 'people', label: 'Mọi người' },
                            { id: 'videos', label: 'Video' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as "all" | "posts" | "people" | "videos")}
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
                <div className="space-y-8">
                    {activeTab === 'all' && (
                        <>
                            {filteredUsers.length > 0 && renderUsers()}
                            <div>
                                <h2 className="text-lg font-bold mb-4 text-gray-800">Bài viết & Video</h2>
                                {renderPosts([...filteredPosts, ...filteredVideos])}
                            </div>
                        </>
                    )}

                    {activeTab === 'people' && renderUsers()}

                    {activeTab === 'posts' && renderPosts(filteredPosts)}

                    {activeTab === 'videos' && renderPosts(filteredVideos, "Video")}
                </div>
            </div>
        </MainLayout>
    );
}
