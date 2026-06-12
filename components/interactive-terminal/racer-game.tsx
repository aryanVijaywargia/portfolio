import { FC, useCallback, useEffect, useRef, useState } from "react";

type ObstacleKind = "car" | "coin";

type Obstacle = {
  id: number;
  lane: number;
  y: number;
  kind: ObstacleKind;
};

type GameStatus = "idle" | "running" | "paused" | "crashed";

interface RacerGameProps {
  onGameEnd: () => void;
  onScoreChange?: (score: number) => void;
}

const LANES = 4;
const LANE_WIDTH = 7;
// 4 lanes + 3 dividers + 2 borders
const ROAD_COLS = LANES * LANE_WIDTH + (LANES - 1) + 2;
const ROWS = 20;
const PLAYER_TOP_ROW = ROWS - 4;
const CAR_HEIGHT = 2;
const INITIAL_TICK_MS = 130;
const MIN_TICK_MS = 65;
const GEAR_DISTANCE = 120;
const MAX_GEAR = 6;
const COIN_POINTS = 25;
const MIN_LANE_GAP = 6;
const SPAWN_WINDOW_ROWS = 8;

const HIGH_SCORE_KEY = "racerHighScore";

const ENEMY_COLORS = ["text-red-400", "text-orange-400", "text-rose-400", "text-amber-500"];

type Cell = {
  ch: string;
  cls: string;
};

type GameState = {
  status: GameStatus;
  playerLane: number;
  obstacles: Obstacle[];
  distance: number;
  coins: number;
  roadOffset: number;
  nextObstacleId: number;
  spawnCooldown: number;
};

const createInitialState = (): GameState => ({
  status: "idle",
  playerLane: 1,
  obstacles: [],
  distance: 0,
  coins: 0,
  roadOffset: 0,
  nextObstacleId: 1,
  spawnCooldown: 6,
});

const getScore = (state: GameState) => state.distance + state.coins * COIN_POINTS;

const getGear = (distance: number) => Math.min(MAX_GEAR, 1 + Math.floor(distance / GEAR_DISTANCE));

const getTickMs = (distance: number) =>
  Math.max(MIN_TICK_MS, INITIAL_TICK_MS - (getGear(distance) - 1) * 13);

const laneStartCol = (lane: number) => 1 + lane * (LANE_WIDTH + 1);

