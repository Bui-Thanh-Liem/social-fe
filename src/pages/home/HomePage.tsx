import { useEffect, useRef } from "react";
import { TypographyP } from "~/components/elements/p";
import { cn } from "~/lib/utils";
import { EFeedType } from "~/shared/enums/type.enum";
import { useReloadStore } from "~/store/useReloadStore";
import { ListTweets } from "../../components/list-tweets/ListTweets";
import { Tweet } from "../../components/tweet/Tweet";
import { useLocation, useNavigate } from "react-router-dom";

export function HomePage() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { triggerReload, reloadKey } = useReloadStore();

  const classNav =
    "flex-1 h-full flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 font-semibold transition-colors relative";
  const classActive =
    "text-black font-bold after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-26 after:h-1 after:rounded-full after:bg-[#1D9BF0]";

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0; // scroll lên đầu container
    }
  }, [reloadKey]);

  function handleClickTabForYou() {
    triggerReload();
    navigate(`${pathname}`);
  }

  function handleClickTabFollowing() {
    triggerReload();
    navigate(`${pathname}#${EFeedType.Following}`);
  }

  return (
    <main className="relative h-screen flex flex-col">
      {/* Fixed Navigation Bar */}
      <div className="h-14 bg-white/50 backdrop-blur-md z-30 flex border-b border-gray-200 flex-shrink-0">
        <div className="flex w-full h-full">
          <TypographyP
            className={cn(classNav, hash === "" && classActive)}
            onClick={handleClickTabForYou}
          >
            Dành Cho Bạn
          </TypographyP>
          <TypographyP
            className={cn(
              classNav,
              hash === `#${EFeedType.Following}` && classActive,
            )}
            onClick={handleClickTabFollowing}
          >
            Đã Theo Dõi
          </TypographyP>
        </div>
      </div>

      {/* Scrollable Content */}
      <div ref={containerRef} className="flex-1 overflow-y-auto">
        <div className="px-4 pt-4">
          <Tweet />
        </div>
        <div className="border-b border-gray-100" />
        <ListTweets feedType={formatTypeText(hash)} />
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
    default:
      return EFeedType.All;
  }
}
