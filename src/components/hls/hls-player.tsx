import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";
import type { MediaPlayer as MediaPlayerType } from "@vidstack/react/types/vidstack.js";
import { useRef } from "react";
import { textTracks } from "./track";

export function HLSPlayer({ src }: { src: string }) {
  const playerRef = useRef<MediaPlayerType>(null);

  return (
    <MediaPlayer
      ref={playerRef}
      title=""
      src={src}
      muted // để khi hover tự play không bị chặn autoplay
      playsInline
      onPointerEnter={() => {
        playerRef.current?.play();
      }}
      // onPointerLeave={() => {
      //   playerRef.current?.pause();
      // }}
      className="h-full"
    >
      <MediaProvider>
        {textTracks.map((track) => (
          <Track {...track} key={track.src} />
        ))}
      </MediaProvider>
      <DefaultVideoLayout
        thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  );
}
