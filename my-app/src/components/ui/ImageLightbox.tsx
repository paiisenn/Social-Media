"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Download,
    RotateCcw,
} from "lucide-react";

interface ImageLightboxProps {
    images: string[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export function ImageLightbox({ images, initialIndex, isOpen, onClose }: ImageLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentIndex(initialIndex);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, [initialIndex, isOpen]);

    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, [images.length]);

    const handlePrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, [images.length]);

    const handleZoomIn = (e: React.MouseEvent) => {
        e.stopPropagation();
        setZoom((prev) => Math.min(prev + 0.5, 4));
    };

    const handleZoomOut = (e: React.MouseEvent) => {
        e.stopPropagation();
        setZoom((prev) => {
            const newZoom = Math.max(prev - 0.25, 0.25);
            if (newZoom === 1) setPosition({ x: 0, y: 0 });
            return newZoom;
        });
    };

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await fetch(images[currentIndex]);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `image-${currentIndex + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download image", error);
        }
    };

    const onMouseDown = (e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "ArrowRight") handleNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, handlePrev, handleNext]);

    // Disable body scroll when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 -top-3 z-100000 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 transition-all select-none"
            onClick={onClose}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            {/* Top Bar Actions */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-linear-to-b from-black/50 to-transparent">
                <div className="text-white font-medium">
                    {currentIndex + 1} / {images.length}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleZoomIn}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                        title="Phóng to"
                    >
                        <ZoomIn size={20} />
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                        title="Thu nhỏ"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                        title="Đặt lại"
                    >
                        <RotateCcw size={20} />
                    </button>
                    <div className="w-px h-4 bg-white/20 mx-1" />
                    <button
                        onClick={handleDownload}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                        title="Tải ảnh xuống"
                    >
                        <Download size={20} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer ml-2"
                        title="Đóng (Esc)"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Navigation - Left */}
            {images.length > 1 && (
                <button
                    onClick={handlePrev}
                    className="absolute left-4 z-10 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all hover:scale-110 cursor-pointer active:scale-95"
                >
                    <ChevronLeft size={48} />
                </button>
            )}

            {/* Main Image Viewport */}
            <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
                onMouseDown={onMouseDown}
            >
                <div
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                    }}
                    className="relative max-w-[90%] max-h-[90%] flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                        draggable={false}
                    />
                </div>
            </div>

            {/* Navigation - Right */}
            {images.length > 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-4 z-10 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all hover:scale-110 cursor-pointer active:scale-95"
                >
                    <ChevronRight size={48} />
                </button>
            )}

            {/* Thumbnails Strip (Optional, can add if needed later) */}
        </div>
    );
}
