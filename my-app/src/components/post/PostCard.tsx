"use client"

import { Heart, MessageCircle, Share, MoreHorizontal, Bookmark, Trash2, Edit, X, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface PostCardProps {
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
  initialIsLiked?: boolean;
  initialIsSaved?: boolean;
  isOwner?: boolean;
  onDelete?: () => void;
  onEdit?: (newContent: string) => void;
}

export function PostCard({
  author,
  content,
  image,
  video,
  likes: initialLikes,
  comments,
  shares,
  timestamp,
  initialIsLiked = false,
  initialIsSaved = false,
  isOwner = false,
  onDelete,
  onEdit,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContent(content);
    setIsMenuOpen(false);
  };

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(editedContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(content);
  };

  // Generate a username if not provided
  const username = author.username || "@" + author.name.toLowerCase().replace(/\s+/g, "");

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Image
            src="/userAvatar.png"
            alt={author.name}
            width={40}
            height={40}
            className="rounded-full object-cover ring-2 ring-gray-50"
          />
          <div>
            <h4 className="font-bold text-gray-900 leading-none hover:text-[#f9622e] cursor-pointer transition-colors">
              {author.name}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {username} • {timestamp}
            </p>
          </div>
        </div>
        
        {isOwner ? (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={handleEditClick}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <Edit size={16} />
                  Chỉnh sửa
                </button>
                <button 
                  onClick={() => { onDelete?.(); setIsMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <Trash2 size={16} />
                  Xóa bài
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors cursor-pointer">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-[15px] text-gray-800 focus:border-[#f9622e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f9622e]/10"
              rows={3}
              autoFocus
            />
            <div className="mt-2 flex justify-end gap-2">
              <button 
                onClick={handleCancelEdit}
                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X size={14} /> Hủy
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex items-center gap-1 rounded-lg bg-[#f9622e] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#d84e1e] transition-colors"
              >
                <Check size={14} /> Lưu
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 whitespace-pre-line leading-relaxed mb-3 text-[15px]">
            {content}
          </p>
        )}
        
        {image && (
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 mt-3">
            <Image
              src={image}
              alt="Post content"
              width={600}
              height={400}
              className="w-full h-auto object-cover max-h-125"
            />
          </div>
        )}
        {video && (
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 mt-3">
            <video
              src={video}
              controls
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
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors group cursor-pointer ${
              isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <div
              className={`p-2 rounded-full transition-colors ${
                isLiked ? "bg-red-50" : "group-hover:bg-red-50"
              }`}
            >
              <Heart
                className={`w-5 h-5 group-active:scale-90 transition-transform ${
                  isLiked ? "fill-red-500" : ""
                }`}
              />
            </div>
            <span className="text-sm font-medium">
              {likeCount.toLocaleString()}
            </span>
          </button>

          {/* Comment Button */}
          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors group cursor-pointer">
            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
              <MessageCircle className="w-5 h-5 group-active:scale-90 transition-transform" />
            </div>
            <span className="text-sm font-medium">
              {comments.toLocaleString()}
            </span>
          </button>

          {/* Share Button */}
          <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors group cursor-pointer">
            <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
              <Share className="w-5 h-5 group-active:scale-90 transition-transform" />
            </div>
            <span className="text-sm font-medium">
              {shares.toLocaleString()}
            </span>
          </button>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleSave}
          className={`p-2 rounded-full transition-colors cursor-pointer group ${
            isSaved
              ? "text-[#f9622e] bg-orange-50"
              : "text-gray-500 hover:bg-gray-50 hover:text-[#f9622e]"
          }`}
        >
          <Bookmark
            className={`w-5 h-5 transition-transform group-active:scale-90 ${
              isSaved ? "fill-[#f9622e]" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
