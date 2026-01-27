"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { mediaLibraryAPI, MediaAsset } from "@/services/media-library.service";
import { Loader2, Search, ImageIcon } from "lucide-react";
import Image from "next/image";

interface MediaLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchAssets();
        }
    }, [isOpen]);

    const fetchAssets = async (query?: string) => {
        setIsLoading(true);
        try {
            const response = await mediaLibraryAPI.getAssets(query);
            const data = response.data || response.items || [];
            setAssets(data);
        } catch (error) {
            console.error("Error fetching assets:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAssets(searchQuery);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Thư viện ảnh"
        >
            <div className="flex flex-col gap-4">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm ảnh..."
                        className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#f9622e]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </form>

                <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto p-1 custom-scrollbar">
                    {isLoading ? (
                        <div className="col-span-3 py-10 flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-[#f9622e]" />
                            <p className="text-sm text-gray-500">Đang tải...</p>
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="col-span-3 py-10 text-center text-gray-500">
                            <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-20" />
                            <p>Không tìm thấy ảnh nào</p>
                        </div>
                    ) : (
                        assets.filter(asset => asset.type === "IMAGE").map((asset) => (
                            <div
                                key={asset.id}
                                className="relative aspect-square cursor-pointer overflow-hidden rounded-lg hover:ring-2 hover:ring-[#f9622e] transition-all group"
                                onClick={() => {
                                    onSelect(asset.url);
                                    onClose();
                                }}
                            >
                                <Image
                                    src={asset.url}
                                    alt={asset.title || "Media"}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Modal>
    );
}
