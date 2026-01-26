import { API_URL } from "./api";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    createdAt: string;
}

export const userAPI = {
    async getUserById(id: string) {
        const token = localStorage.getItem("access_token");
        try {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    window.dispatchEvent(new Event("auth-change"));
                }
                throw new Error("Phiên đăng nhập đã hết hạn.");
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Không thể tải thông tin người dùng");
            }

            return response.json();
        } catch (error) {
            console.error("getUserById error:", error);
            throw error;
        }
    },
};
