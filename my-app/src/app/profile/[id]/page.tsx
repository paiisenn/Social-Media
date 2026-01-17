"use client";

import Image from "next/image";
import {
    MapPin,
    Calendar,
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
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useRef, useState, useEffect } from "react";
import MainLayout from "@/app/main/layout";
import { PostCard } from "@/components/post/PostCard";
import { useRouter, useParams } from "next/navigation";

// Mock Data Database
const MOCK_DB = {
    users: {
        "u1": {
            id: "u1",
            firstName: "Nguyễn Văn",
            lastName: "A",
            username: "@nguyenvana",
            bio: "Yêu thích công nghệ và du lịch 🌏",
            avatar: "/userAvatar.png",
            coverImage: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=400&fit=crop",
            location: "Hà Nội, Vietnam",
            website: "https://nguyenvana.com",
            joinDate: "2023-05-20",
            stats: { posts: 15, followers: 120, following: 50 },
            isFollowing: false,
        },
        "u2": {
            id: "u2",
            firstName: "Trần Thị",
            lastName: "B",
            username: "@tranthib",
            bio: "Đam mê nấu ăn và làm bánh 🍰",
            avatar: "/userAvatar.png",
            coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
            location: "Đà Nẵng, Vietnam",
            website: "",
            joinDate: "2023-08-10",
            stats: { posts: 42, followers: 850, following: 300 },
            isFollowing: true,
        },
        "u3": {
            id: "u3",
            firstName: "Lê Minh",
            lastName: "C",
            username: "@leminhc",
            bio: "Freelancer Designer 🎨",
            avatar: "/userAvatar.png",
            coverImage: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&h=400&fit=crop",
            location: "TP.HCM, Vietnam",
            website: "https://leminhc.design",
            joinDate: "2022-11-01",
            stats: { posts: 8, followers: 1200, following: 40 },
            isFollowing: false,
        },
        "u4": {
            id: "u4",
            firstName: "Phạm Văn",
            lastName: "D",
            username: "@phamvand",
            bio: "Coffee Lover ☕",
            avatar: "/userAvatar.png",
            coverImage: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&h=400&fit=crop",
            location: "Cần Thơ",
            website: "",
            joinDate: "2024-01-01",
            stats: { posts: 5, followers: 45, following: 100 },
            isFollowing: false,
        }
    },
    posts: [
        {
            id: "p1",
            authorId: "u1",
            content: "Hôm nay trời đẹp quá! ☀️",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
            likes: 12,
            comments: 2,
            shares: 0,
            timestamp: "2 giờ trước",
            type: "post"
        },
        {
            id: "p2",
            authorId: "u2",
            content: "Công thức bánh su kem mới nè mọi người ơi!",
            video: "https://www.w3schools.com/html/mov_bbb.mp4",
            likes: 56,
            comments: 10,
            shares: 5,
            timestamp: "1 ngày trước",
            type: "video"
        }
    ]
};

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
    });
}

function formatStatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
}

