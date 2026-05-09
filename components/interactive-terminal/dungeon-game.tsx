import { FC, useEffect, useState, useCallback, useRef } from "react";

type Position = { x: number; y: number };

type Enemy = {
  id: number;
  pos: Position;
  hp: number;
  maxHp: number;
  name: string;
  damage: number;
  char: string;
};

type Item = {
  id: number;
  pos: Position;
  type: "health" | "key" | "treasure" | "sword";
  char: string;
  name: string;
  value: number;
};

type GameState = "start" | "playing" | "combat" | "victory" | "gameover";

interface DungeonGameProps {
  onGameEnd: () => void;
  onEscape?: () => void;
}

const DUNGEON_WIDTH = 40;
const DUNGEON_HEIGHT = 15;

// Dungeon levels
const LEVELS = [
  {
    name: "The Entrance",
    map: [
      "########################################",
      "#......................................#",
      "#..###....###....###....###....###....#",
      "#..#.#....#.#....#.#....#.#....#.#....#",
      "#..###....###....###....###....###....#",
      "#......................................#",
      "#....................................E.#",
      "#......................................#",
      "#..###....###....###....###....###....#",
      "#..#.#....#.#....#.#....#.#....#.#....#",
      "#..###....###....###....###....###....#",
      "#......................................#",
      "#.P....................................#",
      "#......................................#",
      "########################################",
    ],
    enemies: [
      { x: 20, y: 5, name: "Goblin", hp: 30, damage: 5, char: "G" },
      { x: 30, y: 9, name: "Rat", hp: 15, damage: 3, char: "R" },
    ],
    items: [
      { x: 10, y: 7, type: "health" as const, name: "Potion", value: 20 },
      { x: 35, y: 3, type: "treasure" as const, name: "Gold", value: 50 },
    ],
  },
  {
    name: "The Dark Hall",
    map: [
      "########################################",
      "#P.....#.......#.......#.......#......#",
      "#......#.......#.......#.......#......#",
      "#......#.......#.......#.......#......#",
      "####.###.......#.......#.......#......#",
      "#......................................#",
      "#......................................#",
      "#......................................#",
      "#......#.......#.......#.......####.###",
      "#......#.......#.......#.......#......#",
      "#......#.......#.......#.......#......#",
      "#......#.......#.......#.......#.....E#",
      "#......................................#",
      "#......................................#",
      "########################################",
    ],
    enemies: [
      { x: 15, y: 6, name: "Skeleton", hp: 40, damage: 8, char: "S" },
      { x: 25, y: 7, name: "Goblin", hp: 30, damage: 5, char: "G" },
      { x: 32, y: 10, name: "Zombie", hp: 50, damage: 6, char: "Z" },
    ],
    items: [
      { x: 2, y: 6, type: "sword" as const, name: "Iron Sword", value: 5 },
      { x: 20, y: 3, type: "health" as const, name: "Potion", value: 25 },
      { x: 36, y: 6, type: "treasure" as const, name: "Chest", value: 100 },
    ],
  },
  {
    name: "The Dragon's Lair",
    map: [
      "########################################",
      "#P.....................................#",
      "#.....##########..##########...........#",
      "#.....#........#..#........#...........#",
      "#.....#........#..#........#...........#",
      "#.....#........####........#...........#",
      "#.....#....................#...........#",
      "#.....#....................#...........#",
      "#.....#........####........#...........#",
      "#.....#........#..#........#...........#",
      "#.....#........#..#........#...........#",
      "#.....##########..##########...........#",
      "#......................................#",
      "#.....................................E#",
      "########################################",
    ],
    enemies: [{ x: 20, y: 7, name: "DRAGON", hp: 100, damage: 15, char: "D" }],
    items: [
      { x: 5, y: 7, type: "sword" as const, name: "Dragon Slayer", value: 15 },
      { x: 35, y: 2, type: "health" as const, name: "Elixir", value: 50 },
      { x: 35, y: 12, type: "treasure" as const, name: "Dragon Hoard", value: 500 },
    ],
  },
];

