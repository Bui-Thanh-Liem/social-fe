import { Search, X } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSearchPending } from "~/apis/useFetchSearch";
import {
  useCreateSearchHistory,
  useDeleteSearchHistory,
  useGetMultiSearchHistory,
} from "~/apis/useFetchSearchHistory";
import { useDebounce } from "~/hooks/useDebounce";
import { cn } from "~/lib/utils";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { ITrending } from "~/shared/interfaces/schemas/trending.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useUserStore } from "~/store/useUserStore";
import { toastSimpleVerify } from "~/utils/toast";
import { VerifyIcon } from "../icons/verify";
import { Logo } from "../Logo";
import { AvatarMain } from "../ui/avatar";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type SearchSize = "sm" | "md" | "lg";

const sizeStyles: Record<SearchSize, string> = {
  sm: "h-8 text-sm pl-8 pr-3",
  md: "h-10 text-base pl-9 pr-4",
  lg: "h-12 text-lg pl-10 pr-5",
};

interface SearchBarProps {
  size?: SearchSize;
  className?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
}

export function SearchAdvanced({
  onChange,
  className,
  size = "md",
  placeholder = "Tìm kiếm",
}: SearchBarProps) {
  const { user } = useUserStore();

  //
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || hash;

  //
  const [open, setOpen] = useState(false);
  const [searchVal, setSearchVal] = useState(q ?? "");
  const debouncedValue = useDebounce(searchVal, 400);

  //
  const apiCreateHistory = useCreateSearchHistory();
  const apiDeleteHistory = useDeleteSearchHistory();

  //
  const { data } = useSearchPending(
    {
      page: "1",
      limit: "10",
      q: debouncedValue,
    },
    !!debouncedValue && debouncedValue.length > 0,
  );

  const { data: resSearchHistory } = useGetMultiSearchHistory({
    page: "1",
    limit: "10",
    q: debouncedValue,
  });

  // Search pending
  const users = data?.metadata?.users || [];
  const trending = data?.metadata?.trending || [];
  const communities = data?.metadata?.communities || [];

  //
  const searHistory = resSearchHistory?.metadata?.items || [];

  //
  function onChangeSearch(val: string) {
    setSearchVal(val);
    if (onChange) onChange(val);
  }

  //
  function onKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Enter") {
      if (!handleCheckPermission()) return;

      if (searchVal) {
        apiCreateHistory.mutate({ text: searchVal });
        navigate(`/search?q=${searchVal}`);
      }
    }
  }

  //
  function onClickTrendingItem(tr: ITrending) {
    if (!handleCheckPermission()) return;

    if (tr) {
      apiCreateHistory.mutate({ trending: tr._id });
      navigate(`/search?q=${tr?.topic}`);
    }
    setSearchVal(tr.topic!);
    setOpen(false);
  }

  function onClickShItem(tr: string) {
    if (!handleCheckPermission()) return;
    navigate(`/search?q=${tr}`);
    setSearchVal(tr);
    setOpen(false);
  }

  //
  function onClickUserItem(u: IUser) {
    if (!handleCheckPermission()) return;

    if (u) {
      apiCreateHistory.mutate({ user: u._id });
      navigate(`/${u.username}`);
    }
    setSearchVal(u.username!);
    setOpen(false);
  }

  //
  function onClickCommunityItem(c: ICommunity) {
    if (!handleCheckPermission()) return;

    if (c) {
      apiCreateHistory.mutate({ community: c._id });
      navigate(`/search?q=${c?.slug}`);
    }
    setSearchVal(c?.slug);
    setOpen(false);
  }

  function handleDeleteHistory(e: any, id: string) {
    e.stopPropagation();
    e.preventDefault();
    apiDeleteHistory.mutate({ id });
  }

  function handleCheckPermission() {
    if (user && !user?.verify) {
      toastSimpleVerify();
    }

    return user?.verify;
  }

  //
  function onClear() {
    setSearchVal("");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          {/* Icon search bên trái */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          {/* Input */}
          <Input
            type="text"
            value={searchVal}
            placeholder={placeholder}
            onChange={(e) => onChangeSearch(e.target.value)}
            onKeyDown={onKeydown}
            className={cn("rounded-full", sizeStyles[size])}
          />

          {/* Nút clear */}
          {searchVal && (
            <X
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
            />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "bg-white border rounded-2xl shadow-lg z-[4000] w-80",
          className,
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-[60vh] overflow-y-auto">
          {searchVal && (
            <>
              {/*  */}
              {!!trending?.length && (
                <ul>
                  {trending.map((tr) => (
                    <li
                      key={tr._id}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-1"
                      onClick={() => onClickTrendingItem(tr)}
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <h3 className="ml-4 text-md font-semibold">{tr.topic}</h3>
                    </li>
                  ))}
                </ul>
              )}

              {trending.length > 0 && users.length > 0 && (
                <hr className="my-2" />
              )}

              {/*  */}
              {!!users?.length && (
                <ul>
                  {users.map((u) => (
                    <li
                      key={u._id}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-1"
                      onClick={() => onClickUserItem(u)}
                    >
                      <AvatarMain
                        src={u.avatar?.url}
                        alt={u.name}
                        className="mr-3"
                      />
                      <div>
                        <span className="flex items-center gap-2">
                          <h3 className="text-md font-semibold">{u.name}</h3>
                          <VerifyIcon active={!!u.verify} size={20} />
                        </span>
                        <p className="text-[14px] text-gray-400">
                          {u.username}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {users.length > 0 && communities.length > 0 && (
                <hr className="my-2" />
              )}

              {/*  */}
              {!!communities?.length && (
                <ul>
                  {communities.map((c) => (
                    <li
                      key={c._id}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-2"
                      onClick={() => onClickCommunityItem(c)}
                    >
                      <div className="w-16 h-12 rounded-lg overflow-hidden">
                        {c?.cover ? (
                          <img
                            src={c?.cover?.url}
                            alt="Cover Photo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                            <Logo size={32} className="text-gray-400 " />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="flex items-center gap-2">
                          <h3 className="text-md font-semibold line-clamp-1 max-w-[90%]">
                            {c.name}
                          </h3>
                          <div>
                            <VerifyIcon active={!!c.verify} size={20} />
                          </div>
                        </span>
                        <p className="text-[14px] text-gray-400">
                          {c.category}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {!searchVal && (
          <div className="max-h-[60vh] overflow-y-auto">
            {searHistory.length > 0 && (
              <ul>
                {searHistory.map((sh) => {
                  const shTrending = sh.trending as ITrending;
                  const shUser = sh.user as IUser;
                  const shCommunity = sh.community as ICommunity;

                  if (shTrending) {
                    return (
                      <li
                        key={shTrending._id}
                        className="group cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-1"
                        onClick={() => onClickTrendingItem(shTrending)}
                      >
                        <div>
                          <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <h3 className="ml-4 text-md line-clamp-1 max-w-[90%] font-semibold">
                          {shTrending.topic}
                        </h3>
                        <X
                          size={18}
                          className="hidden group-hover:flex ml-auto text-gray-400"
                          onClick={(e) => handleDeleteHistory(e, sh._id)}
                        />
                      </li>
                    );
                  }

                  if (shUser) {
                    return (
                      <li
                        key={shUser._id}
                        className="group cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-1"
                        onClick={() => onClickUserItem(shUser)}
                      >
                        <AvatarMain
                          src={shUser.avatar?.url}
                          alt={shUser.name}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <span className="flex items-center gap-2">
                            <h3 className="text-md font-semibold line-clamp-1 max-w-[90%]">
                              {shUser.name}
                            </h3>
                          </span>
                          <p className="text-[14px] text-gray-400">
                            {shUser.username}
                          </p>
                        </div>
                        <X
                          size={18}
                          className="hidden group-hover:flex ml-auto text-gray-400"
                          onClick={(e) => handleDeleteHistory(e, sh._id)}
                        />
                      </li>
                    );
                  }

                  if (shCommunity) {
                    return (
                      <li
                        key={shCommunity._id}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-2 group"
                        onClick={() => onClickCommunityItem(shCommunity)}
                      >
                        <div className="w-16 h-12 rounded-lg overflow-hidden">
                          {shCommunity?.cover ? (
                            <img
                              src={shCommunity?.cover?.url}
                              alt="Cover Photo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                              <Logo size={32} className="text-gray-400 " />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="flex items-center gap-2">
                            <h3 className="text-md font-semibold line-clamp-1 max-w-[90%]">
                              {shCommunity.name}
                            </h3>

                            <div>
                              <VerifyIcon
                                active={!!shCommunity.verify}
                                size={20}
                              />
                            </div>
                          </span>
                          <p className="text-[14px] text-gray-400">
                            {shCommunity.category}
                          </p>
                        </div>
                        <X
                          size={18}
                          className="hidden group-hover:flex ml-auto text-gray-400"
                          onClick={(e) => handleDeleteHistory(e, sh._id)}
                        />
                      </li>
                    );
                  }

                  return (
                    <li
                      key={sh._id}
                      className="group cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-1"
                      onClick={() => onClickShItem(sh.text!)}
                    >
                      <div>
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <h3 className="ml-4 flex-1 text-md font-semibold line-clamp-1 max-w-[90%]">
                        {sh.text}
                      </h3>
                      <div>
                        <X
                          size={18}
                          className="hidden group-hover:flex ml-auto text-gray-400"
                          onClick={(e) => handleDeleteHistory(e, sh._id)}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/*  */}
        <p className="text-gray-500 text-base p-2 pt-3 line-clamp-2">
          Tìm kiếm mọi thứ bạn muốn{" "}
          {searchVal && <strong>"{searchVal}"</strong>}
        </p>
      </PopoverContent>
    </Popover>
  );
}
