import type { BhopalMapData, MapAnchor } from "lib/boring/map/types";
import { GameInputController } from "lib/boring/input/actions";
import type { GamePhase } from "lib/boring/state/game-store";
import { FC, PointerEvent, useMemo } from "react";

import type { BoringMission } from "../boring-missions";
import type { PlayerTelemetry } from "./player-rig";

const svgPath = (points: [number, number][], close = false) =>
  `${points
    .map(([x, z], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${z.toFixed(2)}`)
    .join(" ")}${close ? " Z" : ""}`;

const MapMinimap: FC<{
  map: BhopalMapData;
  telemetry: PlayerTelemetry;
  target: MapAnchor;
  accent: string;
}> = ({ map, telemetry, target, accent }) => {
  const { minX, maxX, minZ, maxZ } = map.metadata.worldBounds;
  const width = maxX - minX;
  const height = maxZ - minZ;
  const paths = useMemo(() => {
    const roads = map.roads
      .filter(
        (road, index) =>
          !["residential", "service"].includes(road.className) ||
          (road.className === "residential" ? index % 8 === 0 : index % 20 === 0)
      )
      .map((road) => svgPath(road.points))
      .join(" ");
    const waters = map.waters.map((water) => svgPath(water.points, true)).join(" ");
    const railways = map.railways.map((railway) => svgPath(railway.points)).join(" ");
    return { roads, waters, railways };
  }, [map.railways, map.roads, map.waters]);

  return (
    <figure className="boring-minimap" aria-label="Central Bhopal GPS map">
      <svg
        viewBox={`${minX} ${minZ} ${width} ${height}`}
        role="img"
        aria-label={`Player heading toward ${target.label}`}
      >
        <path className="map-water" d={paths.waters} />
        <path className="map-rail" d={paths.railways} />
        <path className="map-roads" d={paths.roads} />
        <line
          className="map-route"
          x1={telemetry.x}
          y1={telemetry.z}
          x2={target.position[0]}
          y2={target.position[1]}
          style={{ stroke: accent }}
        />
        {map.landmarks.map((landmark) => (
          <circle
            key={landmark.id}
            className={`map-landmark map-landmark-${landmark.kind}`}
            cx={landmark.position[0]}
            cy={landmark.position[1]}
            r={landmark.id === "upper-lake" || landmark.id === "lower-lake" ? 0 : 0.75}
          >
            <title>{landmark.name}</title>
          </circle>
        ))}
        <rect
          className="map-target"
          x={target.position[0] - 1.25}
          y={target.position[1] - 1.25}
          width={2.5}
          height={2.5}
          transform={`rotate(45 ${target.position[0]} ${target.position[1]})`}
          style={{ stroke: accent }}
        />
        <path
          className="map-player"
          d={`M ${telemetry.x} ${telemetry.z - 1.8} L ${telemetry.x - 1.25} ${
            telemetry.z + 1.35
          } L ${telemetry.x} ${telemetry.z + 0.7} L ${telemetry.x + 1.25} ${telemetry.z + 1.35} Z`}
          transform={`rotate(${(telemetry.heading * 180) / Math.PI} ${telemetry.x} ${telemetry.z})`}
        />
      </svg>
      <figcaption>
        <span>N</span>
        <strong>{target.label}</strong>
      </figcaption>
    </figure>
  );
};

const TouchControls: FC<{ input: GameInputController; mode: PlayerTelemetry["mode"] }> = ({
  input,
  mode,
}) => {
  const bind = (control: "left" | "right" | "forward" | "backward" | "boost") => {
    const release = (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      input.setTouchControl(control, false);
    };
    return {
      onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        input.setTouchControl(control, true);
      },
      onPointerUp: release,
      onPointerCancel: release,
      onLostPointerCapture: release,
    };
  };
  return (
    <div className="boring-touch-controls" aria-label={`${mode} touch controls`}>
      <div className="touch-steer">
        <button type="button" aria-label="Move or steer left" {...bind("left")}>
          ←
        </button>
        <button type="button" aria-label="Move or steer right" {...bind("right")}>
          →
        </button>
      </div>
      <div className="touch-actions">
        <button
          type="button"
          className="touch-context"
          onPointerDown={() => input.trigger("interact")}
        >
          {mode === "driving" ? "EXIT" : "ENTER"}
        </button>
        <button
          type="button"
          aria-label={mode === "driving" ? "Accelerate" : "Move forward"}
          {...bind("forward")}
        >
          ↑
        </button>
        <button
          type="button"
          aria-label={mode === "driving" ? "Brake and reverse" : "Move backward"}
          {...bind("backward")}
        >
          ↓
        </button>
      </div>
    </div>
  );
};

type GameHudProps = {
  map: BhopalMapData;
  mission: BoringMission;
  missionIndex: number;
  phase: GamePhase;
  completedCount: number;
  telemetry: PlayerTelemetry;
  target: MapAnchor;
  input: GameInputController;
  caption: string;
  muted: boolean;
  onMuteToggle: () => void;
  onPause: () => void;
};

export const GameHud: FC<GameHudProps> = ({
  map,
  mission,
  missionIndex,
  phase,
  completedCount,
  telemetry,
  target,
  input,
  caption,
  muted,
  onMuteToggle,
  onPause,
}) => {
  const objective = phase === "mission-active" ? mission.activeObjective : mission.startObjective;
  return (
    <div className="boring-hud">
      <section className="boring-objective-panel" aria-live="polite">
        <span className="objective-stamp">CASE {mission.number} / 03</span>
        <p className="objective-label">CURRENT OBJECTIVE</p>
        <h2>{objective}</h2>
        <p className="objective-route">{mission.route}</p>
        <div
          className="objective-progress"
          aria-label={`${completedCount} of 3 missions completed`}
        >
          <i style={{ width: `${(completedCount / 3) * 100}%`, background: mission.accent }} />
        </div>
      </section>

      <nav className="boring-hud-actions" aria-label="Game actions">
        <div className="goodwill-meter" aria-label="Goodwill status">
          <span>GOODWILL</span>
          <strong>{100 + completedCount * 25}</strong>
        </div>
        <button type="button" onClick={onMuteToggle} aria-pressed={muted}>
          {muted ? "SOUND OFF" : "SOUND ON"}
        </button>
        <button type="button" onClick={onPause}>
          PDA / PAUSE
        </button>
      </nav>

      <MapMinimap map={map} telemetry={telemetry} target={target} accent={mission.accent} />

      <div className="boring-context-prompt">
        <span>{telemetry.mode === "driving" ? "E · EXIT VEHICLE" : "E · ENTER NEARBY AUTO"}</span>
        <small>{telemetry.mode === "driving" ? "DRIVE SAFELY" : "N · NAMASTE"}</small>
      </div>

      <div className="boring-caption" role="status" aria-live="polite">
        {caption}
      </div>
      <div className="boring-desktop-controls" aria-hidden="true">
        <span>WASD / ARROWS</span> MOVE <i /> <span>E</span> INTERACT <i /> <span>Q / R</span>{" "}
        CAMERA <i />
        <span>P</span> PDA
      </div>
      <TouchControls input={input} mode={telemetry.mode} />
      <span className="boring-district-readout">
        {map.districts[missionIndex]?.shortName ?? map.districts[0].shortName}
      </span>
    </div>
  );
};
