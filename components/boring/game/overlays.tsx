import type { BhopalMapData } from "lib/boring/map/types";
import type { DebugLayers, QualityLevel } from "lib/boring/state/game-store";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FC, useEffect, useRef, useState } from "react";

import { BORING_MISSIONS, BoringMission, GAME_LINKS } from "../boring-missions";

const motionProps = (reduced: boolean) =>
  reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 28, rotate: -0.7 },
        animate: { opacity: 1, y: 0, rotate: 0 },
        exit: { opacity: 0, y: 18, rotate: 0.4 },
      };

export const TitleOverlay: FC<{
  muted: boolean;
  onStart: () => void;
  onFreeRoam: () => void;
  onMuteToggle: () => void;
  onOpenDossier: () => void;
  onExit: () => void;
}> = ({ muted, onStart, onFreeRoam, onMuteToggle, onOpenDossier, onExit }) => {
  const reducedMotion = Boolean(useReducedMotion());
  return (
    <motion.section className="boring-title-overlay" {...motionProps(reducedMotion)}>
      <div className="title-paper-stripe" aria-hidden="true" />
      <div className="title-copy">
        <span className="title-kicker">AN ORIGINAL BHOPAL PORTFOLIO ADVENTURE</span>
        <p className="title-owner">ARYAN VIJAYWARGIA PRESENTS</p>
        <h1>
          <em>BORING</em>
          <strong>MODE</strong>
        </h1>
        <p className="title-subtitle">Three peaceful missions. One very serious résumé.</p>
        <div className="title-actions">
          <button type="button" className="comic-primary" onClick={onStart}>
            START THE STORY <b>→</b>
          </button>
          <button type="button" onClick={onFreeRoam}>
            FREE ROAM
          </button>
        </div>
        <div className="title-secondary-actions">
          <button type="button" onClick={onMuteToggle}>
            {muted ? "SOUND: OFF" : "SOUND: ON"}
          </button>
          <button type="button" onClick={onOpenDossier}>
            HTML DOSSIER
          </button>
          <button type="button" onClick={onExit}>
            EXIT
          </button>
        </div>
        <p className="title-controls">WASD / ARROWS · E INTERACT · N NAMASTE · P PDA</p>
      </div>
    </motion.section>
  );
};

