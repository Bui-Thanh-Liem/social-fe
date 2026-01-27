import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { ShortInfoProfile } from "../ShortInfoProfile";
import { WrapIcon } from "../WrapIcon";

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
}: {
  content: string;
  mentions: IUser[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/*  */}
      <div
        className={`my-3 leading-relaxed whitespace-break-spaces ${isExpanded ? "" : "line-clamp-10"}`}
      >
        <Content content={content} mentions={mentions as unknown as IUser[]} />
      </div>

      {/* Gradient mờ phía dưới */}
      {!isExpanded && content.length > 500 && (
        <div className="pointer-events-none absolute bottom-28 left-0 h-16 w-full bg-gradient-to-t from-white to-transparent group-hover:hidden" />
      )}

      {/*  */}
      {(content.split("\n").length > 10 || content.length > 500) && (
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
    </>
  );
}
