"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string, options: Record<string, unknown>) => YouTubePlayer;
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YouTubePlayer = {
  destroy: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
};

function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (!document.querySelector("script[src='https://www.youtube.com/iframe_api']")) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    } else if (window.YT?.Player) {
      resolve();
    }
  });
}

export function extractYouTubeId(url?: string) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return match?.[1] ?? null;
}

function formatTime(total: number) {
  const seconds = Math.max(0, Math.floor(total));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface Props {
  videoId: string;
  startAt: number;
  maxWatched?: number;
  onProgress: (current: number, duration: number, maxWatched: number) => void;
}

export default function RestrictedYouTubePlayer({ videoId, startAt, maxWatched = 0, onProgress }: Props) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const elementId = useRef(`yt-lesson-${videoId}`).current;
  const endedOverlay = useRef<HTMLDivElement>(null);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  const maxAllowedRef = useRef(Math.max(0, maxWatched, startAt));
  const [playing, setPlaying] = useState(false);
  const [skipWarning, setSkipWarning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [allowed, setAllowed] = useState(Math.max(0, maxWatched, startAt));

  useEffect(() => {
    maxAllowedRef.current = Math.max(maxAllowedRef.current, maxWatched, startAt);
    setAllowed(maxAllowedRef.current);
  }, [maxWatched, startAt]);

  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | undefined;

    const createPlayer = async () => {
      await loadYouTubeApi();
      if (cancelled || !window.YT) return;

      playerRef.current?.destroy();
      const resumeAt = Math.max(0, Math.min(startAt, maxAllowedRef.current));
      playerRef.current = new window.YT.Player(elementId, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          disablekb: 1,
          fs: 0,
          controls: 0,
          iv_load_policy: 3,
          playsinline: 1,
          origin: window.location.origin,
          start: Math.floor(resumeAt),
        },
        events: {
          onReady: (event: { target: YouTubePlayer }) => {
            if (resumeAt > 0) {
              event.target.seekTo(resumeAt, true);
            }
            interval = setInterval(() => {
              const total = event.target.getDuration?.() ?? 0;
              let current = event.target.getCurrentTime?.() ?? 0;
              const max = maxAllowedRef.current;
              if (current > max + 1.5) {
                event.target.seekTo(max, true);
                current = max;
                setSkipWarning(true);
                window.setTimeout(() => setSkipWarning(false), 2500);
              } else if (current > max) {
                maxAllowedRef.current = current;
              }
              setCurrentTime(current);
              setDuration(total);
              setAllowed(maxAllowedRef.current);
              if (total > 0) onProgressRef.current(current, total, maxAllowedRef.current);
            }, 400);
          },
          onStateChange: (event: { data: number }) => {
            if (event.data === window.YT?.PlayerState.PLAYING) setPlaying(true);
            if (event.data === window.YT?.PlayerState.PAUSED) setPlaying(false);
            if (event.data === window.YT?.PlayerState.ENDED && endedOverlay.current) {
              endedOverlay.current.classList.remove("hidden");
              setPlaying(false);
            }
          },
        },
      });
    };

    createPlayer();

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [elementId, startAt, videoId]);

  const seekWithinWatched = (seconds: number) => {
    const player = playerRef.current;
    if (!player) return;
    const target = Math.min(Math.max(0, seconds), maxAllowedRef.current);
    player.seekTo(target, true);
    setCurrentTime(target);
  };

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;
    const state = player.getPlayerState?.();
    if (state === window.YT?.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
      endedOverlay.current?.classList.add("hidden");
    }
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden mb-4">
      <div className="aspect-video relative">
        <div id={elementId} className="w-full h-full pointer-events-none" />
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center text-white"
          aria-label={playing ? "Pausar" : "Reproduzir"}
        >
          {!playing && (
            <span className="bg-black/60 rounded-full w-16 h-16 flex items-center justify-center text-3xl">▶</span>
          )}
        </button>
        {skipWarning && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-black text-sm font-medium px-3 py-1 rounded">
            Não é possível adiantar a aula. Podes voltar para rever.
          </div>
        )}
        <div
          ref={endedOverlay}
          className="hidden absolute inset-0 z-20 bg-black/85 text-white flex items-center justify-center text-center p-6"
        >
          <p className="text-lg font-semibold">Aula concluída neste vídeo.</p>
        </div>
      </div>
      <div className="bg-[#163E72] text-white px-3 py-2 flex items-center gap-3">
        <button type="button" className="text-sm px-2 py-1 rounded bg-white/15" onClick={togglePlay}>
          {playing ? "Pausar" : "Play"}
        </button>
        <button
          type="button"
          className="text-sm px-2 py-1 rounded bg-white/15"
          onClick={() => seekWithinWatched(currentTime - 10)}
        >
          -10s
        </button>
        <input
          type="range"
          min={0}
          max={Math.max(allowed, 1)}
          step={1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => seekWithinWatched(Number(event.target.value))}
          className="flex-1 accent-[#66BCA1]"
          aria-label="Posição do vídeo (só é possível voltar no trecho já assistido)"
        />
        <span className="text-xs whitespace-nowrap">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <span className="text-xs text-white/70 whitespace-nowrap hidden sm:inline">
          Liberado até {formatTime(allowed)}
        </span>
      </div>
    </div>
  );
}
