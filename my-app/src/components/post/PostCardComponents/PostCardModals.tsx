"use client";

import { Modal } from "@/components/ui/Modal";
import { AuthPromptModal } from "@/components/ui/AuthPromptModal";
import { Loader2 } from "lucide-react";

interface PostCardModalsProps {
    showAuthModal: boolean;
    authModalFeature: string;
    showDeleteModal: boolean;
    isDeletingPost: boolean;
    showReportModal: boolean;
    reportReason: string;
    onAuthModalClose: () => void;
    onDeleteModalClose: () => void;
    onConfirmDelete: () => void;
    onReportModalClose: () => void;
    onReportReasonChange: (reason: string) => void;
    onConfirmReport: () => void;
}

export function PostCardModals({
    showAuthModal,
    authModalFeature,
    showDeleteModal,
    isDeletingPost,
    showReportModal,
    reportReason,
    onAuthModalClose,
    onDeleteModalClose,
    onConfirmDelete,
    onReportModalClose,
    onReportReasonChange,
    onConfirmReport
}: PostCardModalsProps) {
    return (
        <>
            <AuthPromptModal
                isOpen={showAuthModal}
                onClose={onAuthModalClose}
                feature={authModalFeature}
            />

            <Modal
                isOpen={showDeleteModal}
                onClose={onDeleteModalClose}
                title="Xác nhận xóa bài viết"
            >
                <div className="p-4">
                    <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onDeleteModalClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirmDelete}
                            disabled={isDeletingPost}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                            {isDeletingPost ? <Loader2 size={16} className="animate-spin" /> : null}
                            Xác nhận xóa
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showReportModal}
                onClose={onReportModalClose}
                title="Báo cáo bài viết"
            >
                <div className="p-4">
                    <p className="text-gray-600 mb-4">Tại sao bạn báo cáo bài viết này?</p>
                    <div className="space-y-3 mb-6">
                        {["Spam", "Nội dung phản cảm", "Quấy rối", "Thông tin sai lệch"].map((reason) => (
                            <label key={reason} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                                <input
                                    type="radio"
                                    name="report-reason"
                                    className="w-4 h-4 text-[#f9622e] focus:ring-[#f9622e]"
                                    checked={reportReason === reason.toLowerCase()}
                                    onChange={() => onReportReasonChange(reason.toLowerCase())}
                                />
                                <span className="text-sm font-medium text-gray-700">{reason}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onReportModalClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirmReport}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#f9622e] hover:bg-[#d84e1e] rounded-lg transition-colors cursor-pointer"
                        >
                            Gửi báo cáo
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
