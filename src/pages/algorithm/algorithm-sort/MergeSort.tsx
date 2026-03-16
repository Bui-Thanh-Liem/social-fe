import { useEffect, useState } from "react";
import { ButtonMain } from "~/components/ui/button";

export function MergeSort() {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [activeRange, setActiveRange] = useState<number[]>([]);

  const resetArray = () => {
    const newArray = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 150) + 10,
    );
    setArray(newArray);
    setComparingIndices([]);
    setActiveRange([]);
    setIsSorting(false);
  };

  useEffect(() => {
    resetArray();
  }, []);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Hàm trộn và thực hiện animation
  const merge = async (
    arr: number[],
    start: number,
    mid: number,
    end: number,
  ) => {
    let i = start;
    let j = mid + 1;
    const temp: number[] = [];

    // Hiển thị vùng đang được trộn
    setActiveRange([start, end]);

    while (i <= mid && j <= end) {
      setComparingIndices([i, j]);
      await sleep(150);

      if (arr[i] <= arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }
    }

    while (i <= mid) temp.push(arr[i++]);
    while (j <= end) temp.push(arr[j++]);

    // Cập nhật mảng chính và hiển thị lên UI
    for (let k = 0; k < temp.length; k++) {
      arr[start + k] = temp[k];
      setArray([...arr]);
      setComparingIndices([start + k]);
      await sleep(50);
    }
  };

  const mergeSortRecursive = async (
    arr: number[],
    start: number,
    end: number,
  ) => {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSortRecursive(arr, start, mid);
    await mergeSortRecursive(arr, mid + 1, end);
    await merge(arr, start, mid, end);
  };

  const runMergeSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    await mergeSortRecursive(arr, 0, arr.length - 1);
    setComparingIndices([]);
    setActiveRange([]);
    setIsSorting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-[calc(100vh-100px)]">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Merge Sort</h1>

      <div className="flex items-end justify-center gap-1 bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl h-64">
        {array.map((value, idx) => {
          let barColor = "bg-blue-400"; // Mặc định

          // Đang trong vùng chia/trộn
          if (idx >= activeRange[0] && idx <= activeRange[1]) {
            barColor = "bg-blue-200";
          }
          // Đang so sánh trực tiếp
          if (comparingIndices.includes(idx)) {
            barColor = "bg-red-500 scale-110 z-10";
          }
          // Khi đã xong toàn bộ
          if (!isSorting && array.length > 0) {
            barColor = "bg-green-500";
          }

          return (
            <div
              key={idx}
              className={`${barColor} transition-all duration-150 rounded-t-sm`}
              style={{ height: `${value * 1.5}px`, width: "24px" }}
            ></div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-4">
        <ButtonMain onClick={resetArray} disabled={isSorting} variant="outline">
          Làm mới mảng
        </ButtonMain>
        <ButtonMain onClick={runMergeSort} disabled={isSorting}>
          {isSorting ? "Đang trộn..." : "Bắt đầu sắp xếp"}
        </ButtonMain>
      </div>

      <div className="mt-6 text-sm text-gray-600 flex gap-6">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-500"></span> Đang so sánh/ghi đè
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-200"></span> Vùng đang xử lý
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500"></span> Hoàn tất
        </div>
      </div>
    </div>
  );
}
