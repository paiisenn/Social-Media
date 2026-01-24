"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { useSearchParams } from "next/navigation";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { messagesAPI } from "@/services/messages.service";

interface Message {
  id: string;
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

interface APIMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender?: {
    avatarUrl?: string;
    name?: string;
  };
}

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const name = searchParams.get("name") || "User";
  const avatar = searchParams.get("avatar") || "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch current user ID from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUserId(userData.id);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  // Fetch conversation messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) {
        setMessages([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await messagesAPI.getConversation(userId);

        // Convert API messages to UI format
        const formattedMessages: Message[] = (Array.isArray(data) ? data : data.data || []).map((msg: APIMessage) => ({
          id: msg.id,
          content: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: msg.senderId === currentUserId,
          avatar: msg.senderId === currentUserId ? undefined : msg.sender?.avatarUrl || avatar,
          senderName: msg.senderId === currentUserId ? undefined : msg.sender?.name || name,
        }));

        setMessages(formattedMessages);

        // Mark conversation as read
        if (currentUserId) {
          await messagesAPI.markConversationAsRead(userId);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUserId) {
      fetchMessages();
    }
  }, [userId, currentUserId, avatar, name]);

  const handleSendMessage = async (content: string, file?: File | null) => {
    if (!userId) return;

    let attachment;
    if (file) {
      attachment = {
        type: file.type.startsWith("video/") ? "video" : "image",
        url: URL.createObjectURL(file),
      } as const;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
      attachment,
    };

    // Add message to UI immediately for better UX
    setMessages([...messages, newMessage]);

    // Send message to API
    try {
      await messagesAPI.sendMessage(userId, content);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally remove the message if sending failed
      // setMessages(messages.filter(m => m.id !== newMessage.id));
    }
  };

  // Search handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setMatchIds([]);
      setCurrentMatchIndex(0);
      return;
    }

    const filteredMessageIds = messages
      .filter((msg) => msg.content.toLowerCase().includes(query.toLowerCase()))
      .map((msg) => msg.id);

    setMatchIds(filteredMessageIds);
    // Start from the most recent result (the last one in the list)
    setCurrentMatchIndex(filteredMessageIds.length > 0 ? filteredMessageIds.length - 1 : 0);
  }, [messages]);

  const handleNextMatch = useCallback(() => {
    if (matchIds.length === 0) return;
    setCurrentMatchIndex((prev) => (prev + 1) % matchIds.length);
  }, [matchIds]);

  const handlePrevMatch = useCallback(() => {
    if (matchIds.length === 0) return;
    setCurrentMatchIndex((prev) => (prev - 1 + matchIds.length) % matchIds.length);
  }, [matchIds]);

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] bg-white shadow-sm">
      {/* Chat Header */}
      <ChatHeader
        name={name}
        avatar={avatar}
        status="online"
        lastActive="5 phút"
        onSearch={handleSearch}
        currentMatchIndex={currentMatchIndex}
        totalMatches={matchIds.length}
        onNextMatch={handleNextMatch}
        onPrevMatch={handlePrevMatch}
      />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#f0f2f5] custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f9622e]"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                timestamp={message.timestamp}
                isOwn={message.isOwn}
                avatar={message.avatar}
                senderName={message.senderName}
                attachment={message.attachment}
                highlightKeyword={searchQuery}
                isCurrentMatch={matchIds.length > 0 && message.id === matchIds[currentMatchIndex]}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
