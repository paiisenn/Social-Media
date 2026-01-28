import { API_URL } from "./api";

export interface Friend {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

export interface FriendRequest {
  id: string;
  requesterId: string;
  addresseeId: string;
  requester: Friend;
  addressee: Friend;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export const friendsAPI = {
  async getFriends() {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/friends`, {
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
        return [];
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch friends");
      }

      return response.json();
    } catch (error) {
      console.error("getFriends error:", error);
      throw error;
    }
  },

  async getUserFriends(userId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/friends/user/${userId}`, {
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
        return [];
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch user friends");
      }

      return response.json();
    } catch (error) {
      console.error("getUserFriends error:", error);
      throw error;
    }
  },

  async getSuggestedFriends(limit: number = 10) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${API_URL}/friends/suggestions?limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return [];
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch suggested friends");
      }

      return response.json();
    } catch (error) {
      console.error("getSuggestedFriends error:", error);
      throw error;
    }
  },

  async getFriendRequests() {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/friends/requests`, {
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
        return [];
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch friend requests");
      }

      return response.json();
    } catch (error) {
      console.error("getFriendRequests error:", error);
      throw error;
    }
  },

  async sendFriendRequest(receiverId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/friends/request/${receiverId}`, {
        method: "POST",
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
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send friend request");
      }

      return response.json();
    } catch (error) {
      console.error("sendFriendRequest error:", error);
      throw error;
    }
  },

  async acceptFriendRequest(requesterId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/friends/accept/${requesterId}`, {
        method: "POST",
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
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to accept friend request");
      }

      return response.json();
    } catch (error) {
      console.error("acceptFriendRequest error:", error);
      throw error;
    }
  },

  async rejectFriendRequest(requesterId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/friends/reject/${requesterId}`, {
        method: "POST",
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
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reject friend request");
      }

      return response.json();
    } catch (error) {
      console.error("rejectFriendRequest error:", error);
      throw error;
    }
  },

  async removeFriend(friendId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/friends/${friendId}`, {
        method: "DELETE",
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
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to remove friend");
      }

      return response.json();
    } catch (error) {
      console.error("removeFriend error:", error);
      throw error;
    }
  },

  async getMutualFriends(userId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/friends/mutual/${userId}`, {
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
        return [];
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch mutual friends");
      }

      return response.json();
    } catch (error) {
      console.error("getMutualFriends error:", error);
      throw error;
    }
  },

  async searchUsers(query: string, limit: number = 20) {
    const token = localStorage.getItem("access_token");
    if (!token) return [];

    try {
      const response = await fetch(
        `${API_URL}/friends/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
        return [];
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to search users");
      }

      return response.json();
    } catch (error) {
      console.error("searchUsers error:", error);
      return [];
    }
  },
};
