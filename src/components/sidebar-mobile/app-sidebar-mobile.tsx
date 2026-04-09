import { SidebarLeft } from "~/layouts/public/home-layout/sidebar-left/sidebar-left";
import { Sidebar, SidebarContent } from "./sidebar";
import { Logo } from "../logo";

export function AppSidebarMobile() {
  return (
    <Sidebar>
      <SidebarContent className="pt-4 pl-4">
        <Logo size={42} className="ml-1" />
        <SidebarLeft />
      </SidebarContent>
    </Sidebar>
  );
}
