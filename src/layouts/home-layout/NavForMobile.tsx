import { useLocation, useNavigate } from "react-router-dom";
import { ExploreIcon } from "~/components/icons/explore";
import { HomeIcon } from "~/components/icons/home";
import { MessageIcon } from "~/components/icons/messages";
import { NotificationIcon } from "~/components/icons/notifications";
import type { NavItem } from "~/layouts/home-layout/SidebarLeft";
import { useReloadStore } from "~/store/useReloadStore";
import { WrapIcon } from "../../components/WrapIcon";
import React, { useEffect, useState } from "react";
import { ENotificationType } from "~/shared/enums/type.enum";
import { useUnreadNotiStore } from "~/store/useUnreadNotiStore";
import { useConversationSocket } from "~/socket/hooks/useConversationSocket";
import { SidebarTriggerMobile } from "../../components/sidebar-mobile/SidebarTriggerMobile";

export function NavForMobile() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //
  const { triggerReload } = useReloadStore();

  //
  const { unread } = useUnreadNotiStore();

  //
  const [unreadCountNoti, setUnreadCountNoti] = useState(0);
  const [unreadCountConv, setUnreadCountConv] = useState(0);

  //
  useConversationSocket(
    () => {},
    (_unread) => {
      setUnreadCountConv(_unread);
    },
    () => {},
  );

  //
  useEffect(() => {
    setUnreadCountNoti(unread);
  }, [unread]);

  //
  const navs: NavItem[] = [
    {
      name: "Hồ sơ",
      icon: <SidebarTriggerMobile />,
      path: "#",
    },
    {
      name: "Trang chủ",
      icon: <HomeIcon />,
      path: "/home",
    },
    {
      name: "Khám phá",
      icon: <ExploreIcon />,
      path: "/explore",
    },
    {
      name: "Thông báo",
      icon: <NotificationIcon />,
      path: `/notifications#${ENotificationType.Community}`,
      countNoti: unreadCountNoti,
    },
    {
      name: "Tin nhắn",
      icon: <MessageIcon />,
      path: "/messages",
      countNoti: unreadCountConv,
    },
  ];

  //
  function onClickNav(path: string, name: string) {
    if (path !== "/home") document.title = name;
    triggerReload();
    navigate(path);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-t border-gray-200 px-4 lg:hidden">
      {navs.map((nav) => {
        const cleanPath = nav.path?.replace(/#.*$/, "") || "";
        const isActive = pathname.startsWith(cleanPath);
        return (
          <WrapIcon
            key={nav.name}
            className="relative"
            onClick={() => onClickNav(nav.path || "", nav.name)}
          >
            {React.cloneElement(
              nav.icon as React.ReactElement,
              {
                active: isActive,
              } as any,
            )}
            {!!nav?.countNoti && (
              <span className="absolute top-6 left-6 w-4 h-4 rounded-full flex items-center justify-center bg-sky-400 text-[10px] font-bold text-white animate-bounce">
                {nav?.countNoti > 9 ? "9+" : nav?.countNoti}
              </span>
            )}
          </WrapIcon>
        );
      })}
    </div>
  );
}
