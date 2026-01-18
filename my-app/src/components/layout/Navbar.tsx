"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Home,
  PlaySquare,
  Users,
  Bell,
  Loader2, // Import Loader2
  X,
  Clock,
  ArrowUpLeft,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

const mainNavLinks = [
  { href: "/", icon: Home, tooltip: "Trang chủ" },
  { href: "/watch", icon: PlaySquare, tooltip: "Xem video" },
  { href: "/groups", icon: Users, tooltip: "Nhóm" },
  { href: "/notifications", icon: Bell, tooltip: "Thông báo" },
];


// Mock data for search suggestions (Friends)
const mockHashtagsAndFriends = [
  { id: "u1", name: "Nguyễn Văn A", username: "@nguyenvana", type: "friend", avatar: "/userAvatar.png" },
  { id: "u2", name: "Trần Thị B", username: "@tranthib", type: "friend", avatar: "/userAvatar.png" },
  { id: "u3", name: "Lê Minh C", username: "@leminhc", type: "friend", avatar: "/userAvatar.png" },
  { id: "u4", name: "Phạm Văn D", username: "@phamvand", type: "friend", avatar: "/userAvatar.png" },
];

// Mock data for recent searches
const mockRecentSearches = [
  "ReactJS",
  "Next.js tutorial",
  "Tailwind CSS",
  "Nguyễn Văn A"
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof mockHashtagsAndFriends>([]);
  const [recentSearches, setRecentSearches] = useState(mockRecentSearches);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setShowDropdown(true);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    // Simulate API call delay
    searchTimeoutRef.current = setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const filtered = mockHashtagsAndFriends.filter(item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.username.toLowerCase().includes(lowerQuery)
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500); // 500ms delay for "loading" effect
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = (username: string) => {
    // In a real app, this might navigate to profile
    // For now, we simulate searching for that person
    router.push(`/search?q=${encodeURIComponent(username)}`);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      {/* Đặt container là relative để định vị cho nav ở giữa */}
      <div className="container relative mx-auto flex h-14 items-center justify-between gap-4 px-4">

        {/* === LEFT: Logo & Search === */}
        <div className="flex items-center gap-2">
          <Link href="/" className="shrink-0">
            <Image
              src="/socialzZz-logo.png"
              alt="SocialzZz Logo"
              width={40}
              height={40}
              priority
              className="h-10 w-10"
            />
          </Link>
          <Link href="/" className="hidden md:block">
            <h1 className="text-2xl font-bold text-[#f9622e]">SocialzZz</h1>
          </Link>
        </div>

        {/* === CENTER: Main Navigation === */}
        {/* Sử dụng absolute positioning để căn giữa một cách hoàn hảo */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-4 px-4 md:flex">
          {mainNavLinks.map((link) => (
            <MainNavLink key={link.href} href={link.href} active={pathname === link.href} tooltip={link.tooltip}>
              <link.icon className="h-6 w-6" />
            </MainNavLink>
          ))}
        </nav>

        {/* === RIGHT: Actions & Profile === */}
        <div className="flex items-center justify-end gap-4">
          {/* Search Bar */}
          {/* Search Bar with Dropdown */}
          <div className="relative hidden w-full max-w-80 md:block" ref={dropdownRef}>
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#f9622e]" />
              ) : (
                <Search className="h-5 w-5 text-gray-400" />
              )}
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm bạn bè..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowDropdown(true)}
              className="w-full rounded-full border-none bg-gray-100 py-2 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F9622E]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setShowDropdown(false);
                  setIsSearching(false);
                  if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Dropdown Results */}
            {showDropdown && (
              <div className="absolute left-1/2 top-full mt-2 w-[110%] -translate-x-1/2 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                {!searchQuery ? (
                  <div className="py-2">
                    <div className="flex items-center justify-between px-4 pb-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tìm kiếm gần đây</h3>
                      {recentSearches.length > 0 && (
                        <button 
                          onClick={() => setRecentSearches([])}
                          className="text-xs text-[#f9622e] hover:underline cursor-pointer"
                        >
                          Xóa tất cả
                        </button>
                      )}
                    </div>
                    {recentSearches.length > 0 ? (
                      recentSearches.map((term, index) => (
                        <div key={index} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer group transition-colors">
                           <div 
                             className="flex flex-1 items-center gap-3 min-w-0" 
                             onClick={() => {
                               setShowDropdown(false);
                               router.push(`/search?q=${encodeURIComponent(term)}`);
                             }}
                           >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                <Clock className="h-4 w-4" /> 
                              </div>
                              <span className="text-sm text-gray-700 font-medium truncate">{term}</span>
                           </div>
                           <div className="flex items-center gap-1">
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setSearchQuery(term);
                                 setIsSearching(true);
                                 if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                                 searchTimeoutRef.current = setTimeout(() => {
                                    const lowerQuery = term.toLowerCase();
                                    const filtered = mockHashtagsAndFriends.filter(item =>
                                      item.name.toLowerCase().includes(lowerQuery) ||
                                      item.username.toLowerCase().includes(lowerQuery)
                                    );
                                    setSearchResults(filtered);
                                    setIsSearching(false);
                                 }, 500);
                               }}
                               className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-[#f9622e] p-1.5 rounded-full hover:bg-orange-50 transition-all"
                               title="Điền vào ô tìm kiếm"
                             >
                               <ArrowUpLeft className="h-4 w-4" />
                             </button>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               setRecentSearches(prev => prev.filter((_, i) => i !== index));
                             }}
                             className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-all"
                           >
                             <X className="h-3 w-3" />
                           </button>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-center text-sm text-gray-500">
                        Không có lịch sử tìm kiếm
                      </div>
                    )}
                  </div>
                ) : isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500">Đang tìm kiếm...</div>
                ) : searchResults.length > 0 ? (
                  <div className="pt-2">
                    <h3 className="px-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bạn bè</h3>
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => handleResultClick(result.name)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <Image src={result.avatar} alt={result.name} width={32} height={32} className="rounded-full bg-gray-200" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            <HighlightText text={result.name} highlight={searchQuery} />
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            <HighlightText text={result.username} highlight={searchQuery} />
                          </p>
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={() => {
                        setShowDropdown(false);
                        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                      }}
                      className="border-t border-gray-100 mt-2 px-4 py-3 text-center text-sm text-[#f9622e] font-medium hover:bg-orange-50 cursor-pointer"
                    >
                      Xem tất cả kết quả cho &quot;{searchQuery}&quot;
                    </div>
                  </div>
                ) : (
                  <><div className="p-4 text-center text-sm text-gray-500">Không tìm thấy kết quả nào.</div>
                  <div
                      onClick={() => {
                        setShowDropdown(false);
                        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                      }}
                      className="border-t border-gray-100 px-4 py-3 text-center text-sm text-[#f9622e] font-medium hover:bg-orange-50 cursor-pointer"
                    >
                      Xem tất cả kết quả cho &quot;{searchQuery}&quot;
                    </div></>
                  
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Component cho các link điều hướng chính ở giữa
function MainNavLink({ href, active, tooltip, children }: { href: string; active: boolean; tooltip: string; children: React.ReactElement }) {
  const activeClasses = "bg-[#F9622E] text-white";
  const inactiveClasses = "text-gray-500 hover:bg-gray-100 hover:text-[#F9622E]";
  return (
    <Link href={href} className="group relative" aria-label={tooltip}>
      <div className={`flex h-10 w-24 items-center justify-center rounded-lg transition-colors duration-200 ${active ? activeClasses : inactiveClasses}`}>
        {children}
      </div>
      <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">{tooltip}</div>
    </Link>
  );
}

function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) return <>{text}</>;

  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="text-[#f9622e] font-bold">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
