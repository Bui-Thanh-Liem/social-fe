import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ETweetAudience } from "~/shared/enums/common.enum";
import { TypographyP } from "../elements/p";
import { AccountFollowIcon } from "../icons/account-follow";
import { CheckIcon } from "../icons/check";
import { EarthIcon } from "../icons/earth";
import { MentionsIcon } from "../icons/mentions";

//
const replyOptions = [
  {
    id: ETweetAudience.Everyone,
    title: "Mọi người",
    icon: <EarthIcon color="#fff" />,
  },
  {
    id: ETweetAudience.Mentions,
    title: "Chỉ những ai tôi nhắc đến",
    icon: <MentionsIcon color="#fff" />,
  },
  {
    id: ETweetAudience.Followers,
    title: "Chỉ những ai đang theo dõi tôi",
    icon: <AccountFollowIcon color="#fff" />,
  },
];

export function TweetAudience({
  onChangeAudience,
}: {
  onChangeAudience: (audience: ETweetAudience) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<ETweetAudience>(
    ETweetAudience.Everyone,
  );

  useEffect(() => {
    onChangeAudience(selectedOption);
  }, [onChangeAudience, selectedOption]);

  const selectedOptionData = replyOptions.find(
    (opt) => opt.id === selectedOption,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-0 outline-transparent px-3 text-[#1D9BF0] bg-blue-100/50 rounded-2xl inline-flex gap-2 items-center cursor-pointer transition-colors py-1">
          {selectedOptionData?.icon &&
            React.isValidElement(selectedOptionData.icon) &&
            React.cloneElement(selectedOptionData.icon, {
              color: "rgb(29, 155, 240)",
            } as { color: string })}
          <TypographyP className="font-semibold text-sm">
            {selectedOptionData?.title}
          </TypographyP>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        className="rounded-2xl w-72 px-0 py-2"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Ai có thể tương tác ?</h3>
          <p className="text-sm text-gray-500">
            Có thể trả lời bài viết của bạn.
          </p>
        </div>

        {/* Options */}
        {replyOptions.map((option) => (
          <DropdownMenuItem
            key={option.id}
            className="cursor-pointer px-4 py-3 focus:bg-blue-50 data-[highlighted]:bg-blue-50"
            onClick={() => setSelectedOption(option.id)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className={`bg-blue-500 rounded-full p-2 text-white`}>
                  {option.icon}
                </div>
                <span className="font-medium text-gray-900">
                  {option.title}
                </span>
              </div>
              {selectedOption === option.id && <CheckIcon />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
