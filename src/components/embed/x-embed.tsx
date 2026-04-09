import { useEffect, useRef } from "react";

export const XTweetEmbed = ({ url }: { url: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweetId = url.split("/status/").pop()?.split("?")[0];

  useEffect(() => {
    let isCancelled = false; // Biến local để kiểm soát vòng đời của hiệu ứng này

    const renderTweet = () => {
      // Nếu component đã bị unmount hoặc không có ref/id thì dừng
      if (isCancelled || !containerRef.current || !tweetId) return;

      if ((window as any).twttr && (window as any).twttr.widgets) {
        // Xóa nội dung cũ để tránh bị nhân đôi
        containerRef.current.innerHTML = "";

        (window as any).twttr.widgets
          .createTweet(tweetId, containerRef.current, {
            theme: "light",
            align: "center",
          })
          .then(() => {
            console.log("Tweet rendered successfully");
          })
          .catch((err: any) => {
            console.error("X Render Error:", err);
          });
      }
    };

    // Tải script nếu chưa có
    if (!(window as any).twttr) {
      const scriptId = "x-widgets-script";
      let script = document.getElementById(scriptId) as HTMLScriptElement;

      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://platform.twitter.com/widgets.js";
        document.body.appendChild(script);
      }

      script.addEventListener("load", renderTweet);
    } else {
      renderTweet();
    }

    // CLEANUP: Đây là phần quan trọng nhất
    return () => {
      isCancelled = true; // Đánh dấu lần render này đã cũ
      if (containerRef.current) {
        containerRef.current.innerHTML = ""; // Xóa sạch DOM khi unmount hoặc update
      }
    };
  }, [tweetId]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[550px] mx-auto min-h-[300px]"
    />
  );
};
