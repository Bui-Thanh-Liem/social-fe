import { TikTokEmbed } from "./TikTokEmbed";
import { YouTubeEmbed } from "./YouTubeEmbed";
import { XTweetEmbed } from "./XEmbed";

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
