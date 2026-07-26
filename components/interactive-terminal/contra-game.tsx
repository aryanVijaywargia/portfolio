import { FC, useCallback, useEffect, useRef, useState } from "react";
import { CONTRA_MISSION_COMPLETE_KEY, isContraMissionComplete } from "./rescue-progress";

type GameStatus = "briefing" | "playing" | "paused" | "dead" | "won";
type EnemyKind = "runner" | "turret" | "core";

type Player = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: -1 | 1;
  health: number;
  invulnerableUntil: number;
};

type Enemy = {
  id: number;
  kind: EnemyKind;
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  spawnX: number;
  nextShotAt: number;
  alive: boolean;
};

type Projectile = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type Pickup = {
  id: number;
  x: number;
  y: number;
  collected: boolean;
};

type GameModel = {
  status: GameStatus;
  player: Player;
  enemies: Enemy[];
  playerShots: Projectile[];
  enemyShots: Projectile[];
  pickups: Pickup[];
  cameraX: number;
  score: number;
  lastFrameAt: number;
  nextPlayerShotAt: number;
  nextProjectileId: number;
  jumpLatched: boolean;
  missionWasAlreadyComplete: boolean;
};

interface ContraGameProps {
  onGameEnd: () => void;
  onMissionComplete?: () => void;
}

const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 340;
const WORLD_WIDTH = 2600;
const GROUND_Y = 278;
const PLAYER_WIDTH = 26;
const PLAYER_HEIGHT = 44;
const PLAYER_SPEED = 235;
const JUMP_SPEED = 485;
const GRAVITY = 1250;
const MAX_HEALTH = 3;
const CORE_X = 2328;

const PLATFORMS = [
  { x: 365, y: 226, width: 150, height: 12 },
  { x: 835, y: 211, width: 180, height: 12 },
  { x: 1360, y: 230, width: 155, height: 12 },
  { x: 1855, y: 202, width: 170, height: 12 },
];

const createEnemies = (): Enemy[] => [
  {
    id: 1,
    kind: "runner",
    x: 520,
    y: GROUND_Y - 38,
    width: 24,
    height: 38,
    hp: 1,
    maxHp: 1,
    spawnX: 520,
    nextShotAt: 900,
    alive: true,
  },
  {
    id: 2,
    kind: "turret",
    x: 730,
    y: GROUND_Y - 31,
    width: 30,
    height: 31,
    hp: 2,
    maxHp: 2,
    spawnX: 730,
    nextShotAt: 1300,
    alive: true,
  },
  {
    id: 3,
    kind: "runner",
    x: 990,
    y: GROUND_Y - 38,
    width: 24,
    height: 38,
    hp: 1,
    maxHp: 1,
    spawnX: 990,
    nextShotAt: 1600,
    alive: true,
  },
  {
    id: 4,
    kind: "runner",
    x: 1215,
    y: GROUND_Y - 38,
    width: 24,
    height: 38,
    hp: 1,
    maxHp: 1,
    spawnX: 1215,
    nextShotAt: 1100,
    alive: true,
  },
  {
    id: 5,
    kind: "turret",
    x: 1480,
    y: GROUND_Y - 31,
    width: 30,
    height: 31,
    hp: 2,
    maxHp: 2,
    spawnX: 1480,
    nextShotAt: 1400,
    alive: true,
  },
  {
    id: 6,
    kind: "runner",
    x: 1715,
    y: GROUND_Y - 38,
    width: 24,
    height: 38,
    hp: 1,
    maxHp: 1,
    spawnX: 1715,
    nextShotAt: 1200,
    alive: true,
  },
  {
    id: 7,
    kind: "turret",
    x: 2025,
    y: GROUND_Y - 31,
    width: 30,
    height: 31,
    hp: 2,
    maxHp: 2,
    spawnX: 2025,
    nextShotAt: 1000,
    alive: true,
  },
  {
    id: 8,
    kind: "runner",
    x: 2160,
    y: GROUND_Y - 38,
    width: 24,
    height: 38,
    hp: 1,
    maxHp: 1,
    spawnX: 2160,
    nextShotAt: 1500,
    alive: true,
  },
  {
    id: 9,
    kind: "core",
    x: CORE_X,
    y: GROUND_Y - 86,
    width: 58,
    height: 86,
    hp: 10,
    maxHp: 10,
    spawnX: CORE_X,
    nextShotAt: 1800,
    alive: true,
  },
];