export default function UserProfilePage() {
    const params = useParams(); // Get ID from URL
    const router = useRouter();
    const userId = params.id as string;
    const { toast } = useToast();

    // State
    const [userData, setUserData] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState<"posts" | "friends" | "photos" | "videos">("posts");
    const [isLoading, setIsLoading] = useState(true);

    // Define isOwnProfile - For simplified demo, assume logged in user is NOT any of these ID unless specified
    // In real app, check context/auth
    const isOwnProfile = false;

    // Refs for tab underline
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const [tabUnderlineStyle, setTabUnderlineStyle] = useState({ left: 0, width: 0 });

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
        navigator.clipboard.writeText(url).then(() => {
            toast("Đã sao chép liên kết trang cá nhân!", "success");
            setIsMenuOpen(false);
        }).catch(() => {
            toast("Không thể sao chép liên kết.", "error");
        });
    };

    const handleReportUser = () => {
        setIsMenuOpen(false);
        // Implement report logic modal here
        alert("Đã gửi báo cáo người dùng. Chúng tôi sẽ xem xét.");
    };

    const handleBlockUser = () => {
        setIsMenuOpen(false);
        // Implement block logic here
        alert(`Đã chặn người dùng ${userData?.firstName}.`);
    };

    useEffect(() => {
        // Simulate Fetching Data
        setIsLoading(true);
        setTimeout(() => {
            const user = MOCK_DB.users[userId as keyof typeof MOCK_DB.users];

            if (user) {
                setUserData(user);
                setIsFollowing(user.isFollowing);

                // Filter posts for this user
                const userPosts = MOCK_DB.posts.filter(p => p.authorId === userId).map(p => ({
                    ...p,
                    author: {
                        name: `${user.firstName} ${user.lastName}`,
                        avatar: user.avatar,
                        username: user.username
                    }
                }));
                setPosts(userPosts);
            }
            setIsLoading(false);
        }, 500);
    }, [userId]);


    useEffect(() => {
        const activeTabIndex = ["posts", "friends", "photos", "videos"].indexOf(activeTab);
        const currentTab = tabsRef.current[activeTabIndex];
        if (currentTab) {
            setTabUnderlineStyle({ left: currentTab.offsetLeft, width: currentTab.offsetWidth });
        }
    }, [activeTab]);


    const handleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    const tabs = [
        { key: "posts", label: "Bài đăng", icon: null },
        { key: "friends", label: "Bạn bè", icon: null, count: userData?.stats.followers || 0 }, // Using followers as friends count for simplicity
        { key: "photos", label: "Ảnh", icon: null, count: 5 },
        { key: "videos", label: "Video", icon: null, count: 2 },
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy người dùng</h2>
                    <p className="text-gray-500">Người dùng này không tồn tại hoặc đã bị xóa.</p>
                    <button onClick={() => router.back()} className="mt-4 text-[#f9622e] hover:underline">Quay lại</button>
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
                                alt="Cover"
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
                                alt={`${userData.firstName} ${userData.lastName}`}
                                width={160}
                                height={160}
                                className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-lg bg-white"
                            />
                        </div>

                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {userData.firstName} {userData.lastName}
                                </h1>
                                <p className="text-lg text-gray-600 mb-2">
                                    {userData.username}
                                </p>

                                <div className="mb-3 text-gray-600">
                                    <span className="font-semibold">
                                        {formatStatNumber(userData.stats.followers)}
                                    </span>{" "}
                                    followers •{" "}
                                    <span className="font-semibold">
                                        {formatStatNumber(userData.stats.following)}
                                    </span>{" "}
                                    following
                                </div>

                                {userData.bio && <p className="mb-3 max-w-2xl text-gray-700">{userData.bio}</p>}

                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 flex-col">
                                    {userData.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {userData.location}
                                        </div>
                                    )}
                                    {userData.website && (
                                        <div className="flex items-center gap-1">
                                            <LinkIcon className="h-4 w-4" />
                                            <a href={userData.website} className="text-[#f9622e] hover:underline" target="_blank">
                                                {userData.website.replace("https://", "")}
                                            </a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Đã tham gia từ {formatDate(userData.joinDate)}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleFollow}
                                    className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isFollowing
                                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        : "bg-[#f9622e] text-white hover:bg-[#e0501e]"
                                        }`}
                                >
                                    {isFollowing ? (
                                        <>
                                            <UserCheck className="h-4 w-4" />
                                            Đang theo dõi
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4" />
                                            Theo dõi
                                        </>
                                    )}
                                </button>
                                <button className="flex items-center cursor-pointer gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200">
                                    <MessageCircle className="h-4 w-4" />
                                    Nhắn tin
                                </button>

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
                                                    onClick={() => { setIsMenuOpen(false); toast("Tính năng chia sẻ đang phát triển", "info"); }}
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
                                ref={(el) => { tabsRef.current[index] = el; }}
                                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                                className={`relative z-10 flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap hover:bg-gray-50 ${activeTab === tab.key
                                    ? "text-[#f9622e]"
                                    : "text-gray-500 cursor-pointer hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                                {tab.count && (
                                    <span className={`rounded-full px-2 py-1 text-xs transition-colors duration-300 ${activeTab === tab.key ? "bg-orange-100 text-[#f9622e]" : "bg-gray-100 text-gray-600"
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                        <div
                            className="absolute bottom-0 h-0.5 bg-[#f9622e] transition-all duration-300 ease-in-out z-20"
                            style={{ left: tabUnderlineStyle.left, width: tabUnderlineStyle.width }}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className={`flex gap-6 ${activeTab !== 'posts' ? 'flex-col' : 'flex-row items-start'}`}>
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
                            // Reusing Friend Grid from Profile Page but adapted
                            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                                <h2 className="mb-4 text-xl font-bold text-gray-900">
                                    Friends
                                </h2>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                    {/* Mock Friends for this user */}
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i}
                                            className="rounded-lg border border-gray-100 p-3 text-center transition-shadow hover:shadow-md cursor-pointer"
                                            onClick={() => router.push(`/profile/u${(i % 4) + 1}`)} // Cycle through mock users
                                        >
                                            <Image
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Friend${i + userId}`} // Vary avatar by current user + index
                                                alt={`Friend ${i + 1}`}
                                                width={100}
                                                height={100}
                                                className="mx-auto h-24 w-24 rounded-full object-cover bg-gray-50"
                                            />
                                            <p className="mt-3 font-semibold text-gray-900 truncate">
                                                Friend {i + 1}
                                            </p>
                                            <p className="text-sm text-gray-500">Mutual friends</p>
                                            <button className="mt-3 w-full rounded-md bg-blue-50 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors">
                                                Add Friend
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Photos/Video Tabs (Simplified Mock) */}
                        {activeTab === "photos" && (
                            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                                <p className="text-gray-500 text-center">Chưa có ảnh nào.</p>
                            </div>
                        )}
                        {activeTab === "videos" && (
                            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                                <p className="text-gray-500 text-center">Chưa có video nào.</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
