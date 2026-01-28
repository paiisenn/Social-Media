import { API_URL } from "./api";

export interface FriendshipStatusResponse {
  isFriend: boolean;
  requestSent: boolean;
  requestReceived: boolean;
  status: "none" | "pending_sent" | "pending_received" | "friends";
}

export const friendshipStatusAPI = {
  async checkFriendshipStatus(
    userId: string,
  ): Promise<FriendshipStatusResponse> {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return {
        isFriend: false,
        requestSent: false,
        requestReceived: false,
        status: "none",
      };
    }

    try {
      // Kiểm tra xem có phải bạn bè không
      const checkResponse = await fetch(`${API_URL}/friends/check/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.areFriends) {
          return {
            isFriend: true,
            requestSent: false,
            requestReceived: false,
            status: "friends",
          };
        }
      }

      // Kiểm tra friend requests
      const requestsResponse = await fetch(`${API_URL}/friends/requests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (requestsResponse.ok) {
        const requests = await requestsResponse.json();
        const receivedRequest = requests.find(
          (req: any) => req.requesterId === userId,
        );
        if (receivedRequest) {
          return {
            isFriend: false,
            requestSent: false,
            requestReceived: true,
            status: "pending_received",
          };
        }
      }

      // Tìm trong search để xem có gửi request chưa
      const searchResponse = await fetch(
        `${API_URL}/friends/search?q=&limit=1000`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (searchResponse.ok) {
        const users = await searchResponse.json();
        const targetUser = users.find((u: any) => u.id === userId);
        if (targetUser?.requestSent) {
          return {
            isFriend: false,
            requestSent: true,
            requestReceived: false,
            status: "pending_sent",
          };
        }
      }

      return {
        isFriend: false,
        requestSent: false,
        requestReceived: false,
        status: "none",
      };
    } catch (error) {
      console.error("checkFriendshipStatus error:", error);
      return {
        isFriend: false,
        requestSent: false,
        requestReceived: false,
        status: "none",
      };
    }
  },
};
