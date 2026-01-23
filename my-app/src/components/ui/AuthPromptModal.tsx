"use client";

import { X } from "lucide-react";
import Link from "next/link";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

export function AuthPromptModal({ isOpen, onClose, feature }: AuthPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 -top-3 left-0 right-0 -bottom-5 z-50 flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 top-0 left-0 right-0 bottom-0 bg-black/50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-w-sm rounded-2xl bg-white p-6 shadow-xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-orange-50 p-3">
              <svg
                className="h-8 w-8 text-[#f9622e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Bạn cần đăng nhập
          </h3>
          <p className="mb-6 text-gray-600">
            Vui lòng đăng nhập để sử dụng tính năng <span className="font-semibold">{feature}</span>
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200 cursor-pointer"
            >
              Huỷ
            </button>
            <Link
              href="/login"
              className="flex-1 rounded-lg bg-[#f9622e] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#e0501e] text-center"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
