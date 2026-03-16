import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "~/components/ui/card";

export function AlgorithmSortPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Card
        onClick={() => {
          navigate("/algorithm/sort/selection");
        }}
      >
        <CardContent>
          <div className="text-2xl font-bold mb-4">Selection Sort</div>
        </CardContent>
      </Card>
      <Card
        onClick={() => {
          navigate("/algorithm/sort/insertion");
        }}
      >
        <CardContent>
          <div className="text-2xl font-bold mb-4">Insertion Sort</div>
        </CardContent>
      </Card>
      <Card
        onClick={() => {
          navigate("/algorithm/sort/bubble");
        }}
      >
        <CardContent>
          <div className="text-2xl font-bold mb-4">Bubble Sort</div>
        </CardContent>
      </Card>
      <Card
        onClick={() => {
          navigate("/algorithm/sort/merge");
        }}
      >
        <CardContent>
          <div className="text-2xl font-bold mb-4">Merge Sort</div>
        </CardContent>
      </Card>
      <Card
        onClick={() => {
          navigate("/algorithm/sort/heap");
        }}
      >
        <CardContent>
          <div className="text-2xl font-bold mb-4">Heap Sort</div>
        </CardContent>
      </Card>

      <Card
        onClick={() => {
          navigate("/algorithm/sort/quick");
        }}
      >
        <CardContent>
          <div className="text-2xl font-bold mb-4">Quick Sort</div>
        </CardContent>
      </Card>
    </div>
  );
}
