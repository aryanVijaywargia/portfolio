import { FC, useCallback, useEffect, useRef, useState } from "react";
import { FALLBACK_TRACKS, MusicTrack } from "lib/music/reddit-playlist";

type MusicPlayerProps = {
  onExit: () => void;
};

type PlaylistResponse = {
  tracks: MusicTrack[];
  source: "reddit-live" | "reddit-curated";
};

const clampIndex = (index: number, length: number) => (index + length) % length;

export const MusicPlayer: FC<MusicPlayerProps> = ({ onExit }) => {
  const [tracks, setTracks] = useState(FALLBACK_TRACKS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playRequest, setPlayRequest] = useState(0);
  const [source, setSource] = useState<PlaylistResponse["source"]>("reddit-curated");
  const [isRefreshing, setIsRefreshing] = useState(true);
  const trackRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/music", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Playlist request failed");
        return response.json() as Promise<PlaylistResponse>;
      })
      .then((playlist) => {
        if (!playlist.tracks.length) return;
        setTracks(playlist.tracks);
        setSource(playlist.source);
        setSelectedIndex(0);
        setActiveIndex(0);
      })
      .catch(() => undefined)
      .finally(() => setIsRefreshing(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    trackRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  const playTrack = useCallback((index: number) => {
    setSelectedIndex(index);
    setActiveIndex(index);
    setPlayRequest((request) => request + 1);
  }, []);

  const moveSelection = useCallback((direction: number) => {
    setSelectedIndex((index) => clampIndex(index + direction, tracks.length));
  }, [tracks.length]);

  const skipTrack = useCallback((direction: number) => {
    playTrack(clampIndex(activeIndex + direction, tracks.length));
  }, [activeIndex, playTrack, tracks.length]);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "k") {
        event.preventDefault();
        moveSelection(-1);
      } else if (event.key === "ArrowDown" || event.key.toLowerCase() === "j") {
        event.preventDefault();
        moveSelection(1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        playTrack(selectedIndex);
      } else if (event.key === "Escape" || event.key.toLowerCase() === "q") {
        event.preventDefault();
        onExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveSelection, onExit, playTrack, selectedIndex]);

  const activeTrack = tracks[activeIndex];
  const embedUrl = `https://www.youtube-nocookie.com/embed/${activeTrack.youtubeId}?autoplay=${
    playRequest > 0 ? "1" : "0"
  }&rel=0&modestbranding=1`;
  const youtubeMusicUrl = `https://music.youtube.com/watch?v=${activeTrack.youtubeId}`;

  return (
    <section className="flex h-full min-h-0 flex-col bg-[#071018] font-mono text-slate-200">
      <header className="flex shrink-0 items-center justify-between border-b border-cyan-300/10 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-cyan-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
            coding frequency
          </div>
          <p className="mt-1 truncate text-xs text-slate-500">
            top Reddit picks · streamed free through YouTube
          </p>
        </div>
        <span className="ml-3 shrink-0 rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-400">
          {isRefreshing ? "syncing…" : source === "reddit-live" ? "reddit live" : "reddit mix"}
        </span>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1.1fr)] md:overflow-hidden">
        <div className="flex min-h-0 flex-col border-b border-slate-800 p-4 md:border-b-0 md:border-r">
          <div
            className="relative shrink-0 overflow-hidden rounded-md border border-cyan-300/20 bg-black bg-cover bg-center shadow-[0_0_45px_-18px_rgba(34,211,238,0.65)]"
            style={{
              aspectRatio: "16 / 9",
              backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.2), rgba(2, 6, 23, 0.72)), url(https://i.ytimg.com/vi/${activeTrack.youtubeId}/hqdefault.jpg)`,
            }}
          >
            {playRequest > 0
              ? <iframe
                  key={`${activeTrack.youtubeId}-${playRequest}`}
                  className="absolute inset-0 h-full w-full"
                  src={embedUrl}
                  title={`Playing ${activeTrack.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              : <button
                  type="button"
                  onClick={() => playTrack(activeIndex)}
                  className="absolute inset-0 flex w-full items-center justify-center bg-black/10 text-white transition hover:bg-black/25"
                  aria-label="Play current track"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/65 pl-1 text-xl shadow-xl backdrop-blur-sm transition-transform hover:scale-105">
                    ▶
                  </span>
                </button>}
          </div>

          <div className="mt-4 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/70">now loaded</p>
            <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white">
              {activeTrack.title}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
              <a
                href={activeTrack.redditUrl}
                target="_blank"
                rel="noreferrer"
                className="truncate transition-colors hover:text-orange-300"
              >
                r/{activeTrack.subreddit} · {activeTrack.score} karma ↗
              </a>
            </div>
          </div>

          <div className="mt-auto flex items-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => skipTrack(-1)}
              className="rounded border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/60 hover:text-cyan-200"
              aria-label="Previous track"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => playTrack(activeIndex)}
              className="flex-1 rounded bg-cyan-300 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              {playRequest > 0 ? "RESTART TRACK" : "PLAY TRACK"}
            </button>
            <button
              type="button"
              onClick={() => skipTrack(1)}
              className="rounded border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/60 hover:text-cyan-200"
              aria-label="Next track"
            >
              ▶
            </button>
          </div>
          <a
            href={youtubeMusicUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 text-center text-[10px] text-slate-500 transition hover:text-cyan-300"
          >
            open in YouTube Music ↗
          </a>
        </div>

        <div className="flex min-h-[15rem] flex-col p-4 md:min-h-0">
          <div className="mb-3 flex shrink-0 items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-500">
            <span>playlist / top while-coding</span>
            <span>{tracks.length} tracks</span>
          </div>

          <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto pr-1" role="listbox">
            {tracks.map((track, index) => {
              const isSelected = selectedIndex === index;
              const isActive = activeIndex === index;

              return (
                <button
                  key={track.id}
                  ref={(element) => {
                    trackRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onFocus={() => setSelectedIndex(index)}
                  onClick={() => playTrack(index)}
                  className={`group mb-1 grid w-full grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 rounded px-2 py-2.5 text-left transition-all ${
                    isSelected
                      ? "bg-cyan-300/10 text-white shadow-[inset_2px_0_0_#67e8f9]"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  <span className={`text-xs ${isSelected ? "text-cyan-300" : "text-slate-600"}`}>
                    {isActive ? "▶" : String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs">{track.title}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-slate-600">
                      r/{track.subreddit}
                    </span>
                  </span>
                  <span className="text-[10px] tabular-nums text-slate-600">▲ {track.score}</span>
                </button>
              );
            })}
          </div>

          <footer className="mt-3 flex shrink-0 flex-wrap gap-x-4 gap-y-1 border-t border-slate-800 pt-3 text-[10px] text-slate-600">
            <span>
              <b className="text-slate-300">↑↓ / jk</b> browse
            </span>
            <span>
              <b className="text-slate-300">enter</b> play
            </span>
            <span>
              <b className="text-slate-300">esc / q</b> close
            </span>
          </footer>
        </div>
      </div>
    </section>
  );
};
