import { useMemo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ProfileAction } from "~/pages/profile/ProfileAction";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useUserStore } from "~/store/useUserStore";
import { VerifyIcon } from "./icons/verify";
import { AvatarMain } from "./ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

//
function NameItemUser({ user }: { user: IUser }) {
  return (
    <Link to={`/${user?.username}`} className="flex items-center gap-2">
      <h3 className="text-lg font-semibold hover:underline hover:cursor-pointer">
        {user?.name}
      </h3>
      <VerifyIcon active={!!user?.verify} size={20} />
    </Link>
  );
}

//
export function ShortInfoProfile({
  profile,
  children,
  isInfor = false,
}: {
  profile: IUser;
  children: ReactNode;
  isInfor?: boolean;
  className?: string;
}) {
  const { user } = useUserStore();

  const isOwnProfile = useMemo(
    () => user?._id === profile?._id,
    [profile?._id, user?._id]
  );

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-72 p-4 bg-white border rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between">
          <AvatarMain
            src={profile?.avatar?.url}
            alt={profile?.name}
            className="mr-3 w-16 h-16"
          />
          {!isInfor && (
            <div className="-mt-20">
              <ProfileAction profile={profile} isOwnProfile={isOwnProfile} />
            </div>
          )}
        </div>
        <div className="mt-1.5">
          <NameItemUser user={profile} />
          <p className="text-sm text-gray-500">{profile?.username}</p>
        </div>
        <div className="text-sm mt-1.5">
          {profile?.bio?.split("\\n").map((p) => (
            <p className="leading-relaxed" key={p}>
              {p}
            </p>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