export const DungeonGame: FC<DungeonGameProps> = ({ onGameEnd, onEscape }) => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [level, setLevel] = useState(0);
  const [player, setPlayer] = useState<Position>({ x: 2, y: 12 });
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp] = useState(100);
  const [playerDamage, setPlayerDamage] = useState(10);
  const [score, setScore] = useState(0);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [combatEnemy, setCombatEnemy] = useState<Enemy | null>(null);
  const messageIdRef = useRef(0);

  const addMessage = useCallback((msg: string) => {
    setMessages((prev) => [...prev.slice(-4), msg]);
  }, []);

  const initLevel = useCallback((levelIndex: number) => {
    const levelData = LEVELS[levelIndex];

    // Find player start position
    for (let y = 0; y < levelData.map.length; y++) {
      for (let x = 0; x < levelData.map[y].length; x++) {
        if (levelData.map[y][x] === "P") {
          setPlayer({ x, y });
          break;
        }
      }
    }

    // Initialize enemies
    setEnemies(
      levelData.enemies.map((e, i) => ({
        id: i,
        pos: { x: e.x, y: e.y },
        hp: e.hp,
        maxHp: e.hp,
        name: e.name,
        damage: e.damage,
        char: e.char,
      }))
    );

    // Initialize items
    setItems(
      levelData.items.map((item, i) => ({
        id: i,
        pos: { x: item.x, y: item.y },
        type: item.type,
        char:
          item.type === "health"
            ? "+"
            : item.type === "sword"
            ? "/"
            : (item.type as string) === "key"
            ? "k"
            : "$",
        name: item.name,
        value: item.value,
      }))
    );

    addMessage(`Entering: ${levelData.name}`);
  }, [addMessage]);

  const handleStartGame = useCallback(() => {
    setGameState("playing");
    setLevel(0);
    setPlayerHp(100);
    setPlayerDamage(10);
    setScore(0);
    setMessages([]);
    initLevel(0);
  }, [initLevel]);

  const handleAttack = useCallback(() => {
    if (!combatEnemy) return;

    const damage = playerDamage + Math.floor(Math.random() * 5);
    const newEnemyHp = combatEnemy.hp - damage;

    addMessage(`You deal ${damage} damage to ${combatEnemy.name}!`);

    if (newEnemyHp <= 0) {
      // Enemy defeated
      addMessage(`${combatEnemy.name} defeated! +${combatEnemy.maxHp} pts`);
      setScore((prev) => prev + combatEnemy.maxHp);
      setEnemies((prev) => prev.filter((e) => e.id !== combatEnemy.id));
      setCombatEnemy(null);
      setGameState("playing");
    } else {
      // Enemy attacks back
      const enemyDamage = combatEnemy.damage + Math.floor(Math.random() * 3);
      const newPlayerHp = playerHp - enemyDamage;
      addMessage(`${combatEnemy.name} deals ${enemyDamage} damage to you!`);
      setPlayerHp(newPlayerHp);
      setCombatEnemy({ ...combatEnemy, hp: newEnemyHp });

      if (newPlayerHp <= 0) {
        setGameState("gameover");
        addMessage("You have been defeated...");
      }
    }
  }, [combatEnemy, playerDamage, playerHp, addMessage]);

  const handleFlee = useCallback(() => {
    if (Math.random() > 0.5) {
      addMessage("You fled successfully!");
      setCombatEnemy(null);
      setGameState("playing");
    } else {
      if (combatEnemy) {
        const damage = combatEnemy.damage;
        addMessage(`Failed to flee! ${combatEnemy.name} hits you for ${damage}!`);
        const newHp = playerHp - damage;
        setPlayerHp(newHp);
        if (newHp <= 0) {
          setGameState("gameover");
        }
      }
    }
  }, [combatEnemy, playerHp, addMessage]);

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (gameState !== "playing") return;

      const newX = player.x + dx;
      const newY = player.y + dy;

      // Check bounds
      if (newX < 0 || newX >= DUNGEON_WIDTH || newY < 0 || newY >= DUNGEON_HEIGHT) return;

      // Check walls
      const currentMap = LEVELS[level].map;
      if (currentMap[newY][newX] === "#") return;

      // Check for exit
      if (currentMap[newY][newX] === "E") {
        if (level < LEVELS.length - 1) {
          setLevel((prev) => {
            const newLevel = prev + 1;
            initLevel(newLevel);
            return newLevel;
          });
          setScore((prev) => prev + 100);
          addMessage("Level complete! +100 pts");
          return;
        } else {
          onEscape?.();
          setGameState("victory");
          setScore((prev) => prev + 500);
          addMessage("You escaped the dungeon! Victory!");
          return;
        }
      }

      // Check for enemies
      const enemy = enemies.find((e) => e.pos.x === newX && e.pos.y === newY);
      if (enemy) {
        setCombatEnemy(enemy);
        setGameState("combat");
        addMessage(`A wild ${enemy.name} appears!`);
        return;
      }

      // Check for items
      const item = items.find((i) => i.pos.x === newX && i.pos.y === newY);
      if (item) {
        if (item.type === "health") {
          setPlayerHp((prev) => Math.min(playerMaxHp, prev + item.value));
          addMessage(`Found ${item.name}! +${item.value} HP`);
        } else if (item.type === "sword") {
          setPlayerDamage((prev) => prev + item.value);
          addMessage(`Found ${item.name}! +${item.value} ATK`);
        } else if (item.type === "treasure") {
          setScore((prev) => prev + item.value);
          addMessage(`Found ${item.name}! +${item.value} pts`);
        }
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      }

      setPlayer({ x: newX, y: newY });
    },
    [gameState, player, level, enemies, items, playerMaxHp, initLevel, addMessage, onEscape]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === "start") {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleStartGame();
        } else if (e.key === "Escape" || e.key === "q" || e.key === "Q") {
          onGameEnd();
        }
        return;
      }

      if (gameState === "victory" || gameState === "gameover") {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleStartGame();
        } else if (e.key === "Escape" || e.key === "q" || e.key === "Q") {
          onGameEnd();
        }
        return;
      }

      if (gameState === "combat") {
        if (e.key === "a" || e.key === "A" || e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleAttack();
        } else if (e.key === "f" || e.key === "F" || e.key === "Escape") {
          e.preventDefault();
          handleFlee();
        }
        return;
      }

      if (e.key === "Escape" || e.key === "q" || e.key === "Q") {
        onGameEnd();
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
        case "k":
        case "K":
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case "ArrowDown":
        case "s":
        case "S":
        case "j":
        case "J":
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
        case "h":
        case "H":
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
        case "d":
        case "D":
        case "l":
        case "L":
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, handleStartGame, handleAttack, handleFlee, movePlayer, onGameEnd]);

  const renderMap = () => {
    const currentMap = LEVELS[level].map;
    const grid: string[][] = currentMap.map((row) => row.split(""));

    // Place items
    items.forEach((item) => {
      grid[item.pos.y][item.pos.x] = item.char;
    });

    // Place enemies
    enemies.forEach((enemy) => {
      grid[enemy.pos.y][enemy.pos.x] = enemy.char;
    });

    // Place player
    grid[player.y][player.x] = "@";

    return grid;
  };

  const getCellColor = (char: string) => {
    switch (char) {
      case "@":
        return "text-green-400 font-bold";
      case "#":
        return "text-gray-600";
      case "E":
        return "text-yellow-400 font-bold";
      case "G":
      case "R":
      case "S":
      case "Z":
        return "text-red-400";
      case "D":
        return "text-red-600 font-bold";
      case "+":
        return "text-pink-400";
      case "/":
        return "text-cyan-400";
      case "$":
        return "text-yellow-300";
      case "k":
        return "text-orange-400";
      default:
        return "text-gray-700";
    }
  };

  // Start screen
  if (gameState === "start") {
    return (
      <div className="flex h-full flex-col bg-[#1e1e1e] dark:bg-transparent p-4 font-mono text-sm text-[#D4D4D4]">
        <div className="text-cyan-400">$ ./dungeon --adventure</div>
        <pre className="mt-2 text-yellow-400">
          {`
    ____  __  ___   ________________________
   / __ \\/ / / / | / / ____/ ____/ ____/ | / /
  / / / / / / /  |/ / / __/ __/ / / __ /  |/ /
 / /_/ / /_/ / /|  / /_/ / /___/ /_/ / /|  /
/_____/\\____/_/ |_/\\____/_____/\\____/_/ |_/

   ____  __  _____________  ______
  / __ \\/ / / / ____/ ___/ /_  __/
 / / / / / / / __/  \\__ \\   / /
/ /_/ / /_/ / /___ ___/ /  / /
\\___\\_\\____/_____//____/  /_/
`}
        </pre>
        <div className="mt-4 border border-gray-700 p-3">
          <div className="text-cyan-400">STORY:</div>
          <div className="mt-2 text-gray-400">
            You are a brave adventurer who has entered the cursed dungeon. Navigate through three
            levels, defeat monsters, collect treasure, and escape alive!
          </div>
          <div className="mt-3 text-cyan-400">CONTROLS:</div>
          <div className="mt-2 text-gray-400">
            <div>
              <span className="text-white">W/A/S/D</span> or{" "}
              <span className="text-white">Arrow Keys</span> - Move
            </div>
            <div>
              <span className="text-white">A</span>/<span className="text-white">SPACE</span> -
              Attack (in combat)
            </div>
            <div>
              <span className="text-white">F</span>/<span className="text-white">ESC</span> - Flee
              (in combat)
            </div>
            <div>
              <span className="text-white">Q</span> - Quit
            </div>
          </div>
          <div className="mt-3 text-cyan-400">LEGEND:</div>
          <div className="mt-2 text-gray-400">
            <div>
              <span className="text-green-400">@</span> = You &nbsp;
              <span className="text-yellow-400">E</span> = Exit &nbsp;
              <span className="text-gray-600">#</span> = Wall
            </div>
            <div>
              <span className="text-red-400">G/R/S/Z</span> = Enemies &nbsp;
              <span className="text-red-600">D</span> = Dragon
            </div>
            <div>
              <span className="text-pink-400">+</span> = Health &nbsp;
              <span className="text-cyan-400">/</span> = Weapon &nbsp;
              <span className="text-yellow-300">$</span> = Treasure
            </div>
          </div>
        </div>
        <div className="mt-4 animate-pulse text-yellow-400">
          Press ENTER or SPACE to begin your quest...
        </div>
      </div>
    );
  }

  // Victory screen
  if (gameState === "victory") {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#1e1e1e] dark:bg-transparent p-4 font-mono text-[#D4D4D4]">
        <pre className="text-yellow-400">
          {`
 _    _______________  ______  __
| |  / /  _/ ____/_  |/ / __ \\/ /
| | / // // /     / / / / / / /
| |/ // // /___  / / / /_/ /_/
|___/___/\\____/ /_/_/\\____(_)
`}
        </pre>
        <div className="mt-4 text-xl text-green-400">You escaped the dungeon!</div>
        <div className="mt-2 text-gray-400">
          <span className="text-yellow-400">FINAL SCORE:</span> {score}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Press <span className="text-white">ENTER</span> to play again or{" "}
          <span className="text-white">Q</span> to quit
        </div>
      </div>
    );
  }

  // Game over screen
  if (gameState === "gameover") {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#1e1e1e] dark:bg-transparent p-4 font-mono text-[#D4D4D4]">
        <pre className="text-red-400">
          {`
   _________    __  _________   ____ _    ____________
  / ____/   |  /  |/  / ____/  / __ \\ |  / / ____/ __ \\
 / / __/ /| | / /|_/ / __/    / / / / | / / __/ / /_/ /
/ /_/ / ___ |/ /  / / /___   / /_/ /| |/ / /___/ _, _/
\\____/_/  |_/_/  /_/_____/   \\____/ |___/_____/_/ |_|
`}
        </pre>
        <div className="mt-4 text-lg text-red-400">You have been defeated...</div>
        <div className="mt-2 text-gray-400">
          <span className="text-yellow-400">SCORE:</span> {score}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Press <span className="text-white">ENTER</span> to try again or{" "}
          <span className="text-white">Q</span> to quit
        </div>
      </div>
    );
  }

  // Combat screen
  if (gameState === "combat" && combatEnemy) {
    const hpPercent = Math.floor((combatEnemy.hp / combatEnemy.maxHp) * 10);
    const playerHpPercent = Math.floor((playerHp / playerMaxHp) * 10);

    return (
      <div className="flex h-full flex-col bg-[#1e1e1e] dark:bg-transparent p-4 font-mono text-sm text-[#D4D4D4]">
        <div className="text-red-400">⚔️ COMBAT! ⚔️</div>
        <div className="mt-4 border border-red-400 p-3">
          <div className="flex justify-between">
            <div>
              <div className="text-green-400">YOU</div>
              <div className="mt-1 text-gray-400">
                HP: [{"█".repeat(playerHpPercent)}
                {" ".repeat(10 - playerHpPercent)}] {playerHp}/{playerMaxHp}
              </div>
              <div className="text-gray-400">ATK: {playerDamage}</div>
            </div>
            <div className="text-center text-2xl text-gray-600">VS</div>
            <div className="text-right">
              <div className="text-red-400">{combatEnemy.name}</div>
              <div className="mt-1 text-gray-400">
                HP: [{"█".repeat(hpPercent)}
                {" ".repeat(10 - hpPercent)}] {combatEnemy.hp}/{combatEnemy.maxHp}
              </div>
              <div className="text-gray-400">ATK: {combatEnemy.damage}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 border border-gray-700 p-2">
          <div className="text-cyan-400">Combat Log:</div>
          {messages.slice(-3).map((msg, i) => (
            <div key={i} className="text-gray-400">
              {">"} {msg}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4">
          <button className="rounded border border-red-400 bg-red-900/30 px-4 py-2 text-red-400 hover:bg-red-900/50">
            [A]ttack
          </button>
          <button className="rounded border border-gray-400 bg-gray-900/30 px-4 py-2 text-gray-400 hover:bg-gray-900/50">
            [F]lee
          </button>
        </div>
      </div>
    );
  }

  // Main game
  const grid = renderMap();

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e] dark:bg-transparent p-2 font-mono text-[#D4D4D4]">
      {/* Header */}
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-cyan-400">$ dungeon --level={level + 1}</span>
        <span className="text-gray-500">[q to quit]</span>
      </div>

      {/* Stats bar */}
      <div className="mb-1 flex justify-between border-b border-gray-700 pb-1 text-xs">
        <span>
          <span className="text-gray-500">HP:</span>{" "}
          <span className={playerHp > 30 ? "text-green-400" : "text-red-400"}>
            {playerHp}/{playerMaxHp}
          </span>
        </span>
        <span>
          <span className="text-gray-500">ATK:</span>{" "}
          <span className="text-cyan-400">{playerDamage}</span>
        </span>
        <span>
          <span className="text-gray-500">SCORE:</span>{" "}
          <span className="text-yellow-400">{score}</span>
        </span>
        <span>
          <span className="text-gray-500">LVL:</span>{" "}
          <span className="text-purple-400">{level + 1}/3</span>
        </span>
      </div>

      {/* Map */}
      <div className="flex-1 overflow-hidden">
        <pre className="text-xs leading-none">
          {grid.map((row, y) => (
            <div key={y} className="whitespace-pre">
              {row.map((cell, x) => (
                <span key={`${x}-${y}`} className={getCellColor(cell)}>
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </pre>
      </div>

      {/* Messages */}
      <div className="mt-1 border-t border-gray-700 pt-1">
        <div className="text-xs text-gray-500">Log:</div>
        <div className="text-xs">
          {messages.slice(-2).map((msg, i) => (
            <div key={i} className="text-gray-400">
              {">"} {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
