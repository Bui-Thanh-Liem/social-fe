import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ALargeSmall } from "lucide-react";

const TEXT_OPTIONS = [
  // ===== CÁC MÀU CHÍNH =====
  { name: "Black", value: "#000000" },
  { name: "Dark Gray", value: "#1f2937" },
  { name: "Gray", value: "#6b7280" },
  { name: "Light Gray", value: "#9ca3af" },
  { name: "White", value: "#ffffff" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },

  // ===== TUỲ CHỈNH =====
  { name: "Custom", value: "CUSTOM" },
];

export function TextColorTweet({
  onChose,
}: {
  onChose: (text: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span onClick={() => setOpen(!open)} className="cursor-pointer">
          <ALargeSmall color="#1d9bf0" size={20} />
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="p-3 border rounded-2xl bg-white shadow-xl flex flex-wrap gap-3 z-[2000] w-[280px]"
        align="start"
      >
        {TEXT_OPTIONS.map((text) => (
          <div key={text.name} className="relative">
            {text.value === "CUSTOM" ? (
              // Nút chọn màu tùy chỉnh với thiết kế Gradient đa sắc
              <label
                className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform flex items-center justify-center relative overflow-hidden shadow-sm"
                title="Custom Color"
                style={{
                  background:
                    "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
                }}
              >
                {/* Biểu tượng ống hút màu hoặc một vòng tròn trắng nhỏ ở giữa để tạo điểm nhấn */}
                <div className="w-3 h-3 bg-white rounded-full shadow-inner opacity-80" />

                <input
                  type="color"
                  className="absolute inset-0 opacity-0 cursor-pointer scale-[3]" // Scale to make the click area larger
                  onChange={(e) => onChose(e.target.value)}
                />
              </label>
            ) : (
              // Các nút màu có sẵn của bạn
              <button
                onClick={() => onChose(text.value)}
                title={text.name}
                style={{ color: text.value }}
                className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform shadow-sm"
              >
                Aa
              </button>
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
