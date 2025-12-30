"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    isClosing?: boolean;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

const ToastItem = ({
    t,
    removeToast,
}: {
    t: Toast;
    removeToast: (id: string) => void;
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        const timer = requestAnimationFrame(() => {
            setIsVisible(true);
        });
        return () => cancelAnimationFrame(timer);
    }, []);

    const styles = {
        success: {
            bg: "bg-green-50 border-green-200",
            iconBg: "bg-white",
            iconColor: "text-green-600",
            progress: "bg-green-500",
        },
        error: {
            bg: "bg-red-50 border-red-200",
            iconBg: "bg-white",
            iconColor: "text-red-600",
            progress: "bg-red-500",
        },
        info: {
            bg: "bg-blue-50 border-blue-200",
            iconBg: "bg-white",
            iconColor: "text-blue-600",
            progress: "bg-blue-500",
        },
    };

    const style = styles[t.type];

    return (
        <div
            className={`
                pointer-events-auto relative flex w-full max-w-sm overflow-hidden rounded-xl p-4 shadow-xl border
                transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${style.bg}
                ${isVisible && !t.isClosing
                    ? "translate-x-0 opacity-100 scale-100"
                    : "translate-x-full opacity-0 scale-95"
                }
            `}
        >
            <div className="flex items-start gap-4 w-full">
                <div className={`shrink-0 rounded-full p-2 ${style.iconBg} ${style.iconColor}`}>
                    {t.type === "success" && <CheckCircle className="h-5 w-5" />}
                    {t.type === "error" && <AlertCircle className="h-5 w-5" />}
                    {t.type === "info" && <Info className="h-5 w-5" />}
                </div>

                <div className="flex-1 pt-0.5">
                    <h4 className="text-sm font-semibold text-gray-900">
                        {t.type === "success" ? "Thành công" : t.type === "error" ? "Lỗi" : "Thông báo"}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{t.message}</p>
                </div>

                <button
                    onClick={() => removeToast(t.id)}
                    className="shrink-0 -mr-1 cursor-pointer -mt-1 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-black/5 rounded-lg transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Progress Bar */}
            {t.duration && t.duration > 0 && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200/50">
                    <div
                        className={`h-full ${style.progress}`}
                        style={{
                            width: isVisible ? "0%" : "100%",
                            transition: `width ${t.duration}ms linear`
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, isClosing: true } : t))
        );

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 500); 
    }, []);

    const toast = useCallback(
        (message: string, type: ToastType = "info", duration: number = 3000) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newToast: Toast = { id, message, type, duration, isClosing: false };

            setToasts((prev) => [...prev, newToast]);

            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast]
    );

    return (
        <ToastContext.Provider value={{ toast, removeToast }}>
            {children}
            <div className="fixed top-4 right-4 z-9999 flex flex-col gap-3 pointer-events-none">
                {toasts.map((t) => (
                    <ToastItem key={t.id} t={t} removeToast={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
