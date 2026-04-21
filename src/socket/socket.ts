import { io } from "socket.io-client";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { IUser } from "~/shared/interfaces/schemas/user.interface";

// URL backend socket server
const SOCKET_URL = import.meta.env.VITE_SERVER_SOCKET_URL;

// Lấy token & user
const getToken = () => localStorage.getItem("access_token");
const user = (localStorage.getItem("user_storage") || {}) as IUser;

//
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket"],
  auth: {
    token: getToken(), // 👈 gửi token khi connect
  },
});

// helper kết nối
export const connectSocket = () => {
  try {
    if (!socket.connected) {
      socket.auth = { token: getToken() }; // cập nhật token mỗi lần connect
      socket.connect();

      if (user?._id) {
        socket.emit(CONSTANT_EVENT_NAMES.JOIN_CONVERSATION, user._id);
      }
    }
  } catch (error) {
    console.log("❌ Socket connect error:", error);
    disconnectSocket();
  }
};

// helper ngắt kết nối
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
