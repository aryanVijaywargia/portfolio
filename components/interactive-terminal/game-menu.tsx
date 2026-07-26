import { FC, useEffect, useState, useCallback } from "react";
import { isContraMissionComplete } from "./rescue-progress";

type GameOption = {
  id: string;
  name: string;
  description: string;
  icon: string;
  command: string;
  rescueMission?: boolean;
};

const GAMES: GameOption[] = [
  {
    id: "contra",
    name: "Contra: Terminal Assault",
    description: "Run, jump, and shoot through the jungle to break Rick's first rescue lock.",
    icon: "🔫",
    command: "./contra --rescue-rick",
    rescueMission: true,
  },
  {
    id: "snake",
    name: "Snake",
    description: "Classic snake game - eat food, grow longer, don't hit walls!",
    icon: "🐍",
    command: "./snake --play",
  },
  {
    id: "dungeon",
    name: "Dungeon Quest",
    description: "ASCII RPG adventure - explore dungeons, fight monsters, collect treasure!",
    icon: "⚔️",
    command: "./dungeon --adventure",
  },
  {
    id: "racer",
    name: "Turbo Racer",
    description: "Top-down highway racer - dodge traffic, grab bonuses, survive the speed!",
    icon: "🏎️",
    command: "./racer --turbo",
  },
];

interface GameMenuProps {
  onSelectGame: (gameId: string) => void;
  onExit: () => void;
}

export const GameMenu: FC<GameMenuProps> = ({ onSelectGame, onExit }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingGame, setLoadingGame] = useState<string | null>(null);
  const [contraComplete, setContraComplete] = useState(false);

  useEffect(() => {
    setContraComplete(isContraMissionComplete());
  }, []);

  const handleSelect = useCallback((index: number) => {
    const selectedGame = GAMES[index];
    setSelectedIndex(index);
    setIsLoading(true);
    setLoadingGame(selectedGame.id);

    // Simulate loading animation
    setTimeout(
      () => {
        onSelectGame(selectedGame.id);
      },
      800
    );
  }, [onSelectGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
        case "k":
        case "K":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : GAMES.length - 1));
          break;
        case "ArrowDown":
        case "s":
        case "S":
        case "j":
        case "J":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < GAMES.length - 1 ? prev + 1 : 0));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleSelect(selectedIndex);
          break;
        case "Escape":
        case "q":
        case "Q":
          e.preventDefault();
          onExit();
          break;
        default: {
          const gameNumber = parseInt(e.key, 10);
          if (gameNumber >= 1 && gameNumber <= GAMES.length) {
            e.preventDefault();
            handleSelect(gameNumber - 1);
          }
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoading, handleSelect, onExit, selectedIndex]);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#1e1e1e] p-4 font-mono text-sm text-[#D4D4D4] dark:bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 text-cyan-400">
        <span>$ ./rick-rescue --missions</span>
        <span className={contraComplete ? "text-lime-400" : "text-red-400"}>
          LOCK 01: {contraComplete ? "OPEN" : "ACTIVE"}
        </span>
      </div>

      {/* ASCII Art Title */}
      <pre className="mt-1 hidden text-yellow-400 sm:block">
        {`
   ___    _    __  __ _____ ____
  / _ \\  / \\  |  \\/  | ____/ ___|
 | | | |/ _ \\ | |\\/| |  _| \\___ \\
 | |_| / ___ \\| |  | | |___ ___) |
  \\___/_/   \\_\\_|  |_|_____|____/
`}
      </pre>

      <div className="mt-2 border-l-2 border-cyan-400/60 bg-cyan-400/5 px-3 py-2 text-xs text-gray-400">
        <span className="font-bold text-cyan-300">RICK RESCUE PROTOCOL:</span> Clear the retro
        simulations. Break the locks. Get Rick out.
      </div>

      {/* Game List */}
      <div className="mt-4 flex-1">
        <div className="mb-2 text-gray-500">Available games:</div>
        <div className="space-y-2">
          {GAMES.map((game, index) => (
            <button
              key={game.id}
              onClick={() => handleSelect(index)}
              className={`block w-full cursor-pointer rounded border p-3 text-left transition-all duration-150 ${
                selectedIndex === index
                  ? "border-[#4EC9B0] bg-[#4EC9B0]/10"
                  : "border-gray-700 bg-[#2a2a2a] hover:border-gray-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{game.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        selectedIndex === index ? "text-[#4EC9B0]" : "text-white"
                      }`}
                    >
                      [{index + 1}] {game.name}
                    </span>
                    {game.rescueMission && (
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest ${
                          contraComplete ? "text-lime-400" : "text-red-400"
                        }`}
                      >
                        {contraComplete ? "Cleared" : "Rescue mission"}
                      </span>
                    )}
                    {loadingGame === game.id && (
                      <span className="animate-pulse text-cyan-400">Loading...</span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">{game.description}</div>
                  <div className="mt-1 text-xs text-gray-600">$ {game.command}</div>
                </div>
                {selectedIndex === index && <span className="text-[#4EC9B0]">{">"}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-gray-700 pt-3">
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <span>
            <span className="text-white">↑/↓</span> Navigate
          </span>
          <span>
            <span className="text-white">Enter</span> Select
          </span>
          <span>
            <span className="text-white">1-{GAMES.length}</span> Quick select
          </span>
          <span>
            <span className="text-white">Q/Esc</span> Back
          </span>
        </div>
      </div>
    </div>
  );
};
