"use client";

import { Heart, ThumbsUp, MessageCircle, Share, Bookmark } from "lucide-react";

interface PostCardActionsProps {
    currentReaction: string | null;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    isSaved: boolean;
    showComments: boolean;
    onReaction: (type: string) => void;
    onCommentToggle: () => void;
    onShare: () => void;
    onSave: () => void;
}

export function PostCardActions({
    currentReaction,
    likeCount,
    commentCount,
    shareCount,
    isSaved,
    showComments,
    onReaction,
    onCommentToggle,
    onShare,
    onSave
}: PostCardActionsProps) {

    const getMainReactionIcon = () => {
        if (currentReaction === "LOVE") {
            return <Heart className="w-5 h-5 fill-red-500 text-red-500" />;
        }
        if (currentReaction === "HAHA") {
            return <span className="text-xl leading-none">😆</span>;
        }
        if (currentReaction === "WOW") {
            return <span className="text-xl leading-none">😮</span>;
        }
        if (currentReaction === "SAD") {
            return <span className="text-xl leading-none">😢</span>;
        }
        if (currentReaction === "ANGRY") {
            return <span className="text-xl leading-none">😡</span>;
        }
        const colorClass = currentReaction ? "fill-[#f9622e] text-[#f9622e]" : "text-gray-500 group-hover:text-[#f9622e]";
        return <ThumbsUp className={`w-5 h-5 ${colorClass}`} />;
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
            <div className="flex items-center gap-6">
                {/* Like Button with Reactions */}
                <div className="relative group/reaction">
                    <button
                        onClick={() => onReaction(currentReaction || "LIKE")}
                        className={`flex items-center gap-2 transition-colors cursor-pointer ${currentReaction ? "text-[#f9622e]" : "text-gray-500"}`}
                    >
                        <div className={`p-2 rounded-full transition-colors ${currentReaction ? "bg-orange-50" : "group-hover/reaction:bg-orange-50"}`}>
                            {getMainReactionIcon()}
                        </div>
                        <span className="text-sm font-medium">
                            {likeCount > 0 ? likeCount.toLocaleString() : "Thích"}
                        </span>
                    </button>

                    {/* Reaction Popup */}
                    <div className="absolute bottom-full left-0 pb-2 hidden group-hover/reaction:flex animate-in fade-in slide-in-from-bottom-2 duration-200 z-10">
                        <div className="bg-white rounded-full shadow-lg border border-gray-100 p-1 gap-1 flex">
                            {[
                                { type: "LIKE", icon: "👍", label: "Thích" },
                                { type: "LOVE", icon: "❤️", label: "Yêu thích" },
                                { type: "HAHA", icon: "😆", label: "Haha" },
                                { type: "WOW", icon: "😮", label: "Wow" },
                                { type: "SAD", icon: "😢", label: "Buồn" },
                                { type: "ANGRY", icon: "😡", label: "Phẫn nộ" },
                            ].map((reaction) => (
                                <div key={reaction.type} className="relative group/item">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onReaction(reaction.type);
                                        }}
                                        className="p-2 text-xl hover:scale-125 transition-transform cursor-pointer hover:bg-gray-50 rounded-full"
                                    >
                                        {reaction.icon}
                                    </button>
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {reaction.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Comment Button */}
                <button
                    onClick={onCommentToggle}
                    className={`flex items-center gap-2 transition-colors group cursor-pointer ${showComments ? "text-blue-500" : "text-gray-500 hover:text-blue-500"}`}
                    title="Bình luận"
                >
                    <div className={`p-2 rounded-full transition-colors ${showComments ? "bg-blue-50" : "group-hover:bg-blue-50"}`}>
                        <MessageCircle className={`w-5 h-5 group-active:scale-90 transition-transform ${showComments ? "fill-blue-500" : ""}`} />
                    </div>
                    <span className="text-sm font-medium">
                        {commentCount.toLocaleString()}
                    </span>
                </button>

                {/* Share Button */}
                <button
                    onClick={onShare}
                    className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors group cursor-pointer"
                    title="Chia sẻ"
                >
                    <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                        <Share className="w-5 h-5 group-active:scale-90 transition-transform" />
                    </div>
                    <span className="text-sm font-medium">
                        {shareCount.toLocaleString()}
                    </span>
                </button>
            </div>

            {/* Bookmark Button */}
            <button
                onClick={onSave}
                className={`p-2 rounded-full transition-colors cursor-pointer group ${isSaved ? "text-[#f9622e] bg-orange-50" : "text-gray-500 hover:bg-gray-50 hover:text-[#f9622e]"}`}
                title={`${isSaved ? "Bỏ lưu bài viết" : "Lưu bài viết"}`}
            >
                <Bookmark className={`w-5 h-5 transition-transform group-active:scale-90 ${isSaved ? "fill-[#f9622e]" : ""}`} />
            </button>
        </div>
    );
}
