import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { IUser } from "~/shared/interfaces/schemas/user.interface";
import { cn } from "~/utils/cn.util";

interface GroupAvatarMainProps {
  srcs: string[];
  max?: number; // số avatar hiển thị tối đa
  className?: string;
}

interface AvatarGroupProps {
  max?: number;
  className?: string;
  users: Pick<IUser, "name" | "avatar">[];
}

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarMain({
  src,
  className,
  alt = "avatar",
}: {
  className?: string;
  alt: string | undefined;
  src: string | undefined;
}) {
  return (
    <Avatar className={cn("w-10 h-10", className)}>
      <AvatarImage
        src={src || "/favicon.png"}
        alt={alt}
        className="object-cover"
      />
      <AvatarFallback>{alt[0]?.toLocaleUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

function GroupAvatarMain({ srcs, max = 3 }: GroupAvatarMainProps) {
  const visibleUsers = srcs?.slice(0, max);

  return (
    <div className="-space-y-2">
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
        {visibleUsers?.slice(0, 2).map((src) => (
          <AvatarMain
            key={src}
            src={src}
            alt={src}
            className="w-7 h-7 border border-white"
          />
        ))}
      </div>
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
        {visibleUsers?.slice(2, 4).map((src) => (
          <AvatarMain
            key={src}
            src={src}
            alt={src}
            className="w-7 h-7 border border-white"
          />
        ))}
      </div>
    </div>
  );
}

export function AvatarGroup({ users, max = 3, className }: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-3">
      {visibleUsers.map((user, index) => (
        <AvatarMain
          key={index}
          alt={user.name}
          src={user.avatar?.url}
          className={cn("border-2 border-white", className)}
        />
      ))}

      {remaining > 0 && (
        <Avatar className="border-2 border-white">
          <AvatarFallback>+{remaining}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export { Avatar, AvatarFallback, AvatarImage, AvatarMain, GroupAvatarMain };
