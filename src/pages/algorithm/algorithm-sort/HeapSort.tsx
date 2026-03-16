import { useEffect, useState } from "react";
import { ButtonMain } from "~/components/ui/button";

export function HeapSort() {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [heapRange, setHeapRange] = useState<number>(-1);

  const resetArray = () => {
    const newArray = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 150) + 10,
    );
    setArray(newArray);
    setComparingIndices([]);
    setHeapRange(newArray.length);
    setIsSorting(false);
  };

  useEffect(() => {
    resetArray();
  }, []);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Hàm vun đống (Heapify)
  const heapify = async (arr: number[], n: number, i: number) => {
    let largest = i;
    const l = 2 * i + 1; // con trái
    const r = 2 * i + 2; // con phải

    setComparingIndices([i, l, r].filter((idx) => idx < n));
    await sleep(100);

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      await sleep(100);

      // Đệ quy vun đống các cây con bị ảnh hưởng
      await heapify(arr, n, largest);
    }
  };

  const runHeapSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    const n = arr.length;

    // 1. Xây dựng Max Heap (Sắp xếp mảng thành cấu trúc đống)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i);
    }

    // 2. Trích xuất từng phần tử từ đống
    for (let i = n - 1; i > 0; i--) {
      // Đưa phần tử lớn nhất (ở gốc) về cuối
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setArray([...arr]);
      setHeapRange(i); // Đánh dấu vùng đã sắp xếp ở cuối
      await sleep(150);

      // Vun đống lại cho phần còn lại
      await heapify(arr, i, 0);
    }

    setHeapRange(0);
    setComparingIndices([]);
    setIsSorting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-[calc(100vh-100px)]">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Heap Sort</h1>

      <div className="flex items-end justify-center gap-1 bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl h-64">
        {array.map((value, idx) => {
          let barColor = "bg-blue-400"; // Mặc định: trong Heap

          // Đang được Heapify (so sánh cha-con)
          if (comparingIndices.includes(idx)) {
            barColor = "bg-yellow-400 animate-pulse";
          }
          // Phần tử đã được chốt vị trí cuối mảng
          if (idx >= heapRange) {
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
        <ButtonMain onClick={runHeapSort} disabled={isSorting}>
          {isSorting ? "Đang vun đống..." : "Bắt đầu sắp xếp"}
        </ButtonMain>
      </div>

      <div className="mt-6 text-sm text-gray-600 flex gap-6">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-400"></span> Đang vun đống
          (Heapify)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-400"></span> Cấu trúc Max Heap
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500"></span> Đã cố định
        </div>
      </div>
    </div>
  );
}
