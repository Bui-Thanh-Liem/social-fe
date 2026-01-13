import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFollowUser } from "~/apis/useFetchFollow";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useUserStore } from "~/store/useUserStore";
import { VerifyIcon } from "../icons/verify";
import { ShortInfoProfile } from "../ShortInfoProfile";
import { AvatarMain } from "../ui/avatar";
import { ButtonMain } from "../ui/button";
import { toastSimpleVerify } from "~/utils/toast";

export function UserToFollowItemSkeleton() {
  return (
    <div className="px-4 py-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {/* Avatar giả */}
          <div className="h-10 w-10 rounded-full bg-gray-200" />

          <div className="space-y-1">
            {/* Tên user */}
            <div className="h-4 w-28 bg-gray-200 rounded" />
            {/* Username */}
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Nút Follow giả */}
        <div className="h-7 w-20 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

export function UserToFollowItem({ user }: { user: Partial<IUser> }) {
  const { user: userActive } = useUserStore();
  const [followed, setFollowed] = useState(user?.isFollow);

  //
  const { mutate, isError } = useFollowUser();

  //
  useEffect(() => {
    if (isError) setFollowed(!followed);
  }, [isError]);

  //
  function handleToggleFollow() {
    if (user && !user?.verify) {
      toastSimpleVerify();
      return;
    }

    setFollowed(!followed);
    mutate({
      user_id: user._id || "",
      username: user.username || "",
    });
  }

  //
  return (
    <div key={user._id} className="hover:bg-gray-100 px-4 py-3 cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex-1 gap-2 flex">
          <AvatarMain src={user?.avatar?.url} alt={user?.name} />
          <div className="flex-1">
            <ShortInfoProfile profile={user as IUser} className="inline-block">
              <Link
                to={`/${user?.username}`}
                className="inline-flex items-center gap-2"
              >
                <p className="text-sm leading-snug font-semibold flex items-center gap-1 hover:underline hover:cursor-pointer">
                  {user.name}
                  <VerifyIcon active={!!user.verify} size={20} />
                </p>
              </Link>
            </ShortInfoProfile>
            <p className="text-xs text-muted-foreground">{user.username}</p>
            {user.bio && (
              <p className="text-xs line-clamp-2 max-w-[95%]">{user.bio}</p>
            )}
          </div>
        </div>

        {userActive?._id === user._id ? (
          <p className="text-gray-400">là bạn</p>
        ) : (
          <ButtonMain size="sm" onClick={handleToggleFollow}>
            {!followed ? "Theo dõi" : "Bỏ theo dõi"}
          </ButtonMain>
        )}
      </div>
    </div>
  );
}
