import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/utils/cn.util";

export function StarPrestige({ count }: { count: number }) {
  // Logic xác định màu sắc dựa trên các mốc
  const getColors = (val: number) => {
    if (val <= -50) return { fill: "#ef4444", stroke: "#7f1d1d" }; // Đỏ đậm (Rất thấp)
    if (val <= -20) return { fill: "#f87171", stroke: "#991b1b" }; // Đỏ vừa
    if (val <= -10) return { fill: "#fca5a5", stroke: "#b91c1c" }; // Đỏ nhạt
    return { fill: "yellow", stroke: "orange" }; // Mặc định (Dương)
  };

  const colors = getColors(count);

  return (
    <span className={cn("flex items-center gap-x-1")}>
      <Star
        fill={colors.fill}
        color={colors.stroke}
        className="inline-block"
        size={20}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "font-medium",
              count < 0 ? "text-red-600" : "text-gray-500",
            )}
          >
            {count}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Uy tín: {count < 0 ? "Cảnh báo" : "Tốt"}</p>
        </TooltipContent>
      </Tooltip>
    </span>
  );
}
