import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Wallpaper } from "lucide-react";

const BG_OPTIONS = [
  // ===== DARK & MODERN =====
  { name: "Midnight Black", value: "#0f172a" },
  { name: "Twitter Dark", value: "#2e5a86" },
  { name: "Carbon", value: "#29295b" },
  { name: "Deep Navy", value: "#0b1220" },

  // ===== LIGHT & MINIMAL =====
  { name: "Snow", value: "#ffffff" },
  { name: "Soft Gray", value: "#f5f7fa" },
  { name: "Warm Paper", value: "#faf7f2" },
  { name: "Cloud", value: "#f1f5f9" },

  // ===== GRADIENT HIỆN ĐẠI =====
  {
    name: "Blue Aurora",
    value: "linear-gradient(to bottom right, #3b82f6, #6366f1, #9333ea)",
  },
  {
    name: "Sunset",
    value: "linear-gradient(to bottom right, #fb923c, #f43f5e, #db2777)",
  },
  {
    name: "Mint Fresh",
    value: "linear-gradient(to bottom right, #34d399, #06b6d4)",
  },
  {
    name: "Purple Dream",
    value: "linear-gradient(to bottom right, #8b5cf6, #d946ef)",
  },
  {
    name: "Ocean Breeze",
    value: "linear-gradient(to bottom right, #22d3ee, #2563eb)",
  },
  {
    name: "Fire Peach",
    value: "linear-gradient(to bottom right, #f43f5e, #fb923c)",
  },
  {
    name: "Neon Lime",
    value: "linear-gradient(to bottom right, #a3e635, #10b981)",
  },
  {
    name: "Galaxy",
    value: "linear-gradient(to bottom right, #4f46e5, #9333ea, #ec4899)",
  },
  {
    name: "Ice Blue",
    value: "linear-gradient(to bottom right, #bae6fd, #3b82f6)",
  },
  {
    name: "Rose Gold",
    value: "linear-gradient(to bottom right, #fbcfe8, #fcd34d)",
  },
  {
    name: "Cyber Teal",
    value: "linear-gradient(to bottom right, #2dd4bf, #0891b2)",
  },
  {
    name: "Blood Moon",
    value: "linear-gradient(to bottom right, #dc2626, #be123c)",
  },
  {
    name: "Sunrise Violet",
    value: "linear-gradient(to bottom right, #d946ef, #7e22ce)",
  },
  {
    name: "Matcha Latte",
    value: "linear-gradient(to bottom right, #bbf7d0, #a3e635)",
  },

  // ===== AESTHETIC / SOCIAL MEDIA STYLE =====
  {
    name: "Peach Cream",
    value: "linear-gradient(to bottom right, #fde68a, #fda4af)",
  },
  {
    name: "Lavender Milk",
    value: "linear-gradient(to bottom right, #c7d2fe, #d8b4fe)",
  },
  {
    name: "Matcha",
    value: "linear-gradient(to bottom right, #bbf7d0, #34d399)",
  },

  // ===== TUỲ CHỈNH =====
  { name: "Custom", value: "CUSTOM" },
];

export function BgColorTweet({ onChose }: { onChose: (bg: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span onClick={() => setOpen(!open)} className="cursor-pointer">
          <Wallpaper color="#1d9bf0" size={20} />
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="p-3 border rounded-2xl bg-white shadow-xl flex flex-wrap gap-3 z-[2000] w-[280px]"
        align="start"
      >
        {BG_OPTIONS.map((bg) => (
          <div key={bg.name} className="relative">
            {bg.value === "CUSTOM" ? (
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
                title={bg.name}
                onClick={() => onChose(bg.value)}
                style={{ background: bg.value }}
                className={`w-8 h-8 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform shadow-sm`}
              />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
