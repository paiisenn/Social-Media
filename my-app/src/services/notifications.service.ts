import { API_URL } from "./api";

export interface NotificationUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "share" | "message" | "friend_request";
  userId: string;
  user?: NotificationUser;
  action: string;
  content?: string;
  relatedPostId?: string;
  relatedUserId?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notificationsAPI = {
  async getNotifications(page = 1, limit = 20) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${API_URL}/notifications?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
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
        throw new Error(error.message || "Failed to fetch notifications");
      }

      return response.json();
    } catch (error) {
      console.error("getNotifications error:", error);
      throw error;
    }
  },

  async markAsRead(notificationId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
        throw new Error(
          error.message || "Failed to mark notification as read"
        );
      }

      return response.json();
    } catch (error) {
      console.error("markAsRead error:", error);
      throw error;
    }
  },

  async deleteNotification(notificationId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
        throw new Error(error.message || "Failed to delete notification");
      }

      return response.json();
    } catch (error) {
      console.error("deleteNotification error:", error);
      throw error;
    }
  },

  async markAllAsRead() {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: "PATCH",
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
        throw new Error(error.message || "Failed to mark all as read");
      }

      return response.json();
    } catch (error) {
      console.error("markAllAsRead error:", error);
      throw error;
    }
  },
};
