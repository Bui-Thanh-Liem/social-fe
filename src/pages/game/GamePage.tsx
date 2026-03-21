import { useEffect } from "react";

export function GamePage() {
  // Metadata
  useEffect(() => {
    document.title = "Trò chơi";
  }, []);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <img
        alt="coming-soon"
        src="/coming-soon.png"
        className="w-[800px] rounded-2xl"
      />
    </div>
  );
}
