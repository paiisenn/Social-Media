"use client";

import { useState } from "react";
import { CreatePost } from "@/components/post/CreatePost";
import { PostCard } from "@/components/post/PostCard";

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
  const currentUser = {
    name: "Nguyễn Văn A",
    avatar: "/userAvatar.png",
  };

  // Mock data for posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "Nguyễn Văn A",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenA",
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Spam");

  const handleCreatePost = (postData: {
    content: string;
    media: { url: string; type: "image" | "video" } | null;
    privacy: string;
  }) => {
    const newPost = {
      id: Date.now().toString(),
      author: {
        name: "Nguyễn Văn A",
        avatar: "/userAvatar.png",
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

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      setPosts(posts.filter((post) => post.id !== postToDelete));
      setPostToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditPost = (postId: string, newContent: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, content: newContent } : post
      )
    );
  };

  const handleReportPost = (postId: string) => {
    setIsReportModalOpen(true);
  };

  const confirmReport = () => {
    setIsReportModalOpen(false);
    alert("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét bài viết này.");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Create Post Section */}
      <CreatePost onCreatePost={handleCreatePost} />

      {/* Posts Feed */}
      <div className="space-y-5">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            isOwner={post.author.name === currentUser.name}
            onDelete={() => handleDeletePost(post.id)}
            onEdit={(newContent) => handleEditPost(post.id, newContent)}
            onReport={() => handleReportPost(post.id)}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xác nhận xóa bài viết?
            </h3>
            <p className="text-gray-600 mb-6">
              Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi dòng thời gian của bạn.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Báo cáo bài viết
            </h3>
            <p className="text-gray-600 mb-4">
              Hãy chọn lý do bạn muốn báo cáo bài viết này:
            </p>

            <div className="space-y-2 mb-6">
              {['Spam', 'Nội dung không phù hợp', 'Bạo lực', 'Thông tin sai lệch'].map((reason) => (
                <label key={reason} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="text-[#f9622e] focus:ring-[#f9622e]"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmReport}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
