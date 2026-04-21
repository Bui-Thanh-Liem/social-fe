import { useEffect } from "react";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { connectSocket, disconnectSocket, socket } from "~/socket/socket";

export const useCommunitySocket = (
  onCountTweetApprove: (count: number) => void,
) => {
  //
  useEffect(() => {
    socket.on("connect_error", (err) => {
      // console.error("❌ Socket connect error:", err.message);
      disconnectSocket();

      if (err.message === "jwt expired") {
        console.log("Token jwt expired");
        connectSocket();
        console.log("Set token Success");
      }
    });
  }, []);

  // Lắng nghe số lượng bài viết duyệt
  useEffect(() => {
    socket.on(CONSTANT_EVENT_NAMES.COUNT_TWEET_APPROVE, onCountTweetApprove);
    return () => {
      socket.off(CONSTANT_EVENT_NAMES.COUNT_TWEET_APPROVE, onCountTweetApprove);
    };
  }, [onCountTweetApprove]);

  //
  const joinCommunity = (id: string) => {
    if (!socket.connected) {
      // console.warn("⚠️ Socket chưa connect, không thể join Community");
      return;
    }
    socket.emit(CONSTANT_EVENT_NAMES.JOIN_COMMUNITY, id);
  };

  //
  const leaveCommunity = (id: string) => {
    if (!socket.connected) {
      // console.warn("⚠️ Socket chưa connect, không thể leave Community");
      return;
    }
    socket.emit(CONSTANT_EVENT_NAMES.LEAVE_COMMUNITY, id);
  };

  return { leaveCommunity, joinCommunity };
};
