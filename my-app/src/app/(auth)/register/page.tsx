"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Eye, EyeOff, User, CheckSquare, Loader2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { authAPI } from "@/services/api";

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            toast("Mật khẩu xác nhận không khớp!", "error");
            setIsLoading(false);
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            toast("Mật khẩu phải có ít nhất 6 ký tự!", "error");
            setIsLoading(false);
            return;
        }

        try {
            // Gọi API đăng ký
            const response = await authAPI.register({
                email: formData.email,
                password: formData.password,
                name: formData.displayName,
            });

            toast("Đăng ký thành công! Chào mừng bạn đến với SocialzZz 🎉 Vui lòng đăng nhập để bắt đầu trải nghiệm ngay nhé!", "success");

            // Chuyển hướng đến trang đăng nhập sau 1.5s
            setTimeout(() => {
                router.push("/login");
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);

            const errorMessage = error instanceof Error ? error.message : "Đăng ký thất bại! Vui lòng thử lại.";

            // Xử lý các loại lỗi khác nhau
            if (errorMessage.includes('Email already exists') ||
                errorMessage.includes('already')) {
                toast("Email đã được sử dụng. Vui lòng chọn email khác!", "error");
            } else if (errorMessage.includes('network') ||
                errorMessage.includes('fetch')) {
                toast("Lỗi kết nối! Vui lòng kiểm tra internet của bạn.", "error");
            } else {
                toast(errorMessage, "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const Year = new Date().getFullYear();

    return (
        <div className="relative flex min-h-screen w-full bg-gray-50">
            {/* Download APK Button */}
            <Link
                href="https://drive.google.com/drive/u/0/folders/1wJ7AAfq6sfNpA_zqNhbYCn-CSc-EXU1E"
                className="fixed right-6 top-4 z-20 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#f9622e] shadow-md ring-1 ring-gray-200 duration-200 transition-all hover:-translate-y-0.5 hover:bg-[#f9622e]/10 hover:shadow-lg active:translate-y-0"
                target="_blank"
            >
                <Download className="h-4 w-4" />
                <span>Tải APK</span>
            </Link>

            {/* Left Side - Brand/Logo */}
            <div className="hidden w-1/2 h-screen flex-col items-center justify-center bg-white p-6 lg:flex relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#f9622e]/10 blur-3xl" />
                <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-orange-100/50 blur-3xl" />

                <div className="z-10 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="relative h-48 w-48 transition-transform hover:scale-105 duration-500">
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
                            Đăng ký ngay để kết nối với hàng triệu người dùng trên toàn thế giới.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-8 text-xs text-gray-400 font-medium">
                    © {Year} SocialzZz Platform. All rights reserved.
                </div>
            </div>

            {/* Right Side - Register Form */}
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
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tạo tài khoản mới 🚀</h2>
                        <p className="text-gray-500 font-medium">Nhập thông tin của bạn để bắt đầu.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        {/* Display Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700" htmlFor="displayName">
                                Tên hiển thị
                            </label>
                            <div className="relative group">
                                <input
                                    id="displayName"
                                    type="text"
                                    placeholder="VD: NguyenVanA"
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-[#f9622e] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#f9622e]/10 transition-all duration-200 font-medium"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                />
                                <User className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-hover:text-[#f9622e] transition-colors" />
                            </div>
                        </div>



                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700" htmlFor="email">
                                Email
                            </label>
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
                            <label className="text-sm font-bold text-gray-700" htmlFor="password">
                                Mật khẩu
                            </label>
                            <div className="relative group">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                                    required
                                    minLength={6}
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

                        {/* Confirm Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700" htmlFor="confirmPassword">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative group">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Nhập lại mật khẩu"
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-[#f9622e] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#f9622e]/10 transition-all duration-200 font-medium"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f9622e] transition-colors focus:outline-none cursor-pointer"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms checkbox */}
                        <div className="flex items-start gap-3 mt-4">
                            <div className="relative flex items-center mt-1">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-all checked:border-[#f9622e] checked:bg-[#f9622e]"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                />
                                <CheckSquare className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <label htmlFor="terms" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
                                Tôi đồng ý với{" "}
                                <Link href="/terms" className="font-bold text-[#f9622e] hover:underline">
                                    Điều khoản dịch vụ
                                </Link>{" "}
                                và{" "}
                                <Link href="/privacy" className="font-bold text-[#f9622e] hover:underline">
                                    Chính sách bảo mật
                                </Link>{" "}
                                của SocialzZz.
                            </label>
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={!agreedToTerms || isLoading}
                            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-all mt-4 
                            ${agreedToTerms && !isLoading
                                    ? "bg-[#f9622e] shadow-orange-500/30 hover:bg-[#ff7240] hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                                    : "bg-gray-300 shadow-none cursor-not-allowed opacity-70"
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Đang đăng ký...
                                </>
                            ) : (
                                "Đăng ký"
                            )}
                        </button>

                        {/* Social Login Separator */}
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-gray-400 font-bold tracking-wider">Hoặc đăng ký với</span>
                            </div>
                        </div>

                        {/* Social Buttons */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="flex w-3/5 items-center justify-center rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 cursor-pointer"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </button>
                        </div>
                    </form>


                    {/* Footer */}
                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-600">
                        <span>Bạn đã có tài khoản?</span>
                        <Link
                            href="/login"
                            className="font-bold text-[#f9622e] hover:text-[#d04a1b] hover:underline underline-offset-4 transition-colors"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}