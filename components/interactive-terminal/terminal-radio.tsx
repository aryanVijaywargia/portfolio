import { FC, FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { RADIO_STATIONS } from "lib/music/radio-stations";

type TerminalRadioProps = {
  audio: HTMLAudioElement;
  initialStationIndex: number;
  onExit: () => void;
};

type PlaybackStatus = "connecting" | "playing" | "paused" | "blocked" | "error";
type LogTone = "normal" | "muted" | "success" | "warning" | "error";

type LogLine = {
  id: number;
  text: string;
  tone: LogTone;
};

const wrapIndex = (index: number) => (index + RADIO_STATIONS.length) % RADIO_STATIONS.length;
const isCancelledOrStalePlay = (error: unknown, audio: HTMLAudioElement, expectedUrl: string) =>
  (error instanceof Error && error.name === "AbortError") || audio.src !== expectedUrl;

const statusText: Record<PlaybackStatus, string> = {
  connecting: "DIALING",
  playing: "LIVE",
  paused: "PAUSED",
  blocked: "WAITING FOR INPUT",
  error: "OFFLINE",
};

export const TerminalRadio: FC<TerminalRadioProps> = ({ audio, initialStationIndex, onExit }) => {
  const initialIndex = wrapIndex(initialStationIndex);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [status, setStatus] = useState<PlaybackStatus>(audio.paused ? "connecting" : "playing");
  const [input, setInput] = useState("");
  const [volume, setVolume] = useState(Math.round(audio.volume * 100));
  const [logs, setLogs] = useState<LogLine[]>([
    { id: 1, text: "radio 1.0.0 — terminal focus receiver", tone: "muted" },
    { id: 2, text: `dialing ${RADIO_STATIONS[initialIndex].name}...`, tone: "normal" },
  ]);
  const logId = useRef(2);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const appendLog = useCallback((text: string, tone: LogTone = "normal") => {
    logId.current += 1;
    setLogs((current) => [...current.slice(-9), { id: logId.current, text, tone }]);
  }, []);

  const playStation = useCallback((index: number) => {
    const nextIndex = wrapIndex(index);
    const station = RADIO_STATIONS[nextIndex];
    setActiveIndex(nextIndex);
    setSelectedIndex(nextIndex);
    setStatus("connecting");
    appendLog(`tune ${String(nextIndex + 1).padStart(2, "0")} :: ${station.name}`, "normal");

    audio.muted = false;
    audio.src = station.streamUrl;
    audio.load();
    const expectedUrl = station.streamUrl;
    audio.play().catch((error: unknown) => {
      if (isCancelledOrStalePlay(error, audio, expectedUrl)) return;
      setStatus("blocked");
      appendLog("autoplay blocked — type `resume` or press enter", "warning");
    });
  }, [appendLog, audio]);

  useEffect(() => {
    const handlePlaying = () => {
      setStatus("playing");
      appendLog(`signal locked :: ${RADIO_STATIONS[activeIndex].name} :: 128kbps mp3`, "success");
    };
    const handleWaiting = () => setStatus("connecting");
    const handlePause = () => setStatus("paused");
    const handleError = () => {
      const station = RADIO_STATIONS[activeIndex];
      if (audio.src !== station.fallbackStreamUrl) {
        appendLog("primary relay missed; trying backup...", "warning");
        setStatus("connecting");
        audio.src = station.fallbackStreamUrl;
        audio.load();
        const expectedUrl = station.fallbackStreamUrl;
        audio.play().catch((error: unknown) => {
          if (isCancelledOrStalePlay(error, audio, expectedUrl)) return;
          setStatus("error");
        });
        return;
      }
      setStatus("error");
      appendLog("no signal — type `next` to try another station", "error");
    };

    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
    };
  }, [activeIndex, appendLog, audio]);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const printStations = () => {
    appendLog(
      RADIO_STATIONS.map((station, index) => `${index + 1}:${station.id}`).join("  "),
      "muted"
    );
  };

  const resolveStation = (query?: string) => {
    if (!query) return selectedIndex;
    const numericIndex = Number(query) - 1;
    if (
      Number.isInteger(numericIndex) &&
      numericIndex >= 0 &&
      numericIndex < RADIO_STATIONS.length
    ) {
      return numericIndex;
    }
    const namedIndex = RADIO_STATIONS.findIndex(
      (station) => station.id === query || station.name.toLowerCase() === query
    );
    return namedIndex >= 0 ? namedIndex : null;
  };

  const runCommand = (rawCommand: string) => {
    const commandLine = rawCommand.trim().toLowerCase();
    appendLog(`radio@aryancodes:~$ ${commandLine}`, "muted");
    const [command, ...args] = commandLine.split(/\s+/);

    if (!command) {
      playStation(selectedIndex);
      return;
    }

    switch (command) {
      case "play":
      case "tune": {
        const stationIndex = resolveStation(args.join(" "));
        if (stationIndex === null) {
          appendLog("station not found — type `list`", "error");
          return;
        }
        playStation(stationIndex);
        return;
      }
      case "next":
      case "n":
        playStation(activeIndex + 1);
        return;
      case "prev":
      case "previous":
      case "p":
        playStation(activeIndex - 1);
        return;
      case "pause":
      case "stop":
        audio.pause();
        appendLog("playback paused", "warning");
        return;
      case "resume":
      case "start": {
        setStatus("connecting");
        const expectedUrl = audio.src;
        audio.play().catch((error: unknown) => {
          if (isCancelledOrStalePlay(error, audio, expectedUrl)) return;
          setStatus("blocked");
          appendLog("browser refused playback — press enter once more", "error");
        });
        return;
      }
      case "volume":
      case "vol": {
        const nextVolume = Number(args[0]);
        if (!Number.isFinite(nextVolume) || nextVolume < 0 || nextVolume > 100) {
          appendLog("usage: volume <0-100>", "error");
          return;
        }
        audio.volume = nextVolume / 100;
        setVolume(nextVolume);
        appendLog(`volume ${nextVolume}%`, "success");
        return;
      }
      case "status":
        appendLog(
          `${statusText[status].toLowerCase()} :: ${
            RADIO_STATIONS[activeIndex].name
          } :: vol ${volume}%`,
          status === "playing" ? "success" : "warning"
        );
        return;
      case "list":
      case "ls":
        printStations();
        return;
      case "help":
      case "?":
        appendLog("play <1-5>  next  prev  pause  resume  volume <0-100>  list  exit", "muted");
        return;
      case "clear":
        setLogs([]);
        return;
      case "j":
        setSelectedIndex((index) => wrapIndex(index + 1));
        return;
      case "k":
        setSelectedIndex((index) => wrapIndex(index - 1));
        return;
      case "exit":
      case "quit":
      case "q":
        onExit();
        return;
      default:
        appendLog(`command not found: ${command}. type \`help\``, "error");
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    runCommand(input);
    setInput("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runCommand(input);
      setInput("");
      return;
    }
    if (input) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => wrapIndex(index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => wrapIndex(index - 1));
    } else if (event.key === "Escape") {
      event.preventDefault();
      onExit();
    }
  };

  const isPlaying = status === "playing";

  return (
    <section
      className="flex h-full min-h-0 flex-col bg-[#05080d] font-mono text-[11px] text-slate-300"
      data-radio-status={status}
      data-stream={audio.src || RADIO_STATIONS[activeIndex].streamUrl}
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      <div ref={outputRef} className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-3 py-2">
        <p className="text-slate-500">visitor@aryancodes.com:~$ radio</p>
        {logs.map((line) => (
          <p
            key={line.id}
            className={
              line.tone === "success"
                ? "text-emerald-400"
                : line.tone === "warning"
                ? "text-amber-300"
                : line.tone === "error"
                ? "text-rose-400"
                : line.tone === "muted"
                ? "text-slate-600"
                : "text-slate-300"
            }
          >
            {line.text}
          </p>
        ))}

        <div className="my-2 border-y border-dashed border-slate-800 py-1" role="listbox">
          {RADIO_STATIONS.map((station, index) => {
            const isSelected = selectedIndex === index;
            const isActive = activeIndex === index;
            return (
              <button
                key={station.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={(event) => {
                  event.stopPropagation();
                  playStation(index);
                  inputRef.current?.focus({ preventScroll: true });
                }}
                className={`block w-full truncate text-left leading-5 ${
                  isSelected ? "text-cyan-300" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span className="inline-block w-4">{isSelected ? ">" : " "}</span>
                <span className="inline-block w-6">{String(index + 1).padStart(2, "0")}</span>
                <span className={isActive ? "text-white" : undefined}>{station.name}</span>
                <span className="hidden text-slate-700 sm:inline"> :: {station.vibe}</span>
              </button>
            );
          })}
        </div>

        <p className={isPlaying ? "text-emerald-400" : "text-amber-300"}>
          [{statusText[status]}] {isPlaying ? "▂▄▆█▆▄▂▄▆" : "─────────"}{" "}
          {RADIO_STATIONS[activeIndex].name}
          <span className="text-slate-700"> :: vol {volume}%</span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center border-t border-slate-800 px-3 py-2"
      >
        <label htmlFor="radio-command" className="shrink-0 text-emerald-400">
          radio@aryancodes:~$
        </label>
        <input
          ref={inputRef}
          id="radio-command"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          className="ml-2 min-w-0 flex-1 border-0 bg-transparent p-0 text-[16px] text-slate-200 caret-cyan-300 outline-none placeholder:text-slate-800 sm:text-[11px]"
          placeholder="help"
          autoComplete="off"
          spellCheck={false}
          aria-label="Radio command"
        />
      </form>

      <footer className="shrink-0 truncate px-3 pb-2 text-[9px] text-slate-700">
        ↑↓ select · ↵ tune · help · q exit · keeps playing on scroll
      </footer>
    </section>
  );
};
