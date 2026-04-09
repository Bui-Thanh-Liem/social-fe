import { TikTokEmbed } from "./tikTok-embed";
import { YouTubeEmbed } from "./youtube-embed";
import { XTweetEmbed } from "./x-embed";

export function MediaEmbed({ url }: { url: string }) {
  return (
    <>
      {url &&
        (url.includes("https://youtu.be") ? (
          <YouTubeEmbed url={url} />
        ) : url.includes("https://www.tiktok.com") ? (
          <TikTokEmbed url={url} />
        ) : (
          <XTweetEmbed url={url} />
        ))}
    </>
  );
}
