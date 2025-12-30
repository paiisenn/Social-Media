"use client";

import { useState } from "react";
import { PostCard } from "@/components/post/PostCard";
import { PlaySquare } from "lucide-react";

interface Post {
  id: string;
  author: {
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
}

export default function VideoPage() {
  const currentUser = {
    name: "Nguyễn Văn A",
    avatar: "/userAvatar.png",
  };

  // Mock data for video posts
  const [videos, setVideos] = useState<Post[]>([
    {
      id: "v1",
      author: {
        name: "Nguyễn Văn A",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenA",
      },
      content: "Vlog du lịch Đà Nẵng - Ngày đầu tiên khám phá thành phố!",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 542,
      comments: 87,
      shares: 45,
      timestamp: "1 giờ trước",
    },
    {
      id: "v2",
      author: {
        name: "Trần Thị B",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TranB",
      },
      content:
        "Hướng dẫn nấu ăn: Cách làm bánh mì thơm ngon kiểu Việt Nam 👨‍🍳",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 893,
      comments: 156,
      shares: 234,
      timestamp: "3 giờ trước",
    },
    {
      id: "v3",
      author: {
        name: "Lê Minh C",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LeMinh",
      },
      content: "Workout tại nhà - 10 phút tập luyện hiệu quả mỗi ngày 💪",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 421,
      comments: 72,
      shares: 89,
      timestamp: "5 giờ trước",
    },
    {
      id: "v4",
      author: {
        name: "Phạm Thị D",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhamD",
      },
      content: "Makeup tutorial - Trang điểm tự nhiên cho người mặt tròn",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 678,
      comments: 134,
      shares: 156,
      timestamp: "7 giờ trước",
    },
    {
      id: "v5",
      author: {
        name: "Hoàng Văn E",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HoangE",
      },
      content: "Review iPhone 15 Pro Max - Có đáng mua không?",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 1203,
      comments: 289,
      shares: 412,
      timestamp: "8 giờ trước",
    },
  ]);

  // Modal states removed as PostCard handles confirmation internally

  const handleDeleteVideo = (videoId: string) => {
    setVideos(videos.filter((video) => video.id !== videoId));
  };

  const handleEditVideo = (videoId: string, newContent: string) => {
    setVideos(
      videos.map((video) =>
        video.id === videoId ? { ...video, content: newContent } : video
      )
    );
  };

  const handleReportVideo = (videoId: string) => {
    console.log("Reported video:", videoId);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Video Feed Header */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
          <PlaySquare className="w-64 h-64 text-[#f9622e]" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-2 mt-1 bg-linear-to-br from-[#f9622e] to-[#ff8f6b] rounded-2xl shadow-lg shadow-orange-200 text-white group-hover:scale-110 transition-transform duration-300">
            <PlaySquare className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Video Feed</h1>
            <p className="text-gray-500 max-w-xl leading-relaxed">
              Khám phá những video thú vị, trending từ bạn bè và cộng đồng.
            </p>
          </div>
        </div>
      </div>

      {/* Videos Feed */}
      <div className="space-y-5">
        {videos.length > 0 ? (
          videos.map((video) => (
            <PostCard
              key={video.id}
              {...video}
              isOwner={video.author.name === currentUser.name}
              onDelete={() => handleDeleteVideo(video.id)}
              onEdit={(newContent) => handleEditVideo(video.id, newContent)}
              onReport={() => handleReportVideo(video.id)}
            />
          ))
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-lg text-gray-500">Chưa có video nào</p>
          </div>
        )}
      </div>

      {/* Modals removed */}
    </div>
  );
}
