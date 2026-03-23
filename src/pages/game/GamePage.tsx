import { useEffect } from "react";
import { ComingSoonPage } from "~/components/ComingSoonPage";

export function GamePage() {
  // Metadata
  useEffect(() => {
    document.title = "Trò chơi";
  }, []);

  return <ComingSoonPage />;
}
