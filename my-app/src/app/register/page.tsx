"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Eye, EyeOff, User, CheckSquare, Loader2 } from "lucide-react";
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
        firstName: "",
        lastName: "",
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
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();

            const response = await authAPI.register({
                email: formData.email,
                password: formData.password,
                name: fullName || formData.displayName, // Dùng fullName, nếu rỗng thì dùng displayName
            });

            // Lưu token vào localStorage
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));

            toast("Đăng ký thành công! Chào mừng bạn đến với SocialzZz 🎉", "success");

            // Chuyển hướng đến trang chủ sau 1.5s
            setTimeout(() => {
                router.push("/");
            }, 1500);

        } catch (error: any) {
            console.error('Registration error:', error);

            // Xử lý các loại lỗi khác nhau
            if (error.message.includes('Email already exists') ||
                error.message.includes('already')) {
                toast("Email đã được sử dụng. Vui lòng chọn email khác!", "error");
            } else if (error.message.includes('network') ||
                error.message.includes('fetch')) {
                toast("Lỗi kết nối! Vui lòng kiểm tra internet của bạn.", "error");
            } else {
                toast(error.message || "Đăng ký thất bại! Vui lòng thử lại.", "error");
            }
        } finally {
            setIsLoading(false);
        }
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

                        {/* Name Fields: First Name & Last Name */}
                        <div className="flex gap-4">
                            <div className="w-2/4 space-y-2">
                                <label className="text-sm font-bold text-gray-700" htmlFor="firstName">
                                    Họ
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="Họ"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#f9622e] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#f9622e]/10 transition-all duration-200 font-medium"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="w-2/4 space-y-2">
                                <label className="text-sm font-bold text-gray-700" htmlFor="lastName">
                                    Tên
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="Tên của bạn"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#f9622e] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#f9622e]/10 transition-all duration-200 font-medium"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
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