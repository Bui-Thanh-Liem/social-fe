import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllPinnedBareCommunities } from "~/apis/useFetchCommunity";
import { EFeedType } from "~/shared/enums/type.enum";
import { useReloadStore } from "~/store/useReloadStore";
import { ListTweets } from "../../components/list-tweets/ListTweets";
import { CommunityTweets } from "../community/Community-page/CommunityTweets";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function HomePage() {
  const { pathname, hash } = useLocation();
  const [communityId, setCommunityId] = useState<string>("");
  const [valueSelect, setValueSelect] = useState<string>(`/`);

  const navigate = useNavigate();
  const { triggerReload, reloadKey } = useReloadStore();

  //
  const { data } = useGetAllPinnedBareCommunities();
  const pinnedCommunities = data?.metadata || [];

  //
  const containerRef = useRef<HTMLDivElement>(null);

  //
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0; // scroll lên đầu container
    }
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
    <main className="relative grid grid-cols-12 pt-3">
      <div className="col-span-3 flex"></div>
      <div
        ref={containerRef}
        className="col-span-9 h-[calc(100vh-76px)] overflow-y-auto"
      >
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

        {/* Scrollable Content */}
        {Object.values(EFeedType).includes(formatTypeText(hash)) ? (
          <ListTweets feedType={formatTypeText(hash)} />
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
