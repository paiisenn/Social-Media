"use client";

import { X, UserMinus, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface UnfriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  userAvatar: string;
}

export function UnfriendModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userAvatar,
}: UnfriendModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <UserMinus className="h-8 w-8 text-red-600" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Hủy kết bạn?
          </h2>

          {/* User Info */}
          <div className="flex items-center justify-center gap-3 my-6 p-4 bg-gray-50 rounded-xl">
            <Image
              src={userAvatar}
              alt={userName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-semibold text-gray-900">{userName}</p>
              <p className="text-sm text-gray-500">Bạn bè</p>
            </div>
          </div>

          {/* Warning message */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 text-left">
              Bạn sẽ không còn là bạn bè với {userName}. Bạn có thể gửi lời mời
              kết bạn lại sau.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
            >
              Hủy kết bạn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
