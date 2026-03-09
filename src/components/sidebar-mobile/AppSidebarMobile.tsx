import { SidebarLeft } from "~/layouts/home-layout/sidebar-left/SidebarLeft";
import { Sidebar, SidebarContent } from "./sidebar";
import { Logo } from "../Logo";

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
