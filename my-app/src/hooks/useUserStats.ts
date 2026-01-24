"use client";

import { useState, useEffect, useCallback } from "react";
import { userStatsAPI, UserStats } from "@/services/user-stats.service";
import { postAPI } from "@/services/post.service";
import { useAuth } from "@/hooks/useAuth";

export function useUserStats(userId?: string) {
    const { user: currentUser, isAuthenticated } = useAuth();
    // Initialize state from localStorage if available, or default values
    const [stats, setStats] = useState<UserStats>(() => {
        if (typeof window !== "undefined") {
            const storedStats = localStorage.getItem(`user-stats-${userId || "current"}`);
            if (storedStats) {
                try {
                    return JSON.parse(storedStats);
                } catch (e) {
                    console.error("Error parsing stored stats", e);
                }
            }
        }
        return {
            userId: userId || "",
            postsCount: 0,
            followersCount: 0,
            followingCount: 0,
            friendsCount: 0,
            photosCount: 0,
            videosCount: 0,
        };
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const finalUserId = userId || currentUser?.id;

    // Helper to persist stats
    const updateStats = useCallback((newStats: UserStats) => {
        setStats(newStats);
        if (typeof window !== "undefined") {
            localStorage.setItem(`user-stats-${finalUserId || "current"}`, JSON.stringify(newStats));
        }
    }, [finalUserId]);

    const fetchStats = useCallback(async () => {
        if (!finalUserId) return;

        setLoading(true);
        setError(null);
        try {
            // Because backend count endpoints (posts/count, media/count) are unreliable (404/broken),
            // we fetch the posts list and calculate counts locally to ensure synchronization.
            const [
                postsResponse,
                followersData,
                followingData,
                friendsData
            ] = await Promise.all([
                postAPI.getUserPosts(finalUserId, 1, 1000), // High limit to get accurate count
                userStatsAPI.getFollowersCount(finalUserId),
                userStatsAPI.getFollowingCount(finalUserId),
                userStatsAPI.getFriendsCount(finalUserId)
            ]);

            // Handle posts data format
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const postsData: any[] = Array.isArray(postsResponse)
                ? postsResponse
                : (postsResponse.data || []);

            // Calculate media counts manually
            let pCount = 0;
            let vCount = 0;
            postsData.forEach(post => {
                const mediaUrls: string[] = post.mediaUrls || [];
                mediaUrls.forEach(url => {
                    if (url.endsWith('.mp4')) {
                        vCount++;
                    } else {
                        pCount++;
                    }
                });
            });

            const newStats = {
                userId: finalUserId,
                postsCount: postsData.length,
                followersCount: followersData?.count || 0,
                followingCount: followingData?.count || 0,
                friendsCount: friendsData?.count || 0,
                photosCount: pCount,
                videosCount: vCount,
            };

            updateStats(newStats);

        } catch (err) {
            console.error("Failed to fetch user stats:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch stats");
        } finally {
            setLoading(false);
        }
    }, [finalUserId, updateStats]);

    useEffect(() => {
        if (isAuthenticated && finalUserId) {
            fetchStats();
        }

        const handleUpdate = () => {
            if (isAuthenticated && finalUserId) {
                // Add a small delay to ensure backend has processed changes
                setTimeout(() => {
                    fetchStats();
                }, 500);
            }
        };

        // Removed redundant update trigger here to avoid double fetch loop issues
        // window.dispatchEvent(new Event("stats-update")); 

        window.addEventListener("stats-update", handleUpdate);
        return () => window.removeEventListener("stats-update", handleUpdate);
    }, [isAuthenticated, finalUserId, fetchStats]);

    return { stats, loading, error, refresh: fetchStats };
}

export function triggerStatsUpdate() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("stats-update"));
    }
}
