"use client";

import { useState, useEffect, useCallback } from "react";
import { CreatePost } from "@/components/post/CreatePost";
import { PostCard } from "@/components/post/PostCard";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";
import { postAPI } from "@/services/post.service";

interface Post {
  id: string;
  author: {
    id?: string;
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
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await postAPI.getPosts(1, 10);
      interface PostData {
        id: string;
        author: {
          id: string;
          name: string;
          avatarUrl: string;
        };
        content: string;
        mediaUrls?: string[];
        _count?: {
          reactions?: number;
          comments?: number;
        };
        createdAt: string;
      }
      
      // Handle both paginated and non-paginated responses
      const postsData = res.data || res;
      if (!Array.isArray(postsData)) {
        throw new Error('Invalid posts data format');
      }
      
      const mappedPosts = postsData.map((p: PostData) => ({
        id: p.id,
        author: {
          id: p.author.id,
          name: p.author.name,
          avatar: p.author.avatarUrl || "/userAvatar.png",
          username: "@" + (p.author.name ? p.author.name.replace(/\s+/g, '').toLowerCase() : "user")
        },
        content: p.content,
        image: p.mediaUrls && p.mediaUrls.length > 0 && !p.mediaUrls[0].endsWith(".mp4") ? p.mediaUrls[0] : undefined,
        video: p.mediaUrls && p.mediaUrls.length > 0 && p.mediaUrls[0].endsWith(".mp4") ? p.mediaUrls[0] : undefined,
        likes: p._count?.reactions || 0,
        comments: p._count?.comments || 0,
        shares: 0,
        timestamp: new Date(p.createdAt).toLocaleString('vi-VN'),
      }));
      setPosts(mappedPosts);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      const errorMsg = error instanceof Error ? error.message : "Không thể tải bài viết";
      toast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchPosts]);

  const handleCreatePost = async (postData: {
    content: string;
    media: { url: string; type: "image" | "video" }[];
    privacy: string;
    feeling?: string;
    location?: string;
    taggedUserIds?: string[];
  }) => {
    try {
      await postAPI.createPost({
        content: postData.content,
        privacy: postData.privacy as "public" | "friends" | "private",
        mediaUrls: [], // Backend doesn't support media uploads yet
        feeling: postData.feeling,
        location: postData.location,
        taggedUserIds: postData.taggedUserIds
      });

      toast("Đăng bài viết thành công!", "success");
      // Refresh posts list to show the newly created post
      await fetchPosts();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Đăng bài viết thất bại";
      toast(errorMessage, "error");
      throw error;
    }
  };

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
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Đang tải bài viết...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              isOwner={!!(user && post.author.id === user.id)}
              onDelete={() => handleDeletePost(post.id)}
              onEdit={(newContent) => handleEditPost(post.id, newContent)}
              onReport={() => handleReportPost(post.id)}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Chưa có bài viết nào.</div>
        )}
      </div>
    </div>
  );
}
