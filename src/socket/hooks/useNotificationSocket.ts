import { useEffect } from "react";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import type { ENotificationType } from "~/shared/enums/type.enum";
import type { INotification } from "~/shared/interfaces/schemas/notification.interface";
import { socket } from "~/socket/socket";

export const useNotificationSocket = (
  onNewNotification: (data: INotification) => void,
  onUnreadCount: (count: number) => void,
  onUnreadCountByType: (val: Record<ENotificationType, number>) => void
) => {
  // Kết nối socket
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

  // Lắng nghe thông báo
  useEffect(() => {
    socket.on(CONSTANT_EVENT_NAMES.NEW_NOTIFICATION, onNewNotification);
    return () => {
      socket.off(CONSTANT_EVENT_NAMES.NEW_NOTIFICATION, onNewNotification);
    };
  }, [onNewNotification]);

  // Lắng nghe số lượng thông báo chưa đọc
  useEffect(() => {
    socket.on(CONSTANT_EVENT_NAMES.UNREAD_COUNT_NOTIFICATION, onUnreadCount);
    return () => {
      socket.off(CONSTANT_EVENT_NAMES.UNREAD_COUNT_NOTIFICATION, onUnreadCount);
    };
  }, [onUnreadCount]);

  // Lắng nghe số lượng thông báo chưa đọc theo từng loại
  useEffect(() => {
    socket.on(
      CONSTANT_EVENT_NAMES.UNREAD_COUNT_NOTIFICATION_BY_TYPE,
      onUnreadCountByType
    );
    return () => {
      socket.off(
        CONSTANT_EVENT_NAMES.UNREAD_COUNT_NOTIFICATION_BY_TYPE,
        onUnreadCountByType
      );
    };
  }, [onUnreadCountByType]);
};
