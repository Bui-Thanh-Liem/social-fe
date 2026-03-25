import { useEffect } from "react";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import { socket } from "~/socket/socket";

export const useCommentSocket = (onNewComment: (tw: ITweet) => void) => {
  //
  useEffect(() => {
    socket.on("connect_error", (err) => {
      // console.error("❌ Socket connect error:", err.message);
      socket.disconnect();

      if (err.message === "jwt expired") {
        console.log("Token jwt expired");
        const getToken = () => localStorage.getItem("access_token");
        socket.auth = { token: getToken() };
        socket.connect();
        console.log("Set token Success");
      }
    });
  }, []);

  // Lắng nghe comment mới
  useEffect(() => {
    socket.on(CONSTANT_EVENT_NAMES.NEW_COMMENT, onNewComment);
    return () => {
      socket.off(CONSTANT_EVENT_NAMES.NEW_COMMENT, onNewComment);
    };
  }, [onNewComment]);

  //
  const joinComment = (id: string) => {
    if (!socket.connected) {
      // console.warn("⚠️ Socket chưa connect, không thể join Comment");
      return;
    }
    socket.emit(CONSTANT_EVENT_NAMES.JOIN_COMMENT, id);
  };

  //
  const leaveComment = (id: string) => {
    if (!socket.connected) {
      // console.warn("⚠️ Socket chưa connect, không thể leave Comment");
      return;
    }
    socket.emit(CONSTANT_EVENT_NAMES.LEAVE_COMMENT, id);
  };

  return { leaveComment, joinComment };
};
