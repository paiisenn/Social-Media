import { API_URL } from "./api";

export interface MessageUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: string;
  sender: MessageUser;
  receiver: MessageUser;
}

export interface Conversation {
  partner: MessageUser;
  lastMessage: Message;
  unreadCount: number;
}

export const messagesAPI = {
  async sendMessage(receiverId: string, content: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId,
          content,
        }),
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
        throw new Error(error.message || "Failed to send message");
      }

      return response.json();
    } catch (error) {
      console.error("sendMessage error:", error);
      throw error;
    }
  },

  async getChatList() {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_URL}/messages/conversations`, {
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
        throw new Error(error.message || "Failed to fetch chat list");
      }

      return response.json();
    } catch (error) {
      console.error("getChatList error:", error);
      throw error;
    }
  },

  async getConversation(userId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${API_URL}/messages/conversations/${userId}`,
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
        throw new Error(error.message || "Failed to fetch conversation");
      }

      return response.json();
    } catch (error) {
      console.error("getConversation error:", error);
      throw error;
    }
  },

  async markAsRead(messageId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${API_URL}/messages/${messageId}/read`,
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
        throw new Error(error.message || "Failed to mark message as read");
      }

      return response.json();
    } catch (error) {
      console.error("markAsRead error:", error);
      throw error;
    }
  },

  async markConversationAsRead(userId: string) {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${API_URL}/messages/conversations/${userId}/read`,
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
          error.message || "Failed to mark conversation as read"
        );
      }

      return response.json();
    } catch (error) {
      console.error("markConversationAsRead error:", error);
      throw error;
    }
  },
};
