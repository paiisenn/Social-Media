"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface User {
    id: string;
    email: string;
    name: string;
    username?: string;
    avatar?: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Function to load user from localStorage
    const loadUserFromStorage = useCallback(() => {
        if (typeof window === "undefined") return;

        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("access_token");

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user data:", error);
                localStorage.removeItem("user");
                localStorage.removeItem("access_token");
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadUserFromStorage();

        // Listen for storage changes (cross-tab sync)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "user" || e.key === "access_token") {
                loadUserFromStorage();
            }
        };

        // Listen for custom event (same-tab updates)
        const handleAuthChange = () => {
            loadUserFromStorage();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("auth-change", handleAuthChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, [loadUserFromStorage]);

    // Function to set user data after login/register
    const setUserData = useCallback((userData: User, token: string) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("access_token", token);
        setUser(userData);

        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event("auth-change"));
    }, []);

    // Function to update user data
    const updateUser = useCallback((userData: Partial<User>) => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        try {
            const currentUser = JSON.parse(storedUser);
            const updatedUser = { ...currentUser, ...userData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            // Dispatch custom event for same-tab updates
            window.dispatchEvent(new Event("auth-change"));
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    }, []);

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        setUser(null);

        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event("auth-change"));

        router.push("/login");
    }, [router]);

    return {
        user,
        loading,
        logout,
        setUserData,
        updateUser,
        isAuthenticated: !!user
    };
}
