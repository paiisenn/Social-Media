"use client";

import { useState, useRef } from "react";
import { Send, Smile, Paperclip, Mic, X } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MAX_HEIGHT = 120;

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage("");

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

    const fileName = files[0].name;

    setMessage((prev) => {
      const newMessage = prev
        ? `${prev}\n[File: ${fileName}]`
        : `[File: ${fileName}]`;

      // Chờ React render rồi resize
      setTimeout(autoResizeTextarea, 0);
      return newMessage;
    });

    // reset input để chọn lại cùng file
    e.target.value = "";
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
    <div className="border-t border-gray-100 bg-white px-4 py-3">
      <div className="flex items-end gap-2">
        {/* LEFT ICONS */}
        <div className="flex gap-1">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#f9622e] transition-colors hover:bg-orange-50">
            <Smile size={22} />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#f9622e] transition-colors hover:bg-orange-50"
          >
            <Paperclip size={22} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
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
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              isRecording
                ? "bg-red-500 text-white hover:bg-red-600"
                : "text-[#f9622e] hover:bg-orange-50"
            }`}
          >
            {isRecording ? <X size={22} /> : <Mic size={22} />}
          </button>

          <button
            onClick={handleSendMessage}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#f9622e] transition-colors hover:bg-orange-50"
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
