import {
  ArrowDownNarrowWide,
  Bookmark,
  Hash,
  HomeIcon,
  Search,
  Ship,
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
import { AccessRecent } from "./AccessRecent";

export type NavItem = {
  name: string;
  icon: ReactNode;
  path?: string;
  countNoti?: number;
};

const images = [
  "/home.png",
  "/explore.png",
  "/community.png",
  "/message.png",
  "/detail-tweet.png",
];

export function SidebarLeft() {
  //
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //
  const { user } = useUserStore();

  //
  const { triggerReload } = useReloadStore();

  //
  const [isOpenIntro, setIsOpenIntro] = useState(
    Boolean(user && !user?.verify),
  );

  //
  function onClickNav(path: string, name: string) {
    if (path !== "/") document.title = name;
    triggerReload();
    navigate(path);
  }

  //
  const navMain: NavItem[] = [
    {
      name: "Trang chủ",
      icon: <HomeIcon />,
      path: "/",
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
        {/*  */}
        {navMain.map((x) => {
          const cleanPath = x.path?.replace(/#.*$/, "") || "";

          const isActive =
            pathname === "/"
              ? pathname.includes(cleanPath)
              : pathname === cleanPath;

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
                  <span className="line-clamp-1">{x.name} </span>
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

        {/*  */}
        <li>
          <Accordion type="single" collapsible defaultValue="community">
            {/* Cộng đồng */}
            <AccordionItem value="community">
              <AccordionTrigger className="cursor-pointer">
                Cộng đồng
              </AccordionTrigger>
              <AccordionContent className="pl-2">
                <Link to="/communities" className={cla}>
                  <UsersRound size={20} />
                  <p
                    className={cn(
                      "text-[16px]",
                      pathname.includes("/communities") && "font-semibold",
                    )}
                  >
                    Cộng đồng
                  </p>
                </Link>
              </AccordionContent>
              <AccordionContent className="pl-2">
                <CreateCommunity />
              </AccordionContent>
            </AccordionItem>

            {/* Thuật toán */}
            <AccordionItem value="algorithm">
              <AccordionTrigger className="cursor-pointer">
                Thuật toán
              </AccordionTrigger>
              <AccordionContent className="pl-2">
                <Link to="/algorithm/search" className={cn(cla, "text-[16px]")}>
                  <Search size={18} />
                  Tìm kiếm
                </Link>
              </AccordionContent>
              <AccordionContent className="pl-2">
                <Link to="/algorithm/sort" className={cn(cla, "text-[16px]")}>
                  <ArrowDownNarrowWide size={18} />
                  Sắp xếp
                </Link>
              </AccordionContent>
              <AccordionContent className="pl-2">
                <Link to="/algorithm/other" className={cn(cla, "text-[16px]")}>
                  <Hash size={18} />
                  Khác
                </Link>
              </AccordionContent>
            </AccordionItem>

            {/* Kiến trúc */}
            <AccordionItem value="architecture">
              <AccordionTrigger className="cursor-pointer">
                Kiến trúc
              </AccordionTrigger>
              <AccordionContent className="pl-2">
                <Link to="/architecture" className={cn(cla, "text-[16px]")}>
                  <Search size={18} />
                  Tìm kiếm
                </Link>
              </AccordionContent>
              <AccordionContent className="pl-2">
                <Link to="/architecture" className={cn(cla, "text-[16px]")}>
                  <ArrowDownNarrowWide size={18} />
                  Sắp xếp
                </Link>
              </AccordionContent>
              <AccordionContent className="pl-2">
                <Link to="/architecture" className={cn(cla, "text-[16px]")}>
                  <Hash size={18} />
                  Khác
                </Link>
              </AccordionContent>
            </AccordionItem>

            {/* Trò chơi */}
            <AccordionItem value="game">
              <AccordionTrigger className="cursor-pointer">
                Trò chơi
              </AccordionTrigger>
              <AccordionContent className="pl-2">
                <Link to="/games" className={cn(cla, "text-[16px]")}>
                  <Ship size={18} />
                  Bắn tàu
                </Link>
              </AccordionContent>
            </AccordionItem>

            {/* Gần đây */}
            <AccessRecent />
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
      </DialogMain>
    </>
  );
}
