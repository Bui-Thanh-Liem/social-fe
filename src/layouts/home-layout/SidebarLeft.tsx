import {
  ArrowRight,
  Bookmark,
  HomeIcon,
  Telescope,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypographyP } from "~/components/elements/p";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { ButtonMain } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { DialogMain } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { CreateCommunity } from "~/pages/community/CreateCommunity";
import { useReloadStore } from "~/store/useReloadStore";
import { useUserStore } from "~/store/useUserStore";

export type NavItem = {
  name: string;
  icon: ReactNode;
  path?: string;
  countNoti?: number;
};

const images = [
  "./home.png",
  "./explore.png",
  "./community.png",
  "./message.png",
  "./detail-tweet.png",
];

export function SidebarLeft() {
  //
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //
  const { user } = useUserStore();

  const { triggerReload } = useReloadStore();

  //
  const [isOpenIntro, setIsOpenIntro] = useState(!user?.verify);

  //
  function onClickNav(path: string, name: string) {
    if (path !== "/home") document.title = name;
    triggerReload();
    navigate(path);
  }

  //

  const navs: NavItem[] = [
    {
      name: "Trang chủ",
      icon: <HomeIcon />,
      path: "/home",
    },
    {
      name: "Khám phá",
      icon: <Telescope />,
      path: "/explore",
    },
    {
      name: "Dấu trang",
      icon: <Bookmark />,
      path: "/bookmarks",
    },
  ];

  const cla = "flex gap-x-3 p-2 rounded-full hover:bg-gray-100 cursor-pointer";
  return (
    <>
      <ul className="h-full space-y-3 text-sm text-gray-700 pt-3 border-r pr-4">
        {navs.map((x) => {
          const cleanPath = x.path?.replace(/#.*$/, "") || "";
          const isActive = pathname.startsWith(cleanPath);

          return (
            <li key={x.name} className="cursor-pointer group relative">
              <div onClick={() => onClickNav(x.path || "", x.name)}>
                <TypographyP
                  className={cn(
                    "text-[18px] p-3 py-2 group-hover:bg-gray-100 rounded-3xl flex items-center gap-3",
                    isActive ? "font-semibold" : "",
                  )}
                >
                  {x.icon}
                  <span className="line-clamp-1 hidden lg:block">
                    {x.name}{" "}
                  </span>
                  {!!x?.countNoti && (
                    <span className="absolute top-3 left-6 w-4 h-4 rounded-full flex items-center justify-center bg-sky-400 text-[10px] font-bold text-white animate-bounce">
                      {x?.countNoti > 9 ? "9+" : x?.countNoti}
                    </span>
                  )}
                </TypographyP>
              </div>
            </li>
          );
        })}

        <li>
          <Accordion type="single" collapsible defaultValue="community">
            <AccordionItem value="game">
              <AccordionTrigger className="cursor-pointer">
                Trò chơi
              </AccordionTrigger>
              <AccordionContent className="pl-2">
                <div className={cla}>
                  <img
                    src="./community.png"
                    alt="community"
                    className="w-6 h-6 rounded-full"
                  />
                  <Link to="/communities" className="text-[16px]">
                    Đá bóng
                  </Link>
                </div>
              </AccordionContent>
              <AccordionContent className="pl-2">
                <div className={cla}>
                  <img
                    src="./community.png"
                    alt="community"
                    className="w-6 h-6 rounded-full"
                  />
                  <Link to="/communities" className="text-[16px]">
                    Bóng rổ
                  </Link>
                </div>
              </AccordionContent>
              <AccordionContent className="pl-2">
                <div className={cla}>
                  <img
                    src="./community.png"
                    alt="community"
                    className="w-6 h-6 rounded-full"
                  />
                  <Link to="/communities" className="text-[16px]">
                    Bóng chuyền
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="community">
              <AccordionTrigger className="cursor-pointer">
                Cộng đồng
              </AccordionTrigger>
              <AccordionContent className="pl-2">
                <Link to="/communities" className={cla}>
                  <UsersRound size={20} />
                  <p className="text-[16px]">Cộng đồng</p>
                </Link>
              </AccordionContent>
              <AccordionContent className="pl-2">
                <CreateCommunity />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </li>
      </ul>

      {/*  */}
      <DialogMain
        textHeader="Xác minh tài khoản của bạn để: xem bài viết, nhắn tin, cộng đồng, ..."
        textDesc="Kiểm tra email hoặc yêu cầu gửi lại mail ở trang cá nhân của bạn."
        width="6xl"
        isLogo={false}
        open={isOpenIntro}
        onOpenChange={setIsOpenIntro}
      >
        <Carousel>
          <CarouselContent className="cursor-grab">
            {images.map((_, index) => (
              <CarouselItem key={index}>
                <img src={_} alt={_} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="text-end mt-3">
          <a href="https://mail.google.com/mail/u/0/" target="_blank">
            <ButtonMain className="animate-bounce">
              Đi tới email của bạn <ArrowRight />
            </ButtonMain>
          </a>
        </div>
      </DialogMain>
    </>
  );
}
