import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

export function StarPrestige({ count }: { count: number }) {
  return (
    <span className={cn("flex items-center gap-x-1")}>
      <Star fill="yellow" color="orange" className="inline-block" size={20} />
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-gray-500">{count}</span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Uy tín</p>
        </TooltipContent>
      </Tooltip>
    </span>
  );
}
