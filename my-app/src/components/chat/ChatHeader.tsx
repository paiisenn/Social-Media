import { useState, useRef, useEffect } from "react";
import { Phone, Video, MoreVertical, User, BellOff, Ban, Trash2, Search, X } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  avatar: string;
  status: string;
  lastActive?: string;
}

export function ChatHeader({
  name,
  avatar,
  status,
  lastActive,
}: ChatHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus input khi mở search
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-2 flex items-center justify-between shadow-sm z-10">
      {isSearchOpen ? (
        <div className="flex-1 flex items-center gap-3 animate-in fade-in duration-200">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm tin nhắn..."
              className="w-full bg-gray-100 text-gray-900 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/70 text-sm"
            />
          </div>
          <button 
            onClick={() => { setIsSearchOpen(false); setSearchValue(""); }}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <>
          {/* Left: Avatar and User Info */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={avatar}
                alt={name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {status === "online" && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">{name}</h2>
              <p className="text-sm text-gray-600">
                {status === "online" ? (
                  <span className="text-green-600 font-medium">Đang hoạt động</span>
                ) : (
                  <>Hoạt động {lastActive} trước</>
                )}
              </p>
            </div>
          </div>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full cursor-pointer hover:bg-orange-50 transition-colors text-[#f9622e]"
            >
              <Search size={20} />
            </button>
            <button className="p-2 rounded-full cursor-pointer hover:bg-orange-50 transition-colors text-[#f9622e]">
              <Phone size={20} />
            </button>
            <button className="p-2 rounded-full cursor-pointer hover:bg-orange-50 transition-colors text-[#f9622e]">
              <Video size={20} />
            </button>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`p-2 rounded-full cursor-pointer transition-colors ${
                  isDropdownOpen ? "bg-gray-100 text-gray-900" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <MoreVertical size={20} />
              </button>

              {/* Dropdown Menu */}
              <div 
                className={`absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right transition-all duration-200 ease-out ${
                  isDropdownOpen 
                    ? "opacity-100 scale-100 translate-y-0 visible" 
                    : "opacity-0 scale-95 -translate-y-2 invisible"
                }`}
              >
                <button className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors">
                  <User size={18} className="text-gray-500" />
                  Xem trang cá nhân
                </button>
                <button className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors">
                  <BellOff size={18} className="text-gray-500" />
                  Tắt thông báo
                </button>
                <button className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors">
                  <Ban size={18} className="text-gray-500" />
                  Chặn người dùng
                </button>
                <div className="my-1 border-t border-gray-100"></div>
                <button 
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-100 flex items-center gap-3 transition-colors"
                >
              <Trash2 size={18} />
              Xóa cuộc trò chuyện
            </button>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa cuộc trò chuyện?</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Bạn có chắc chắn muốn xóa cuộc trò chuyện này không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium text-sm transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 font-medium text-sm transition-colors cursor-pointer"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
