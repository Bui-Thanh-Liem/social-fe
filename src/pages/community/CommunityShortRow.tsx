import { Pin, PinOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useTogglePinCommunity } from "~/apis/useFetchCommunity";
import { VerifyIcon } from "~/components/icons/verify";
import { AvatarMain } from "~/components/ui/avatar";
import { WrapIcon } from "~/components/WrapIcon";
import { cn } from "~/lib/utils";
import { EMembershipType, EVisibilityType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";

export function CommunityShortRow({
  community,
  onTogglePinned,
}: {
  community: ICommunity;
  onTogglePinned?: (id: string) => void;
}) {
  //
  const apiTogglePin = useTogglePinCommunity();

  //
  async function onTogglePin(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const res = await apiTogglePin.mutateAsync({
      community_id: community._id,
    });
    if (onTogglePinned && res.statusCode === 200) onTogglePinned(community._id);
  }

  return (
    <div className="group flex gap-x-3 p-2 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 relative">
      <div>
        <AvatarMain
          className="w-14 h-14"
          alt={community?.name}
          src={community?.cover?.url || "/favicon.png"}
        />
      </div>
      <div>
        <div className="flex items-center gap-1">
          <p className="line-clamp-1 pb-0.5 hover:underline">
            <Link to={`/communities/${community?.slug}`}>{community.name}</Link>
          </p>
          <VerifyIcon active={community.verify} size={20} color="orange" />
        </div>

        {onTogglePinned && (
          <WrapIcon
            onClick={onTogglePin}
            className={`absolute top-0 right-0 rounded-none rounded-bl-xl p-1.5 cursor-pointer transition-all duration-200 ease-out bg-white shadow-sm
              ${
                community.pinned
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }
            `}
          >
            {community.pinned ? (
              <>
                {/* 📌 Pin hiện sẵn, hover ẩn */}
                <Pin
                  size={18}
                  className="rotate-45 transition-opacity duration-200 ease-out opacity-100 group-hover:opacity-0"
                />
                {/* ❌ PinOff hiện khi hover */}
                <PinOff
                  size={18}
                  className="rotate-45 text-red-400 absolute inset-0 m-auto transition-opacity duration-200 ease-out opacity-0 group-hover:opacity-100"
                />
              </>
            ) : (
              // 🩶 Khi chưa pin → hover mới hiện icon pin
              <Pin
                size={18}
                className="rotate-45 text-gray-600 transition-opacity duration-200 ease-out opacity-100"
              />
            )}
          </WrapIcon>
        )}
        <div className="flex gap-2 items-center mt-1">
          <CommunityTag text={community.visibility_type} />
          <CommunityTag text={community.membership_type} />
        </div>
      </div>
    </div>
  );
}

export function CommunityShortRowSkeleton() {
  return (
    <div className="flex gap-x-3 p-2 py-3 rounded-xl bg-gray-50 animate-pulse relative">
      {/* 1. Avatar Skeleton (Bên trái) */}
      <div className="w-14 h-14 bg-gray-200 rounded-full flex-shrink-0" />

      {/* 2. Content Skeleton (Bên phải) */}
      <div className="flex-1 space-y-2">
        {/* Title & Verify Icon */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
        </div>

        {/* Tags */}
        <div className="flex gap-2 items-center mt-1">
          <div className="h-5 w-16 bg-gray-200 rounded-lg" />
          <div className="h-5 w-20 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* 3. Pin Icon Placeholder (Góc trên phải) */}
      <div className="absolute -top-1 -right-1 bg-gray-200 rounded-bl-xl h-7 w-7" />
    </div>
  );
}

export function CommunityTag({
  text,
  classNameWrap,
  classNameText,
}: {
  text: EVisibilityType | EMembershipType;
  classNameWrap?: string;
  classNameText?: string;
}) {
  let _private = false;
  if (
    text === EVisibilityType.Private ||
    text === EMembershipType.Invite_only
  ) {
    _private = true;
  }

  return (
    <div
      className={cn(
        "px-1 bg-gray-50/85 border inline-block rounded-2xl",
        _private ? "border-orange-400" : "border-green-400",
        classNameWrap,
      )}
    >
      <p
        className={cn(
          "text-[10px] font-medium",
          _private ? "text-orange-400" : "text-green-400",
          classNameText,
        )}
      >
        {text}
      </p>
    </div>
  );
}
