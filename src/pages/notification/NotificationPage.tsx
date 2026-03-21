import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ENotificationType } from "~/shared/enums/type.enum";
import { useUnreadNotiStore } from "~/store/useUnreadNotiStore";
import { TabContent } from "./TabContent";

export function NotificationPage() {
  // Metadata
  useEffect(() => {
    document.title = "Thông báo";
  }, []);

  //
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  //
  const { unreadByType } = useUnreadNotiStore();
  const [unreadNoti, setUnreadNoti] = useState<Record<
    ENotificationType,
    number
  > | null>(null);

  //
  useEffect(() => {
    setUnreadNoti(unreadByType);
  }, [unreadByType]);

  // ✅ Khi người dùng đổi tab → điều hướng sang route tương ứng
  const handleTabChange = (value: string) => {
    navigate(`${pathname}${value}`);
  };

  return (
    <div className="grid grid-cols-12 overflow-y-auto h-[calc(100vh-60px)]">
      <div className="col-span-0 xl:col-span-2"></div>
      <div className="col-span-12 xl:col-span-10">
        <Tabs
          value={hash}
          onValueChange={handleTabChange}
          defaultValue={`#${ENotificationType.Community}`}
        >
          <div className="bg-white sticky top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={`#${ENotificationType.Community}`}
              >
                <span>Cộng đồng</span>
                {unreadNoti && unreadNoti[ENotificationType.Community] && (
                  <p className="flex items-center justify-center text-sky-400 bg-transparent text-[10px] font-bold">
                    {unreadNoti[ENotificationType.Community]}
                  </p>
                )}
              </TabsTrigger>

              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={`#${ENotificationType.Mention_like}`}
              >
                <p className="line-clamp-2">Nhắc đến / Thích</p>
                {unreadNoti && unreadNoti[ENotificationType.Mention_like] && (
                  <p className="flex items-center justify-center text-sky-400 bg-transparent text-[10px] font-bold">
                    {unreadNoti[ENotificationType.Mention_like]}
                  </p>
                )}
              </TabsTrigger>

              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={`#${ENotificationType.Follow}`}
              >
                <span>Theo dõi</span>
                {unreadNoti && unreadNoti[ENotificationType.Follow] && (
                  <div className="flex items-center justify-center text-sky-400 bg-transparent text-[10px] font-bold">
                    {unreadNoti[ENotificationType.Follow]}
                  </div>
                )}
              </TabsTrigger>

              <TabsTrigger
                className="cursor-pointer flex items-center"
                value={`#${ENotificationType.Other}`}
              >
                <span>Khác</span>
                {unreadNoti && unreadNoti[ENotificationType.Other] && (
                  <div className="flex items-center justify-center text-sky-400 bg-transparent text-[10px] font-bold">
                    {unreadNoti[ENotificationType.Other]}
                  </div>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="px-1">
            <TabsContent
              value={`#${ENotificationType.Community}`}
              className="px-0"
            >
              <TabContent
                type={ENotificationType.Community}
                key={ENotificationType.Community}
                emptyText="Tất cả các hoạt động lên quan đến cộng đồng sẽ xuất hiện tại đây."
              />
            </TabsContent>

            <TabsContent
              value={`#${ENotificationType.Mention_like}`}
              className="px-0"
            >
              <TabContent
                type={ENotificationType.Mention_like}
                key={ENotificationType.Mention_like}
                emptyText="Từ lượt thích đến lượt đăng lại và nhiều hơn thế nữa, đây chính là nơi diễn ra mọi hoạt động."
              />
            </TabsContent>
            <TabsContent
              value={`#${ENotificationType.Follow}`}
              className="px-0"
            >
              <TabContent
                type={ENotificationType.Follow}
                key={ENotificationType.Follow}
                emptyText="Những ai đang theo dõi bạn, đây chính là nơi diễn ra mọi hoạt động."
              />
            </TabsContent>

            <TabsContent value={`#${ENotificationType.Other}`} className="px-0">
              <TabContent
                type={ENotificationType.Other}
                key={ENotificationType.Other}
                emptyText="Đây chính là nơi diễn ra mọi hoạt động khác."
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
