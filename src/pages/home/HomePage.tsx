import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllPinnedBareCommunities } from "~/apis/useFetchCommunity";
import { TypographyP } from "~/components/elements/p";
import { cn } from "~/lib/utils";
import { EFeedType } from "~/shared/enums/type.enum";
import { useReloadStore } from "~/store/useReloadStore";
import { ListTweets } from "../../components/list-tweets/ListTweets";
import { CommunityTweets } from "../community/Community-page/CommunityTweets";

export function HomePage() {
  const { pathname, hash } = useLocation();
  const [communityId, setCommunityId] = useState<string>("");

  const navigate = useNavigate();
  const { triggerReload, reloadKey } = useReloadStore();

  //
  const { data } = useGetAllPinnedBareCommunities();
  const pinnedCommunities = data?.metadata || [];

  //
  const classNav =
    "min-w-1/2 line-clamp-1 text-gray-700 px-3 py-1 rounded-2xl hover:bg-gray-100 cursor-pointer";
  const classActive = "font-medium bg-gray-100";

  //
  const containerRef = useRef<HTMLDivElement>(null);

  //
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0; // scroll lên đầu container
    }
  }, [reloadKey]);

  //
  function handleClickTabForYou() {
    triggerReload();
    navigate(`${pathname}`);
  }

  //
  function handleClickTabFollowing() {
    triggerReload();
    navigate(`${pathname}#${EFeedType.Following}`);
  }

  //
  function handleClickTabCommunity(slug: string, communityId: string) {
    triggerReload();
    setCommunityId(communityId);
    navigate(`${pathname}#${slug}`);
  }

  const havePinnedCommunities = pinnedCommunities.length > 0;
  return (
    <main className="relative grid grid-cols-12 pt-3">
      {/* Fixed Navigation Bar */}
      <div className="col-span-2 flex">
        <div className="scrollbar-hide space-y-2 pr-4">
          <TypographyP
            className={cn(
              `${classNav} select-none`,
              hash === "" && classActive,
            )}
            onClick={handleClickTabForYou}
          >
            Dành Cho Bạn
          </TypographyP>

          <TypographyP
            className={cn(
              `${classNav} select-none`,
              hash === `#${EFeedType.Following}` && classActive,
            )}
            onClick={handleClickTabFollowing}
          >
            Đã Theo Dõi
          </TypographyP>

          {havePinnedCommunities &&
            pinnedCommunities.map((community) => (
              <TypographyP
                key={community._id}
                className={cn(
                  `${classNav} select-none`,
                  hash === `#${community.slug}` && classActive,
                )}
                onClick={() =>
                  handleClickTabCommunity(community.slug, community._id)
                }
              >
                {community.name}
              </TypographyP>
            ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={containerRef}
        className="col-span-10 h-[calc(100vh-76px)] overflow-y-auto"
      >
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
