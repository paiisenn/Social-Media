import { API_URL } from "./api";

export interface UserStats {
  userId: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  friendsCount: number;
  photosCount: number;
  videosCount: number;
}

export const userStatsAPI = {
  async getUserStats(userId?: string) {
    const token = localStorage.getItem("access_token");
    try {
      let url = `${API_URL}/users/stats`;
      if (userId) {
        url = `${API_URL}/users/${userId}/stats`;
      }

      const response = await fetch(url, {
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
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        // If 404 or other error, return default empty stats instead of throwing
        // This is important because the backend might not implement this specific endpoint yet
        console.warn(`Failed to fetch user stats (status ${response.status}), falling back to defaults.`);
        return {
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
          friendsCount: 0,
          photosCount: 0,
          videosCount: 0,
        };
      }

      return response.json();
    } catch (error) {
      console.error("getUserStats error:", error);
      throw error;
    }
  },

  async getPostsCount(userId?: string) {
    const token = localStorage.getItem("access_token");
    try {
      let url = `${API_URL}/posts/count`;
      if (userId) {
        url = `${API_URL}/posts/user/${userId}/count`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return { count: 0 };
      }

      if (!response.ok) {
        return { count: 0 };
      }

      return response.json();
    } catch (error) {
      console.error("getPostsCount error:", error);
      return { count: 0 };
    }
  },

  async getFollowersCount(userId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/users/${userId}/followers/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return { count: 0 };
      }

      if (!response.ok) {
        return { count: 0 };
      }

      return response.json();
    } catch (error) {
      console.error("getFollowersCount error:", error);
      return { count: 0 };
    }
  },

  async getFollowingCount(userId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/users/${userId}/following/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return { count: 0 };
      }

      if (!response.ok) {
        return { count: 0 };
      }

      return response.json();
    } catch (error) {
      console.error("getFollowingCount error:", error);
      return { count: 0 };
    }
  },

  async getFriendsCount(userId?: string) {
    const token = localStorage.getItem("access_token");
    try {
      let url = `${API_URL}/friends/count`;
      if (userId) {
        url = `${API_URL}/friends/user/${userId}/count`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return { count: 0 };
      }

      if (!response.ok) {
        return { count: 0 };
      }

      return response.json();
    } catch (error) {
      console.error("getFriendsCount error:", error);
      return { count: 0 };
    }
  },

  async getMediaCount(
    userId?: string,
    type?: "IMAGE" | "VIDEO"
  ) {
    const token = localStorage.getItem("access_token");
    try {
      let url = `${API_URL}/users/media/count`;
      if (userId) {
        url = `${API_URL}/users/${userId}/media/count`;
      }
      if (type) {
        url += `?type=${type}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return { count: 0 };
      }

      if (!response.ok) {
        return { count: 0 };
      }

      return response.json();
    } catch (error) {
      console.error("getMediaCount error:", error);
      return { count: 0 };
    }
  },
};
