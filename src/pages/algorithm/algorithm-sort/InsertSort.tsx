import { useEffect, useState } from "react";
import { ButtonMain } from "~/components/ui/button";

export function InsertionSort() {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1); // Phần tử đang được cầm lên để chèn
  const [comparingIndex, setComparingIndex] = useState(-1); // Các phần tử đang được dịch chuyển
  const [sortedLimit, setSortedLimit] = useState(-1); // Đánh dấu vùng đã xử lý

  const resetArray = () => {
    const newArray = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 150) + 10,
    );
    setArray(newArray);
    setCurrentIndex(-1);
    setComparingIndex(-1);
    setSortedLimit(-1);
    setIsSorting(false);
  };

  useEffect(() => {
    resetArray();
  }, []);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const insertionSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      setCurrentIndex(i);
      setSortedLimit(i);
      await sleep(300); // Tốc độ chạy để quan sát phần tử được chọn

      // Di chuyển các phần tử lớn hơn key về sau 1 vị trí
      while (j >= 0 && arr[j] > key) {
        setComparingIndex(j);
        await sleep(300);

        arr[j + 1] = arr[j];
        setArray([...arr]); // Cập nhật mảng để thấy hiệu ứng dịch chuyển
        j = j - 1;
      }

      arr[j + 1] = key;
      setArray([...arr]);
      setComparingIndex(-1);
    }

    setIsSorting(false);
    setCurrentIndex(-1);
    setSortedLimit(n); // Hoàn tất
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-[calc(100vh-100px)]">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Insertion Sort</h1>

      <div className="flex items-end justify-center gap-1 bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl h-64">
        {array.map((value, idx) => {
          let barColor = "bg-blue-300"; // Mặc định: chưa xử lý

          if (idx <= sortedLimit) barColor = "bg-blue-500"; // Vùng đang xử lý
          if (idx === currentIndex) barColor = "bg-red-500 animate-bounce"; // Phần tử đang cầm lên
          if (idx === comparingIndex) barColor = "bg-yellow-400"; // Phần tử đang bị so sánh để dịch chuyển
          if (!isSorting && sortedLimit === array.length)
            barColor = "bg-green-500"; // Hoàn tất

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
        <ButtonMain onClick={insertionSort} disabled={isSorting}>
          {isSorting ? "Đang chạy..." : "Bắt đầu sắp xếp"}
        </ButtonMain>
      </div>

      <div className="mt-6 text-sm text-gray-600 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-500"></span> Đang lấy ra (Key)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-400"></span> Đang so sánh & dịch
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-blue-500"></span> Vùng đã sắp xếp
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500"></span> Hoàn tất
        </div>
      </div>
    </div>
  );
}
