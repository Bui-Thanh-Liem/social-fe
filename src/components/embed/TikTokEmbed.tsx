import React, { useEffect } from "react";

export const TikTokEmbed: React.FC<{ url: string }> = ({ url }) => {
  // https://www.tiktok.com/@kaylin.dhl0/video/7617342985864301832?is_from_webapp=1&sender_device=pc&web_id=7588098101643871751
  const videoId = url.split("/video/").pop()?.split("?")[0];

  useEffect(() => {
    // Tải script của TikTok một cách an toàn
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Dọn dẹp script khi component unmount để tránh rác bộ nhớ
      document.body.removeChild(script);
    };
  }, [url]);

  return (
    <blockquote
      data-video-id={videoId}
      className="tiktok-embed"
      cite={`https://www.tiktok.com/v/${videoId}`}
      style={{ maxWidth: "605px", minWidth: "325px" }}
    >
      <section className="flex h-full justify-center items-center">
        <a target="_blank" href={`https://www.tiktok.com/v/${videoId}`}>
          Đang tải video...
        </a>
      </section>
    </blockquote>
  );
};
