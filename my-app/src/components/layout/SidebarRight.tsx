"use client";

import { Search, UserPlus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

// --- Type Definitions ---
interface FriendSuggestion {
  id: number;
  name: string;
  avatar: string;
  mutualFriends: number;
}

interface Message {
  id: number | string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
}

interface MessageRequest {
  id: number;
  name: string;
  avatar: string;
  messageSnippet: string;
}

// Dữ liệu giả lập cho các gợi ý kết bạn
const initialSuggestedFriends: FriendSuggestion[] = [
  {
    id: 1,
    name: "Hà Anh Tuấn",
    avatar: "/userAvatar.png",
    mutualFriends: 5,
  },
  {
    id: 2,
    name: "Mỹ Tâm",
    avatar: "/userAvatar.png",
    mutualFriends: 12,
  },
  {
    id: 3,
    name: "Đen Vâu",
    avatar: "/userAvatar.png",
    mutualFriends: 8,
  },
];

// Dữ liệu giả lập cho tin nhắn
const initialMessages: Message[] = [
  {
    id: 1,
    name: "Sơn Tùng M-TP",
    avatar: "/userAvatar.png",
    lastMessage: "Tối nay đi diễn với anh không em?",
    timestamp: "15 phút",
    isRead: false,
  },
  {
    id: 2,
    name: "Hà Anh Tuấn",
    avatar: "/userAvatar.png",
    lastMessage: "Cafe nhé, tôi có ý tưởng mới cho See Sing Share.",
    timestamp: "1 giờ",
    isRead: true,
  },
  {
    id: 3,
    name: "Mỹ Tâm",
    avatar: "/userAvatar.png",
    lastMessage: "Bạn đã nhận được vé liveshow của tôi chưa?",
    timestamp: "3 giờ",
    isRead: true,
  },
];

// Dữ liệu giả lập cho yêu cầu tin nhắn
const initialMessageRequests: MessageRequest[] = [
  {
    id: 1,
    name: "Người lạ 1",
    avatar: "/userAvatar.png",
    messageSnippet: "Chào bạn, mình làm quen được không?",
  },
  {
    id: 2,
    name: "Người lạ 2",
    avatar: "/userAvatar.png",
    messageSnippet: "Bạn có phải là người đã làm rơi ví này không?",
  },
];

export function SidebarRight() {
  const [activeTab, setActiveTab] = useState("primary");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [messageRequests, setMessageRequests] = useState<MessageRequest[]>(initialMessageRequests);
  const [suggestedFriends, setSuggestedFriends] = useState<FriendSuggestion[]>(initialSuggestedFriends);

  // State để lưu style (vị trí, kích thước) của thanh trượt
  const [underlineStyle, setUnderlineStyle] = useState({});
  // Refs để tham chiếu đến các nút tab
  const primaryTabRef = useRef<HTMLButtonElement>(null);
  const requestsTabRef = useRef<HTMLButtonElement>(null);

  // Effect để cập nhật vị trí thanh trượt khi tab thay đổi
  useEffect(() => {
    if (activeTab === 'primary' && primaryTabRef.current) {
      setUnderlineStyle({
        left: primaryTabRef.current.offsetLeft,
        width: primaryTabRef.current.offsetWidth,
      });
    } else if (activeTab === 'requests' && requestsTabRef.current) {
      setUnderlineStyle({
        left: requestsTabRef.current.offsetLeft,
        width: requestsTabRef.current.offsetWidth,
      });
    }
  }, [activeTab]);
  
  const requestCount = messageRequests.length;

  // Hàm xử lý khi chấp nhận yêu cầu
  const handleAcceptRequest = (id: number) => {
    const requestToAccept = messageRequests.find((req) => req.id === id);
    if (!requestToAccept) return;

    // Tạo một cuộc trò chuyện mới từ yêu cầu đã chấp nhận
    const newConversation: Message = {
      id: uuidv4(), // Sử dụng uuid để tạo ID duy nhất, an toàn
      name: requestToAccept.name,
      avatar: requestToAccept.avatar,
      lastMessage: requestToAccept.messageSnippet,
      timestamp: "Vừa xong",
      isRead: false, // Đánh dấu là chưa đọc để người dùng chú ý
    };

    setMessages((currentMessages) => [newConversation, ...currentMessages]);
    setMessageRequests((currentRequests) => currentRequests.filter((req) => req.id !== id));
  };

  // Hàm xử lý khi xóa yêu cầu
  const handleDeleteRequest = (id: number) => {
    setMessageRequests((currentRequests) => currentRequests.filter((req) => req.id !== id));
  };

  // Hàm xử lý khi thêm bạn từ gợi ý
  const handleAddFriend = (id: number) => {
    console.log(`Sending friend request to user ${id}`);
    // Trong ứng dụng thật, bạn sẽ gửi yêu cầu API ở đây
    setSuggestedFriends((currentFriends) => currentFriends.filter((friend) => friend.id !== id));
  };

  // Hàm xử lý khi xóa một gợi ý
  const handleRemoveSuggestion = (id: number) => {
    setSuggestedFriends((currentFriends) => currentFriends.filter((friend) => friend.id !== id));
  };

  return (
    <aside className="custom-scrollbar sticky top-14 hidden h-[calc(100vh-3.5rem)] w-78 flex-col gap-4 overflow-y-auto bg-gray-50 p-4 lg:flex">
      {/* Khối Tin nhắn */}
      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">Tin nhắn</h3>
        </div>

        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full rounded-full border-none bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F9622E]"
          />
        </div>

        {/* Tab container */}
        <div className="border-b border-gray-200">
          <div className="relative flex items-center gap-6">
            <button
              ref={primaryTabRef}
              onClick={() => setActiveTab("primary")}
              className={`pb-2 text-sm font-semibold transition-colors duration-300 ${
                activeTab === "primary"
                  ? "text-[#f9622e]"
                  : "text-gray-500 hover:text-gray-800 cursor-pointer"
              }`}
            >
              Chính
            </button>
            <button
              ref={requestsTabRef}
              onClick={() => setActiveTab("requests")}
              className={`relative pb-2 text-sm font-semibold transition-colors duration-300 group ${
                activeTab === "requests"
                  ? "text-[#f9622e]"
                  : "text-gray-500 hover:text-gray-800 cursor-pointer"
              }`}
            >
              Yêu cầu
              {requestCount > 0 && (
                <span className="absolute -right-5 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white group-hover:bg-red-600">
                  {requestCount}
                </span>
              )}
            </button>
            {/* Thanh trượt gạch chân động */}
            <div className="absolute -bottom-px h-0.5 bg-[#f9622e] transition-all duration-300 ease-in-out" style={underlineStyle} />
          </div>
        </div>

        {/* Danh sách tin nhắn */}
        <div className="mt-2">
          {activeTab === 'primary' && (
            <ul className="space-y-1">
              {messages.map((msg) => (
                <li key={msg.id}>
                  <Link href={`/messages?name=${encodeURIComponent(msg.name)}&avatar=${encodeURIComponent(msg.avatar)}`} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100">
                    <Image src={msg.avatar} alt={msg.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800">{msg.name}</p>
                      <p className={`truncate text-xs ${msg.isRead ? 'text-gray-500' : 'font-bold text-gray-800'}`}>{msg.lastMessage}</p>
                    </div>
                    {!msg.isRead && <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500"></div>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {activeTab === 'requests' && (
            <ul className="space-y-3">
              {messageRequests.map((req) => (
                <li key={req.id} className="rounded-lg p-2 transition-colors hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Image src={req.avatar} alt={req.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800">{req.name}</p>
                      <p className="truncate text-xs text-gray-500">{req.messageSnippet}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => handleAcceptRequest(req.id)} className="flex-1 rounded-lg cursor-pointer bg-[#f9622e] py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#f9622e]/90">Chấp nhận</button>
                    <button onClick={() => handleDeleteRequest(req.id)} className="flex-1 rounded-lg cursor-pointer bg-gray-200 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-300">Xóa</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Khối Gợi ý kết bạn */}
      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800">Gợi ý cho bạn</h3>
        <ul className="space-y-3">
          {suggestedFriends.map((friend) => (
            <li key={friend.id} className="flex items-center gap-3">
              <Image src={friend.avatar} alt={friend.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{friend.name}</p>
                <p className="text-xs text-gray-500">{friend.mutualFriends} bạn chung</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleAddFriend(friend.id)} title="Thêm bạn" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#f9622e]/10 text-[#f9622e] transition-colors hover:bg-[#f9622e]/20">
                  <UserPlus size={16} />
                </button>
                <button onClick={() => handleRemoveSuggestion(friend.id)} title="Xóa gợi ý" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200">
                  <X size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}