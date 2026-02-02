import { useEffect, useRef, useState } from "react";
import { TypographyP } from "~/components/elements/p";
import { cn } from "~/lib/utils";
import { EFeedType } from "~/shared/enums/type.enum";
import { useReloadStore } from "~/store/useReloadStore";
import { ListTweets } from "../../components/list-tweets/ListTweets";
import { Tweet } from "../../components/tweet/Tweet";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllPinnedBareCommunities } from "~/apis/useFetchCommunity";
import { CommunityTweets } from "../community/Community-page/CommunityTweets";
import { Hand, HandGrab } from "lucide-react";

function AutoGrabIcon() {
  return (
    <div className="relative h-4 w-4">
      <Hand className="absolute grab-open" size={16} />
      <HandGrab className="absolute grab-close" size={16} />
    </div>
  );
}

export function HomePage() {
  //
  const navRef = useRef<HTMLDivElement>(null);
  const hasDragged = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      hasDragged.current = false;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      el.classList.add("cursor-grabbing");
    };

    const onMouseLeave = () => {
      isDragging.current = false;
      el.classList.remove("cursor-grabbing");
    };

    const onMouseUp = () => {
      isDragging.current = false;
      el.classList.remove("cursor-grabbing");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const x = e.pageX - el.offsetLeft;
      const walk = x - startX.current;

      if (Math.abs(walk) > 5) {
        hasDragged.current = true; // 🔥 đánh dấu đã drag
      }

      el.scrollLeft = scrollLeft.current - walk;
    };

    const onClickCapture = (e: MouseEvent) => {
      if (hasDragged.current) {
        e.preventDefault();
        e.stopPropagation();
        hasDragged.current = false;
      }
    };
    el.addEventListener("click", onClickCapture, true);

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);
  //

  const { pathname, hash } = useLocation();
  const [communityId, setCommunityId] = useState<string>("");

  const navigate = useNavigate();
  const { triggerReload, reloadKey } = useReloadStore();

  //
  const { data } = useGetAllPinnedBareCommunities();
  const pinnedCommunities = data?.metadata || [];

  //
  const classNav =
    "min-w-1/2 line-clamp-1 max-w-4 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 font-semibold transition-colors relative";
  const classActive =
    "text-black font-bold after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-26 after:h-1 after:rounded-full after:bg-[#1D9BF0]";

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

  function handleClickTabFollowing() {
    triggerReload();
    navigate(`${pathname}#${EFeedType.Following}`);
  }

  function handleClickTabCommunity(slug: string, communityId: string) {
    triggerReload();
    setCommunityId(communityId);
    navigate(`${pathname}#${slug}`);
  }

  const havePinnedCommunities = pinnedCommunities.length > 0;
  return (
    <main className="relative">
      {/* Fixed Navigation Bar */}
      <div className="sticky top-0 h-14 bg-white/50 backdrop-blur-md z-30 flex border-b border-gray-200 flex-shrink-0 cursor-grab">
        <div
          ref={navRef}
          className="flex w-full h-full overflow-x-auto scrollbar-hide"
        >
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
                  `${classNav} select-none text-center`,
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

        {havePinnedCommunities && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <AutoGrabIcon />
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div
        ref={containerRef}
        className="flex-1 h-[calc(100vh-56px)] overflow-y-auto"
      >
        <div className="px-4 pt-4">
          <Tweet community={communityId} />
        </div>
        <div className="border-b border-gray-100" />
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
