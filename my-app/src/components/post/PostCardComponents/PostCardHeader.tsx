"use client";

import React, { RefObject } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Edit, Trash2, EyeOff, Flag } from "lucide-react";
import { Author } from "../PostCard.types";

interface PostCardHeaderProps {
    author: Author;
    timestamp: string;
    username: string;
    isOwner: boolean;
    isMenuOpen: boolean;
    onMenuToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onHide: () => void;
    onReport: () => void;
    menuRef: RefObject<HTMLDivElement | null>;
}

export function PostCardHeader({
    author,
    timestamp,
    username,
    isOwner,
    isMenuOpen,
    onMenuToggle,
    onEdit,
    onDelete,
    onHide,
    onReport,
    menuRef
}: PostCardHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <Image
                    src={author.avatar || "/userAvatar.png"}
                    alt={author.name}
                    width={40}
                    height={40}
                    onClick={() => router.push(`/profile/${author.id}`)}
                    className="rounded-full object-cover ring-2 ring-gray-50 cursor-pointer hover:opacity-80 transition-opacity"
                />
                <div>
                    <h4
                        onClick={() => router.push(`/profile/${author.id}`)}
                        className="font-bold text-gray-900 leading-none hover:text-[#f9622e] cursor-pointer transition-colors"
                    >
                        {author.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                        {username} • {timestamp}
                    </p>
                </div>
            </div>

            <div className="relative" ref={menuRef}>
                <button
                    onClick={onMenuToggle}
                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-200">
                        {isOwner ? (
                            <>
                                <button
                                    onClick={onEdit}
                                    className="flex w-full items-center cursor-pointer gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <Edit size={16} />
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={onDelete}
                                    className="flex w-full items-center cursor-pointer gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                >
                                    <Trash2 size={16} />
                                    Xóa bài
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onHide}
                                    className="flex w-full items-center cursor-pointer gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <EyeOff size={16} />
                                    Ẩn bài viết
                                </button>
                                <button
                                    onClick={onReport}
                                    className="flex w-full items-center cursor-pointer gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                >
                                    <Flag size={16} />
                                    Báo cáo
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
