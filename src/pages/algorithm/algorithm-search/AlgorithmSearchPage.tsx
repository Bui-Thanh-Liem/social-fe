import { useEffect } from "react";
import { ComingSoonPage } from "~/components/ComingSoonPage";

export function AlgorithmSearchPage() {
  // Metadata
  useEffect(() => {
    document.title = "Thuật toán tìm kiếm";
  }, []);

  return <ComingSoonPage />;
}
