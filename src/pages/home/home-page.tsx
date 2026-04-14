import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllPinnedBareCommunities } from "~/apis/community.api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { EFeedType } from "~/shared/enums/type.enum";
import { useReloadStore } from "~/store/useReloadStore";
import { TweetsList } from "../../components/list-tweets/tweets-list";
import { CommunityTweets } from "../community/Community-page/community-tweets";
import { ReelsList } from "../../components/reel/reels-list";

export function HomePage() {
  // Metadata
  useEffect(() => {
    document.title = "Mạng xã hội (DEV)";
  }, []);

  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  //
  const [communityId, setCommunityId] = useState<string>("");
  const [valueSelect, setValueSelect] = useState<string>(`/`);

  //
  const { triggerReload, reloadKey } = useReloadStore();

  //
  const { data } = useGetAllPinnedBareCommunities();
  const pinnedCommunities = data?.metadata || [];

  //
  const containerRef = useRef<HTMLDivElement>(null);

  //
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = 0; // scroll lên đầu container
  }, [reloadKey]);

  //
  useEffect(() => {
    setValueSelect(hash || "/");
  }, [hash]);

  //
  const navigation = [
    {
      name: "Dành Cho Bạn",
      value: "/",
    },
    {
      name: "Đã Theo Dõi",
      value: `#${EFeedType.Following}`,
    },
    ...pinnedCommunities.map((community) => ({
      name: community.name,
      value: `#${community.slug}`,
    })),
  ];

  //
  function handleClickNav(value: string) {
    triggerReload();
    setValueSelect(value);

    const selectedCommunity = pinnedCommunities.find(
      (community) => `#${community.slug}` === value,
    );
    const communityId = selectedCommunity?._id || "";
    setCommunityId(communityId);
    navigate(value === "/" ? pathname : `${pathname}${value}`);
  }

  return (
    <main className="relative grid grid-cols-12 pt-3 h-[calc(100vh-70px)] overflow-y-auto">
      <div className="col-span-0 xl:col-span-2"></div>
      <div ref={containerRef} className="col-span-12 xl:col-span-10 ">
        {/* Fixed Navigation Bar */}
        <Select
          value={valueSelect}
          onValueChange={handleClickNav}
          defaultValue={navigation[0].value}
        >
          <SelectTrigger
            id="nav"
            size="sm"
            className="border-0 outline-0 focus:bg-white bg-white min-w-60 mb-3"
          >
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {navigation.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/*  */}
        <ReelsList />

        {/* Scrollable Content */}
        {Object.values(EFeedType).includes(formatTypeText(hash)) ? (
          <TweetsList feedType={formatTypeText(hash)} />
        ) : (
          <div className="space-y-4">
            <CommunityTweets community_id={communityId} />
          </div>
        )}
      </div>
    </main>
  );
}

function formatTypeText(type: any) {
  switch (type) {
    case `#${EFeedType.Everyone}`:
      return EFeedType.Everyone;
    case `#${EFeedType.Following}`:
      return EFeedType.Following;
    case ``:
      return EFeedType.All;
    default:
      return type?.replace("#", "");
  }
}
