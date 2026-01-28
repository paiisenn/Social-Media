"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, Mic, X } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

interface MessageInputProps {
  onSendMessage: (message: string, file?: File | null) => void;
  onTyping?: (isTyping: boolean) => void;
}

const MAX_HEIGHT = 120;

export function MessageInput({ onSendMessage, onTyping }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State cho emoji và file preview
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Xử lý click outside để đóng emoji picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================
     Auto resize textarea
  ========================= */
  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + "px";
  };

  /* =========================
     Send message
  ========================= */
  const handleSendMessage = () => {
    if (!message.trim() && !selectedFile) return;

    onSendMessage(message, selectedFile);

    // Reset states
    setMessage("");
    clearFile();
    setShowEmojiPicker(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  /* =========================
     Enter to send
  ========================= */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* =========================
     File attach
  ========================= */
  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Tạo preview URL
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
    } else {
      // Nếu không phải ảnh/video thì vẫn lưu file nhưng không preview hình ảnh (có thể hiện tên file)
      // Theo yêu cầu chỉ cần hiển thị video/ảnh, nhưng ta cứ xử lý chung
      setSelectedFile(file);
      setPreviewUrl(null);
    }

    // reset input
    e.target.value = "";

    // Focus lại vào input text
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================
     Emoji Handler
  ========================= */
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    // Auto resize sau khi thêm emoji
    setTimeout(autoResizeTextarea, 0);
  };

  /* =========================
     Recording toggle
  ========================= */
  const toggleRecording = () => {
    if (isRecording) {
      // TODO: stop & discard audio (MediaRecorder)
    }
    setIsRecording((prev) => !prev);
  };

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-3 relative">
      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full left-4 mb-2 z-10 shadow-xl rounded-xl"
        >
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme={Theme.LIGHT}
            lazyLoadEmojis={true}
            height={350}
            width={300}
          />
        </div>
      )}

      {/* File Preview Area */}
      {selectedFile && (
        <div className="mb-3 relative inline-block">
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 max-h-35 max-w-50">
            {previewUrl && selectedFile.type.startsWith("image/") && (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-contain"
              />
            )}
            {previewUrl && selectedFile.type.startsWith("video/") && (
              <video
                src={previewUrl}
                controls
                className="h-full w-full object-contain max-h-40"
              />
            )}
            {!previewUrl && (
              <div className="p-3 text-sm text-gray-500 flex items-center gap-2">
                <Paperclip size={16} />
                <span className="truncate max-w-37.5">{selectedFile.name}</span>
              </div>
            )}
          </div>
          <button
            onClick={clearFile}
            className="absolute -top-2 -right-2 cursor-pointer bg-gray-500 text-white rounded-full p-1 hover:bg-gray-700 transition-colors shadow-sm"
            title="Xóa tệp"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* LEFT ICONS */}
        <div className="flex gap-1 relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors ${
              showEmojiPicker
                ? "bg-orange-100 text-[#f9622e]"
                : "text-[#f9622e] hover:bg-orange-50"
            }`}
          >
            <Smile size={22} />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#f9622e] transition-colors hover:bg-orange-50"
          >
            <Paperclip size={22} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*" // Giới hạn chọn ảnh/video
            hidden
            onChange={handleFileAttach}
          />
        </div>

        {/* INPUT AREA */}
        <div className="relative flex-1 rounded-3xl bg-gray-100 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#f9622e]">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              autoResizeTextarea();

              // Send typing indicator
              if (onTyping) {
                onTyping(true);

                // Clear previous timeout
                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current);
                }

                // Stop typing after 2 seconds of inactivity
                typingTimeoutRef.current = setTimeout(() => {
                  onTyping(false);
                }, 2000);
              }
            }}
            onKeyDown={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            rows={1}
            className="
              block w-full resize-none bg-transparent
              px-4 py-2.5 text-sm text-gray-900
              placeholder-gray-500 focus:outline-none
              overflow-y-auto custom-scrollbar
            "
            style={{
              minHeight: "40px",
              maxHeight: `${MAX_HEIGHT}px`,
            }}
          />
        </div>

        {/* RIGHT ICONS */}
        <div className="flex gap-1">
          <button
            onClick={toggleRecording}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors ${
              isRecording
                ? "bg-red-500 text-white hover:bg-red-600"
                : "text-[#f9622e] hover:bg-orange-50"
            }`}
          >
            {isRecording ? <X size={22} /> : <Mic size={22} />}
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!message.trim() && !selectedFile}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              !message.trim() && !selectedFile
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#f9622e] hover:bg-orange-50 cursor-pointer"
            }`}
          >
            <Send size={22} />
          </button>
        </div>
      </div>

      {/* RECORDING STATUS */}
      {isRecording && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span>Recording...</span>
        </div>
      )}
    </div>
  );
}
