import {
  ArrowDownNarrowWide,
  Bookmark,
  HomeIcon,
  Search,
  Ship,
  Telescope,
  UserRoundPlus,
  UserRoundSearch,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { cn } from "~/utils/cn.util";
import { CreateCommunity } from "~/pages/public/community/create-community";
import { useReloadStore } from "~/store/useReloadStore";
import { AccessRecent } from "./access-recent";
import {
  explore_tab,
  joined_tab,
} from "~/pages/public/community/communities-page";

export type NavItem = {
  name: string;
  icon: ReactNode;
  path?: string;
  countNoti?: number;
};

export function SidebarLeft() {
  //
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //
  const { triggerReload } = useReloadStore();

  //
  function onClickNav(path: string) {
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

  //
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
              <div onClick={() => onClickNav(x.path || "")}>
                <p
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
                </p>
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
                <Link to={`/communities/t/${explore_tab}`} className={cla}>
                  <UsersRound size={20} />
                  <p
                    className={cn(
                      "text-[16px]",
                      pathname === `/communities/t/${explore_tab}` &&
                        "font-semibold",
                    )}
                  >
                    Tất cả
                  </p>
                </Link>
              </AccordionContent>

              <AccordionContent className="pl-2">
                <Link to="/communities" className={cla}>
                  <UserRoundPlus size={20} />
                  <p
                    className={cn(
                      "text-[16px]",
                      pathname === "/communities" && "font-semibold",
                    )}
                  >
                    Của tôi
                  </p>
                </Link>
              </AccordionContent>

              <AccordionContent className="pl-2">
                <Link to={`/communities/t/${joined_tab}`} className={cla}>
                  <UserRoundSearch size={20} />
                  <p
                    className={cn(
                      "text-[16px]",
                      pathname === `/communities/t/${joined_tab}` &&
                        "font-semibold",
                    )}
                  >
                    Đã tham gia
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
                <Link
                  to="/algorithm/search"
                  className={cn(
                    cla,
                    "text-[16px]",
                    pathname.includes("/algorithm/search") && "font-semibold",
                  )}
                >
                  <Search size={18} />
                  Tìm kiếm
                </Link>
              </AccordionContent>
              <AccordionContent className="pl-2">
                <Link
                  to="/algorithm/sort"
                  className={cn(
                    cla,
                    "text-[16px]",
                    pathname.includes("/algorithm/sort") && "font-semibold",
                  )}
                >
                  <ArrowDownNarrowWide size={18} />
                  Sắp xếp
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
    </>
  );
}
