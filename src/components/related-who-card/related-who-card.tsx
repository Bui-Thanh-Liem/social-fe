import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "~/utils/cn.util";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useTrendingStore } from "~/storage/use-trending.storage";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { UserToFollowItem } from "../who-to-follow/who-to-follow-item";

export function RelatedWhoCard() {
  const { trendingItem } = useTrendingStore();
  const { pathname } = useLocation();
  const users = trendingItem?.highlight;
  const [open, setOpen] = useState(false);

  //
  useEffect(() => {
    const isOpen = !!(users && users?.length > 0) && pathname === "/trending";
    setOpen(isOpen);
  }, [pathname, users]);

  //
  return (
    <Card
      className={cn(
        "w-full rounded-2xl py-0 pt-2 overflow-hidden gap-2",
        open ? "" : "hidden",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between px-4 mb-0">
        <CardTitle className="text-xl">Những người liên quan</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {users &&
          users?.length > 0 &&
          users?.map((u) => (
            <UserToFollowItem key={u._id} user={u as Partial<IUser>} />
          ))}
      </CardContent>
    </Card>
  );
}
