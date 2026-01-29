import { SidebarTrigger } from "~/components/sidebar-mobile/sidebar";
import { AvatarMain } from "~/components/ui/avatar";
import { useUserStore } from "~/store/useUserStore";

export function SidebarTriggerMobile() {
  const { user: profile } = useUserStore();

  return (
    <div className="md:hidden h-7">
      <SidebarTrigger
        icon={
          <AvatarMain
            src={profile?.avatar?.url}
            alt={profile?.name}
            className="w-7 h-7"
          />
        }
      />
    </div>
  );
}
