import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useJoinCommunity, useLeaveCommunity } from "~/apis/useFetchCommunity";
import { VerifyIcon } from "~/components/icons/verify";
import { Logo } from "~/components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { EMembershipType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useUserStore } from "~/store/useUserStore";
import { toastSimpleVerify } from "~/utils/toast";
import { CommunityTag } from "./CommunityCard";

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
  const { user: userActive } = useUserStore();
  const [joined, setJoined] = useState(community?.is_joined);

  //
  const { mutate: joinMutate, isError: joinError } = useJoinCommunity();
  const { mutate: leaveMutate, isError: leaveError } = useLeaveCommunity();

  //
  useEffect(() => {
    if (joinError || leaveError) setJoined(!joined);
  }, [joinError, leaveError]);

  //
  function handleToggleJoin() {
    if (userActive && !userActive?.verify) {
      toastSimpleVerify();
      return;
    }

    if (joined) {
      // Đang là thành viên, bấm rời khỏi
      setJoined(!joined);
      leaveMutate({
        community_id: community._id || "",
      });
    } else {
      // Chưa là thành viên, bấm tham gia
      setJoined(!joined);
      joinMutate({
        community_id: community._id || "",
      });
    }
  }

  //
  return (
    <div key={community._id} className="hover:bg-gray-100 px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex-1 gap-4 flex">
          <div className="w-32 h-24 rounded-xl overflow-hidden border border-gray-50">
            {community?.cover ? (
              <img
                alt="Cover Photo"
                src={community?.cover?.url || "/favicon.png"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                <Logo size={32} className="text-gray-400 " />
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
      </div>
    </div>
  );
}

export function CommunityRowSkeleton() {
  return (
    <div className="px-4 py-3 hover:bg-gray-50">
      <div className="flex justify-between items-center">
        <div className="flex-1 gap-4 flex">
          {/* cover */}
          <div
            className="w-20 h-24 rounded-xl overflow-hidden bg-gray-200 animate-pulse"
            aria-hidden="true"
          />

          <div className="flex-1">
            {/* title + verify placeholder */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-20 lg:w-40 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-4 w-6 rounded-md bg-gray-200 animate-pulse" />
            </div>

            {/* bio (2 lines) */}
            <div className="space-y-2 mb-3.5 max-w-[95%]">
              <div className="h-3 w-full rounded-md bg-gray-200 animate-pulse" />
              <div className="h-3 w-5/6 rounded-md bg-gray-200 animate-pulse" />
            </div>

            {/* avatars */}
            <div className="flex -space-x-2 items-center" aria-hidden="true">
              {/* create several circular skeletons to mimic avatars */}
              <div className="w-6 h-6 rounded-full ring-2 ring-white bg-gray-200 animate-pulse" />
              <div className="w-6 h-6 rounded-full ring-2 ring-white bg-gray-200 animate-pulse" />
              <div className="w-6 h-6 rounded-full ring-2 ring-white bg-gray-200 animate-pulse" />
              <div className="w-6 h-6 rounded-full ring-2 ring-white bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>

        {/* button skeleton */}
        <div>
          <div
            role="status"
            aria-label="Loading"
            className="h-8 w-20 rounded-md bg-gray-200 animate-pulse"
          />
        </div>
      </div>
    </div>
  );
}
