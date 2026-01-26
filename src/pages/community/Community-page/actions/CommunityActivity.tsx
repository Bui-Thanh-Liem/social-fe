import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Cctv,
  ChevronRightIcon,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { DialogMain } from "~/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { WrapIcon } from "~/components/WrapIcon";
import { useGetMultiActivities } from "~/apis/useFetchCommunity";
import { EActivityType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import { toastSimple } from "~/utils/toast";

const icons = {
  [EActivityType.Invite]: <UserPlus className="size-5 text-green-400" />,
  [EActivityType.Leave]: <ArrowRightFromLine className="size-5 text-red-400" />,
  [EActivityType.Join]: <ArrowLeftFromLine className="size-5 text-sky-400" />,
};

export function CommunityActivity({ community }: { community: ICommunity }) {
  const [isOpen, setIsOpen] = useState(false);

  //
  const { data } = useGetMultiActivities(
    community._id,
    {
      page: "1",
      limit: "50",
    },
    isOpen,
  );
  const activities = data?.metadata?.items || [];

  //
  if (!community.is_joined) return null;
  if (!community.is_admin) {
    if (
      (community.is_mentor && !community.show_log_for_mentor) ||
      (community.is_member && !community.show_log_for_member)
    ) {
      return null;
    }
  }

  //
  function handleClickItem() {
    toastSimple("Tính năng đang được cập nhật.");
  }

  //
  return (
    <>
      <WrapIcon className="border" onClick={() => setIsOpen(true)}>
        <Cctv size={18} />
      </WrapIcon>

      <DialogMain
        textHeader="Hoạt động"
        textDesc="Tất cả những hoạt động của cộng đồng sẽ được ghi lại ở đây."
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
        width="xl"
      >
        <div className="space-y-3">
          {activities.map((ac) => {
            return (
              <Item
                asChild
                size="sm"
                key={ac._id}
                variant="outline"
                className="group"
              >
                <div>
                  <ItemMedia>{icons[ac.action.key]}</ItemMedia>
                  <ItemContent>
                    <ItemTitle>{ac.action.message}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon
                      className="size-5 cursor-pointer hidden group-hover:flex"
                      onClick={handleClickItem}
                    />
                  </ItemActions>
                </div>
              </Item>
            );
          })}
        </div>
      </DialogMain>
    </>
  );
}
