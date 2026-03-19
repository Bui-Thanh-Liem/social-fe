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
    <div className="flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Bubble Sort</h1>
      <div className="text-slate-600 text-sm leading-relaxed mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
        <p className="font-semibold mb-2 text-slate-800">
          Quy trình thực hiện:
        </p>
        <ul className="list-disc ml-5 space-y-1">
          <li>
            <span className="font-medium text-yellow-600">Bước 1:</span> So sánh
            cặp phần tử liền kề{" "}
            <code className="bg-slate-200 px-1 rounded">arr[j]</code> và{" "}
            <code className="bg-slate-200 px-1 rounded">arr[j+1]</code>.
          </li>
          <li>
            <span className="font-medium text-blue-600">Bước 2:</span> Nếu phần
            tử trước lớn hơn phần tử sau, thực hiện{" "}
            <strong>hoán đổi (swap)</strong> vị trí của chúng.
          </li>
          <li>
            <span className="font-medium text-green-600">Bước 3:</span> Sau mỗi
            lượt quét, phần tử lớn nhất sẽ "nổi" về cuối mảng và được cố định.
          </li>
          <li>
            <span className="font-medium text-purple-600">Bước 4:</span> Lặp lại
            cho đến khi toàn bộ mảng được sắp xếp (không còn cặp nào sai thứ
            tự).
          </li>
        </ul>
      </div>

      <div className="flex items-end justify-center gap-1 bg-white p-6 px-3 rounded-xl shadow-lg w-full max-w-2xl h-64">
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
              className={`${barColor} transition-all duration-100 rounded-t-sm w-3 lg:w-6`}
              style={{ height: `${value * 1.5}px` }}
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

      <div className="mt-6 text-sm text-gray-600 grid grid-cols-1 lg:grid-cols-3 gap-4 gap-x-10">
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
