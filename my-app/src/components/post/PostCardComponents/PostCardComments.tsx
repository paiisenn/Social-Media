"use client";

import Image from "next/image";
import { Send, Loader2, Filter, Heart, ThumbsUp } from "lucide-react";
import { Comment } from "../PostCard.types";
import { useRouter } from "next/navigation";

interface PostCardCommentsProps {
    commentsList: Comment[];
    commentText: string;
    isSubmittingComment: boolean;
    isLoadingComments: boolean;
    commentSortOrder: "newest" | "oldest";
    onCommentTextChange: (value: string) => void;
    onSubmitComment: () => void;
    onSortToggle: () => void;
    onCommentReaction: (commentId: string, type: string) => void;
}

export function PostCardComments({
    commentsList,
    commentText,
    isSubmittingComment,
    isLoadingComments,
    commentSortOrder,
    onCommentTextChange,
    onSubmitComment,
    onSortToggle,
    onCommentReaction
}: PostCardCommentsProps) {
    const router = useRouter();

    const sortedComments = [...commentsList].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return commentSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    const getCommentReactionIcon = (reactionType: string | null | undefined, size = "w-4 h-4") => {
        if (reactionType === "LOVE") return <Heart className={`${size} fill-red-500 text-red-500`} />;
        if (reactionType === "HAHA") return <span className="text-sm">😆</span>;
        if (reactionType === "WOW") return <span className="text-sm">😮</span>;
        if (reactionType === "SAD") return <span className="text-sm">😢</span>;
        if (reactionType === "ANGRY") return <span className="text-sm">😡</span>;
        return <ThumbsUp className={`${size} ${reactionType ? "fill-[#f9622e] text-[#f9622e]" : "text-gray-400"}`} />;
    };

    return (
        <div className="mt-3.5 pt-3.5 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Comment Input */}
            <div className="flex gap-3 mb-6">
                <Image
                    src="/userAvatar.png"
                    alt="Current User"
                    width={32}
                    height={32}
                    className="rounded-full object-cover w-8 h-8 ring-2 ring-gray-50"
                />
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => onCommentTextChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSubmitComment()}
                        placeholder="Viết bình luận..."
                        className="w-full bg-gray-50 border-none outline-none rounded-xl py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-[#f9622e] focus:bg-white transition-all"
                    />
                    <button
                        onClick={onSubmitComment}
                        disabled={!commentText.trim() || isSubmittingComment}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#f9622e] hover:bg-orange-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmittingComment ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Send size={16} />
                        )}
                    </button>
                </div>
            </div>

            {/* Comment Controls (Sort) */}
            {commentsList.length > 0 && (
                <div className="flex items-center justify-between mb-4 px-1">
                    <span className="text-sm font-bold text-gray-700">Tất cả bình luận</span>
                    <button
                        onClick={onSortToggle}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#f9622e] transition-colors bg-gray-50 px-2 py-1 rounded-lg cursor-pointer"
                    >
                        <Filter size={12} />
                        Sắp xếp: {commentSortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}
                    </button>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {isLoadingComments ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-[#f9622e]" />
                        <span className="text-sm font-medium">Đang tải bình luận...</span>
                    </div>
                ) : sortedComments.length > 0 ? (
                    sortedComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 group">
                            <Image
                                src={comment.author.avatar}
                                alt={comment.author.name}
                                width={32}
                                height={32}
                                className="rounded-full object-cover w-8 h-8 ring-2 ring-gray-50 shrink-0"
                            />
                            <div className="flex-1">
                                <div className="relative inline-block max-w-[90%]">
                                    <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2">
                                        <h5
                                            onClick={() => router.push(`/profile/${comment.author.id || '#'}`)}
                                            className="text-[13px] font-bold text-gray-900 hover:underline hover:text-[#f9622e] transition-colors duration-150 cursor-pointer"
                                        >
                                            {comment.author.name}
                                        </h5>
                                        <p className="text-sm text-gray-800 mt-0.5 leading-relaxed">{comment.content}</p>
                                    </div>

                                    {comment.likes > 0 && (
                                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full shadow-sm border border-gray-100 px-1.5 py-0.5 flex items-center gap-1 scale-90">
                                            {getCommentReactionIcon(comment.reactionType, "w-3 h-3")}
                                            <span className="text-[10px] font-bold text-gray-500">{comment.likes}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 mt-1.5 ml-2">
                                    <span className="text-xs text-gray-500 font-medium">{comment.timestamp}</span>
                                    <button
                                        onClick={() => onCommentReaction(comment.id, "LIKE")}
                                        className="text-xs font-bold text-gray-500 hover:text-[#f9622e] transition-colors"
                                    >
                                        Thích
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-400 text-sm italic">
                        Chưa có bình luận nào. Hãy là người đầu tiên!
                    </div>
                )}
            </div>
        </div>
    );
}
