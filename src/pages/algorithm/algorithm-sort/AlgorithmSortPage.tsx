import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "~/components/ui/card";

export function AlgorithmSortPage() {
  const navigate = useNavigate();

  const sortingAlgorithms = [
    { name: "Selection Sort", path: "/algorithm/sort/selection" },
    { name: "Insertion Sort", path: "/algorithm/sort/insertion" },
    { name: "Bubble Sort", path: "/algorithm/sort/bubble" },
    { name: "Merge Sort", path: "/algorithm/sort/merge" },
    { name: "Heap Sort", path: "/algorithm/sort/heap" },
    { name: "Quick Sort", path: "/algorithm/sort/quick" },
  ];

  return (
    <div className="space-y-4 my-4 grid grid-cols-2 gap-x-4">
      {sortingAlgorithms.map((algo) => (
        <Card
          key={algo.name}
          onClick={() => {
            navigate(algo.path);
          }}
          className="cursor-pointer"
        >
          <CardContent>
            <div className="text-2xl font-bold mb-4">{algo.name}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
