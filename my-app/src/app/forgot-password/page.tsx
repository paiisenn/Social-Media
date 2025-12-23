"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Reset password attempt for:", email);
        // Add reset password API call here
        setIsSubmitted(true);
    };

    const Year = new Date().getFullYear();

    return (
        <div className="flex min-h-screen w-full bg-gray-50">
            {/* Left Side - Brand/Logo (Same as Login/Register) */}
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
                            Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập tài khoản.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-8 text-xs text-gray-400 font-medium">
                    © {Year} SocialzZz Platform. All rights reserved.
                </div>
            </div>

            {/* Right Side - Forgot Password Form */}
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

                    {!isSubmitted ? (
                        <>
                            {/* Header */}
                            <div className="space-y-2 text-center lg:text-left">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Quên mật khẩu? 🔒</h2>
                                <p className="text-gray-500 font-medium">Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700" htmlFor="email">Email đăng ký</label>
                                    <div className="relative group">
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-[#f9622e] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#f9622e]/10 transition-all duration-200 font-medium"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Mail className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-hover:text-[#f9622e] transition-colors" />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f9622e] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-[#ff7240] hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                                    disabled={!email}
                                >
                                    Gửi yêu cầu
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </>
                    ) : (
                        // Success State
                        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
                                <Mail className="h-10 w-10 text-green-600" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-gray-900">Kiểm tra hộp thư đến</h2>
                                <p className="text-gray-500 font-medium">
                                    Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <span className="font-bold text-gray-900">{email}</span>.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-sm text-orange-800 font-medium">
                                Không nhận được email? <button onClick={() => setIsSubmitted(false)} className="underline cursor-pointer font-bold hover:text-orange-900">Gửi lại</button> hoặc kiểm tra thư mục spam.
                            </div>
                        </div>
                    )}

                    {/* Back to Login */}
                    <div className="flex justify-center">
                        <Link
                            href="/login"
                            className="group flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#f9622e] transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}