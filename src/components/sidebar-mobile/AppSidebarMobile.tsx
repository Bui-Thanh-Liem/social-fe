import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from "./sidebar";
import { BookmarkIcon } from "../icons/bookmark";
import { useUserStore } from "~/store/useUserStore";
import { AvatarMain } from "../ui/avatar";
import { ProfileIcon } from "../icons/profile";
import { CommunityIcon } from "../icons/communities";
import { Link } from "react-router-dom";
import { TypographyP } from "../elements/p";

export function AppSidebarMobile() {
  const { setOpenMobile, setOpen } = useSidebar();

  //
  const { user } = useUserStore();

  // Menu items.
  const items = [
    {
      name: "Dấu trang",
      icon: <BookmarkIcon size={20} />,
      path: "/bookmarks",
    },
    {
      name: "Cộng đồng",
      icon: <CommunityIcon size={20} />,
      path: "/communities",
    },
    {
      name: "Chi tiết hồ sơ",
      icon: <ProfileIcon size={20} />,
      path: user?.username ? `/${user.username}` : "/profile",
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>liemdev</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu className="pl-4">
              <div className="space-y-4">
                <AvatarMain
                  src={user?.avatar?.url}
                  alt={user?.name}
                  className="w-12 h-12"
                />
                {/* <!-- Name and Username --> */}
                <div className="mb-3">
                  <h2 className="text-xl font-bold flex items-center gap-1">
                    {user?.name}{" "}
                  </h2>
                  <p className="text-gray-500">{user?.username}</p>
                </div>
              </div>
              <ul className="space-y-5 mt-4">
                {items.map((item) => (
                  <li key={item.name} className="cursor-pointer">
                    <Link
                      to={item.path || ""}
                      onClick={() => {
                        setOpenMobile(false);
                        setOpen(false);
                      }}
                    >
                      <TypographyP className="font-medium flex items-center gap-x-3">
                        {item.icon}
                        <span className="line-clamp-1">{item.name} </span>
                      </TypographyP>
                    </Link>
                  </li>
                ))}
              </ul>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
