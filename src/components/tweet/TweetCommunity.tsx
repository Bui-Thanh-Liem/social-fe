import { User, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useGetAllBareCommunities } from "~/apis/useFetchCommunity";
import { TypographyP } from "../elements/p";
import { CheckIcon } from "../icons/check";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function TweetCommunity({
  onchange,
  communityId,
}: {
  communityId?: string;
  onchange: (community_id: string) => void;
}) {
  const [selectedOption, setSelectedOption] = useState(communityId || "");

  useEffect(() => {
    onchange(selectedOption);
  }, [onchange, selectedOption]);

  const { data } = useGetAllBareCommunities();
  const communities = data?.metadata
    ? [
        {
          _id: "",
          name: "Dòng thời gian của tôi",
          icon: <User color="#fff" size={20} />,
        },
        ...data.metadata,
      ]
    : [];

  if (!communities.length) return null;

  //
  const selectedOptionData = communities.find(
    (opt) => opt._id === selectedOption,
  ) as any;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-0 outline-transparent px-3 text-[#1D9BF0] bg-blue-100/50 rounded-2xl inline-flex gap-2 items-center cursor-pointer transition-colors py-1">
          {selectedOptionData?.icon &&
          React.isValidElement(selectedOptionData.icon) ? (
            React.cloneElement(selectedOptionData.icon, {
              color: "rgb(29, 155, 240)",
            } as { color: string })
          ) : (
            <Users color="#1d9bf0" size={20} />
          )}
          <TypographyP className="font-medium text-sm">
            {selectedOptionData?.name}
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
          <h3 className="font-semibold text-gray-900">
            Bài viết này sẽ xuất hiện ở đâu ?
          </h3>
          <p className="text-sm text-gray-500">Trên dòng thời gian của bạn.</p>
          <p className="text-sm text-gray-500">
            Trong cộng đồng bạn đã tham gia.
          </p>
        </div>

        {/* Options */}
        <div className="max-h-[30vh] overflow-y-auto">
          {communities.map((option) => (
            <DropdownMenuItem
              key={option._id}
              className="cursor-pointer px-4 py-3 focus:bg-blue-50 data-[highlighted]:bg-blue-50"
              onClick={() => setSelectedOption(option._id)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className={`bg-blue-500 rounded-full p-2 text-white`}>
                    {(option as any)?.icon ? (
                      (option as any)?.icon
                    ) : (
                      <Users color="#fff" size={20} />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">
                      {option.name}
                    </span>
                  </div>
                </div>
                {selectedOption === option._id && <CheckIcon />}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
