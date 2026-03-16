import { useEffect, useState } from "react";
import { ButtonMain } from "~/components/ui/button";

export function QuickSort() {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [pivotIndex, setPivotIndex] = useState(-1);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  const resetArray = () => {
    const newArray = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 150) + 10,
    );
    setArray(newArray);
    setPivotIndex(-1);
    setComparingIndices([]);
    setSortedIndices([]);
    setIsSorting(false);
  };

  useEffect(() => {
    resetArray();
  }, []);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const partition = async (arr: number[], low: number, high: number) => {
    // Chọn phần tử cuối làm Pivot
    const pivot = arr[high];
    setPivotIndex(high);
    let i = low - 1;

    for (let j = low; j < high; j++) {
      setComparingIndices([j, i + 1]);
      await sleep(150);

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
      }
    }
    // Đưa Pivot về đúng vị trí giữa
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    setPivotIndex(i + 1);
    await sleep(200);

    return i + 1;
  };

  const quickSortRecursive = async (
    arr: number[],
    low: number,
    high: number,
  ) => {
    if (low <= high) {
      const pi = await partition(arr, low, high);

      // Đánh dấu phần tử này đã nằm đúng vị trí vĩnh viễn
      setSortedIndices((prev) => [...prev, pi]);

      await quickSortRecursive(arr, low, pi - 1);
      await quickSortRecursive(arr, pi + 1, high);
    }
  };

  const runQuickSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    await quickSortRecursive(arr, 0, arr.length - 1);
    setPivotIndex(-1);
    setComparingIndices([]);
    setIsSorting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-[calc(100vh-100px)]">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Quick Sort</h1>

      <div className="flex items-end justify-center gap-1 bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl h-64">
        {array.map((value, idx) => {
          let barColor = "bg-blue-400"; // Mặc định

          if (idx === pivotIndex)
            barColor = "bg-purple-600 animate-pulse"; // Điểm chốt
          else if (comparingIndices.includes(idx))
            barColor = "bg-yellow-400"; // Đang so sánh
          else if (sortedIndices.includes(idx)) barColor = "bg-green-500"; // Đã chốt vị trí

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
        <ButtonMain onClick={runQuickSort} disabled={isSorting}>
          {isSorting ? "Đang phân tách..." : "Bắt đầu sắp xếp"}
        </ButtonMain>
      </div>

      <div className="mt-6 text-sm text-gray-600 flex flex-wrap justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-purple-600"></span> Pivot (Điểm chốt)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-400"></span> Đang so sánh & đổi chỗ
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500"></span> Đã nằm đúng chỗ
        </div>
      </div>
    </div>
  );
}
