import { Rocket, Timer } from "lucide-react";

export const ComingSoonPage = ({ featureName = "Tính năng mới" }) => {
  return (
    <div className="flex items-center justify-center w-full min-h-[400px] p-6 select-none">
      <div className="relative max-w-sm w-full group">
        <div className="relative flex flex-col items-center p-8 bg-white dark:bg-neutral-900 rounded-3xl ">
          {/* Khu vực Tên lửa bay */}
          <div className="relative mb-8">
            {/* Vầng sáng phía sau tên lửa */}
            <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full animate-pulse" />

            {/* Container Tên lửa: Thêm animation lơ lửng */}
            <div
              className="relative w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center 
                          animate-[rocket-float_3s_ease-in-out_infinite] 
                          group-hover:scale-110 group-hover:text-blue-500 transition-all duration-500"
            >
              <Rocket className="w-10 h-10 text-blue-600 dark:text-blue-400 transform -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>

            {/* Icon đồng hồ nhỏ */}
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-amber-400 rounded-full border-4 border-white dark:border-neutral-900 flex items-center justify-center shadow-lg">
              <Timer className="w-3.5 h-3.5 text-white animate-spin-[3s_linear_infinite]" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {featureName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed px-4">
              Tôi đang "nấu" tính năng này một cách kỹ lưỡng nhất.
              <span className="block font-medium text-blue-500 mt-1 italic">
                Sắp được hưởng thức rồi! 🚀
              </span>
            </p>
          </div>

          {/* Thanh trang trí tiến độ */}
          <div className="mt-8 w-full flex gap-1 justify-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full bg-blue-500/20 ${i === 3 ? "w-12 animate-pulse" : "w-4"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Inject CSS keyframes trực tiếp để tránh lỗi TS mà vẫn có hiệu ứng bay */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes rocket-float {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-15px) rotate(8deg); }
        }
      `,
        }}
      />
    </div>
  );
};