export const RacerGame: FC<RacerGameProps> = ({ onGameEnd, onScoreChange }) => {
  const gameRef = useRef<GameState>(createInitialState());
  const [, setRenderTick] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const forceRender = useCallback(() => setRenderTick((tick) => tick + 1), []);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    if (saved) {
      setHighScore(parseInt(saved, 10) || 0);
    }
  }, []);

  const reportedScoreRef = useRef(0);
  const maybeReportScore = useCallback((force = false) => {
    const score = getScore(gameRef.current);
    // Throttle: report every 100 points or on demand (crash), so the
    // achievement store isn't updated on every tick.
    if (force || score - reportedScoreRef.current >= 100) {
      reportedScoreRef.current = score;
      onScoreChange?.(score);
    }
  }, [onScoreChange]);

  const handleCrash = useCallback(() => {
    const game = gameRef.current;
    game.status = "crashed";
    const score = getScore(game);
    setHighScore((prev) => {
      if (score > prev) {
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
        return score;
      }
      return prev;
    });
    maybeReportScore(true);
  }, [maybeReportScore]);

  const startGame = useCallback(() => {
    gameRef.current = { ...createInitialState(), status: "running" };
    reportedScoreRef.current = 0;
    forceRender();
  }, [forceRender]);

  // Lanes that contain an obstacle near the top of the road
  const lanesBlockedNearTop = (obstacles: Obstacle[]) => {
    const blocked = new Set<number>();
    obstacles.forEach((obstacle) => {
      if (obstacle.kind === "car" && obstacle.y < SPAWN_WINDOW_ROWS) {
        blocked.add(obstacle.lane);
      }
    });
    return blocked;
  };

  const laneHasRoomToSpawn = (obstacles: Obstacle[], lane: number) =>
    !obstacles.some((obstacle) => obstacle.lane === lane && obstacle.y < MIN_LANE_GAP);

  const tick = useCallback(() => {
    const game = gameRef.current;
    if (game.status !== "running") return;

    game.roadOffset += 1;
    game.distance += 1;

    // Move traffic down the road
    game.obstacles = game.obstacles
      .map((obstacle) => ({ ...obstacle, y: obstacle.y + 1 }))
      .filter((obstacle) => obstacle.y < ROWS + CAR_HEIGHT);

    // Collisions against the player rows
    const playerBottomRow = PLAYER_TOP_ROW + CAR_HEIGHT - 1;
    const survivors: Obstacle[] = [];
    let crashed = false;
    game.obstacles.forEach((obstacle) => {
      const overlapsPlayer =
        obstacle.lane === game.playerLane &&
        obstacle.y + (obstacle.kind === "car" ? CAR_HEIGHT - 1 : 0) >= PLAYER_TOP_ROW &&
        obstacle.y <= playerBottomRow;

      if (overlapsPlayer && obstacle.kind === "coin") {
        game.coins += 1;
        return;
      }
      if (overlapsPlayer && obstacle.kind === "car") {
        crashed = true;
      }
      survivors.push(obstacle);
    });
    game.obstacles = survivors;

    if (crashed) {
      handleCrash();
      forceRender();
      return;
    }

    // Spawn traffic: keep at least one lane open near the top so every
    // wave stays dodgeable.
    game.spawnCooldown -= 1;
    if (game.spawnCooldown <= 0) {
      const lane = Math.floor(Math.random() * LANES);
      const blocked = lanesBlockedNearTop(game.obstacles);
      const wouldBlockAllLanes = !blocked.has(lane) && blocked.size >= LANES - 1;
      if (!wouldBlockAllLanes && laneHasRoomToSpawn(game.obstacles, lane)) {
        game.obstacles.push({
          id: game.nextObstacleId++,
          lane,
          y: -CAR_HEIGHT,
          kind: "car",
        });
        game.spawnCooldown = 2 + Math.floor(Math.random() * 3);
      } else {
        game.spawnCooldown = 1;
      }
    }

    // Occasional coin in a lane with room
    if (Math.random() < 0.07) {
      const lane = Math.floor(Math.random() * LANES);
      if (laneHasRoomToSpawn(game.obstacles, lane)) {
        game.obstacles.push({ id: game.nextObstacleId++, lane, y: -1, kind: "coin" });
      }
    }

    maybeReportScore();
    forceRender();
  }, [forceRender, handleCrash, maybeReportScore]);

  // Game loop - tick speed follows the current gear
  const distance = gameRef.current.distance;
  const status = gameRef.current.status;
  useEffect(() => {
    if (status !== "running") return undefined;

    const interval = setInterval(tick, getTickMs(distance));
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, getGear(distance), tick]);

  const movePlayer = useCallback((delta: number) => {
    const game = gameRef.current;
    if (game.status !== "running") return;

    const nextLane = Math.min(LANES - 1, Math.max(0, game.playerLane + delta));
    if (nextLane === game.playerLane) return;
    game.playerLane = nextLane;

    // Switching into a car still counts as a crash
    const playerBottomRow = PLAYER_TOP_ROW + CAR_HEIGHT - 1;
    const hit = game.obstacles.find(
      (obstacle) =>
        obstacle.kind === "car" &&
        obstacle.lane === nextLane &&
        obstacle.y + CAR_HEIGHT - 1 >= PLAYER_TOP_ROW &&
        obstacle.y <= playerBottomRow
    );
    if (hit) {
      handleCrash();
    } else {
      // Grab any coin sitting in the new lane
      game.obstacles = game.obstacles.filter((obstacle) => {
        const grabbed =
          obstacle.kind === "coin" &&
          obstacle.lane === nextLane &&
          obstacle.y >= PLAYER_TOP_ROW &&
          obstacle.y <= playerBottomRow;
        if (grabbed) game.coins += 1;
        return !grabbed;
      });
    }
    forceRender();
  }, [forceRender, handleCrash]);

  const togglePause = useCallback(() => {
    const game = gameRef.current;
    if (game.status === "running") {
      game.status = "paused";
    } else if (game.status === "paused") {
      game.status = "running";
    }
    forceRender();
  }, [forceRender]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const game = gameRef.current;

      if (
        (game.status === "idle" || game.status === "crashed") &&
        (e.key === " " || e.key === "Enter")
      ) {
        e.preventDefault();
        startGame();
        return;
      }

      if (e.key === "Escape" || e.key === "q" || e.key === "Q") {
        onGameEnd();
        return;
      }

      if (e.key === "p" || e.key === "P") {
        togglePause();
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
        case "h":
        case "H":
          e.preventDefault();
          movePlayer(-1);
          break;
        case "ArrowRight":
        case "d":
        case "D":
        case "l":
        case "L":
          e.preventDefault();
          movePlayer(1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer, onGameEnd, startGame, togglePause]);

  const game = gameRef.current;
  const score = getScore(game);
  const gear = getGear(game.distance);

  // Build the road as a grid of colored characters
  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];

    for (let y = 0; y < ROWS; y++) {
      grid[y] = [];
      for (let x = 0; x < ROAD_COLS; x++) {
        if (x === 0 || x === ROAD_COLS - 1) {
          grid[y][x] = { ch: "║", cls: "text-gray-600" };
        } else if ((x - 1) % (LANE_WIDTH + 1) === LANE_WIDTH) {
          // Animated dashed lane dividers scroll with the road
          const dash = (y + game.roadOffset) % 4 < 2;
          grid[y][x] = { ch: dash ? "┆" : " ", cls: "text-gray-700" };
        } else {
          grid[y][x] = { ch: " ", cls: "" };
        }
      }
    }

    const drawSprite = (lane: number, y: number, rows: string[], cls: string) => {
      const start = laneStartCol(lane) + Math.floor((LANE_WIDTH - 3) / 2);
      rows.forEach((rowChars, rowIndex) => {
        const row = y + rowIndex;
        if (row < 0 || row >= ROWS) return;
        rowChars.split("").forEach((ch, colIndex) => {
          if (ch !== " ") {
            grid[row][start + colIndex] = { ch, cls };
          }
        });
      });
    };

    game.obstacles.forEach((obstacle) => {
      if (obstacle.kind === "coin") {
        drawSprite(obstacle.lane, obstacle.y, [" $ "], "text-yellow-400");
      } else {
        drawSprite(
          obstacle.lane,
          obstacle.y,
          ["███", " ▀ "],
          ENEMY_COLORS[obstacle.id % ENEMY_COLORS.length]
        );
      }
    });

    if (game.status === "crashed") {
      drawSprite(game.playerLane, PLAYER_TOP_ROW - 1, ["\\|/", ">*<", "/|\\"], "text-orange-400");
    } else {
      drawSprite(game.playerLane, PLAYER_TOP_ROW, [" ▄ ", "███"], "text-cyan-400");
    }

    return grid;
  };

  // Start screen
  if (game.status === "idle") {
    return (
      <div className="flex h-full flex-col bg-[#1e1e1e] p-4 font-mono text-sm text-[#D4D4D4] dark:bg-transparent">
        <div className="text-cyan-400">$ ./racer --turbo</div>
        <div className="mt-2 text-gray-400">
          <pre className="text-red-400">{`
  _____ _   _ ____  ____   ___
 |_   _| | | |  _ \\| __ ) / _ \\
   | | | | | | |_) |  _ \\| | | |
   | | | |_| |  _ <| |_) | |_| |
   |_|  \\___/|_| \\_\\____/ \\___/
        R  A  C  E  R
`}</pre>
        </div>
        <div className="mt-2 text-gray-400">
          <span className="text-yellow-400">HIGH SCORE:</span> {highScore}
        </div>
        <div className="mt-4 border border-gray-700 p-3">
          <div className="text-cyan-400">CONTROLS:</div>
          <div className="mt-2 text-gray-400">
            <div>
              <span className="text-white">A/D</span> or <span className="text-white">←/→</span> or{" "}
              <span className="text-white">H/L</span> - Steer
            </div>
            <div>
              <span className="text-white">P</span> - Pause
            </div>
            <div>
              <span className="text-white">Q/ESC</span> - Quit
            </div>
          </div>
          <div className="mt-3 text-gray-400">
            <div>
              <span className="text-cyan-400">███</span> = Your ride
            </div>
            <div>
              <span className="text-red-400">███</span> = Traffic (avoid!)
            </div>
            <div>
              <span className="text-yellow-400">$</span> = Bonus (+{COIN_POINTS} points)
            </div>
            <div className="mt-1 text-gray-500">Survive to score. The road only gets faster.</div>
          </div>
        </div>
        <div className="mt-4 animate-pulse text-yellow-400">Press ENTER or SPACE to start...</div>
      </div>
    );
  }

  const grid = renderGrid();

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e] p-2 font-mono text-[#D4D4D4] dark:bg-transparent">
      {/* Terminal header */}
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-cyan-400">$ racer --racing</span>
        <span className="text-gray-500">[q to quit]</span>
      </div>

      {/* Score bar */}
      <div className="mb-1 flex justify-between border-b border-gray-700 pb-1 text-xs">
        <span>
          <span className="text-gray-500">SCORE:</span>{" "}
          <span className="text-green-400">{score.toString().padStart(5, "0")}</span>
        </span>
        <span>
          <span className="text-gray-500">HIGH:</span>{" "}
          <span className="text-yellow-400">{highScore.toString().padStart(5, "0")}</span>
        </span>
        <span>
          <span className="text-gray-500">GEAR:</span>{" "}
          <span className="text-cyan-400">
            {gear}
            <span className="text-gray-600">/{MAX_GEAR}</span>
          </span>
        </span>
        <span>
          <span className="text-gray-500">$:</span>{" "}
          <span className="text-yellow-400">{game.coins.toString().padStart(3, "0")}</span>
        </span>
      </div>

      {/* Road */}
      <div className="relative flex-1 overflow-hidden">
        <pre className="mx-auto w-min text-xs leading-none md:text-sm">
          {grid.map((row, y) => (
            <div key={y} className="whitespace-pre">
              {row.map((cell, x) => (
                <span key={`${x}-${y}`} className={cell.cls}>
                  {cell.ch}
                </span>
              ))}
            </div>
          ))}
        </pre>

        {/* Pause overlay */}
        {game.status === "paused" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="border border-yellow-400 p-4 text-center">
              <div className="text-xl text-yellow-400">== PIT STOP ==</div>
              <div className="mt-2 text-sm text-gray-400">Press P to hit the road</div>
            </div>
          </div>
        )}

        {/* Crash overlay */}
        {game.status === "crashed" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="border border-red-400 p-4 text-center">
              <pre className="text-red-400">{`
  ____ ____      _    ____  _   _ _____ ____
 / ___|  _ \\    / \\  / ___|| | | | ____|  _ \\
| |   | |_) |  / _ \\ \\___ \\| |_| |  _| | | | |
| |___|  _ <  / ___ \\ ___) |  _  | |___| |_| |
 \\____|_| \\_\\/_/   \\_\\____/|_| |_|_____|____/
`}</pre>
              <div className="mt-2 text-gray-400">
                <span className="text-yellow-400">FINAL SCORE:</span> {score}
              </div>
              {score > 0 && score >= highScore && (
                <div className="mt-1 animate-pulse text-green-400">NEW HIGH SCORE!</div>
              )}
              <div className="mt-3 text-sm text-gray-500">
                Press <span className="text-white">ENTER</span> to race again or{" "}
                <span className="text-white">Q</span> to quit
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div className="mt-2 grid grid-cols-2 gap-1 text-center text-xs md:hidden">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            movePlayer(-1);
          }}
          className="rounded border border-gray-600 bg-gray-800 py-2 active:bg-gray-700"
        >
          ◀ LEFT
        </button>
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            movePlayer(1);
          }}
          className="rounded border border-gray-600 bg-gray-800 py-2 active:bg-gray-700"
        >
          RIGHT ▶
        </button>
      </div>
    </div>
  );
};
