import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { EReelType } from "~/shared/enums/type.enum";

//
const type = [
  {
    id: EReelType.Reel,
    title: "Bản tin thông thường",
  },
  {
    id: EReelType.Story,
    title: "Tự động ẩn sau 24h",
  },
];

export function ReelType({
  onChangeType,
}: {
  onChangeType: (type: EReelType) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<EReelType>(
    EReelType.Reel,
  );

  useEffect(() => {
    onChangeType(selectedOption);
  }, [onChangeType, selectedOption]);

  const selectedOptionData = type.find((opt) => opt.id === selectedOption);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-0 outline-transparent px-3 h-8 text-[#1D9BF0] bg-blue-100/50 rounded-2xl inline-flex gap-2 items-center cursor-pointer transition-colors">
          <p className="font-semibold text-sm">
            {selectedOptionData?.title}
          </p>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        className="rounded-2xl w-72 px-0 py-2"
      >
        {/* Options */}
        {type.map((option) => (
          <DropdownMenuItem
            key={option.id}
            className="cursor-pointer px-4 py-3 focus:bg-blue-50 data-[highlighted]:bg-blue-50"
            onClick={() => setSelectedOption(option.id)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">
                  {option.title}
                </span>
              </div>
              {selectedOption === option.id && <Check />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
