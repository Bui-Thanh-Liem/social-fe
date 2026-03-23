import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useJoinCommunity, useLeaveCommunity } from "~/apis/useFetchCommunity";
import { VerifyIcon } from "~/components/icons/verify";
import { Logo } from "~/components/Logo";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarMain,
} from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { EMembershipType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { handleResponse } from "~/utils/toast";
import { CommunityTag } from "./CommunityShortRow";

export function CommunityRow({
  community,
}: {
  community: Partial<ICommunity>;
}) {
  const members = community?.members || [];
  const mentors = community?.mentors || [];
  const isOnlyInvite =
    community?.membership_type === EMembershipType.Invite_only;

  //
  const [joined, setJoined] = useState(community?.is_joined);

  //
  const { mutateAsync: joinMutate, isError: joinError } = useJoinCommunity();
  const { mutateAsync: leaveMutate, isError: leaveError } = useLeaveCommunity();

  //
  useEffect(() => {
    if (joinError || leaveError) setJoined(!joined);
  }, [joinError, leaveError]);

  //
  async function handleToggleJoin() {
    if (joined) {
      // Đang là thành viên, bấm rời khỏi
      const res = await leaveMutate({ community_id: community._id || "" });
      if (res.statusCode === 200) setJoined(!joined);
      handleResponse(res);
    } else {
      // Chưa là thành viên, bấm tham gia
      const res = await joinMutate({ community_id: community._id || "" });
      if (res.statusCode === 200) setJoined(!joined);
      handleResponse(res);
    }
  }

  //
  return (
    <div
      key={community._id}
      className="bg-gray-50 hover:bg-gray-100 px-4 py-2 group rounded-xl"
    >
      <div className="flex justify-between items-center">
        <div className="flex-1 gap-4 flex">
          <div>
            {community?.cover ? (
              <AvatarMain
                alt={community?.name}
                src={community?.cover?.url || "/favicon.png"}
              />
            ) : (
              <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                <Logo size={40} className="text-gray-400 " />
              </div>
            )}
          </div>

          <div className="flex-1">
            <Link
              to={`/communities/${community?.slug}`}
              className="inline-flex items-center gap-2"
            >
              <p className="text-sm leading-snug font-semibold flex items-center gap-1 hover:underline hover:cursor-pointer mb-.5">
                {community.name}
                <VerifyIcon active={!!community.verify} size={20} />
              </p>
            </Link>
            {community.bio && (
              <p className="line-clamp-1 max-w-[95%] text-xs text-muted-foreground">
                {community.bio}
              </p>
            )}
            <div className="mb-1 space-x-1">
              <CommunityTag text={community.visibility_type!} />
              <CommunityTag text={community.membership_type!} />
            </div>
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
              {(
                [...members, ...mentors, community?.admin] as unknown as IUser[]
              )?.map((u, i) => (
                <Avatar key={`${u}-${i}`} className="w-6 h-6">
                  <AvatarImage
                    src={u?.avatar?.url || "/favicon.png"}
                    alt={u?.name}
                  />
                  <AvatarFallback>{u?.name[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>

        <span className="lg:hidden lg:group-hover:block">
          {community.is_admin ? (
            <ButtonMain size="sm" variant="outline" disabled>
              Của bạn
            </ButtonMain>
          ) : (
            <ButtonMain
              size="sm"
              onClick={handleToggleJoin}
              variant="outline"
              className={cn(
                "",
                !joined
                  ? isOnlyInvite
                    ? "pointer-events-none cursor-not-allowed text-gray-300 border-gray-200"
                    : ""
                  : "text-red-400 border-red-200",
              )}
            >
              {!joined
                ? isOnlyInvite
                  ? EMembershipType.Invite_only
                  : "Tham gia"
                : "Rời khỏi"}
            </ButtonMain>
          )}
        </span>
      </div>
    </div>
  );
}

export function CommunityRowSkeleton() {
  return (
    <div className="px-4 py-2 border-b border-gray-50">
      <div className="flex justify-between items-center">
        <div className="flex-1 gap-4 flex">
          {/* Avatar/Cover Placeholder - Cố định kích thước để tránh nhảy layout */}
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />

          <div className="flex-1">
            {/* Title + Verify Icon */}
            <div className="flex items-center gap-2 mb-1">
              <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
            </div>

            {/* Bio - 1 dòng duy nhất như line-clamp-1 */}
            <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse mb-2" />

            {/* Tags (Visibility & Membership) */}
            <div className="flex gap-1 mb-2">
              <div className="h-5 w-16 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
            </div>

            {/* Avatar Stack */}
            <div className="flex -space-x-2 items-center">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full ring-2 ring-white bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Button - Mô phỏng logic lg:hidden lg:group-hover:block */}
        {/* Chúng ta dùng hidden lg:block để khớp với trạng thái hiển thị của Row */}
        <div className="hidden lg:block">
          <div className="h-8 w-20 rounded-md bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
