import { CheckCheck } from "lucide-react";
import { useEffect, useRef } from "react";

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
  avatar?: string;
  senderName?: string;
  attachment?: {
    type: "image" | "video";
    url: string;
  };
  highlightKeyword?: string;
  isCurrentMatch?: boolean;
}

export function MessageBubble({
  content,
  timestamp,
  isOwn,
  avatar,
  senderName,
  attachment,
  highlightKeyword,
  isCurrentMatch,
}: MessageBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn tới tin nhắn nếu là kết quả tìm kiếm hiện tại
  useEffect(() => {
    if (isCurrentMatch && bubbleRef.current) {
      bubbleRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isCurrentMatch]);

  // Hàm highlight text
  const renderContent = (text: string, keyword?: string) => {
    if (!keyword || !keyword.trim()) return text;

    // Escape special regex characters
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedKeyword})`, 'gi'));

    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ?
        <span key={i} className={`${isCurrentMatch ? "bg-yellow-300" : "bg-yellow-200"} text-gray-900 font-medium rounded-xs transition-colors duration-300`}>{part}</span> : part
    );
  };

  return (
    <div ref={bubbleRef} className={`flex gap-3 mb-4 ${isOwn ? "justify-end" : "justify-start"} ${isCurrentMatch ? "bg-orange-50/50 -mx-2 px-2 py-1 rounded-lg transition-colors duration-500" : ""}`}>
      {!isOwn && avatar && (
        <img
          src={avatar}
          alt={senderName}
          className="w-8 h-8 rounded-full shrink-0"
        />
      )}

      <div
        className={`max-w-xs lg:max-w-md px-2.5 py-2.5 rounded-2xl shadow-sm ${isOwn
          ? "bg-linear-to-r from-[#f9622e]/90 to-[#ff8f6b] text-white rounded-br-none"
          : "bg-white text-gray-900 rounded-bl-none border border-gray-100"
          }`}
      >
        {attachment && (
          <div className="mb-2">
            {attachment.type === "image" ? (
              <img
                src={attachment.url}
                alt="Attachment"
                className="rounded-lg max-h-60 w-full object-contain"
              />
            ) : (
              <video
                src={attachment.url}
                controls
                className="rounded-lg max-h-60 w-full object-cover"
              />
            )}
          </div>
        )}

        {content && (
          <p className="text-sm wrap-break-word whitespace-pre-wrap">{renderContent(content, highlightKeyword)}</p>
        )}

        <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
          <p className={`text-xs ${isOwn ? "text-orange-100" : "text-gray-500"}`}>
            {timestamp}
          </p>
          {isOwn && <CheckCheck size={14} className="text-orange-100" />}
        </div>
      </div>
    </div>
  );
}
