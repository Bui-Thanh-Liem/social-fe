import { useEffect } from "react";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import { socket } from "~/socket/socket";

export const useConversationSocket = (
  onNewConversation: (data: IConversation) => void,
  onUnreadCount: (count: number) => void,
  onChangeConversation: (conversation: IConversation) => void
) => {
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

  // Lắng nghe có cuộc trò chuyện mới
  useEffect(() => {
    socket.on(CONSTANT_EVENT_NAMES.NEW_CONVERSATION, onNewConversation);
    return () => {
      socket.off(CONSTANT_EVENT_NAMES.NEW_CONVERSATION, onNewConversation);
    };
  }, [onNewConversation]);

  // Lắng nghe cuộc trò chuyện thay đổi (có tin nhắn mới/ đọc tin nhắn)
  useEffect(() => {
    socket.on(CONSTANT_EVENT_NAMES.CHANGE_CONVERSATION, onChangeConversation);
    return () => {
      socket.off(
        CONSTANT_EVENT_NAMES.CHANGE_CONVERSATION,
        onChangeConversation
      );
    };
  }, [onChangeConversation]);

  // Lắng nghe số lượng cuộc trò chuyện chưa đọc
  useEffect(() => {
    socket.on(CONSTANT_EVENT_NAMES.UNREAD_COUNT_CONVERSATION, onUnreadCount);
    return () => {
      socket.off(CONSTANT_EVENT_NAMES.UNREAD_COUNT_CONVERSATION, onUnreadCount);
    };
  }, [onUnreadCount]);

  //
  const joinConversation = (ids: string[]) => {
    if (!socket.connected) {
      // console.warn("⚠️ Socket chưa connect, không thể join conversation");
      return;
    }
    socket.emit(CONSTANT_EVENT_NAMES.JOIN_CONVERSATION, ids);
  };

  //
  const leaveConversation = (ids: string[]) => {
    if (!socket.connected) {
      // console.warn("⚠️ Socket chưa connect, không thể leave conversation");
      return;
    }
    socket.emit(CONSTANT_EVENT_NAMES.LEAVE_CONVERSATION, ids);
  };

  return { leaveConversation, joinConversation };
};