const createGame = (status: GameStatus = "briefing"): GameModel => ({
  status,
  player: {
    x: 70,
    y: GROUND_Y - PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    facing: 1,
    health: MAX_HEALTH,
    invulnerableUntil: 0,
  },
  enemies: createEnemies(),
  playerShots: [],
  enemyShots: [],
  pickups: [
    { id: 1, x: 1080, y: GROUND_Y - 18, collected: false },
    { id: 2, x: 1805, y: GROUND_Y - 18, collected: false },
  ],
  cameraX: 0,
  score: 0,
  lastFrameAt: 0,
  nextPlayerShotAt: 0,
  nextProjectileId: 100,
  jumpLatched: false,
  missionWasAlreadyComplete: isContraMissionComplete(),
});

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const overlaps = (
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

const isStanding = (player: Player) => {
  const feet = player.y + PLAYER_HEIGHT;
  if (Math.abs(feet - GROUND_Y) < 2) return true;

  return PLATFORMS.some(
    (platform) =>
      Math.abs(feet - platform.y) < 3 &&
      player.x + PLAYER_WIDTH > platform.x &&
      player.x < platform.x + platform.width
  );
};

const playerControls = {
  left: ["arrowleft", "a"],
  right: ["arrowright", "d"],
  jump: ["arrowup", "w", " "],
  shoot: ["j", "x", "z"],
};

const hasPressed = (pressed: Set<string>, controls: string[]) =>
  controls.some((control) => pressed.has(control));

export const ContraGame: FC<ContraGameProps> = ({ onGameEnd, onMissionComplete }) => {
  const gameRef = useRef<GameModel>(createGame());
  const pressedRef = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number | null>(null);
  const [, setRenderTick] = useState(0);

  const forceRender = useCallback(() => setRenderTick((tick) => tick + 1), []);

  const startGame = useCallback(() => {
    gameRef.current = createGame("playing");
    pressedRef.current.clear();
    forceRender();
  }, [forceRender]);

  const setPaused = useCallback((paused: boolean) => {
    const game = gameRef.current;
    if (paused && game.status === "playing") {
      game.status = "paused";
      game.lastFrameAt = 0;
    } else if (!paused && game.status === "paused") {
      game.status = "playing";
      game.lastFrameAt = 0;
    }
    pressedRef.current.clear();
    forceRender();
  }, [forceRender]);

  const finishMission = useCallback(() => {
    const game = gameRef.current;
    if (game.status === "won") return;

    game.status = "won";
    game.score += 2500;
    game.lastFrameAt = 0;
    pressedRef.current.clear();
    window.localStorage.setItem(CONTRA_MISSION_COMPLETE_KEY, "true");
    onMissionComplete?.();
    forceRender();
  }, [forceRender, onMissionComplete]);

  const loseMission = useCallback(() => {
    const game = gameRef.current;
    game.status = "dead";
    game.lastFrameAt = 0;
    pressedRef.current.clear();
    forceRender();
  }, [forceRender]);

  const damagePlayer = useCallback((now: number, direction: -1 | 1) => {
    const game = gameRef.current;
    const player = game.player;
    if (now < player.invulnerableUntil || game.status !== "playing") return;

    player.health -= 1;
    player.invulnerableUntil = now + 1100;
    player.vx = direction * 150;
    player.vy = -235;

    if (player.health <= 0) {
      loseMission();
    }
  }, [loseMission]);

  const updateGame = useCallback((timestamp: number) => {
    const game = gameRef.current;
    if (game.status !== "playing") return;

    const delta = game.lastFrameAt ? Math.min(0.034, (timestamp - game.lastFrameAt) / 1000) : 0.016;
    game.lastFrameAt = timestamp;

    const player = game.player;
    const pressed = pressedRef.current;
    const movingLeft = hasPressed(pressed, playerControls.left);
    const movingRight = hasPressed(pressed, playerControls.right);
    const wantsToJump = hasPressed(pressed, playerControls.jump);
    const wantsToShoot = hasPressed(pressed, playerControls.shoot);

    if (movingLeft !== movingRight) {
      player.vx = movingLeft ? -PLAYER_SPEED : PLAYER_SPEED;
      player.facing = movingLeft ? -1 : 1;
    } else {
      player.vx *= Math.pow(0.0001, delta);
    }

    if (wantsToJump && !game.jumpLatched && isStanding(player)) {
      player.vy = -JUMP_SPEED;
      game.jumpLatched = true;
    }
    if (!wantsToJump) game.jumpLatched = false;

    if (wantsToShoot && timestamp >= game.nextPlayerShotAt) {
      game.playerShots.push({
        id: game.nextProjectileId++,
        x: player.x + (player.facing === 1 ? PLAYER_WIDTH : -8),
        y: player.y + 19,
        vx: player.facing * 620,
        vy: 0,
      });
      game.nextPlayerShotAt = timestamp + 190;
    }

    const previousBottom = player.y + PLAYER_HEIGHT;
    player.vy += GRAVITY * delta;
    player.x = clamp(player.x + player.vx * delta, 8, WORLD_WIDTH - PLAYER_WIDTH - 8);
    player.y += player.vy * delta;
    const nextBottom = player.y + PLAYER_HEIGHT;

    if (player.vy >= 0) {
      const landingPlatform = PLATFORMS.find(
        (platform) =>
          previousBottom <= platform.y + 3 &&
          nextBottom >= platform.y &&
          player.x + PLAYER_WIDTH > platform.x + 3 &&
          player.x < platform.x + platform.width - 3
      );

      if (landingPlatform) {
        player.y = landingPlatform.y - PLAYER_HEIGHT;
        player.vy = 0;
      } else if (nextBottom >= GROUND_Y) {
        player.y = GROUND_Y - PLAYER_HEIGHT;
        player.vy = 0;
      }
    }

    game.cameraX = clamp(player.x - 245, 0, WORLD_WIDTH - VIEW_WIDTH);

    game.enemies.forEach((enemy) => {
      if (!enemy.alive) return;

      const distanceToPlayer = player.x - enemy.x;
      if (enemy.kind === "runner" && Math.abs(distanceToPlayer) < 420) {
        const direction = distanceToPlayer < 0 ? -1 : 1;
        enemy.x = clamp(enemy.x + direction * 52 * delta, enemy.spawnX - 90, enemy.spawnX + 90);
      }

      const fireRange = enemy.kind === "core" ? 650 : 470;
      if (Math.abs(distanceToPlayer) < fireRange && timestamp >= enemy.nextShotAt) {
        const direction = distanceToPlayer < 0 ? -1 : 1;
        const speed = enemy.kind === "core" ? 300 : 245;
        game.enemyShots.push({
          id: game.nextProjectileId++,
          x: enemy.x + enemy.width / 2,
          y: enemy.y + (enemy.kind === "core" ? 34 : 14),
          vx: direction * speed,
          vy: enemy.kind === "core" && enemy.hp <= 5 ? -35 : 0,
        });
        enemy.nextShotAt = timestamp + (enemy.kind === "core" ? 720 : 1250 + (enemy.id % 3) * 240);
      }

      if (
        enemy.kind !== "core" &&
        overlaps({ x: player.x, y: player.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }, enemy)
      ) {
        damagePlayer(timestamp, player.x < enemy.x ? -1 : 1);
      }
    });

    const survivingPlayerShots: Projectile[] = [];
    game.playerShots.forEach((shot) => {
      shot.x += shot.vx * delta;
      const target = game.enemies.find(
        (enemy) => enemy.alive && overlaps({ x: shot.x, y: shot.y, width: 10, height: 4 }, enemy)
      );

      if (target) {
        target.hp -= 1;
        if (target.hp <= 0) {
          target.alive = false;
          game.score += target.kind === "core" ? 1000 : target.kind === "turret" ? 250 : 150;
          if (target.kind === "core") finishMission();
        }
      } else if (shot.x > game.cameraX - 60 && shot.x < game.cameraX + VIEW_WIDTH + 60) {
        survivingPlayerShots.push(shot);
      }
    });
    game.playerShots = survivingPlayerShots;

    const survivingEnemyShots: Projectile[] = [];
    game.enemyShots.forEach((shot) => {
      shot.x += shot.vx * delta;
      shot.y += shot.vy * delta;

      const hitPlayer = overlaps(
        { x: shot.x, y: shot.y, width: 9, height: 5 },
        { x: player.x, y: player.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }
      );
      if (hitPlayer) {
        damagePlayer(timestamp, shot.vx < 0 ? -1 : 1);
      } else if (
        shot.x > game.cameraX - 80 &&
        shot.x < game.cameraX + VIEW_WIDTH + 80 &&
        shot.y > 0 &&
        shot.y < GROUND_Y
      ) {
        survivingEnemyShots.push(shot);
      }
    });
    game.enemyShots = survivingEnemyShots;

    game.pickups.forEach((pickup) => {
      if (
        !pickup.collected &&
        overlaps(
          { x: player.x, y: player.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT },
          { x: pickup.x, y: pickup.y, width: 18, height: 18 }
        )
      ) {
        pickup.collected = true;
        player.health = Math.min(MAX_HEALTH, player.health + 1);
        game.score += 100;
      }
    });

    forceRender();
  }, [damagePlayer, finishMission, forceRender]);

  const status = gameRef.current.status;
  useEffect(() => {
    if (status !== "playing") return undefined;

    const frame = (timestamp: number) => {
      updateGame(timestamp);
      if (gameRef.current.status === "playing") {
        animationFrameRef.current = window.requestAnimationFrame(frame);
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(frame);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status, updateGame]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const game = gameRef.current;

      if (["arrowleft", "arrowright", "arrowup", " "].includes(key)) {
        event.preventDefault();
      }

      if (key === "escape" || key === "q") {
        event.preventDefault();
        onGameEnd();
        return;
      }

      if (key === "p" && (game.status === "playing" || game.status === "paused")) {
        event.preventDefault();
        setPaused(game.status === "playing");
        return;
      }

      if (
        (key === "enter" || key === " ") &&
        (game.status === "briefing" || game.status === "dead")
      ) {
        event.preventDefault();
        startGame();
        return;
      }

      pressedRef.current.add(key);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedRef.current.delete(event.key.toLowerCase());
    };

    const handleBlur = () => {
      if (gameRef.current.status === "playing") setPaused(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [onGameEnd, setPaused, startGame]);

  const setTouchControl = (control: keyof typeof playerControls, pressed: boolean) => {
    const key = playerControls[control][0];
    if (pressed) {
      pressedRef.current.add(key);
    } else {
      pressedRef.current.delete(key);
    }
  };

  const bindTouchControl = (control: keyof typeof playerControls) => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setTouchControl(control, true);
    },
    onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setTouchControl(control, false);
    },
    onPointerCancel: () => setTouchControl(control, false),
  });

  const game = gameRef.current;
  const core = game.enemies.find((enemy) => enemy.kind === "core");
  const defeatedEnemies = game.enemies.filter(
    (enemy) => !enemy.alive && enemy.kind !== "core"
  ).length;
  const missionProgress = Math.round((game.player.x / CORE_X) * 100);

  if (game.status === "briefing") {
    return (
      <div className="contra-shell flex h-full flex-col overflow-y-auto bg-[#070b08] p-4 font-mono text-[#d9f99d] sm:p-6">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-lime-500 sm:text-xs">
          <span>$ ./contra --rescue-rick</span>
          <span className="text-red-400">Lock 01 // active</span>
        </div>

        <div className="my-auto grid gap-5 py-5 sm:grid-cols-[1.15fr_0.85fr] sm:items-center">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.36em] text-amber-300">
              Morty mission file 001
            </p>
            <h2 className="contra-title text-4xl font-black uppercase leading-[0.82] text-[#f5f0c9] sm:text-6xl">
              Contra
              <span className="block text-red-500">Terminal Assault</span>
            </h2>
            <p className="mt-4 max-w-lg text-xs leading-relaxed text-lime-100/60 sm:text-sm">
              Rick is trapped behind a chain of retro game locks. Run the jungle, survive the
              defense line, and destroy the fortress core to break the first lock.
            </p>
          </div>

          <div className="border-l-2 border-lime-400/30 pl-4 text-xs text-lime-100/65 sm:text-sm">
            <div className="mb-3 text-lime-300">MISSION OBJECTIVE</div>
            <div>01 / Reach the fortress</div>
            <div>02 / Destroy the portal core</div>
            <div>03 / Recover Rick&apos;s rescue key</div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <span>
                <b className="text-white">A/D</b> RUN
              </span>
              <span>
                <b className="text-white">W/↑</b> JUMP
              </span>
              <span>
                <b className="text-white">J/X</b> FIRE
              </span>
              <span>
                <b className="text-white">P</b> PAUSE
              </span>
            </div>
          </div>
        </div>

        {game.missionWasAlreadyComplete && (
          <div className="mb-3 border-l-2 border-cyan-400 bg-cyan-400/5 px-3 py-2 text-xs text-cyan-300">
            LOCK 01 ALREADY OPEN // Replay available
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={startGame}
            className="contra-start border-2 border-lime-300 bg-lime-300 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#071007] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            Deploy Morty
          </button>
          <button
            onClick={onGameEnd}
            className="px-3 py-2 text-xs text-lime-100/45 hover:text-white"
          >
            Q / ESC — Abort
          </button>
          <span className="hidden animate-pulse text-[10px] uppercase tracking-[0.25em] text-amber-300 sm:inline">
            Enter or space to start
          </span>
        </div>

        <style jsx>{`
          .contra-shell {
            background-image: repeating-linear-gradient(
                0deg,
                rgba(163, 230, 53, 0.025) 0,
                rgba(163, 230, 53, 0.025) 1px,
                transparent 1px,
                transparent 4px
              ),
              radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.12), transparent 35%);
          }
          .contra-title {
            font-family: "Azeret Mono", monospace;
            letter-spacing: -0.08em;
            text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.8);
          }
          .contra-start {
            box-shadow: 5px 5px 0 #365314;
          }
          .contra-start:active {
            transform: translate(3px, 3px);
            box-shadow: 2px 2px 0 #365314;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="contra-game flex h-full select-none flex-col bg-[#050806] font-mono text-lime-100">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-lime-300/20 bg-black/75 px-2 text-[9px] uppercase tracking-wider sm:px-3 sm:text-[11px]">
        <span className="text-lime-300">Morty // Jungle sector</span>
        <div className="flex items-center gap-2 sm:gap-4">
          <span>
            HP <b className="text-red-400">{"♥".repeat(Math.max(0, game.player.health))}</b>
            <b className="text-white/15">
              {"♥".repeat(MAX_HEALTH - Math.max(0, game.player.health))}
            </b>
          </span>
          <span className="hidden sm:inline">
            KILLS <b className="text-amber-300">{defeatedEnemies}/8</b>
          </span>
          <span>
            SCORE <b className="text-white">{game.score.toString().padStart(5, "0")}</b>
          </span>
          <button onClick={onGameEnd} className="text-white/40 hover:text-white">
            Q EXIT
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#07110c]">
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Contra-style side scrolling rescue mission starring Morty"
          style={{ imageRendering: "pixelated" }}
        >
          <defs>
            <linearGradient id="contraSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#07160f" />
              <stop offset="68%" stopColor="#18331f" />
              <stop offset="100%" stopColor="#345126" />
            </linearGradient>
            <linearGradient id="contraGround" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#688636" />
              <stop offset="13%" stopColor="#344e25" />
              <stop offset="100%" stopColor="#101b13" />
            </linearGradient>
            <pattern id="groundNoise" width="32" height="18" patternUnits="userSpaceOnUse">
              <rect width="32" height="18" fill="transparent" />
              <rect x="3" y="4" width="7" height="3" fill="#263a22" />
              <rect x="20" y="11" width="9" height="2" fill="#52703a" />
            </pattern>
          </defs>

          <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="url(#contraSky)" />
          <circle cx="675" cy="62" r="31" fill="#d8e7b0" opacity="0.12" />

          <g transform={`translate(${-game.cameraX * 0.16}, 0)`} opacity="0.48">
            {[0, 350, 720, 1090, 1450, 1810, 2170, 2520].map((x, index) => (
              <path
                key={x}
                d={`M${x} 236 L${x + 130} ${index % 2 ? 102 : 128} L${x + 285} 236 Z`}
                fill={index % 2 ? "#142f22" : "#183824"}
              />
            ))}
          </g>

          <g transform={`translate(${-game.cameraX * 0.42}, 0)`} opacity="0.72">
            {[40, 260, 600, 910, 1260, 1580, 1930, 2250, 2570].map((x, index) => (
              <g key={x} transform={`translate(${x}, 0)`}>
                <rect x="0" y={118 + (index % 3) * 14} width="17" height="124" fill="#142417" />
                <path d="M8 125 L-44 185 H58 Z" fill="#214529" />
                <path d="M9 155 L-64 221 H80 Z" fill="#1b3823" />
              </g>
            ))}
          </g>

          <g transform={`translate(${-game.cameraX}, 0)`} shapeRendering="crispEdges">
            <rect
              x="0"
              y={GROUND_Y}
              width={WORLD_WIDTH}
              height={VIEW_HEIGHT - GROUND_Y}
              fill="url(#contraGround)"
            />
            <rect
              x="0"
              y={GROUND_Y}
              width={WORLD_WIDTH}
              height={VIEW_HEIGHT - GROUND_Y}
              fill="url(#groundNoise)"
            />
            <rect x="0" y={GROUND_Y} width={WORLD_WIDTH} height="5" fill="#93b84b" />

            {[180, 680, 1160, 1640, 2110].map((x) => (
              <g key={x} transform={`translate(${x}, 0)`} opacity="0.82">
                <rect x="0" y="224" width="13" height="54" fill="#20381e" />
                <rect x="-8" y="211" width="29" height="20" fill="#2f5a28" />
                <rect x="8" y="196" width="35" height="24" fill="#3b6a2d" />
                <rect x="-27" y="204" width="31" height="21" fill="#365e2a" />
              </g>
            ))}

            {PLATFORMS.map((platform) => (
              <g key={platform.x}>
                <rect {...platform} fill="#263325" />
                <rect
                  x={platform.x}
                  y={platform.y}
                  width={platform.width}
                  height="4"
                  fill="#9aaa52"
                />
                {Array.from({ length: Math.floor(platform.width / 24) }).map((_, index) => (
                  <rect
                    key={index}
                    x={platform.x + 7 + index * 24}
                    y={platform.y + 5}
                    width="11"
                    height="4"
                    fill="#53633a"
                  />
                ))}
              </g>
            ))}

            <g transform="translate(2278, 0)">
              <rect x="0" y="143" width="176" height="135" fill="#121713" />
              <rect x="0" y="143" width="176" height="12" fill="#5a6658" />
              <rect x="17" y="169" width="142" height="109" fill="#222b23" />
              {[25, 62, 99, 136].map((x) => (
                <rect key={x} x={x} y="155" width="8" height="123" fill="#3b453c" />
              ))}
              <rect x="-10" y="132" width="196" height="11" fill="#272e28" />
            </g>

            <g transform="translate(2482, 176)">
              <rect
                x="0"
                y="0"
                width="74"
                height="102"
                fill="#07100e"
                stroke="#22d3ee"
                strokeWidth="4"
              />
              {[13, 29, 45, 61].map((x) => (
                <rect key={x} x={x} y="0" width="3" height="102" fill="#67e8f9" opacity="0.65" />
              ))}
              <g transform="translate(23, 29)">
                <path d="M3 3 L9 -8 L13 2 L20 -10 L20 5 L29 -3 L25 12" fill="#8ae5ef" />
                <rect x="5" y="8" width="22" height="20" fill="#d6c5a2" />
                <rect x="3" y="28" width="27" height="34" fill="#dbe3e1" />
                <rect x="10" y="25" width="10" height="11" fill="#8cc7d1" />
              </g>
              <text x="37" y="-9" textAnchor="middle" fill="#67e8f9" fontSize="9">
                RICK // LOCKED
              </text>
            </g>

            {game.pickups
              .filter((pickup) => !pickup.collected)
              .map((pickup) => (
                <g key={pickup.id} transform={`translate(${pickup.x}, ${pickup.y})`}>
                  <rect width="18" height="18" fill="#e8f5e9" stroke="#ef4444" strokeWidth="2" />
                  <rect x="7" y="3" width="4" height="12" fill="#ef4444" />
                  <rect x="3" y="7" width="12" height="4" fill="#ef4444" />
                </g>
              ))}

            {game.enemies
              .filter((enemy) => enemy.alive)
              .map((enemy) =>
                enemy.kind === "core"
                  ? <g key={enemy.id} transform={`translate(${enemy.x}, ${enemy.y})`}>
                      <rect
                        width={enemy.width}
                        height={enemy.height}
                        fill="#171c18"
                        stroke="#798078"
                        strokeWidth="4"
                      />
                      <rect
                        x="9"
                        y="11"
                        width="40"
                        height="53"
                        fill="#351414"
                        stroke="#ef4444"
                        strokeWidth="3"
                      />
                      <rect
                        x="18"
                        y="20"
                        width="22"
                        height="36"
                        fill="#ef4444"
                        opacity={enemy.hp <= 5 ? 0.95 : 0.62}
                        className="core-pulse"
                      />
                      <rect x="0" y="67" width="58" height="19" fill="#323932" />
                      <rect x="-8" y="75" width="15" height="8" fill="#606860" />
                      <text x="29" y="-9" textAnchor="middle" fill="#fca5a5" fontSize="9">
                        PORTAL CORE
                      </text>
                    </g>
                  : enemy.kind === "turret"
                  ? <g key={enemy.id} transform={`translate(${enemy.x}, ${enemy.y})`}>
                      <rect x="4" y="8" width="22" height="23" fill="#7f1d1d" />
                      <rect x="0" y="3" width="30" height="8" fill="#b91c1c" />
                      <rect
                        x={game.player.x < enemy.x ? -13 : 24}
                        y="6"
                        width="19"
                        height="5"
                        fill="#d1d5db"
                      />
                      <rect x="5" y="26" width="20" height="5" fill="#374151" />
                    </g>
                  : <g key={enemy.id} transform={`translate(${enemy.x}, ${enemy.y})`}>
                      <rect x="5" y="0" width="17" height="13" fill="#d6aa83" />
                      <rect x="2" y="1" width="23" height="5" fill="#ef4444" />
                      <rect x="4" y="13" width="19" height="18" fill="#7f1d1d" />
                      <rect
                        x={game.player.x < enemy.x ? -8 : 21}
                        y="16"
                        width="13"
                        height="4"
                        fill="#d1d5db"
                      />
                      <rect x="5" y="31" width="6" height="7" fill="#29352c" />
                      <rect x="16" y="31" width="6" height="7" fill="#29352c" />
                    </g>
              )}

            {game.playerShots.map((shot) => (
              <g key={shot.id} transform={`translate(${shot.x}, ${shot.y})`}>
                <rect width="12" height="4" fill="#fde047" />
                <rect
                  x={shot.vx > 0 ? -7 : 9}
                  y="1"
                  width="8"
                  height="2"
                  fill="#f97316"
                  opacity="0.7"
                />
              </g>
            ))}

            {game.enemyShots.map((shot) => (
              <g key={shot.id} transform={`translate(${shot.x}, ${shot.y})`}>
                <rect width="9" height="5" fill="#fb7185" />
                <rect
                  x={shot.vx > 0 ? -5 : 7}
                  y="1"
                  width="6"
                  height="3"
                  fill="#ef4444"
                  opacity="0.6"
                />
              </g>
            ))}

            <g
              transform={`translate(${game.player.x}, ${game.player.y}) scale(${game.player.facing}, 1)`}
              opacity={
                game.player.invulnerableUntil > game.lastFrameAt &&
                Math.floor(game.lastFrameAt / 90) % 2 === 0
                  ? 0.25
                  : 1
              }
            >
              <rect x="-10" y="18" width="15" height="5" fill="#a3a3a3" />
              <rect x="5" y="0" width="19" height="17" fill="#f1c7a3" />
              <rect x="3" y="0" width="23" height="6" fill="#5b3927" />
              <rect x="6" y="5" width="4" height="3" fill="#111827" />
              <rect x="4" y="17" width="21" height="20" fill="#facc15" />
              <rect x="-1" y="18" width="9" height="6" fill="#f1c7a3" />
              <rect x="5" y="37" width="7" height="7" fill="#2563eb" />
              <rect x="18" y="37" width="7" height="7" fill="#2563eb" />
            </g>
          </g>

          <g transform="translate(18, 18)">
            <rect width="202" height="7" fill="#111827" opacity="0.85" />
            <rect width={202 * clamp(missionProgress / 100, 0, 1)} height="7" fill="#a3e635" />
            <text x="0" y="20" fill="#bef264" fontSize="9">
              FORTRESS {clamp(missionProgress, 0, 100)}%
            </text>
          </g>

          {core?.alive && game.cameraX > 1700 && (
            <g transform="translate(555, 18)">
              <text x="0" y="8" fill="#fca5a5" fontSize="9">
                LOCK CORE
              </text>
              <rect x="70" y="0" width="150" height="8" fill="#291414" />
              <rect x="70" y="0" width={(150 * core.hp) / core.maxHp} height="8" fill="#ef4444" />
            </g>
          )}
        </svg>

        <div className="scanlines pointer-events-none absolute inset-0" aria-hidden="true" />

        {game.status === "paused" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/75 p-4">
            <div className="border-y-2 border-amber-300 px-8 py-5 text-center">
              <div className="text-2xl font-black uppercase tracking-[0.24em] text-amber-300">
                Paused
              </div>
              <button
                onClick={() => setPaused(false)}
                className="mt-3 text-xs text-white/60 hover:text-white"
              >
                P / TAP TO RESUME
              </button>
            </div>
          </div>
        )}

        {game.status === "dead" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#120506]/90 p-4 text-center">
            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-red-300">
                Signal lost
              </div>
              <div className="mt-1 text-4xl font-black uppercase text-red-500 sm:text-5xl">
                Morty Down
              </div>
              <div className="mt-3 text-xs text-white/55">
                The lock reset. Rick is still trapped.
              </div>
              <button
                onClick={startGame}
                className="mt-5 border-2 border-red-400 bg-red-400 px-5 py-2 text-xs font-black uppercase tracking-widest text-black hover:bg-white"
              >
                Retry mission
              </button>
              <button
                onClick={onGameEnd}
                className="ml-3 px-3 py-2 text-xs text-white/45 hover:text-white"
              >
                Exit
              </button>
            </div>
          </div>
        )}

        {game.status === "won" && (
          <div className="victory-overlay absolute inset-0 flex items-center justify-center bg-[#02100d]/92 p-4 text-center">
            <div className="max-w-lg">
              <div className="text-[10px] uppercase tracking-[0.4em] text-cyan-300">
                Rescue protocol updated
              </div>
              <div className="mt-2 text-4xl font-black uppercase leading-none text-lime-300 sm:text-5xl">
                Lock 01 Broken
              </div>
              <div className="mx-auto my-4 h-px w-28 bg-cyan-300/50" />
              <p className="text-sm leading-relaxed text-white/70">
                Contra cleared. Morty recovered the first rescue key. Rick is one game closer to
                freedom.
              </p>
              <div className="mt-3 text-xs text-amber-300">FINAL SCORE // {game.score}</div>
              <button
                onClick={onGameEnd}
                className="mt-5 border-2 border-lime-300 bg-lime-300 px-5 py-2 text-xs font-black uppercase tracking-widest text-black hover:bg-white"
              >
                Return to missions
              </button>
            </div>
          </div>
        )}
      </div>

      {game.status === "playing" && (
        <div className="grid h-[62px] shrink-0 grid-cols-[1fr_1fr_1.15fr_1.15fr] gap-1 border-t border-lime-300/20 bg-black p-1.5 text-[10px] font-bold uppercase md:hidden">
          <button
            {...bindTouchControl("left")}
            className="touch-button border border-lime-400/35 bg-lime-950/70 active:bg-lime-400 active:text-black"
          >
            ◀ Run
          </button>
          <button
            {...bindTouchControl("right")}
            className="touch-button border border-lime-400/35 bg-lime-950/70 active:bg-lime-400 active:text-black"
          >
            Run ▶
          </button>
          <button
            {...bindTouchControl("jump")}
            className="touch-button border border-cyan-400/35 bg-cyan-950/70 text-cyan-200 active:bg-cyan-300 active:text-black"
          >
            ▲ Jump
          </button>
          <button
            {...bindTouchControl("shoot")}
            className="touch-button border border-red-400/45 bg-red-950/70 text-red-200 active:bg-red-400 active:text-black"
          >
            ● Fire
          </button>
        </div>
      )}

      <style jsx>{`
        .contra-game {
          background-image: radial-gradient(
            circle at 50% 0%,
            rgba(163, 230, 53, 0.08),
            transparent 40%
          );
        }
        .scanlines {
          opacity: 0.14;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 3px,
            rgba(0, 0, 0, 0.75) 4px
          );
          mix-blend-mode: multiply;
        }
        .touch-button {
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }
        .victory-overlay {
          animation: victory-in 420ms steps(6, end) both;
        }
        :global(.core-pulse) {
          animation: core-pulse 0.55s steps(2, end) infinite;
        }
        @keyframes core-pulse {
          50% {
            opacity: 0.35;
          }
        }
        @keyframes victory-in {
          from {
            opacity: 0;
            transform: scale(1.08);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .victory-overlay,
          :global(.core-pulse) {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