export const MissionBriefingOverlay: FC<{
  mission: BoringMission;
  onAccept: () => void;
  onBack: () => void;
}> = ({ mission, onAccept, onBack }) => {
  const reducedMotion = Boolean(useReducedMotion());
  return (
    <motion.div
      className="boring-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.article
        className="boring-mission-brief"
        {...motionProps(reducedMotion)}
        aria-labelledby={`brief-${mission.id}`}
      >
        <div
          className="mission-comic-panel"
          style={{ background: mission.accent }}
          aria-hidden="true"
        >
          <span>{mission.number}</span>
          <i>BHOPAL DISPATCH</i>
        </div>
        <div className="mission-brief-copy">
          <p className="mission-stamp">
            MISSION {mission.number} · {mission.duration}
          </p>
          <h2 id={`brief-${mission.id}`}>{mission.title}</h2>
          <p className="mission-route">{mission.route}</p>
          <p>{mission.briefing}</p>
          <div className="mission-rule">
            <b>NO FAIL STATE</b>
            <span>Wrong turns reroute. Facts and progress never depend on a timer.</span>
          </div>
          <div className="mission-actions">
            <button type="button" className="comic-primary" onClick={onAccept}>
              ACCEPT MISSION <b>→</b>
            </button>
            <button type="button" onClick={onBack}>
              BACK TO FREE ROAM
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
};

export const MissionCompleteOverlay: FC<{
  mission: BoringMission;
  isLast: boolean;
  onNext: () => void;
  onFreeRoam: () => void;
  onReplay: () => void;
  onExit: () => void;
}> = ({ mission, isLast, onNext, onFreeRoam, onReplay, onExit }) => {
  const reducedMotion = Boolean(useReducedMotion());
  return (
    <motion.div
      className="boring-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.article className="boring-mission-complete" {...motionProps(reducedMotion)}>
        <div className="mission-passed-stamp">
          <span>MISSION</span>
          <strong>PASSED</strong>
          <i>GOODWILL +25</i>
        </div>
        <div className="mission-complete-copy">
          <p>{mission.factHeading} UNLOCKED</p>
          <h2>{mission.title}</h2>
          <ul>
            {mission.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <p className="mission-reward">
            <b>REWARD</b> {mission.reward}
          </p>
          {isLast
            ? <nav className="mission-final-links" aria-label="Portfolio finale links">
                {GAME_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </nav>
            : null}
          <div className="mission-actions">
            {!isLast
              ? <button type="button" className="comic-primary" onClick={onNext}>
                  NEXT MISSION <b>→</b>
                </button>
              : null}
            <button type="button" onClick={onFreeRoam}>
              FREE ROAM
            </button>
            <button type="button" onClick={onReplay}>
              REPLAY
            </button>
            <button type="button" onClick={onExit}>
              EXIT
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
};

const DEBUG_LABELS: Record<keyof DebugLayers, string> = {
  districtBounds: "District bounds",
  laneGraph: "Vehicle lane graph",
  pedestrianGraph: "Pedestrian graph",
  collisions: "Building collisions",
  anchors: "Stable anchors",
};

export const PdaOverlay: FC<{
  map: BhopalMapData;
  currentMissionIndex: number;
  completedMissionIds: string[];
  quality: QualityLevel;
  debugLayers: DebugLayers;
  onQualityChange: (quality: QualityLevel) => void;
  onDebugToggle: (key: keyof DebugLayers) => void;
  onResume: () => void;
  onOpenDossier: () => void;
  onExit: () => void;
}> = ({
  map,
  currentMissionIndex,
  completedMissionIds,
  quality,
  debugLayers,
  onQualityChange,
  onDebugToggle,
  onResume,
  onOpenDossier,
  onExit,
}) => {
  const [tab, setTab] = useState<"missions" | "controls" | "settings" | "credits">("missions");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
    const dialog = dialogRef.current;
    if (!dialog) return;
    const keepFocusInside = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex='-1'])"
        )
      ).filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener("keydown", keepFocusInside);
    return () => dialog.removeEventListener("keydown", keepFocusInside);
  }, []);
  return (
    <motion.div
      ref={dialogRef}
      className="boring-pda-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pda-heading"
    >
      <section className="boring-pda">
        <header>
          <div>
            <span>BHOPAL DISPATCH</span>
            <h2 id="pda-heading" ref={headingRef} tabIndex={-1}>
              PDA / PAUSED
            </h2>
          </div>
          <button type="button" className="comic-primary" onClick={onResume}>
            RESUME
          </button>
        </header>
        <nav className="pda-tabs" aria-label="PDA sections">
          {(["missions", "controls", "settings", "credits"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={tab === value ? "active" : ""}
              onClick={() => setTab(value)}
            >
              {value}
            </button>
          ))}
        </nav>
        <div className="pda-content">
          {tab === "missions"
            ? <div className="pda-missions">
                {BORING_MISSIONS.map((mission, index) => (
                  <article
                    key={mission.id}
                    className={index === currentMissionIndex ? "active" : ""}
                  >
                    <span>
                      {completedMissionIds.includes(mission.id)
                        ? "✓ COMPLETE"
                        : index === currentMissionIndex
                        ? "● ACTIVE"
                        : "○ LOCKED"}
                    </span>
                    <h3>
                      {mission.number} · {mission.title}
                    </h3>
                    <p>{mission.summary}</p>
                    <small>{mission.route}</small>
                  </article>
                ))}
                <button type="button" onClick={onOpenDossier}>
                  OPEN COMPLETE HTML DOSSIER
                </button>
              </div>
            : null}
          {tab === "controls"
            ? <div className="pda-controls">
                <h3>KEYBOARD</h3>
                <dl>
                  <div>
                    <dt>WASD / arrows</dt>
                    <dd>Move, steer, accelerate, brake</dd>
                  </div>
                  <div>
                    <dt>E / Enter</dt>
                    <dd>Interact, enter, exit, confirm</dd>
                  </div>
                  <div>
                    <dt>N</dt>
                    <dd>Namaste greeting / respectful request</dd>
                  </div>
                  <div>
                    <dt>Q / R</dt>
                    <dd>Rotate camera</dd>
                  </div>
                  <div>
                    <dt>+ / −</dt>
                    <dd>Camera zoom</dd>
                  </div>
                  <div>
                    <dt>Backspace</dt>
                    <dd>Recover at safe curb</dd>
                  </div>
                  <div>
                    <dt>P / Escape</dt>
                    <dd>PDA / pause / back</dd>
                  </div>
                </dl>
                <p>
                  Touch controls appear automatically on coarse pointers. Controller mapping is
                  experimental.
                </p>
              </div>
            : null}
          {tab === "settings"
            ? <div className="pda-settings">
                <h3>QUALITY</h3>
                <div className="quality-options">
                  {(["high", "medium", "low"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={quality === value}
                      onClick={() => onQualityChange(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <p>
                  Low mode reduces shadows, postprocessing, road detail, draw distance, and
                  decorative trees. It never removes objectives, landmarks, facts, or the GPS.
                </p>
                <h3>DEVELOPMENT LAYERS</h3>
                <div className="debug-options">
                  {(Object.keys(DEBUG_LABELS) as Array<keyof DebugLayers>).map((key) => (
                    <label key={key}>
                      <input
                        type="checkbox"
                        checked={debugLayers[key]}
                        onChange={() => onDebugToggle(key)}
                      />
                      {DEBUG_LABELS[key]}
                    </label>
                  ))}
                </div>
              </div>
            : null}
          {tab === "credits"
            ? <div className="pda-credits">
                <h3>ORIGINAL GAME & MAP CREDIT</h3>
                <p>
                  Original code, models, UI, map transform, copy, and interactions created for
                  Aryan's portfolio. No GTA/Rockstar assets, fonts, audio, maps, mission copy, or
                  branding are included.
                </p>
                <a href={map.metadata.licenseUrl} target="_blank" rel="noreferrer">
                  {map.metadata.attribution} · ODbL ↗
                </a>
                <p>
                  Landmarks are navigation context. Fictional missions sit outside sensitive
                  boundaries and do not imply a real institutional location.
                </p>
              </div>
            : null}
        </div>
        <footer>
          <button type="button" onClick={onExit}>
            EXIT TO PORTFOLIO
          </button>
        </footer>
      </section>
    </motion.div>
  );
};

export const HtmlMissionDossier: FC<{
  map?: BhopalMapData | null;
  reason?: string;
  canClose: boolean;
  onClose?: () => void;
  onExit: () => void;
}> = ({ map, reason, canClose, onClose, onExit }) => (
  <section className="boring-html-dossier" aria-labelledby="html-dossier-heading">
    <header>
      <div>
        <span>ACCESSIBLE / NO-WEBGL PATH</span>
        <h1 id="html-dossier-heading">Boring Mode mission dossier</h1>
      </div>
      <div>
        {canClose && onClose
          ? <button type="button" onClick={onClose}>
              RETURN TO GAME
            </button>
          : null}
        <button type="button" onClick={onExit}>
          EXIT
        </button>
      </div>
    </header>
    {reason ? <p className="dossier-reason">{reason}</p> : null}
    <p>
      This semantic dossier contains the complete three-mission portfolio story without requiring
      WebGL, motion, dragging, audio, or a timed interaction.
    </p>
    <main>
      {BORING_MISSIONS.map((mission) => (
        <article key={mission.id}>
          <p>
            MISSION {mission.number} · {mission.duration}
          </p>
          <h2>{mission.title}</h2>
          <p>
            <b>Route:</b> {mission.route}
          </p>
          <p>{mission.briefing}</p>
          <h3>{mission.factHeading}</h3>
          <ul>
            {mission.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <p>
            <b>Reward:</b> {mission.reward}
          </p>
        </article>
      ))}
    </main>
    <nav aria-label="Portfolio links">
      {GAME_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noreferrer"
        >
          {link.label} ↗
        </a>
      ))}
    </nav>
    <footer>
      {map
        ? <a href={map.metadata.licenseUrl} target="_blank" rel="noreferrer">
            {map.metadata.attribution} · ODbL
          </a>
        : <span>Map data © OpenStreetMap contributors · ODbL</span>}
    </footer>
  </section>
);

export const OverlaySwitch: FC<{ children: React.ReactNode }> = ({ children }) => (
  <AnimatePresence mode="wait">{children}</AnimatePresence>
);
