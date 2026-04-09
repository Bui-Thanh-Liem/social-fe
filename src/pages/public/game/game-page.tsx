import { useEffect } from "react";
import { ComingSoonPage } from "~/components/coming-soon-page";

export function GamePage() {
  // Metadata
  useEffect(() => {
    document.title = "Trò chơi";
  }, []);

  return <ComingSoonPage />;
}
