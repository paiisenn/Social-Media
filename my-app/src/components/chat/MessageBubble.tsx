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
}

export function MessageBubble({
  content,
  timestamp,
  isOwn,
  avatar,
  senderName,
  attachment,
}: MessageBubbleProps) {
  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && avatar && (
        <img
          src={avatar}
          alt={senderName}
          className="w-8 h-8 rounded-full shrink-0"
        />
      )}

      <div
        className={`max-w-xs lg:max-w-md px-2.5 py-2.5 rounded-2xl shadow-sm ${isOwn
          ? "bg-linear-to-r from-[#f9622e] to-[#ff8f6b] text-white rounded-br-none"
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

        {content && <p className="text-sm wrap-break-word whitespace-pre-wrap">{content}</p>}

        <p
          className={`text-xs mt-1 ${isOwn ? "text-orange-100" : "text-gray-500"
            }`}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
}
