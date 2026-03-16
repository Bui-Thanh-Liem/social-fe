import { useParams } from "react-router-dom";
import { SelectionSort } from "./SelectionSort";
import { InsertionSort } from "./InsertSort";
import { BubbleSort } from "./BubbleSort";
import { MergeSort } from "./MergeSort";
import { QuickSort } from "./QuickSort";
import { HeapSort } from "./HeapSort";

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
              khai. Vui lòng quay lại và chọn một thuật toán khác.
            </p>
          </div>
        );
    }
  };

  return <div>{renderAlgorithm()}</div>;
}
