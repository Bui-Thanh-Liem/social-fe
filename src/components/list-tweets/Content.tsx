import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { ShortInfoProfile } from "../ShortInfoProfile";
import { WrapIcon } from "../WrapIcon";
import { cn } from "~/lib/utils";

export function Content({
  content,
  mentions,
}: {
  content: string;
  mentions: IUser[];
}) {
  return content.split(/([@#][\w.]+)/g).map((part, i) => {
    // check mention
    if (part.startsWith("@")) {
      const mention = mentions.find((m) => m?.username === part);
      return (
        <ShortInfoProfile
          isInfor
          key={i}
          profile={mention as IUser}
          className="inline"
        >
          <Link
            to={`/${mention?.username}`}
            className="items-center gap-2 inline"
          >
            <span className="text-blue-400 font-semibold hover:underline hover:cursor-pointer mb-2 inline-block">
              {mention?.username}
            </span>
          </Link>
        </ShortInfoProfile>
      );
    }

    // check hashtag
    if (part.startsWith("#")) {
      //
      return (
        <Link
          key={i}
          to={`/search?q=${part.replace("#", "")}`}
          className="text-blue-400 font-medium hover:underline hover:cursor-pointer"
        >
          {part}
        </Link>
      );
    }

    // text thường
    return part;
  });
}

export function ContentExpanded({
  content,
  mentions,
  text,
  bg,
}: {
  content: string;
  mentions: IUser[];
  text: string;
  bg: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn("relative rounded-xl", bg ? "px-3 py-0.5" : "")}
      style={{ background: bg || "transparent", color: text || "inherit" }}
    >
      {/*  */}
      <div
        className={cn(
          "my-3 leading-relaxed whitespace-pre-wrap overflow-hidden",
          // Thêm 2 class "cứu cánh" này:
          "break-words [word-break:break-word] [hyphens:auto]",
          isExpanded ? "" : "line-clamp-14",
        )}
      >
        <Content content={content} mentions={mentions as unknown as IUser[]} />
      </div>

      {/* Gradient mờ phía dưới */}
      {/* {!isExpanded && content.length > 500 && (
        <div className="pointer-events-none absolute bottom-28 left-0 h-16 w-full bg-gradient-to-t from-white to-transparent group-hover:hidden" />
      )} */}

      {/*  */}
      {(content.split("\n").length > 14 || content.length > 500) && (
        <div className="flex my-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="m-auto outline-none"
          >
            <WrapIcon className="bg-gray-100">
              {isExpanded ? (
                <ArrowUp size={20} className="text-blue-400" />
              ) : (
                <ArrowDown size={20} className="text-blue-400" />
              )}
            </WrapIcon>
          </button>
        </div>
      )}
    </div>
  );
}
