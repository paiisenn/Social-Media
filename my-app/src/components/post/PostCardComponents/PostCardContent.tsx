"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Check, Loader2 } from "lucide-react";

interface PostCardContentProps {
    content: string;
    image?: string;
    video?: string;
    isEditing: boolean;
    editedContent: string;
    isSavingEdit: boolean;
    onEditedContentChange: (value: string) => void;
    onCancelEdit: () => void;
    onSaveEdit: () => void;
    highlight?: string;
}

export function PostCardContent({
    content,
    image,
    video,
    isEditing,
    editedContent,
    isSavingEdit,
    onEditedContentChange,
    onCancelEdit,
    onSaveEdit,
    highlight
}: PostCardContentProps) {
    const router = useRouter();

    const renderContentWithHashtags = (text: string) => {
        // First split by hashtags
        const parts = text.split(/(#[\p{L}\d_]+)/u);

        return parts.map((part, index) => {
            if (part.startsWith("#")) {
                const tag = part.slice(1);
                return (
                    <span
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/trending/${encodeURIComponent(tag)}`);
                        }}
                        className="text-[#f9622e] font-semibold hover:underline cursor-pointer"
                    >
                        {part}
                    </span>
                );
            }

            // For non-hashtag parts, handle highlighting
            if (highlight && highlight.trim()) {
                const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const highlightParts = part.split(new RegExp(`(${escapedHighlight})`, "gi"));

                return highlightParts.map((hPart, hIndex) => (
                    hPart.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={`${index}-${hIndex}`} className="bg-orange-100 text-[#f9622e] font-bold px-0.5 rounded">
                            {hPart}
                        </span>
                    ) : (
                        hPart
                    )
                ));
            }

            return part;
        });
    };

    return (
        <div className="mb-4">
            {isEditing ? (
                <div className="mb-3">
                    <textarea
                        value={editedContent}
                        onChange={(e) => onEditedContentChange(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-[15px] text-gray-800 focus:border-[#f9622e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#f9622e]/10"
                        rows={3}
                        autoFocus
                    />
                    <div className="mt-2 flex justify-end gap-2">
                        <button
                            onClick={onCancelEdit}
                            className="flex items-center cursor-pointer gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <X size={14} /> Hủy
                        </button>
                        <button
                            onClick={onSaveEdit}
                            disabled={isSavingEdit}
                            className="flex items-center cursor-pointer gap-1 rounded-lg bg-[#f9622e] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#d84e1e] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSavingEdit ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Check size={14} /> Lưu
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-800 whitespace-pre-line leading-relaxed mb-3 text-[15px]">
                    {renderContentWithHashtags(content)}
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
                        style={{ width: "100%", height: "auto" }}
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
    );
}
