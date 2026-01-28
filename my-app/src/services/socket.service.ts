import { io, Socket } from "socket.io-client";
import { API_URL } from "./api";

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected && this.userId === userId) {
      return;
    }

    this.userId = userId;
    const token = localStorage.getItem("access_token");

    // Kết nối WebSocket với backend
    this.socket = io(API_URL, {
      auth: {
        token,
      },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("✅ WebSocket connected");
      // Đăng ký userId với server
      this.socket?.emit("register", userId);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ WebSocket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  // Messages events
  sendMessage(receiverId: string, content: string) {
    if (!this.socket || !this.userId) {
      throw new Error("Socket not connected");
    }

    this.socket.emit("sendMessage", {
      senderId: this.userId,
      receiverId,
      content,
    });
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on("newMessage", callback);
  }

  onMessageSent(callback: (message: any) => void) {
    this.socket?.on("messageSent", callback);
  }

  markAsRead(messageId: string) {
    if (!this.socket || !this.userId) {
      return;
    }

    this.socket.emit("markAsRead", {
      messageId,
      userId: this.userId,
    });
  }

  // Typing indicator
  sendTyping(receiverId: string, isTyping: boolean) {
    if (!this.socket || !this.userId) {
      return;
    }

    this.socket.emit("typing", {
      senderId: this.userId,
      receiverId,
      isTyping,
    });
  }

  onUserTyping(
    callback: (data: { userId: string; isTyping: boolean }) => void,
  ) {
    this.socket?.on("userTyping", callback);
  }

  // Notifications events
  onNewNotification(callback: (notification: any) => void) {
    this.socket?.on("notification", callback);
  }

  // Friends events (nếu có gateway)
  onFriendRequest(callback: (data: any) => void) {
    this.socket?.on("friendRequest", callback);
  }

  onFriendAccepted(callback: (data: any) => void) {
    this.socket?.on("friendAccepted", callback);
  }

  // Cleanup listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
