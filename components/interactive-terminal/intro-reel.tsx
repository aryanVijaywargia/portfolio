import { ArrowLeftIcon, ArrowPathIcon, StopIcon } from "@heroicons/react/24/solid";
import { FC, KeyboardEvent, MouseEvent, useCallback, useEffect, useRef, useState } from "react";

interface IntroReelProps {
  onExit: () => void;
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const IntroReel: FC<IntroReelProps> = ({ onExit }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);

  const seekToTime = useCallback((nextTime: number) => {
    const video = videoRef.current;
    const videoDuration = video?.duration || duration;
    if (!video || !videoDuration) return;

    const clampedTime = Math.min(Math.max(nextTime, 0), videoDuration);
    video.currentTime = clampedTime;
    setCurrentTime(clampedTime);
    setProgress(clampedTime / videoDuration);
    setHasEnded(false);
  }, [duration]);

  const seekToPointer = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const video = videoRef.current;
    const videoDuration = video?.duration || duration;
    if (!videoDuration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const nextProgress = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    seekToTime(nextProgress * videoDuration);
  }, [duration, seekToTime]);

  const seekWithKeyboard = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      seekToTime(currentTime + (event.key === "ArrowRight" ? 5 : -5));
    }
  }, [currentTime, seekToTime]);

  const playFromStart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
    setHasEnded(false);
    const playPromise = video.play();
    if (playPromise) {
      playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, []);

  const stopVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    setCurrentTime(0);
    setProgress(0);
    setHasEnded(false);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const playPromise = video.play();
    if (playPromise) {
      playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }

    return () => {
      video.pause();
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#05070d] font-mono text-[#e2e8f0]">
      <div className="flex min-h-0 flex-1 items-center justify-center p-3 sm:p-4">
        <div className="aspect-video relative flex w-full max-w-5xl items-center justify-center overflow-hidden rounded-md border border-cyan-300/20 bg-black shadow-[0_0_45px_-20px_rgba(103,232,249,0.8)]">
          <video
            ref={videoRef}
            src="/videos/aryan-intro.mp4"
            className="h-full w-full object-contain"
            aria-label="Aryan profile video"
            autoPlay
            playsInline
            preload="auto"
            onPlay={() => {
              setIsPlaying(true);
              setHasEnded(false);
            }}
            onPause={() => setIsPlaying(false)}
            onLoadedMetadata={(event) => {
              setDuration(event.currentTarget.duration || 0);
            }}
            onEnded={() => {
              setHasEnded(true);
              setIsPlaying(false);
              setProgress(1);
              setCurrentTime(duration);
            }}
            onTimeUpdate={(event) => {
              const video = event.currentTarget;
              setCurrentTime(video.currentTime);
              setProgress(video.duration ? video.currentTime / video.duration : 0);
            }}
          />

          {!isPlaying && !hasEnded && (
            <div className="bg-black/35 pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rounded border border-cyan-300/30 bg-black/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
                stopped
              </span>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-cyan-300/10 bg-[#080d18] px-3 py-2 sm:px-4">
        <div className="flex items-center gap-3 text-[11px] tabular-nums text-slate-400">
          <span className="w-9 text-right">{formatTime(currentTime)}</span>
          <button
            type="button"
            role="slider"
            aria-label="Seek video"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            title="Seek"
            onClick={seekToPointer}
            onKeyDown={seekWithKeyboard}
            className="group relative h-4 flex-1 cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-200/60"
          >
            <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-slate-700/80">
              <span
                className="block h-full rounded-full bg-[#67e8f9] transition-[width] duration-150 group-hover:bg-cyan-200"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </span>
          </button>
          <span className="w-9">{formatTime(duration)}</span>
        </div>

        <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs">
          <div className="min-w-0 truncate text-slate-500">
            <span className="text-cyan-300">whois</span>
            <span className="mx-2 text-slate-700">/</span>
            <span>profile video</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-black/25 px-2 py-1 shadow-inner">
            <button
              type="button"
              aria-label="Stop"
              title="Stop"
              onClick={stopVideo}
              className="group flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-700/70 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-300/60"
            >
              <StopIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Reset"
              title="Reset"
              onClick={playFromStart}
              className="group flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-300/10 text-cyan-100 transition-colors hover:bg-cyan-300/20 focus:outline-none focus:ring-2 focus:ring-cyan-200/70"
            >
              <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Back"
              title="Back"
              onClick={onExit}
              className="group flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-700/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-300/60"
            >
              <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IntroReel;
