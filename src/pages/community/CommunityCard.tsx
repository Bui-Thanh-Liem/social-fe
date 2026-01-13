import { Pin, PinOff } from "lucide-react";
import { Link } from "react-router-dom";
import { VerifyIcon } from "~/components/icons/verify";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { WrapIcon } from "~/components/wrapIcon";
import { useTogglePinCommunity } from "~/apis/useFetchCommunity";
import { cn } from "~/lib/utils";
import { EMembershipType, EVisibilityType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";

export function CommunityCard({
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
    <div>
      <Card className="p-0 overflow-hidden hover:shadow relative group">
        <Link
          to={`/communities/${community?.slug}`}
          className="block w-full h-24 border-b"
        >
          {community.cover ? (
            <img
              alt={community.name}
              className="h-full w-full object-cover"
              src={community.cover?.url || "/favicon.png"}
            />
          ) : (
            <div className="bg-gray-300 w-full h-full"></div>
          )}
        </Link>
        <CardHeader className="p-0 px-3 mb-3">
          <CardTitle className="flex items-center gap-1">
            <p className="max-w-[80%] line-clamp-1 pb-0.5">
              <Link to={`/communities/${community?.slug}`}>
                {community.name}
              </Link>
            </p>
            <VerifyIcon active={community.verify} size={20} color="orange" />
          </CardTitle>

          {onTogglePinned && (
            <WrapIcon
              onClick={onTogglePin}
              className={`absolute -top-1 -right-1 rounded-none rounded-bl-xl p-1.5 cursor-pointer transition-all duration-200 ease-out bg-white shadow-sm
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
        </CardHeader>
        <div className="absolute top-[72px] left-2 flex gap-2 items-center">
          <CommunityTag text={community.visibility_type} />
          <CommunityTag text={community.membership_type} />
        </div>
      </Card>
    </div>
  );
}

export function CommunityCardSkeleton() {
  return (
    <Card className="p-0 overflow-hidden relative animate-pulse">
      {/* Cover image skeleton */}
      <div className="w-full h-24 bg-gray-200 relative">
        <div className="absolute bottom-2 left-2 flex gap-2">
          <div className="h-4 w-10 bg-gray-300 rounded-2xl" />
          <div className="h-4 w-10 bg-gray-300 rounded-2xl" />
        </div>
      </div>

      {/* Content skeleton */}
      <CardHeader className="p-0 px-3 mb-3">
        {/* Title */}
        <div className="flex items-center gap-1">
          <div className="h-4 w-3/4 bg-gray-300 rounded" />
          <div className="h-4 w-4 bg-gray-300 rounded-full" />
        </div>

        {/* Pin icon placeholder */}
        <div
          className="absolute -top-1 -right-1 bg-gray-200 rounded-none
          rounded-bl-xl p-2 h-6 w-6"
        />
      </CardHeader>
    </Card>
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
        classNameWrap
      )}
    >
      <p
        className={cn(
          "text-[10px] font-medium",
          _private ? "text-orange-400" : "text-green-400",
          classNameText
        )}
      >
        {text}
      </p>
    </div>
  );
}
