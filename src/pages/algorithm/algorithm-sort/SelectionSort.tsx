import { useEffect, useState } from "react";
import { ButtonMain } from "~/components/ui/button";

export function SelectionSort() {
  const [array, setArray] = useState<number[] | []>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [comparingIndex, setComparingIndex] = useState(-1);
  const [minIndex, setMinIndex] = useState(-1);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  // Khởi tạo mảng ngẫu nhiên
  const resetArray = () => {
    const newArray = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 150) + 10,
    );
    setArray(newArray);
    setSortedIndices([]);
    setCurrentIndex(-1);
    setComparingIndex(-1);
    setMinIndex(-1);
    setIsSorting(false);
  };

  useEffect(() => {
    resetArray();
  }, []);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const selectionSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    const n = arr.length;
    const newSortedIndices: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      setCurrentIndex(i);
      setMinIndex(i);

      for (let j = i + 1; j < n; j++) {
        setComparingIndex(j);
        await sleep(200); // Tốc độ chạy

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          setMinIndex(j);
        }
      }

      // Hoán đổi
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
      }

      newSortedIndices.push(i);
      setSortedIndices([...newSortedIndices]);
    }

    newSortedIndices.push(n - 1);
    setSortedIndices([...newSortedIndices]);
    setIsSorting(false);
    setComparingIndex(-1);
    setMinIndex(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-[calc(100vh-100px)]">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Selection Sort</h1>

      <div className="flex items-end justify-center gap-1 bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
        {array.map((value, idx) => {
          // Logic đổi màu Tailwind
          let barColor = "bg-blue-500";
          if (sortedIndices.includes(idx)) barColor = "bg-green-500";
          else if (idx === minIndex) barColor = "bg-red-500 animate-pulse";
          else if (idx === comparingIndex) barColor = "bg-yellow-400";
          else if (idx === currentIndex) barColor = "bg-blue-800";

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
        <ButtonMain onClick={selectionSort} disabled={isSorting}>
          {isSorting ? "Đang chạy..." : "Bắt đầu sắp xếp"}
        </ButtonMain>
      </div>

      <div className="mt-6 text-sm text-gray-600 flex gap-6">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-800"></span> Đang xét
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-400"></span> Đang so sánh
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-500"></span> Nhỏ nhất hiện tại
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500"></span> Đã xong
        </div>
      </div>
    </div>
  );
}
