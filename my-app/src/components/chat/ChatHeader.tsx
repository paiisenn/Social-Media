import { Phone, Video, MoreVertical } from "lucide-react";

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
  return (
    <div className="border-b border-gray-200 bg-white px-6 py-2 flex items-center justify-between shadow-sm z-10">
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
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full cursor-pointer hover:bg-orange-50 transition-colors text-[#f9622e]">
          <Phone size={20} />
        </button>
        <button className="p-2 rounded-full cursor-pointer hover:bg-orange-50 transition-colors text-[#f9622e]">
          <Video size={20} />
        </button>
        <button className="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors text-gray-600">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}
