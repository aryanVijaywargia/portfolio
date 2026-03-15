import { FC, useEffect, useRef, useState, useCallback } from "react";

type Position = {
  x: number;
  y: number;
};

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

interface SnakeGameProps {
  onGameEnd: () => void;
}

const GRID_WIDTH = 40;
const GRID_HEIGHT = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;
const MIN_SPEED = 60;

export const SnakeGame: FC<SnakeGameProps> = ({ onGameEnd }) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 20, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 30, y: 10 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(false);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef<Direction>("RIGHT");

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("snakeHighScore");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * (GRID_WIDTH - 2)) + 1,
        y: Math.floor(Math.random() * (GRID_HEIGHT - 2)) + 1,
      };
    } while (currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // Check collision with walls or self
  const checkCollision = useCallback((head: Position, snakeBody: Position[]): boolean => {
    // Wall collision
    if (head.x <= 0 || head.x >= GRID_WIDTH - 1 || head.y <= 0 || head.y >= GRID_HEIGHT - 1) {
      return true;
    }
    // Self collision (skip head)
    return snakeBody.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
  }, []);

  // Game loop
  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted || isPaused) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };
      const currentDirection = directionRef.current;

      switch (currentDirection) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // Check collision
      if (checkCollision(head, prevSnake)) {
        setGameOver(true);
        // Update high score
        setScore((currentScore) => {
          if (currentScore > highScore) {
            setHighScore(currentScore);
            localStorage.setItem("snakeHighScore", currentScore.toString());
          }
          return currentScore;
        });
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check if food eaten
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
        // Increase speed
        setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [gameOver, gameStarted, isPaused, food, generateFood, checkCollision, highScore]);

  // Define handleStartGame and handleRetry before keyboard useEffect
  const handleStartGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setSnake([{ x: 20, y: 10 }]);
    setFood(generateFood([{ x: 20, y: 10 }]));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  }, [generateFood]);

  const handleRetry = useCallback(() => {
    handleStartGame();
  }, [handleStartGame]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted && !gameOver && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        handleStartGame();
        return;
      }

      if (gameOver && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        handleRetry();
        return;
      }

      if (e.key === "Escape" || e.key === "q" || e.key === "Q") {
        onGameEnd();
        return;
      }

      if (e.key === "p" || e.key === "P") {
        if (gameStarted && !gameOver) {
          setIsPaused((prev) => !prev);
        }
        return;
      }

      if (isPaused) return;

      const currentDirection = directionRef.current;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
        case "k":
        case "K":
          e.preventDefault();
          if (currentDirection !== "DOWN") {
            directionRef.current = "UP";
            setDirection("UP");
          }
          break;
        case "ArrowDown":
        case "s":
        case "S":
        case "j":
        case "J":
          e.preventDefault();
          if (currentDirection !== "UP") {
            directionRef.current = "DOWN";
            setDirection("DOWN");
          }
          break;
        case "ArrowLeft":
        case "a":
        case "A":
        case "h":
        case "H":
          e.preventDefault();
          if (currentDirection !== "RIGHT") {
            directionRef.current = "LEFT";
            setDirection("LEFT");
          }
          break;
        case "ArrowRight":
        case "d":
        case "D":
        case "l":
        case "L":
          e.preventDefault();
          if (currentDirection !== "LEFT") {
            directionRef.current = "RIGHT";
            setDirection("RIGHT");
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, gameOver, isPaused, onGameEnd, handleStartGame, handleRetry]);

  // Game loop interval
  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, isPaused, speed, moveSnake]);

  // Render the terminal grid
  const renderGrid = () => {
    const grid: string[][] = [];

    // Initialize grid with empty spaces
    for (let y = 0; y < GRID_HEIGHT; y++) {
      grid[y] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        // Draw borders
        if (y === 0 || y === GRID_HEIGHT - 1) {
          if (x === 0 || x === GRID_WIDTH - 1) {
            grid[y][x] = "+";
          } else {
            grid[y][x] = "-";
          }
        } else if (x === 0 || x === GRID_WIDTH - 1) {
          grid[y][x] = "|";
        } else {
          grid[y][x] = " ";
        }
      }
    }

    // Draw food
    grid[food.y][food.x] = "*";

    // Draw snake
    snake.forEach((segment, index) => {
      if (segment.x >= 0 && segment.x < GRID_WIDTH && segment.y >= 0 && segment.y < GRID_HEIGHT) {
        if (index === 0) {
          // Snake head - direction based
          switch (directionRef.current) {
            case "UP":
              grid[segment.y][segment.x] = "^";
              break;
            case "DOWN":
              grid[segment.y][segment.x] = "v";
              break;
            case "LEFT":
              grid[segment.y][segment.x] = "<";
              break;
            case "RIGHT":
              grid[segment.y][segment.x] = ">";
              break;
          }
        } else {
          grid[segment.y][segment.x] = "o";
        }
      }
    });

    return grid;
  };

  // Render cell with appropriate color
  const getCellColor = (char: string) => {
    switch (char) {
      case "^":
      case "v":
      case "<":
      case ">":
        return "text-green-400"; // Snake head
      case "o":
        return "text-green-600"; // Snake body
      case "*":
        return "text-red-400"; // Food
      case "+":
      case "-":
      case "|":
        return "text-gray-600"; // Walls
      default:
        return "text-gray-800"; // Empty space
    }
  };

  // Start screen
  if (!gameStarted && !gameOver) {
    return (
      <div className="flex h-full flex-col bg-[#1e1e1e] p-4 font-mono text-sm text-[#D4D4D4]">
        <div className="text-cyan-400">$ ./snake --play</div>
        <div className="mt-2 text-gray-400">
          <pre className="text-green-400">{`
   _____ _   _          _  ________
  / ____| \\ | |   /\\   | |/ /  ____|
 | (___ |  \\| |  /  \\  | ' /| |__
  \\___ \\| . \` | / /\\ \\ |  < |  __|
  ____) | |\\  |/ ____ \\| . \\| |____
 |_____/|_| \\_/_/    \\_\\_|\\_\\______|

`}</pre>
        </div>
        <div className="mt-2 text-gray-400">
          <span className="text-yellow-400">HIGH SCORE:</span> {highScore}
        </div>
        <div className="mt-4 border border-gray-700 p-3">
          <div className="text-cyan-400">CONTROLS:</div>
          <div className="mt-2 text-gray-400">
            <div>
              <span className="text-white">W/A/S/D</span> or{" "}
              <span className="text-white">Arrow Keys</span> or{" "}
              <span className="text-white">H/J/K/L</span> - Move
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
              <span className="text-green-400">{">"}</span> = Snake Head
            </div>
            <div>
              <span className="text-green-600">o</span> = Snake Body
            </div>
            <div>
              <span className="text-red-400">*</span> = Food (+10 points)
            </div>
          </div>
        </div>
        <div className="mt-4 animate-pulse text-yellow-400">Press ENTER or SPACE to start...</div>
      </div>
    );
  }

  const grid = renderGrid();

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e] p-2 font-mono text-[#D4D4D4]">
      {/* Terminal header */}
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-cyan-400">$ snake --playing</span>
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
          <span className="text-gray-500">LEN:</span>{" "}
          <span className="text-cyan-400">{snake.length.toString().padStart(3, "0")}</span>
        </span>
      </div>

      {/* Game grid */}
      <div className="relative flex-1 overflow-hidden">
        <pre className="text-xs leading-none md:text-sm">
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

        {/* Pause overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="border border-yellow-400 p-4 text-center">
              <div className="text-xl text-yellow-400">== PAUSED ==</div>
              <div className="mt-2 text-sm text-gray-400">Press P to resume</div>
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="border border-red-400 p-4 text-center">
              <pre className="text-red-400">{`
  ___   _   __  __ ___    _____   _____ ___
 / __| /_\\ |  \\/  | __|  / _ \\ \\ / / __| _ \\
| (_ |/ _ \\| |\\/| | _|  | (_) \\ V /| _||   /
 \\___/_/ \\_\\_|  |_|___|  \\___/ \\_/ |___|_|_\\
`}</pre>
              <div className="mt-2 text-gray-400">
                <span className="text-yellow-400">FINAL SCORE:</span> {score}
              </div>
              {score > 0 && score >= highScore && (
                <div className="mt-1 animate-pulse text-green-400">NEW HIGH SCORE!</div>
              )}
              <div className="mt-3 text-sm text-gray-500">
                Press <span className="text-white">ENTER</span> to retry or{" "}
                <span className="text-white">Q</span> to quit
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div className="mt-2 grid grid-cols-3 gap-1 text-center text-xs md:hidden">
        <div />
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            if (directionRef.current !== "DOWN") {
              directionRef.current = "UP";
              setDirection("UP");
            }
          }}
          className="rounded border border-gray-600 bg-gray-800 py-2 active:bg-gray-700"
        >
          W
        </button>
        <div />
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            if (directionRef.current !== "RIGHT") {
              directionRef.current = "LEFT";
              setDirection("LEFT");
            }
          }}
          className="rounded border border-gray-600 bg-gray-800 py-2 active:bg-gray-700"
        >
          A
        </button>
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            if (directionRef.current !== "UP") {
              directionRef.current = "DOWN";
              setDirection("DOWN");
            }
          }}
          className="rounded border border-gray-600 bg-gray-800 py-2 active:bg-gray-700"
        >
          S
        </button>
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            if (directionRef.current !== "LEFT") {
              directionRef.current = "RIGHT";
              setDirection("RIGHT");
            }
          }}
          className="rounded border border-gray-600 bg-gray-800 py-2 active:bg-gray-700"
        >
          D
        </button>
      </div>
    </div>
  );
};
