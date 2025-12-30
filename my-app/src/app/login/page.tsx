"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);

            // Mock validation/auth logic
            if (formData.email === "admin@gmail.com" && formData.password === "123456") {
                toast("Đăng nhập thành công! Đang chuyển hướng...", "success");
                setTimeout(() => router.push("/main/home"), 1000);
            } else {
                toast("Email hoặc mật khẩu không chính xác!", "error");
            }
        }, 1500);
    };

    const Year = new Date().getFullYear();

    return (
        <div className="flex min-h-screen w-full bg-gray-50">
            {/* Left Side - Brand/Logo */}
            <div className="hidden w-1/2 h-screen flex-col items-center justify-center bg-white p-6 lg:flex relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#f9622e]/10 blur-3xl" />
                <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-orange-100/50 blur-3xl" />

                <div className="z-10 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="relative h-36 w-36 transition-transform hover:scale-105 duration-500">
                        {/* Pulse Effect */}
                        <div className="absolute inset-0 rounded-full bg-[#f9622e]/20 animate-ping" />
                        <Image
                            src="/SocialzZz-Logo.png"
                            alt="SocialzZz Logo"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>

                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-black text-[#f9622e] tracking-tight drop-shadow-sm">SocialzZz</h1>
                        <p className="text-xl text-gray-500 font-medium max-w-sm">
                            Kết nối, chia sẻ và khám phá thế giới của bạn ngay hôm nay.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-8 text-xs text-gray-400 font-medium">
                    © {Year} SocialzZz Platform. All rights reserved.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex w-full flex-col justify-center p-6 lg:w-1/2 xl:px-24">
                <div className="mx-auto w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                    {/* Mobile Logo */}
                    <div className="flex flex-col items-center gap-2 lg:hidden mb-8">
                        <Image
                            src="/SocialzZz-Logo.png"
                            alt="SocialzZz Logo"
                            width={60}
                            height={60}
                            className="rounded-xl"
                        />
                        <span className="text-2xl font-bold text-[#f9622e]">SocialzZz</span>
                    </div>

                    {/* Header */}
                    <div className="space-y-1.5 text-center lg:text-left">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Chào mừng trở lại! 👋</h2>
                        <p className="text-gray-500 font-medium">Hãy đăng nhập để tiếp tục hành trình của bạn.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700" htmlFor="email">Email</label>
                            <div className="relative group">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-[#f9622e] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#f9622e]/10 transition-all duration-200 font-medium"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <Mail className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-hover:text-[#f9622e] transition-colors" />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700" htmlFor="password">Mật khẩu</label>
                            <div className="relative group">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu của bạn"
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-[#f9622e] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#f9622e]/10 transition-all duration-200 font-medium"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f9622e] transition-colors focus:outline-none cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-all checked:border-[#f9622e] checked:bg-[#f9622e]"
                                        checked={formData.rememberMe}
                                        onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    />
                                    <KeyRound className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Ghi nhớ đăng nhập</span>
                            </label>

                            <Link
                                href="/forgot-password"
                                className="text-sm font-bold text-[#f9622e] hover:text-[#d04a1b] hover:underline underline-offset-4 transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f9622e] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-[#ff7240] hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Đang đăng nhập...
                                </>
                            ) : (
                                "Đăng nhập"
                            )}
                        </button>

                        {/* Social Login Separator */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-gray-400 font-bold tracking-wider">Hoặc tiếp tục với</span>
                            </div>
                        </div>

                        {/* Social Buttons */}
                        <div className="flex justify-center">
                            <button type="button" className="flex w-3/5 items-center justify-center rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 cursor-pointer">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-600">
                        <span>Bạn chưa có tài khoản?</span>
                        <Link href="/register" className="font-bold text-[#f9622e] hover:text-[#d04a1b] hover:underline underline-offset-4 transition-colors">
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
