"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Home,
  PlaySquare,
  Users,
  Bell,
  Loader2,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { friendsAPI } from "@/services/friends.service";

interface SearchResultUser {
  id: string;
  name: string;
  avatarUrl?: string;
  email: string;
}

const mainNavLinks = [
  { href: "/", icon: Home, tooltip: "Trang chủ" },
  { href: "/watch", icon: PlaySquare, tooltip: "Xem video" },
  { href: "/groups", icon: Users, tooltip: "Nhóm" },
  { href: "/notifications", icon: Bell, tooltip: "Thông báo" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultUser[]>([]);
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
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    // Debounced API call
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await friendsAPI.searchUsers(query, 5);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        setShowDropdown(false);
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
    }
  };

  const handleResultClick = (userId: string) => {
    router.push(`/profile/${userId}`);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
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
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-4 px-4 md:flex">
          {mainNavLinks.map((link) => (
            <MainNavLink key={link.href} href={link.href} active={pathname === link.href} tooltip={link.tooltip}>
              <link.icon className="h-6 w-6" />
            </MainNavLink>
          ))}
        </nav>

        {/* === RIGHT: Actions & Profile === */}
        <div className="flex items-center justify-end gap-4">
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
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
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

            {showDropdown && searchQuery && (
              <div className="absolute left-1/2 top-full mt-2 w-[112%] -translate-x-1/2 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10 animate-in fade-in slide-in-from-top-2 duration-200 z-100">
                <div className="py-2 max-h-[80vh] overflow-y-auto">
                  {isSearching ? (
                    <div className="p-6 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-[#f9622e]" />
                      <span>Đang tìm kiếm mọi người...</span>
                    </div>
                  ) : (
                    <>
                      <div className="px-4 pb-1">
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Mọi người</h3>
                      </div>

                      {searchResults.length > 0 ? (
                        <div className="space-y-0.5">
                          {searchResults.map((result) => (
                            <div
                              key={`result-${result.id}`}
                              onClick={() => handleResultClick(result.id)}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <div className="relative h-9 w-9 shrink-0">
                                <Image
                                  src={result.avatarUrl || "/userAvatar.png"}
                                  alt={result.name}
                                  fill
                                  className="rounded-full bg-gray-200 object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  <HighlightText text={result.name} highlight={searchQuery} />
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {result.email}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-sm text-gray-500">Không tìm thấy người dùng nào</p>
                        </div>
                      )}

                      <div
                        onClick={() => {
                          setShowDropdown(false);
                          router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                        }}
                        className="border-t border-gray-100 mt-2 px-4 py-3 text-center text-sm text-[#f9622e] font-bold hover:bg-orange-50 cursor-pointer transition-all flex items-center justify-center gap-2"
                      >
                        <Search className="h-4 w-4" />
                        Xem tất cả kết quả cho &quot;{searchQuery}&quot;
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

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
