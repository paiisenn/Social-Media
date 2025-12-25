"use client";

import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { useSearchParams } from "next/navigation";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  avatar?: string;
  senderName?: string;
}

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Nguyễn Văn A";
  const avatar = searchParams.get("avatar") || "https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenA";
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fake API để load tin nhắn theo user
  useEffect(() => {
    const fakeMessages: Message[] = [
      {
        id: "1",
        content: `Xin chào! Mình là ${name} đây.`,
        timestamp: "10:30",
        isOwn: false,
        avatar: avatar,
        senderName: name,
      },
      {
        id: "2",
        content: "Chào bạn, rất vui được gặp!",
        timestamp: "10:31",
        isOwn: true,
      },
      {
        id: "3",
        content: "Hôm nay bạn thế nào?",
        timestamp: "10:32",
        isOwn: false,
        avatar: avatar,
        senderName: name,
      },
    ];
    setMessages(fakeMessages);
  }, [name, avatar]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] bg-white shadow-sm">
      {/* Chat Header */}
      <ChatHeader
        name={name}
        avatar={avatar}
        status="online"
        lastActive="5 phút"
      />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#f0f2f5] custom-scrollbar">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              isOwn={message.isOwn}
              avatar={message.avatar}
              senderName={message.senderName}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
