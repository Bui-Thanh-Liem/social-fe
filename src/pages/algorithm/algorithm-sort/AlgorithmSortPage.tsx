import { useNavigate } from "react-router-dom";
import { ButtonMain } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export function AlgorithmSortPage() {
  const navigate = useNavigate();

  const sortingAlgorithms = [
    {
      name: "Selection Sort",
      desc: "Tìm phần tử nhỏ nhất trong phần chưa sắp xếp và đưa về đầu mảng.",
      path: "/algorithm/sort/selection",
    },
    {
      name: "Insertion Sort",
      desc: "Xây dựng mảng đã sắp xếp bằng cách chèn từng phần tử vào đúng vị trí của nó.",
      path: "/algorithm/sort/insertion",
    },
    {
      name: "Bubble Sort",
      desc: "Liên tục hoán đổi các cặp phần tử kề nhau nếu chúng sai thứ tự cho đến khi mảng ổn định.",
      path: "/algorithm/sort/bubble",
    },
    {
      name: "Merge Sort",
      desc: "Sử dụng chiến thuật 'Chia để trị' để chia nhỏ mảng rồi trộn lại theo thứ tự.",
      path: "/algorithm/sort/merge",
    },
    {
      name: "Quick Sort",
      desc: "Chọn một điểm chốt (pivot) và phân chia mảng thành các phần nhỏ hơn và lớn hơn chốt.",
      path: "/algorithm/sort/quick",
    },
    {
      name: "Heap Sort",
      desc: "Sử dụng cấu trúc dữ liệu Heap để tìm phần tử lớn nhất và đưa về cuối mảng.",
      path: "/algorithm/sort/heap",
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4 max-h-[calc(100vh-60px)] overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8 text-center italic text-slate-800">
        Trực quan hóa các thuật toán sắp xếp
      </h1>

      {/* Grid container: Sửa lỗi lệch item bằng gap-8 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortingAlgorithms.map((algo) => (
          <div
            key={algo.name}
            className="group [perspective:1000px] h-[250px] w-full"
          >
            {/* The Flipping Card */}
            <div className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(-180deg)] rounded-3xl">
              {/* FRONT SIDE */}
              <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden] border-2 border-slate-100 flex flex-col justify-center bg-white">
                <CardContent className="p-6 text-center">
                  <div className="inline-block p-3 rounded-full bg-blue-50 text-sky-600 mb-4 group-hover:scale-110 transition-transform duration-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3 16 4 4 4-4" />
                      <path d="M7 20V4" />
                      <path d="m21 8-4-4-4 4" />
                      <path d="M17 4v16" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {algo.name}
                  </h2>
                  <p className="mt-2 text-slate-400 text-sm italic">
                    Di chuột để lật thẻ
                  </p>
                </CardContent>
              </Card>

              {/* BACK SIDE */}
              <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-sky-500 bg-sky-100 flex flex-col justify-center overflow-hidden">
                <CardContent className="p-6 text-center relative z-10">
                  <h2 className="text-xl font-bold mb-3">{algo.name}</h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {algo.desc}
                  </p>
                  <ButtonMain onClick={() => navigate(algo.path)}>
                    Xem mô phỏng
                  </ButtonMain>
                </CardContent>

                {/* Decorative background element for back side */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl" />
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
