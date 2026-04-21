import { useEffect } from "react";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { IUser } from "~/shared/interfaces/schemas/user.interface";
import { connectSocket, socket } from "~/socket/socket";

export const useNewsFeedSocket = (
  onNewsFeedUpdate: (val: {
    kol: Pick<IUser, "_id" | "name" | "avatar" | "username">;
  }) => void,
) => {
  //
  useEffect(() => {
    socket.on("connect_error", (err) => {
      // console.error("❌ Socket connect error:", err.message);
      socket.disconnect();

      if (err.message === "jwt expired") {
        console.log("Token jwt expired");
        connectSocket();
        console.log("Set token Success");
      }
    });
  }, []);

  //
  useEffect(() => {
    socket.on(CONSTANT_EVENT_NAMES.USER_NEWS_FEED, onNewsFeedUpdate);
    return () => {
      socket.off(CONSTANT_EVENT_NAMES.USER_NEWS_FEED, onNewsFeedUpdate);
    };
  }, [onNewsFeedUpdate]);
};
