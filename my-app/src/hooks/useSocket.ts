import { useEffect } from "react";
import { socketService } from "@/services/socket.service";

export function useSocket(userId: string | null) {
  useEffect(() => {
    if (!userId) return;

    // Kết nối WebSocket khi user đăng nhập
    socketService.connect(userId);

    return () => {
      // Không disconnect khi component unmount
      // Chỉ disconnect khi user logout
    };
  }, [userId]);

  return socketService;
}

export function useSocketNotifications(
  onNotification: (notification: any) => void,
) {
  useEffect(() => {
    socketService.onNewNotification(onNotification);

    return () => {
      // Cleanup listener khi component unmount
    };
  }, [onNotification]);
}

export function useSocketFriendRequests(
  onFriendRequest: (data: any) => void,
  onFriendAccepted: (data: any) => void,
) {
  useEffect(() => {
    socketService.onFriendRequest(onFriendRequest);
    socketService.onFriendAccepted(onFriendAccepted);

    return () => {
      // Cleanup listeners
    };
  }, [onFriendRequest, onFriendAccepted]);
}
