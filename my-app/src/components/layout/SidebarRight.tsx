"use client";

import { MessageCircleMore, Search, UserPlus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { messagesAPI, Conversation } from "@/services/messages.service";
import { friendsAPI } from "@/services/friends.service";
import { useToast } from "@/context/ToastContext";

// --- Type Definitions ---
interface FriendSuggestion {
  id: string;
  name: string;
  avatarUrl: string;
  mutualFriendsCount?: number;
}

interface FriendRequest {
  id: string;
  requesterId: string;
  requester: {
    name: string;
    avatarUrl?: string;
  };
}

export function SidebarRight() {
  const [activeTab, setActiveTab] = useState("primary");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestedFriends, setSuggestedFriends] = useState<FriendSuggestion[]>([]);

  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Refs để tham chiếu đến các nút tab
  const primaryTabRef = useRef<HTMLButtonElement>(null);
  const requestsTabRef = useRef<HTMLButtonElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);

  // Effect để tải conversations & requests khi component mount và user đã authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadConversations();
      loadSuggestedFriends();
      loadFriendRequests();
    }
  }, [isAuthenticated, authLoading]);

  // Effect để cập nhật vị trí thanh trượt khi tab thay đổi
  useEffect(() => {
    const activeRef = activeTab === 'primary' ? primaryTabRef : requestsTabRef;
    if (activeRef.current && underlineRef.current) {
      underlineRef.current.style.left = `${activeRef.current.offsetLeft}px`;
      underlineRef.current.style.width = `${activeRef.current.offsetWidth}px`;
    }
  }, [activeTab]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messagesAPI.getChatList();
      setConversations(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Không thể tải danh sách tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestedFriends = async () => {
    try {
      setLoadingSuggestions(true);
      const data = await friendsAPI.getSuggestedFriends(5);
      // Đảm bảo không gợi ý chính bản thân mình
      const filteredData = Array.isArray(data)
        ? data.filter((f: FriendSuggestion) => f.id !== user?.id)
        : [];
      setSuggestedFriends(filteredData);
    } catch (err) {
      console.error('Failed to load suggested friends:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      await friendsAPI.sendFriendRequest(friendId);
      toast("Đã gửi yêu cầu kết bạn!", "success");
      setSuggestedFriends((prev) => prev.filter((f) => f.id !== friendId));
    } catch (err) {
      console.error('Failed to add friend:', err);
      toast("Không thể gửi yêu cầu kết bạn", "error");
    }
  };

  const handleRemoveSuggestion = (friendId: string) => {
    setSuggestedFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  const loadFriendRequests = async () => {
    try {
      setLoadingRequests(true);
      const data = await friendsAPI.getFriendRequests();
      // Loại bỏ các yêu cầu trùng lặp từ cùng một người (nếu có)
      const uniqueRequests = Array.isArray(data)
        ? (data as FriendRequest[]).filter((req, index, self) =>
          index === self.findIndex((r) => r.requesterId === req.requesterId)
        )
        : [];
      setFriendRequests(uniqueRequests);
    } catch (err) {
      console.error('Failed to load friend requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleAcceptRequest = async (requesterId: string) => {
    try {
      await friendsAPI.acceptFriendRequest(requesterId);
      toast("Đã chấp nhận lời mời kết bạn!", "success");
      setFriendRequests((prev) => prev.filter((r) => r.requesterId !== requesterId));
      loadConversations(); // Refresh conversations as they might have started a chat or just to update list
    } catch (err) {
      console.error('Failed to accept request:', err);
      toast("Không thể chấp nhận yêu cầu", "error");
    }
  };

  const handleRejectRequest = async (requesterId: string) => {
    try {
      await friendsAPI.rejectFriendRequest(requesterId);
      toast("Đã từ chối lời mời kết bạn", "success");
      setFriendRequests((prev) => prev.filter((r) => r.requesterId !== requesterId));
    } catch (err) {
      console.error('Failed to reject request:', err);
      toast("Không thể từ chối yêu cầu", "error");
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = conversations.filter(conv => conv.unreadCount > 0).length;
  const requestCount = friendRequests.length;

  return (
    <aside className="custom-scrollbar sticky top-14 hidden h-[calc(100vh-3.5rem)] w-78 flex-col gap-4 overflow-y-auto bg-gray-50 p-4 lg:flex">
      {!authLoading && (
        <>
          {/* Khối Tin nhắn */}
          {isAuthenticated ? (
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border-none bg-gray-100 py-2 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-500 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F9622E]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Tab container */}
              <div className="border-b border-gray-200  ml-1">
                <div className="relative flex items-center gap-6">
                  <button
                    ref={primaryTabRef}
                    onClick={() => setActiveTab("primary")}
                    className={`pb-2 text-sm font-semibold transition-colors duration-300 ${activeTab === "primary"
                      ? "text-[#f9622e]"
                      : "text-gray-500 hover:text-gray-800 cursor-pointer"
                      }`}
                  >
                    Chính
                  </button>
                  <button
                    ref={requestsTabRef}
                    onClick={() => setActiveTab("requests")}
                    className={`relative pb-2 text-sm font-semibold transition-colors duration-300 group ${activeTab === "requests"
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
                  <div ref={underlineRef} className="absolute -bottom-px h-0.5 bg-[#f9622e] transition-all duration-300 ease-in-out" />
                </div>
              </div>

              {/* Nội dung danh sách */}
              <div className="mt-2">
                {activeTab === 'primary' ? (
                  loading ? (
                    <div className="py-4 text-center text-sm text-gray-500">
                      Đang tải tin nhắn...
                    </div>
                  ) : error ? (
                    <div className="py-4 text-center text-sm text-red-500">
                      {error}
                    </div>
                  ) : filteredConversations.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto custom-scrollbar pr-1">
                      <ul className="space-y-1">
                        {filteredConversations.map((conv) => (
                          <li key={conv.partner.id}>
                            <Link
                              href={`/messages?userId=${conv.partner.id}&name=${encodeURIComponent(conv.partner.name)}&avatar=${encodeURIComponent(conv.partner.avatarUrl || '/userAvatar.png')}`}
                              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100"
                            >
                              <Image
                                src={conv.partner.avatarUrl || '/userAvatar.png'}
                                alt={conv.partner.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-800">
                                  {conv.partner.name}
                                </p>
                                <p className={`truncate text-xs ${conv.unreadCount > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                                  {conv.lastMessage.content}
                                </p>
                              </div>
                              {conv.unreadCount > 0 && (
                                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500"></div>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">
                      Không tìm thấy tin nhắn nào
                    </div>
                  )
                ) : (
                  // Requests Tab Content
                  loadingRequests ? (
                    <div className="py-4 text-center text-sm text-gray-500">
                      Đang tải yêu cầu...
                    </div>
                  ) : friendRequests.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto custom-scrollbar pr-1">
                      <ul className="space-y-2">
                        {friendRequests.map((req) => (
                          <li key={req.id} className="flex items-center gap-3">
                            <Image
                              src={req.requester.avatarUrl || '/userAvatar.png'}
                              alt={req.requester.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-gray-800">
                                {req.requester.name}
                              </p>
                              <p className="truncate text-[11px] text-gray-500">
                                Gửi lời mời kết bạn
                              </p>
                              <div className="mt-1.5 flex gap-2">
                                <button
                                  onClick={() => handleAcceptRequest(req.requesterId)}
                                  className="rounded-md bg-[#f9622e] cursor-pointer px-3 py-1 text-[11px] font-bold text-white hover:bg-[#d84e1e] transition-colors"
                                >
                                  Chấp nhận
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(req.requesterId)}
                                  className="rounded-md bg-gray-200 cursor-pointer px-3 py-1 text-[11px] font-bold text-gray-700 hover:bg-gray-300 transition-colors"
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">
                      Không có yêu cầu nào gửi cho bạn
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex flex-col items-center text-center space-y-3 py-6">
                <div className="rounded-full bg-orange-50 p-3">
                  <MessageCircleMore className="h-8 w-8 text-[#f9622e]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Bạn chưa đăng nhập?</h3>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    Đăng nhập để sử dụng tính năng trò chuyện và nhắn tin với bạn bè!
                  </p>
                </div>
                <Link
                  href="/login"
                  className="w-full rounded-lg bg-[#f9622e] py-2 text-sm font-bold text-white transition-all hover:bg-[#ff7240] hover:shadow-lg hover:shadow-orange-500/30"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          )}

          {/* Khối Gợi ý kết bạn */}
          {isAuthenticated ? (
            <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800">Gợi ý cho bạn</h3>
              {loadingSuggestions ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  Đang tải gợi ý...
                </div>
              ) : suggestedFriends.length > 0 ? (
                <div className="max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  <ul className="space-y-3">
                    {suggestedFriends.map((friend) => (
                      <li key={friend.id} className="flex items-center gap-3">
                        <Image
                          src={friend.avatarUrl || "/userAvatar.png"}
                          alt={friend.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">
                            {friend.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {friend.mutualFriendsCount || 0} bạn chung
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddFriend(friend.id)}
                            title="Thêm bạn"
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#f9622e]/10 text-[#f9622e] transition-colors hover:bg-[#f9622e]/20"
                          >
                            <UserPlus size={16} />
                          </button>
                          <button
                            onClick={() => handleRemoveSuggestion(friend.id)}
                            title="Xóa gợi ý"
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="py-2 text-center text-sm text-gray-500">
                  Không có gợi ý mới
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex flex-col items-center text-center space-y-3 py-6">
                <div className="rounded-full bg-orange-50 p-3">
                  <UserPlus className="h-8 w-8 text-[#f9622e]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Tìm bạn mới?</h3>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    Đăng nhập để khám phá những người mới và mở rộng mạng lưới kết nối của bạn!
                  </p>
                </div>
                <Link
                  href="/login"
                  className="w-full rounded-lg bg-[#f9622e] py-2 text-sm font-bold text-white transition-all hover:bg-[#ff7240] hover:shadow-lg hover:shadow-orange-500/30"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
}