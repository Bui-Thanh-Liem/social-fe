export const YouTubeEmbed = ({ url }: { url: string }) => {
  // https://youtu.be/gkFam1iYWf8?si=HxsXnilz08xbuTXz
  const embedId = url.split("be/").pop();

  return (
    <div className="my-2 border rounded-xl flex items-center justify-center overflow-hidden [&_iframe]:w-full [&_iframe]:aspect-video">
      <iframe
        allowFullScreen
        title="YouTube video player"
        src={`https://www.youtube.com/embed/${embedId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>
  );
};
