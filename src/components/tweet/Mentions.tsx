import { useCallback } from "react";
import { useDebounce } from "~/hooks/useDebounce";
import { useGetMultiForMentions } from "~/apis/useFetchUser";
import { cn } from "~/lib/utils";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { VerifyIcon } from "../icons/verify";
import { AvatarMain } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface MentionsProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  className?: string;
  children: React.ReactNode;
  valueSearch: string;
  onSelect: (user: Pick<IUser, "_id" | "name" | "username">) => void;
}

const UserSkeleton = () => {
  return (
    <li className="cursor-default p-2 rounded flex items-center gap-3 animate-pulse">
      {/* Avatar */}
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

      {/* Texts */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
        </div>
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
      </div>
    </li>
  );
};

export function Mentions({
  open,
  setOpen,
  children,
  className,
  onSelect,
  valueSearch,
}: MentionsProps) {
  //
  const debouncedValue = useDebounce(valueSearch, 400);

  //
  const { data, isLoading } = useGetMultiForMentions(
    debouncedValue,
    !!debouncedValue && debouncedValue.length > 0
  );
  const mentions = data?.metadata || [];

  // Memoize onSelect để tránh re-render không cần thiết
  const handleSelect = useCallback(
    (user: Pick<IUser, "_id" | "name" | "username">) => {
      onSelect(user);
      setOpen(false);
    },
    [onSelect, setOpen]
  );

  //
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn(className)}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="bg-white border rounded-2xl shadow-lg max-h-72 overflow-y-auto z-[100] pointer-events-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isLoading ? (
          <ul className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <UserSkeleton key={idx} />
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col">
            {mentions.map((u) => (
              <li
                key={u._id}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-1"
                onClick={() => handleSelect(u)}
              >
                <AvatarMain src={u.avatar?.url} alt={u.name} className="mr-3" />
                <div>
                  <span className="flex items-center gap-2">
                    <h3 className="text-md font-semibold">{u.name}</h3>
                    <VerifyIcon active={!!u.verify} size={20} />
                  </span>
                  <p className="text-[14px] text-gray-400">{u.username}</p>
                </div>
              </li>
            ))}
            {!mentions.length && (
              <li className="text-gray-500 text-base p-2">Không có kết quả</li>
            )}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
