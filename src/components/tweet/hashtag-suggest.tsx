import { useCallback, type ReactNode } from "react";
import { useDebounce } from "~/hooks/useDebounce";
import { useGetMultiHashtags } from "~/apis/public/hashtag.api";
import { cn } from "~/utils/cn.util";
import type { IHashtag } from "~/shared/interfaces/schemas/hashtag.interface";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function HashtagSuggest({
  open,
  setOpen,
  children,
  className,
  oncSelect,
  valueSearch,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  className?: string;
  children: ReactNode;
  valueSearch: string;
  oncSelect: (hashtag: string) => void;
}) {
  //
  const debouncedValue = useDebounce(valueSearch, 400);

  //
  const { data, isLoading } = useGetMultiHashtags(!!debouncedValue, {
    page: "1",
    limit: "20",
    q: debouncedValue.replace("#", ""),
  });
  const hashtags = data?.metadata?.items || [];

  // Memoize onSelect để tránh re-render không cần thiết
  const handleSelect = useCallback(
    (hashtag: IHashtag) => {
      oncSelect(hashtag.name);
      setOpen(false);
    },
    [oncSelect, setOpen],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn(className)}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="p-4 bg-white border rounded-2xl shadow-lg max-h-72 overflow-y-auto z-[100] pointer-events-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isLoading ? (
          <ul className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <li key={idx} className="p-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-2">
            {hashtags.map((h) => (
              <li
                key={h._id}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => handleSelect(h)}
              >
                {h.name}
              </li>
            ))}
            {!hashtags.length && (
              <li className="text-gray-500 text-base p-2">Không có kết quả</li>
            )}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
