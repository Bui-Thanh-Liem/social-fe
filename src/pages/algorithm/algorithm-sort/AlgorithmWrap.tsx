import { useParams } from "react-router-dom";
import { BubbleSort } from "./BubbleSort";
import { HeapSort } from "./HeapSort";
import { InsertionSort } from "./InsertSort";
import { MergeSort } from "./MergeSort";
import { QuickSort } from "./QuickSort";
import { SelectionSort } from "./SelectionSort";

export function AlgorithmWrap() {
  const { slug } = useParams();

  const renderAlgorithm = () => {
    switch (slug) {
      case "selection":
        return <SelectionSort />;
      case "insertion":
        return <InsertionSort />;
      case "bubble":
        return <BubbleSort />;
      case "merge":
        return <MergeSort />;
      case "quick":
        return <QuickSort />;
      case "heap":
        return <HeapSort />;

      default:
        return (
          <div className="h-[calc(100vh-100px)] flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-4">
              Không tìm thấy thuật toán
            </h1>
            <p className="text-gray-600">
              Thuật toán bạn đang tìm kiếm không tồn tại hoặc chưa được triển
              khai.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-h-[calc(100vh-60px)] overflow-y-auto">
      {renderAlgorithm()}
    </div>
  );
}
