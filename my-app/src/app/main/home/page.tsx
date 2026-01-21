"use client";

import { useState, useEffect } from "react";
import { CreatePost } from "@/components/post/CreatePost";
import { PostCard } from "@/components/post/PostCard";
import { useAuth } from "@/hooks/useAuth";

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

export default function HomePage() {
  const { user } = useAuth();

  const currentUser = {
    name: user?.name || "Nguyễn Văn A",
    avatar: user?.avatar || "/userAvatar.png",
    username: user?.username || "@user"
  };

  // Mock data for posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        username: currentUser.username,
      },
      content:
        "Hôm nay thời tiết thật đẹp! Đi chơi với bạn bè tại công viên.",
      image:
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop",
      likes: 245,
      comments: 32,
      shares: 12,
      timestamp: "2 giờ trước",
    },
    {
      id: "2",
      author: {
        name: "Trần Thị B",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TranB",
      },
      content:
        "Vừa hoàn thành một dự án quan trọng! Cảm thấy rất tự hào về kết quả.",
      likes: 156,
      comments: 18,
      shares: 8,
      timestamp: "4 giờ trước",
    },
    {
      id: "3",
      author: {
        name: "Lê Minh C",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LeMinh",
      },
      content: "Ai muốn đi ăn cơm tối nay không? Có quán ngon gần đây! 🍜",
      likes: 89,
      comments: 24,
      shares: 5,
      timestamp: "6 giờ trước",
    },
  ]);

  // Modal states removed as PostCard handles confirmation internally

  const handleCreatePost = (postData: {
    content: string;
    media: { url: string; type: "image" | "video" } | null;
    privacy: string;
  }) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        username: currentUser.username,
      },
      content: postData.content,
      image: postData.media?.type === "image" ? postData.media.url : undefined,
      video: postData.media?.type === "video" ? postData.media.url : undefined,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: "Vừa xong",
    };
    setPosts([newPost, ...posts]);
  };

  // Sync the first post with logged in user
  useEffect(() => {
    if (user) {
      setPosts(prev => prev.map(p => p.id === "1" ? {
        ...p,
        author: {
          name: user.name,
          avatar: user.avatar || "/userAvatar.png",
          username: user.username || "@user"
        }
      } : p));
    }
  }, [user]);

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleEditPost = (postId: string, newContent: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, content: newContent } : post
      )
    );
  };

  const handleReportPost = (postId: string) => {
    console.log("Reported post:", postId);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Create Post Section */}
      <CreatePost onCreatePost={handleCreatePost} />

      {/* Posts Feed */}
      <div className="space-y-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            isOwner={!!(user && post.author.name === user.name)}
            onDelete={() => handleDeletePost(post.id)}
            onEdit={(newContent) => handleEditPost(post.id, newContent)}
            onReport={() => handleReportPost(post.id)}
          />
        ))}
      </div>

      {/* Modals removed */}
    </div>
  );
}
