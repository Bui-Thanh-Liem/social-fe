import { useEffect, useState } from "react";
import { ButtonMain } from "~/components/ui/button";

export function BubbleSort() {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [comparingIndex, setComparingIndex] = useState<{
    i: number;
    j: number;
  } | null>(null);
  const [sortedLimit, setSortedLimit] = useState<number | null>(null);

  const resetArray = () => {
    const newArray = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 150) + 10,
    );
    setArray(newArray);
    setComparingIndex(null);
    setSortedLimit(null);
    setIsSorting(false);
  };

  useEffect(() => {
    resetArray();
  }, []);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Đánh dấu 2 phần tử đang so sánh
        setComparingIndex({ i: j, j: j + 1 });
        await sleep(100); // Tốc độ nhanh hơn vì Bubble Sort khá nhiều bước

        if (arr[j] > arr[j + 1]) {
          // Hoán đổi
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }
      // Sau mỗi vòng lặp lớn, phần tử lớn nhất đã "nổi" lên cuối
      setSortedLimit(n - i - 1);
    }

    setSortedLimit(0); // Đã xong toàn bộ
    setComparingIndex(null);
    setIsSorting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-[calc(100vh-100px)]">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Bubble Sort</h1>

      <div className="flex items-end justify-center gap-1 bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl h-64">
        {array.map((value, idx) => {
          let barColor = "bg-blue-400"; // Mặc định

          // Đang so sánh cặp này
          if (
            comparingIndex &&
            (idx === comparingIndex.i || idx === comparingIndex.j)
          ) {
            barColor = "bg-yellow-400 scale-110 shadow-md z-10";
          }

          // Vùng đã chốt (đã nổi lên trên cùng)
          if (sortedLimit !== null && idx >= sortedLimit) {
            barColor = "bg-green-500";
          }

          return (
            <div
              key={idx}
              className={`${barColor} transition-all duration-100 rounded-t-sm`}
              style={{ height: `${value * 1.5}px`, width: "24px" }}
            ></div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-4">
        <ButtonMain onClick={resetArray} disabled={isSorting} variant="outline">
          Làm mới mảng
        </ButtonMain>
        <ButtonMain onClick={bubbleSort} disabled={isSorting}>
          {isSorting ? "Đang chạy..." : "Bắt đầu sắp xếp"}
        </ButtonMain>
      </div>

      <div className="mt-6 text-sm text-gray-600 flex gap-6">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-400"></span> Đang so sánh cặp
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-400"></span> Chưa sắp xếp
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500"></span> Đã cố định (Nổi xong)
        </div>
      </div>
    </div>
  );
}
