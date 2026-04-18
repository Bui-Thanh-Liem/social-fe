import { useEffect } from "react";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import type { sendMessageDto } from "~/shared/dtos/req/socket/message.dto";
import type { IMessage } from "~/shared/interfaces/schemas/message.interface";
import { socket } from "~/socket/socket";

export const useChatSocket = (onNewMessage: (data: IMessage) => void) => {
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

  //
  useEffect(() => {
    socket.on(CONSTANT_EVENT_NAMES.NEW_MESSAGE, onNewMessage);
    return () => {
      socket.off(CONSTANT_EVENT_NAMES.NEW_MESSAGE, onNewMessage);
    };
  }, [onNewMessage]);

  //
  const sendMessage = (data: sendMessageDto) => {
    if (!socket.connected) {
      // console.warn("⚠️ Socket chưa connect, không thể sendMessage");
      return;
    }
    socket.emit(CONSTANT_EVENT_NAMES.SEND_MESSAGE, data);
  };

  return { sendMessage };
};
