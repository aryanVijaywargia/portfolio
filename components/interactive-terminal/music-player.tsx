import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from "react";
import { RADIO_STATIONS } from "lib/music/radio-stations";

type MusicPlayerProps = {
  audio: HTMLAudioElement;
  initialStationIndex: number;
  launchedByChatbot?: boolean;
  onExit: () => void;
};

type PlaybackStatus = "connecting" | "playing" | "paused" | "blocked" | "error";

const wrapIndex = (index: number) => (index + RADIO_STATIONS.length) % RADIO_STATIONS.length;

export const MusicPlayer: FC<MusicPlayerProps> = ({
  audio,
  initialStationIndex,
  launchedByChatbot = false,
  onExit,
}) => {
  const stationRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [selectedIndex, setSelectedIndex] = useState(() => wrapIndex(initialStationIndex));
  const [activeIndex, setActiveIndex] = useState(() => wrapIndex(initialStationIndex));
  const [status, setStatus] = useState<PlaybackStatus>("connecting");
  const [volume, setVolume] = useState(0.72);

  const playStation = useCallback((index: number) => {
    const nextIndex = wrapIndex(index);
    const nextStation = RADIO_STATIONS[nextIndex];
    setSelectedIndex(nextIndex);
    setActiveIndex(nextIndex);
    setStatus("connecting");

    if (audio.src !== nextStation.streamUrl) {
      audio.src = nextStation.streamUrl;
      audio.load();
    }

    audio.play().catch(() => setStatus("blocked"));
  }, [audio]);

  const togglePlayback = useCallback(() => {
    if (audio.paused) {
      setStatus("connecting");
      audio.play().catch(() => setStatus("blocked"));
    } else {
      audio.pause();
    }
  }, [audio]);

  useEffect(() => {
    const handlePlaying = () => setStatus("playing");
    const handlePause = () => setStatus("paused");
    const handleWaiting = () => setStatus("connecting");
    const handleError = () => setStatus("error");

    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("error", handleError);
    setStatus(audio.paused ? "blocked" : "playing");

    return () => {
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("error", handleError);
    };
  }, [audio]);

  useEffect(() => {
    stationRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSelectedIndex((index) => wrapIndex(index - 1));
      } else if (event.key === "ArrowDown" || event.key.toLowerCase() === "j") {
        event.preventDefault();
        setSelectedIndex((index) => wrapIndex(index + 1));
      } else if (event.key === "Enter") {
        event.preventDefault();
        playStation(selectedIndex);
      } else if (event.key === " ") {
        event.preventDefault();
        togglePlayback();
      } else if (event.key === "Escape" || event.key.toLowerCase() === "q") {
        event.preventDefault();
        onExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExit, playStation, selectedIndex, togglePlayback]);

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
    audio.volume = nextVolume;
  };

  const activeStation = RADIO_STATIONS[activeIndex];
  const isPlaying = status === "playing";
  const statusLabel =
    status === "connecting"
      ? "buffering"
      : status === "blocked"
      ? "press play"
      : status === "error"
      ? "stream offline"
      : status;

  return (
    <section
      className="flex h-full min-h-0 flex-col bg-[#071018] font-mono text-slate-200"
      data-playback={status}
      data-stream={activeStation.streamUrl}
    >
      <header className="flex shrink-0 items-center justify-between border-b border-cyan-300/10 px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-xs text-cyan-300">
            {launchedByChatbot ? "$ byte --shuffle coding-radio" : "$ radio --reddit-picks"}
          </p>
          <p className="mt-0.5 truncate text-[10px] text-slate-600">
            {launchedByChatbot
              ? "Byte picked a random favorite · playback continues while you scroll"
              : "Reddit-picked focus stations · playback continues while you scroll"}
          </p>
        </div>
        <span className="ml-3 flex shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isPlaying ? "animate-pulse bg-cyan-300" : "bg-amber-300"
            }`}
          />
          {statusLabel}
        </span>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto sm:grid-cols-[minmax(0,0.85fr)_minmax(17rem,1.15fr)] sm:overflow-hidden">
        <div className="flex min-h-[9.5rem] flex-col border-b border-slate-800 p-3 sm:min-h-0 sm:border-b-0 sm:border-r">
          <p className="text-[9px] uppercase tracking-[0.2em] text-cyan-400/70">now streaming</p>
          <h2 className="mt-1 text-base font-semibold leading-tight text-white">
            {activeStation.name}
          </h2>
          <p className="mt-1 text-[10px] text-slate-500">{activeStation.vibe}</p>

          <div className="my-auto flex h-12 items-center gap-1" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((bar) => (
              <span
                key={bar}
                className={`w-1 rounded-full bg-cyan-300/80 ${
                  isPlaying ? "animate-pulse" : "opacity-40"
                }`}
                style={{
                  animationDelay: `${bar * -0.11}s`,
                  height: isPlaying ? `${28 + ((bar * 23) % 62)}%` : "8%",
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => playStation(activeIndex - 1)}
              className="rounded border border-slate-700 px-2.5 py-1.5 text-xs text-slate-400 transition hover:border-cyan-300/60 hover:text-cyan-200"
              aria-label="Previous station"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={togglePlayback}
              className="flex-1 rounded bg-cyan-300 px-3 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              {isPlaying ? "PAUSE" : "PLAY"}
            </button>
            <button
              type="button"
              onClick={() => playStation(activeIndex + 1)}
              className="rounded border border-slate-700 px-2.5 py-1.5 text-xs text-slate-400 transition hover:border-cyan-300/60 hover:text-cyan-200"
              aria-label="Next station"
            >
              ▶
            </button>
          </div>

          <label className="mt-2 flex items-center gap-2 text-[9px] uppercase tracking-wider text-slate-600">
            vol
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="h-1 flex-1 cursor-pointer accent-cyan-300"
              aria-label="Volume"
            />
            {Math.round(volume * 100)}
          </label>
        </div>

        <div className="flex min-h-[11rem] flex-col p-3 sm:min-h-0">
          <div className="mb-2 flex shrink-0 items-center justify-between text-[9px] uppercase tracking-[0.16em] text-slate-600">
            <span>stations / coding radio</span>
            <span>{RADIO_STATIONS.length} live</span>
          </div>

          <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto" role="listbox">
            {RADIO_STATIONS.map((station, index) => {
              const isSelected = selectedIndex === index;
              const isActive = activeIndex === index;

              return (
                <button
                  key={station.id}
                  ref={(element) => {
                    stationRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onFocus={() => setSelectedIndex(index)}
                  onClick={() => playStation(index)}
                  className={`mb-1 grid w-full grid-cols-[1.5rem_minmax(0,1fr)] gap-2 rounded px-2 py-1.5 text-left transition ${
                    isSelected
                      ? "bg-cyan-300/10 text-white shadow-[inset_2px_0_0_#67e8f9]"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  <span
                    className={`pt-0.5 text-[10px] ${
                      isSelected ? "text-cyan-300" : "text-slate-700"
                    }`}
                  >
                    {isActive && isPlaying ? "▶" : String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-semibold">{station.name}</span>
                    <span className="mt-0.5 block truncate text-[9px] text-slate-600">
                      {station.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <footer className="mt-2 flex shrink-0 flex-wrap gap-x-3 border-t border-slate-800 pt-2 text-[9px] text-slate-700">
            <span>
              <b className="text-slate-400">↑↓</b> browse
            </span>
            <span>
              <b className="text-slate-400">enter</b> tune
            </span>
            <span>
              <b className="text-slate-400">space</b> play/pause
            </span>
            <span>
              <b className="text-slate-400">q</b> back
            </span>
          </footer>
        </div>
      </div>
    </section>
  );
};
