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
    <div className="flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Quick Sort</h1>
      <div className="text-slate-600 text-sm leading-relaxed mb-6 bg-slate-50 p-5 rounded-lg border border-slate-100 max-w-2xl">
        <p className="font-semibold mb-3 text-slate-800 flex items-center gap-2">
          <span className="w-2 h-4 bg-purple-600 rounded-full"></span>
          Cách thức hoạt động của Quick Sort:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p>
              <strong className="text-purple-700">1. Chọn Pivot:</strong> Một
              phần tử được chọn làm chốt (trong code này là phần tử cuối cùng
              `high`).
            </p>
            <p>
              <strong className="text-yellow-600">
                2. Phân tách (Partition):
              </strong>{" "}
              Duyệt mảng và đưa các phần tử nhỏ hơn Pivot sang trái, lớn hơn
              sang phải.
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong className="text-blue-600">3. Đặt Pivot:</strong> Đưa Pivot
              về vị trí chính xác giữa hai nhóm. Lúc này Pivot đã{" "}
              <span className="text-green-600 font-bold">
                đứng đúng vị trí vĩnh viễn
              </span>
              .
            </p>
            <p>
              <strong className="text-slate-700">4. Đệ quy:</strong> Lặp lại quy
              trình trên cho hai mảng con bên trái và bên phải của Pivot.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-center gap-1 bg-white p-6 px-3 rounded-xl shadow-lg w-full max-w-2xl h-64">
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
              className={`${barColor} transition-all duration-150 rounded-t-sm w-3 lg:w-6`}
              style={{ height: `${value * 1.5}px` }}
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

      <div className="mt-6 text-sm text-gray-600 grid grid-cols-1 lg:grid-cols-3 gap-4 gap-x-10">
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
