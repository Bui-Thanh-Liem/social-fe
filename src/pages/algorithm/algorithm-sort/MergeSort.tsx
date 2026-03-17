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
    <div className="flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Merge Sort</h1>
      <div className="text-slate-600 text-sm leading-relaxed mb-6 bg-slate-50 p-5 rounded-lg border border-slate-100 max-w-2xl">
        <p className="font-semibold mb-3 text-slate-800 flex items-center gap-2">
          <span className="w-2 h-4 bg-blue-500 rounded-full"></span>
          Cách thức hoạt động của Merge Sort:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          <div className="flex gap-2">
            <span className="font-bold text-blue-400">1. Chia (Divide):</span>
            <p>
              Chia mảng đang xét thành hai nửa bằng nhau cho đến khi mỗi mảng
              chỉ còn 1 phần tử.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-red-500">2. So sánh:</span>
            <p>
              So sánh các phần tử đầu tiên của hai mảng con để tìm phần tử nhỏ
              hơn.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-blue-300">3. Trộn (Merge):</span>
            <p>
              Kết hợp (trộn) các mảng con đã sắp xếp lại với nhau để tạo thành
              mảng lớn hơn.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-green-600">4. Hoàn tất:</span>
            <p>
              Quá trình đệ quy kết thúc khi mảng ban đầu được lấp đầy bởi các
              phần tử đã sắp xếp.
            </p>
          </div>
        </div>
        <p className="mt-3 pt-3 border-t border-slate-200 text-xs italic text-slate-500">
          * Merge Sort có độ phức tạp thời gian ổn định là $O(n \log n)$, nhanh
          hơn đáng kể so với Bubble Sort hay Insertion Sort.
        </p>
      </div>

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
        <ButtonMain onClick={runMergeSort} disabled={isSorting}>
          {isSorting ? "Đang trộn..." : "Bắt đầu sắp xếp"}
        </ButtonMain>
      </div>

      <div className="mt-6 text-sm text-gray-600 grid grid-cols-2 lg:grid-cols-3 gap-4 gap-x-10">
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
