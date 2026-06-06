import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FPS = 30;
export const WIDTH = 1280;
export const HEIGHT = 720;
export const DURATION_IN_FRAMES = 1005;

type Pose = "idle" | "wave" | "sit-type" | "swim" | "ride" | "kneel-pet";
type Expression = "smile" | "open" | "worried" | "focused" | "soft";

const colors = {
  paper: "#fffdf7",
  paperShadow: "#f1f4f5",
  ink: "#050505",
  faintInk: "#454545",
  blue: "#aee7fb",
  blueSoft: "#e8f8fe",
  yellow: "#fff34f",
  green: "#9bf1cd",
  red: "#ef6b7b",
  water: "#87d8f0",
  waterDeep: "#5fc0dc",
};

const handFont =
  "'Comic Sans MS', 'Marker Felt', 'Chalkboard SE', 'Arial Rounded MT Bold', sans-serif";
const monoFont = "Menlo, Monaco, 'Courier New', monospace";

const sceneDurations = {
  boot: 90,
  hello: 120,
  agents: 210,
  swim: 165,
  horse: 135,
  byte: 165,
  outro: 120,
};

const sceneStarts = {
  boot: 0,
  hello: sceneDurations.boot,
  agents: sceneDurations.boot + sceneDurations.hello,
  swim:
    sceneDurations.boot +
    sceneDurations.hello +
    sceneDurations.agents,
  horse:
    sceneDurations.boot +
    sceneDurations.hello +
    sceneDurations.agents +
    sceneDurations.swim,
  byte:
    sceneDurations.boot +
    sceneDurations.hello +
    sceneDurations.agents +
    sceneDurations.swim +
    sceneDurations.horse,
  outro:
    sceneDurations.boot +
    sceneDurations.hello +
    sceneDurations.agents +
    sceneDurations.swim +
    sceneDurations.horse +
    sceneDurations.byte,
};

const ink = {
  fill: "none",
  stroke: colors.ink,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const fadeIn = (frame: number, length = 12) =>
  interpolate(frame, [0, length], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fadeOut = (frame: number, duration: number, length = 12) =>
  interpolate(frame, [duration - length, duration], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const sceneOpacity = (frame: number, duration: number) =>
  Math.min(fadeIn(frame), fadeOut(frame, duration));

const smooth = (value: number) =>
  interpolate(clamp(value), [0, 1], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
  });

const typewriter = (text: string, frame: number, start = 0, framesPerChar = 2) =>
  text.slice(0, clamp(Math.floor((frame - start) / framesPerChar), 0, text.length));

const wiggle = (frame: number, amount = 1, speed = 5) =>
  Math.sin(frame / speed) * amount;

const localPop = (frame: number) =>
  interpolate(frame, [0, 10, 16], [0.8, 1.08, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const yWave = (x: number, frame: number, amp = 12) =>
  Math.sin(x / 72 + frame / 10) * amp;

export const AryanIntro: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.paperShadow, fontFamily: handFont }}>
    <PaperBackdrop />
    <Sequence from={sceneStarts.boot} durationInFrames={sceneDurations.boot}>
      <BootScene duration={sceneDurations.boot} />
    </Sequence>
    <Sequence from={sceneStarts.hello} durationInFrames={sceneDurations.hello}>
      <HelloScene duration={sceneDurations.hello} />
    </Sequence>
    <Sequence from={sceneStarts.agents} durationInFrames={sceneDurations.agents}>
      <AgentsScene duration={sceneDurations.agents} />
    </Sequence>
    <Sequence from={sceneStarts.swim} durationInFrames={sceneDurations.swim}>
      <SwimScene duration={sceneDurations.swim} />
    </Sequence>
    <Sequence from={sceneStarts.horse} durationInFrames={sceneDurations.horse}>
      <HorseScene duration={sceneDurations.horse} />
    </Sequence>
    <Sequence from={sceneStarts.byte} durationInFrames={sceneDurations.byte}>
      <ByteScene duration={sceneDurations.byte} />
    </Sequence>
    <Sequence from={sceneStarts.outro} durationInFrames={sceneDurations.outro}>
      <OutroScene duration={sceneDurations.outro} />
    </Sequence>
    <FrameOverlay />
  </AbsoluteFill>
);

const SceneLayer: React.FC<{ duration: number; children: ReactNode }> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity(frame, duration) }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {children}
      </svg>
    </AbsoluteFill>
  );
};

const PaperBackdrop: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <defs>
          <pattern id="paper-grain" width="42" height="42" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="11" r="0.8" fill="#d9d9d9" opacity="0.24" />
            <circle cx="28" cy="24" r="0.9" fill="#d9d9d9" opacity="0.18" />
            <path d="M 4 35 Q 14 32 24 35" stroke="#d6d6d6" strokeWidth="1" fill="none" opacity="0.15" />
          </pattern>
          <filter id="marker-wobble">
            <feTurbulence baseFrequency="0.015" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="0.75" />
          </filter>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill={colors.paperShadow} />
        <rect x="40" y="30" width="1200" height="660" rx="28" fill={colors.paper} />
        <rect x="40" y="30" width="1200" height="660" rx="28" fill="url(#paper-grain)" />
        <rect
          x="40"
          y="30"
          width="1200"
          height="660"
          rx="28"
          fill="none"
          stroke={colors.ink}
          strokeWidth="7"
          filter="url(#marker-wobble)"
        />
        <path
          d={`M 96 ${642 + wiggle(frame, 2, 11)} Q 370 ${
            624 + wiggle(frame, 3, 19)
          } 642 ${640 + wiggle(frame, 2, 13)} T 1184 ${636 + wiggle(frame, 2, 17)}`}
          stroke={colors.ink}
          strokeWidth="2.5"
          strokeOpacity="0.15"
          fill="none"
        />
      </svg>
    </AbsoluteFill>
  );
};

const FrameOverlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      <rect
        x="40"
        y="30"
        width="1200"
        height="660"
        rx="28"
        fill="none"
        stroke={colors.ink}
        strokeWidth="7"
        filter="url(#marker-wobble)"
      />
    </svg>
  </AbsoluteFill>
);

const BootScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 22, fps, config: { damping: 11, stiffness: 120 } });
  const prompt = typewriter("> ./aryan --intro", frame, 6, 1.6);
  const cursor = Math.floor(frame / 8) % 2 === 0 ? "_" : " ";

  return (
    <SceneLayer duration={duration}>
      <SketchTerminal
        x={96}
        y={112}
        width={582}
        height={172}
        title="boot.sh"
        lines={["visitor@aryancodes.com", `${prompt}${cursor}`]}
        frame={frame}
      />
      <MotionLines x={760} y={238} frame={frame} />
      <g transform={`translate(780 556) scale(${0.88 + pop * 0.18})`}>
        <StickFigure pose="wave" expression="open" />
      </g>
      <ComicBubble
        x={690}
        y={86}
        width={430}
        lines={["oh - hey.", "you actually made it"]}
        emoji="👋"
        variant="thought"
        opacity={fadeIn(frame - 28, 12)}
      />
    </SceneLayer>
  );
};

const HelloScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const pose: Pose = frame < 52 ? "wave" : "idle";

  return (
    <SceneLayer duration={duration}>
      <g transform={`translate(${330 + wiggle(frame, 5, 22)} 560)`}>
        <StickFigure pose={pose} expression="smile" />
      </g>
      <ComicBubble
        x={490}
        y={110}
        width={604}
        lines={["i'm Aryan.", "i build things on the internet."]}
        chip="Senior Software Engineer · GEP Worldwide"
        opacity={fadeIn(frame, 14)}
      />
      <ScribbleNote x={122} y={148} text="tiny intro.exe" angle={-7} delay={10} frame={frame} />
      <ScribbleNote x={900} y={490} text="probably fine" angle={5} delay={32} frame={frame} />
    </SceneLayer>
  );
};

const AgentsScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 20], [50, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneLayer duration={duration}>
      <g transform={`translate(104 ${34 + slide}) scale(0.9)`}>
        <DeskWithLaptop x={0} y={0} frame={frame} />
      </g>
      <ComicBubble
        x={42}
        y={54}
        width={330}
        lines={["mostly i build", "AI agent systems -"]}
        opacity={fadeIn(frame - 8, 12)}
      />
      <ComicBubble
        x={816}
        y={454}
        width={360}
        lines={["they stream, use tools,", "and pause for humans."]}
        opacity={fadeIn(frame - 80, 12)}
        accent={colors.green}
      />
      <AgentDoodles frame={frame} />
    </SceneLayer>
  );
};

const SwimScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [2, duration - 18], [-120, 1120], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = 445 + wiggle(frame, 14, 7);

  return (
    <SceneLayer duration={duration}>
      <ComicBubble
        x={94}
        y={96}
        width={386}
        lines={["weekends?", "i'm in the pool."]}
        opacity={fadeIn(frame - 6, 12)}
        accent={colors.blue}
      />
      <Pool frame={frame} />
      <g transform={`translate(${x} ${y}) rotate(${wiggle(frame, 5, 14)}) scale(1.04)`}>
        <StickFigure pose="swim" expression="soft" />
      </g>
      <text
        x="824"
        y="280"
        fill={colors.faintInk}
        fontFamily={handFont}
        fontSize="28"
        opacity="0.38"
        fontWeight="800"
      >
        dive / breathe / repeat
      </text>
    </SceneLayer>
  );
};

const HorseScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, duration], [-220, 1130], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bob = wiggle(frame, 8, 4);

  return (
    <SceneLayer duration={duration}>
      <GroundLine frame={frame} />
      <ComicBubble
        x={88}
        y={82}
        width={580}
        lines={["or on a horse - pretending", "i have a routine."]}
        accent={colors.yellow}
        opacity={fadeIn(frame - 4, 12)}
      />
      <g transform={`translate(${x} ${520 + bob})`}>
        <SketchHorse frame={frame} />
        <g transform="translate(8 -38)">
          <StickFigure pose="ride" expression="smile" />
        </g>
      </g>
    </SceneLayer>
  );
};

const ByteScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const dogX = interpolate(frame, [0, 46], [1040, 735], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heartPop = localPop(frame - 66);

  return (
    <SceneLayer duration={duration}>
      <GroundLine frame={frame} />
      <g transform="translate(510 565)">
        <StickFigure pose="kneel-pet" expression="soft" />
      </g>
      <ByteDog x={dogX} y={530} frame={frame} />
      <ComicBubble
        x={88}
        y={84}
        width={412}
        lines={["and this is Byte.", "say hi -"]}
        opacity={fadeIn(frame - 4, 12)}
      />
      <ComicBubble
        x={720}
        y={88}
        width={448}
        lines={["he runs on a", "Neural Bark Network."]}
        accent={colors.green}
        opacity={fadeIn(frame - 66, 12)}
        variant="thought"
      />
      <Woof x={790} y={372} frame={frame} />
      <g transform={`translate(702 360) scale(${Math.max(0, heartPop)})`} opacity={clamp(heartPop)}>
        <Heart />
      </g>
    </SceneLayer>
  );
};

const OutroScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const collapse = smooth(frame / 34);
  const prompt = "visitor@aryancodes.com:~$";
  const typed = typewriter(prompt, frame, 28, 1.1);
  const cursor = Math.floor(frame / 9) % 2 === 0 ? "_" : " ";

  return (
    <SceneLayer duration={duration}>
      <g opacity={1 - collapse} transform={`translate(${collapse * 430} ${collapse * 80}) scale(${1 - collapse * 0.55})`}>
        <MiniSketch x={165} y={192} label="agents" />
        <MiniSketch x={220} y={522} label="pool" />
        <MiniSketch x={970} y={520} label="byte" />
      </g>
      <SketchTerminal
        x={156}
        y={238}
        width={968}
        height={218}
        title="visitor shell"
        lines={[`${typed}${cursor}`, "commands: help, work, projects", "hobbies, byte"]}
        frame={frame}
        big
        opacity={fadeIn(frame - 20, 12)}
      />
      <ComicBubble
        x={350}
        y={482}
        width={546}
        lines={["that's the tour.", "poke around - type `help`."]}
        accent={colors.yellow}
        opacity={fadeIn(frame - 42, 12)}
      />
    </SceneLayer>
  );
};

const ComicBubble: React.FC<{
  x: number;
  y: number;
  width: number;
  lines: string[];
  chip?: string;
  emoji?: string;
  opacity?: number;
  accent?: string;
  variant?: "speech" | "thought";
}> = ({
  x,
  y,
  width,
  lines,
  chip,
  emoji,
  opacity = 1,
  accent = colors.blue,
  variant = "speech",
}) => {
  const fontSize = width > 500 ? 30 : 28;
  const lineHeight = fontSize + 12;
  const height = 44 + lines.length * lineHeight + (chip ? 42 : 0);

  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity} filter="url(#marker-wobble)">
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        rx={variant === "thought" ? 42 : 18}
        fill={colors.paper}
        stroke={colors.ink}
        strokeWidth="6"
      />
      <rect x="18" y={height - 18} width={width - 36} height="10" fill={accent} opacity="0.55" />
      {variant === "thought" ? (
        <g fill={colors.paper} stroke={colors.ink} strokeWidth="5">
          <circle cx="-28" cy={height - 22} r="17" />
          <circle cx="-58" cy={height + 8} r="10" />
        </g>
      ) : (
        <path
          d={`M 72 ${height - 2} L 38 ${height + 34} L 130 ${height - 2}`}
          fill={colors.paper}
          stroke={colors.ink}
          strokeWidth="6"
          strokeLinejoin="round"
        />
      )}
      <text fill={colors.ink} fontFamily={handFont} fontSize={fontSize} fontWeight="900">
        {lines.map((line, index) => (
          <tspan key={line} x="26" y={36 + index * lineHeight}>
            {line}
          </tspan>
        ))}
        {emoji ? (
          <tspan x={width - 62} y={36 + (lines.length - 1) * lineHeight}>
            {emoji}
          </tspan>
        ) : null}
      </text>
      {chip ? (
        <g transform={`translate(25 ${34 + lines.length * lineHeight})`}>
          <rect width={Math.min(width - 50, chip.length * 13 + 22)} height="30" rx="8" fill={colors.yellow} stroke={colors.ink} strokeWidth="3" />
          <text x="12" y="22" fill={colors.ink} fontFamily={handFont} fontSize="17" fontWeight="900">
            {chip}
          </text>
        </g>
      ) : null}
    </g>
  );
};

const StickFigure: React.FC<{ pose: Pose; expression: Expression }> = ({
  pose,
  expression,
}) => {
  const frame = useCurrentFrame();

  if (pose === "wave") {
    return <StandingFigure frame={frame} expression={expression} waving />;
  }

  if (pose === "idle") {
    return <StandingFigure frame={frame} expression={expression} />;
  }

  if (pose === "sit-type") {
    return <SittingFigure frame={frame} expression={expression} />;
  }

  if (pose === "swim") {
    return <SwimmingFigure frame={frame} expression={expression} />;
  }

  if (pose === "ride") {
    return <RidingFigure frame={frame} expression={expression} />;
  }

  return <KneelingFigure frame={frame} expression={expression} />;
};

const CartoonHead: React.FC<{
  x?: number;
  y?: number;
  r?: number;
  expression: Expression;
  frame: number;
  look?: "left" | "right" | "center";
  facing?: "front" | "right";
  sweat?: boolean;
}> = ({ x = 0, y = -220, r = 56, expression, frame, look = "center", facing = "front", sweat }) => {
  const pupilOffset = look === "left" ? -4 : look === "right" ? 4 : wiggle(frame, 1.4, 30);
  const brow = expression === "worried" ? -10 : expression === "focused" ? 6 : 0;
  const openMouth = expression === "open";
  const faceShift = facing === "right" ? 11 : 0;
  const bob = wiggle(frame, 1.2, 12);

  return (
    <g filter="url(#marker-wobble)" transform={`translate(0 ${bob})`}>
      <circle cx={x} cy={y} r={r} fill={colors.paper} stroke={colors.ink} strokeWidth="6" />
      <path d={`M ${x - 32} ${y - r + 8} L ${x - 12} ${y - r - 22} L ${x - 5} ${y - r + 4}`} {...ink} strokeWidth="6" />
      <path d={`M ${x - 2} ${y - r + 4} L ${x + 22} ${y - r - 18} L ${x + 18} ${y - r + 8}`} {...ink} strokeWidth="6" />
      <path d={`M ${x + 25} ${y - r + 12} L ${x + 44} ${y - r - 1}`} {...ink} strokeWidth="5" />

      <circle cx={x - 18 + faceShift + pupilOffset} cy={y - 8} r={facing === "right" ? 4.5 : 5.5} fill={colors.ink} />
      <circle cx={x + 18 + faceShift + pupilOffset * 0.4} cy={y - 8} r="5.5" fill={colors.ink} />
      <path d={`M ${x - 30 + faceShift} ${y - 30 + brow} Q ${x - 18 + faceShift} ${y - 36 + brow} ${x - 7 + faceShift} ${y - 29 + brow}`} {...ink} strokeWidth="4" />
      <path d={`M ${x + 8 + faceShift} ${y - 29 - brow} Q ${x + 20 + faceShift} ${y - 36 - brow} ${x + 32 + faceShift} ${y - 29 - brow}`} {...ink} strokeWidth="4" />
      {facing === "right" ? (
        <path d={`M ${x + 37} ${y - 3} Q ${x + 49} ${y + 6} ${x + 37} ${y + 14}`} {...ink} strokeWidth="4" />
      ) : null}
      {openMouth ? (
        <g>
          <ellipse cx={x + 5 + faceShift} cy={y + 28} rx="20" ry="18" fill={colors.ink} />
          <path d={`M ${x - 8 + faceShift} ${y + 36} Q ${x + 6 + faceShift} ${y + 46} ${x + 20 + faceShift} ${y + 35}`} fill={colors.red} />
          <rect x={x - 8 + faceShift} y={y + 14} width="27" height="8" rx="2" fill={colors.paper} />
        </g>
      ) : expression === "worried" ? (
        <path d={`M ${x - 18 + faceShift} ${y + 31} Q ${x + 4 + faceShift} ${y + 16} ${x + 28 + faceShift} ${y + 30}`} {...ink} strokeWidth="5" />
      ) : expression === "focused" ? (
        <path d={`M ${x - 18 + faceShift} ${y + 27} Q ${x + 4 + faceShift} ${y + 31} ${x + 25 + faceShift} ${y + 25}`} {...ink} strokeWidth="4" />
      ) : (
        <path d={`M ${x - 22 + faceShift} ${y + 25} Q ${x + 4 + faceShift} ${y + 42} ${x + 30 + faceShift} ${y + 24}`} {...ink} strokeWidth="4" />
      )}
      {sweat ? (
        <g fill={colors.blue} stroke={colors.ink} strokeWidth="3">
          <path d={`M ${x - 65} ${y - 12} C ${x - 84} ${y + 16} ${x - 48} ${y + 22} ${x - 65} ${y - 12}`} />
          <path d={`M ${x + 62} ${y + 4} C ${x + 48} ${y + 28} ${x + 78} ${y + 31} ${x + 62} ${y + 4}`} />
        </g>
      ) : null}
    </g>
  );
};

const StandingFigure: React.FC<{
  frame: number;
  expression: Expression;
  waving?: boolean;
}> = ({ frame, expression, waving = false }) => {
  const wave = waving ? wiggle(frame, 16, 4) : 0;
  const sway = wiggle(frame, 4, 18);
  const knee = wiggle(frame, 3, 14);

  return (
    <g transform={`translate(${sway * 0.4} ${wiggle(frame, 1.4, 10)}) rotate(${sway * 0.35})`}>
      <CartoonHead expression={expression} frame={frame} sweat={expression === "open"} />
      <g {...ink} strokeWidth="8" filter="url(#marker-wobble)">
        <path d={`M 0 -164 Q ${-10 + sway} -112 ${-2 - sway * 0.4} -60`} />
        <path d={`M -2 -134 Q ${-46 - sway} ${-106 + knee} -70 -66`} />
        {waving ? (
          <path d={`M 2 -136 Q ${42 + wave} ${-176 - wave * 0.2} ${72 + wave} ${-214 + wave * 0.15}`} />
        ) : (
          <path d={`M 2 -136 Q ${46 + sway} ${-106 - knee} 70 -66`} />
        )}
        <path d={`M -2 -60 Q ${-34 - knee} 0 ${-58 - sway} 54`} />
        <path d={`M -2 -60 Q ${34 + knee} 0 ${58 + sway} 54`} />
      </g>
      {waving ? <circle cx={76 + wave} cy={-216 + wave * 0.15} r="9" fill={colors.yellow} stroke={colors.ink} strokeWidth="4" /> : null}
    </g>
  );
};

// Seated in profile, facing right toward the desk/screen. Origin (0,0) is the
// seat-contact point (his hips), so place this where the chair seat sits.
const SittingFigure: React.FC<{ frame: number; expression: Expression }> = ({
  frame,
  expression,
}) => {
  const tap = wiggle(frame, 2.5, 3);
  const lean = wiggle(frame, 3, 18);

  return (
    <g transform={`translate(${lean * 0.3} ${wiggle(frame, 1.2, 11)})`}>
      <g {...ink} strokeWidth="8" filter="url(#marker-wobble)">
        {/* far arm + far leg, drawn first so the near side overlaps them */}
        <path d={`M 48 -138 Q ${124 + lean} -96 152 ${-24 - tap}`} />
        <path d={`M 0 -12 Q ${54 + lean} -16 100 -10`} />
        <path d="M 100 -10 L 110 96" />
        <path d="M 110 96 L 138 102" />
        {/* spine leaning toward the screen + neck */}
        <path d={`M 6 -12 Q ${18 + lean} -92 52 -138`} />
        <path d="M 52 -138 L 62 -156" />
        {/* near leg: thigh forward, shin down to the floor, foot */}
        <path d={`M 6 -12 Q ${60 + lean} -18 112 -14`} />
        <path d="M 112 -14 L 124 98" />
        <path d="M 124 98 L 154 104" />
        {/* near arm reaching down onto the keyboard */}
        <path d={`M 52 -138 Q ${134 + lean} -92 164 ${-16 + tap}`} />
      </g>
      <CartoonHead
        x={62}
        y={-188}
        r={50}
        expression={expression}
        frame={frame}
        look="right"
        facing="right"
        sweat={expression === "worried"}
      />
    </g>
  );
};

const SwimmingFigure: React.FC<{ frame: number; expression: Expression }> = ({
  frame,
  expression,
}) => {
  const stroke = wiggle(frame, 28, 5);

  return (
    <g transform="rotate(-6)">
      <CartoonHead x={-76} y={-62} r={42} expression={expression} frame={frame} look="right" />
      <g {...ink} strokeWidth="8" filter="url(#marker-wobble)">
        <path d="M -32 -42 Q 42 -36 118 -20" />
        <path d={`M -24 -42 Q ${20 + stroke} ${-98 + stroke * 0.15} ${88 + stroke} -82`} />
        <path d={`M -10 -28 Q ${-60 - stroke * 0.3} 10 ${-112 - stroke * 0.3} 30`} />
        <path d={`M 100 -20 Q ${160 + stroke * 0.2} ${-58 - stroke * 0.2} 214 -40`} />
        <path d={`M 102 -18 Q ${168 - stroke * 0.15} ${20 + stroke * 0.2} 220 32`} />
      </g>
    </g>
  );
};

const RidingFigure: React.FC<{ frame: number; expression: Expression }> = ({
  frame,
  expression,
}) => (
  <g transform={`translate(0 ${wiggle(frame, 4, 4)}) scale(0.82)`}>
    <CartoonHead expression={expression} frame={frame} look="right" />
    <g {...ink} strokeWidth="8" filter="url(#marker-wobble)">
      <path d="M 0 -164 Q -2 -114 -6 -76" />
      <path d="M -2 -132 Q 42 -116 96 -96" />
      <path d="M -2 -130 Q -42 -108 -62 -80" />
      <path d="M -6 -76 Q -58 -28 -92 18" />
      <path d="M -6 -76 Q 48 -34 94 16" />
    </g>
  </g>
);

const KneelingFigure: React.FC<{ frame: number; expression: Expression }> = ({
  frame,
  expression,
}) => {
  const pet = wiggle(frame, 8, 4);

  return (
    <g>
      <CartoonHead expression={expression} frame={frame} look="right" />
      <g {...ink} strokeWidth="8" filter="url(#marker-wobble)">
        <path d="M 0 -164 Q -10 -116 -18 -70" />
        <path d={`M -4 -130 Q 52 ${-106 + pet * 0.2} 122 ${-86 + pet}`} />
        <path d="M -8 -128 Q -48 -92 -68 -54" />
        <path d="M -18 -70 Q -68 -30 -120 -26" />
        <path d="M -18 -70 Q 22 -28 88 -26" />
      </g>
    </g>
  );
};

const SketchTerminal: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  lines: string[];
  frame: number;
  big?: boolean;
  opacity?: number;
}> = ({ x, y, width, height, title, lines, big = false, opacity = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity} filter="url(#marker-wobble)">
    <rect width={width} height={height} rx="18" fill={colors.paper} stroke={colors.ink} strokeWidth="6" />
    <line x1="0" y1="38" x2={width} y2="38" stroke={colors.ink} strokeWidth="5" />
    <circle cx="23" cy="20" r="6" fill={colors.red} stroke={colors.ink} strokeWidth="2" />
    <circle cx="44" cy="20" r="6" fill={colors.yellow} stroke={colors.ink} strokeWidth="2" />
    <circle cx="65" cy="20" r="6" fill={colors.green} stroke={colors.ink} strokeWidth="2" />
    <text x="88" y="26" fill={colors.ink} fontFamily={handFont} fontSize="17" fontWeight="900">
      {title}
    </text>
    <text x="26" y={big ? 82 : 76} fill={colors.ink} fontFamily={monoFont} fontSize={big ? 34 : 26} fontWeight="900">
      {lines.map((line, index) => (
        <tspan key={`${line}-${index}`} x="26" dy={index === 0 ? 0 : big ? 46 : 42}>
          {line}
        </tspan>
      ))}
    </text>
  </g>
);

const DeskWithLaptop: React.FC<{
  x: number;
  y: number;
  frame: number;
}> = ({ x, y, frame }) => {
  const tapLeft = wiggle(frame, 4, 2.5);
  const tapRight = wiggle(frame + 7, 4, 2.5);
  const breathe = wiggle(frame, 2, 4);

  return (
    <g transform={`translate(${x} ${y})`} filter="url(#marker-wobble)">
      <g {...ink} strokeWidth="7">
        <path d="M 126 342 L 1006 344 L 1118 456 L 42 454 Z" fill={colors.paper} />
        <path d="M 126 342 L 462 248 L 1006 344" />
        <path d="M 42 454 L 36 664" />
        <path d="M 1118 456 L 1110 668" />
        <path d="M 860 456 L 852 678" />
        <path d="M 154 454 L 148 658" />
      </g>

      <g transform="translate(574 28) rotate(3)">
        <rect x="0" y="0" width="452" height="260" rx="4" fill={colors.paper} stroke={colors.ink} strokeWidth="7" />
        <rect x="20" y="21" width="410" height="212" rx="3" fill={colors.blueSoft} stroke={colors.ink} strokeWidth="4" />
        <g transform="translate(22 22) scale(0.98)">
          <AgentScreen frame={frame} width={372} />
        </g>
        <path d="M 222 260 L 230 330" {...ink} strokeWidth="6" />
        <path d="M 276 260 L 284 330" {...ink} strokeWidth="6" />
        <path d="M 176 330 L 322 336 L 322 362 L 154 356 Z" fill={colors.paper} stroke={colors.ink} strokeWidth="6" />
      </g>

      <g transform={`translate(344 ${184 + breathe})`}>
        <circle cx="0" cy="0" r="78" fill={colors.paper} stroke={colors.ink} strokeWidth="7" />
        <path d="M -8 78 L -8 132" {...ink} strokeWidth="8" />
        <path d="M -8 132 L -6 292" {...ink} strokeWidth="7" />
        <path d="M -18 145 Q -54 204 -70 300" {...ink} strokeWidth="7" />
        <path d="M 8 146 Q 54 214 96 304" {...ink} strokeWidth="7" />
        <path d={`M -70 300 Q 22 ${326 + tapLeft} 214 ${314 + tapLeft}`} {...ink} strokeWidth="7" />
        <path d={`M 74 302 Q 168 ${334 + tapRight} 320 ${320 + tapRight}`} {...ink} strokeWidth="7" />
        <ellipse cx="214" cy={314 + tapLeft} rx="22" ry="12" fill={colors.paper} stroke={colors.ink} strokeWidth="6" />
        <ellipse cx="320" cy={320 + tapRight} rx="22" ry="12" fill={colors.paper} stroke={colors.ink} strokeWidth="6" />
      </g>

      <g transform="translate(456 374)">
        <path d="M 0 0 L 342 0 L 392 74 L -52 74 Z" fill={colors.paper} stroke={colors.ink} strokeWidth="6" strokeLinejoin="round" />
        <g stroke={colors.ink} strokeWidth="3" fill={colors.paperShadow}>
          {Array.from({ length: 11 }, (_, index) => (
            <rect key={`top-${index}`} x={26 + index * 27} y={14} width="18" height="12" rx="3" />
          ))}
          {Array.from({ length: 10 }, (_, index) => (
            <rect key={`mid-${index}`} x={44 + index * 27} y={34} width="18" height="12" rx="3" />
          ))}
          {Array.from({ length: 7 }, (_, index) => (
            <rect key={`bot-${index}`} x={94 + index * 29} y={54} width="22" height="10" rx="3" />
          ))}
        </g>
        <path d="M 24 7 L 314 8 M 42 67 L 300 68" {...ink} strokeWidth="3" opacity="0.35" />
      </g>

      <g transform="translate(234 350)" {...ink} strokeWidth="7">
        <path
          d="M 58 4 C 24 8 4 31 8 70 L 25 194 C 31 230 58 249 98 251 L 168 251 C 211 249 236 226 232 188 L 212 58 C 207 24 180 4 144 2 Z"
          fill={colors.paper}
        />
        <path d="M 36 226 C 92 244 188 243 250 224 L 280 254 C 226 288 86 290 30 258 Z" fill={colors.paper} />
        <path d="M 138 268 L 138 318" />
        <path d="M 138 318 L 38 360 M 138 318 L 256 356 M 138 318 L 138 384" />
        <circle cx="32" cy="366" r="14" fill={colors.paper} />
        <circle cx="262" cy="362" r="14" fill={colors.paper} />
        <circle cx="138" cy="394" r="14" fill={colors.paper} />
        <path d="M 226 202 L 334 176 L 350 318" />
        <path d="M 350 318 Q 382 313 388 338 Q 362 356 334 341" />
        <path d="M 244 238 L 416 214 L 442 350" />
        <path d="M 442 350 Q 476 342 484 368 Q 454 390 426 372" />
      </g>
    </g>
  );
};

const AgentScreen: React.FC<{ frame: number; width: number }> = ({ frame, width }) => {
  const packet = (frame % 120) / 120;
  const packetX = interpolate(packet, [0, 0.24, 0.45, 0.68, 1], [54, 138, 238, 188, 318]);
  const packetY = interpolate(packet, [0, 0.24, 0.45, 0.68, 1], [91, 56, 56, 122, 92]);

  return (
    <g transform="translate(34 39)">
      <text x="38" y="-10" fill={colors.ink} fontFamily={handFont} fontSize="20" fontWeight="900">
        LangGraph flow
      </text>
      <rect x="-10" y="6" width={width - 26} height="126" rx="10" fill="#fbfdff" stroke={colors.ink} strokeWidth="2.5" opacity="0.72" />
      <g opacity="0.22" stroke={colors.ink} strokeWidth="1">
        {Array.from({ length: 6 }, (_, index) => (
          <path key={`grid-h-${index}`} d={`M -8 ${26 + index * 19} L ${width - 42} ${26 + index * 19}`} />
        ))}
        {Array.from({ length: 8 }, (_, index) => (
          <path key={`grid-v-${index}`} d={`M ${20 + index * 42} 10 L ${20 + index * 42} 128`} />
        ))}
      </g>
      <rect x="-4" y="15" width="30" height="104" rx="8" fill={colors.paper} stroke={colors.ink} strokeWidth="3" />
      <circle cx="11" cy="36" r="7" fill={colors.yellow} stroke={colors.ink} strokeWidth="2" />
      <rect x="5" y="55" width="12" height="12" rx="3" fill={colors.green} stroke={colors.ink} strokeWidth="2" />
      <path d="M 5 86 L 17 76 L 17 96 Z" fill={colors.blue} stroke={colors.ink} strokeWidth="2" />
      <path
        d="M 83 73 C 112 73 105 52 134 52 M 190 52 C 219 52 217 52 246 52 M 296 68 C 315 80 306 94 326 94 M 190 112 C 220 112 224 96 268 96 M 84 91 C 112 112 112 112 134 112"
        {...ink}
        strokeWidth="4"
      />
      <BuilderNode x={38} y={59} label="trigger" active={packet < 0.2} accent={colors.yellow} />
      <BuilderNode x={130} y={34} label="planner" active={packet >= 0.18 && packet < 0.4} accent={colors.blue} />
      <BuilderNode x={244} y={34} label="tool" active={packet >= 0.36 && packet < 0.58} accent={colors.green} />
      <BuilderNode x={134} y={94} label="memory" active={packet >= 0.58 && packet < 0.72} accent={colors.blue} />
      <BuilderNode x={262} y={78} label="human" active={packet >= 0.66 && packet < 0.86} accent={colors.yellow} wide />
      <BuilderNode x={326} y={77} label="final" active={packet >= 0.84} accent={colors.green} />
      <circle cx={packetX} cy={packetY} r="6" fill={colors.yellow} stroke={colors.ink} strokeWidth="3" />
      <text x="0" y="152" fill={colors.ink} fontFamily={monoFont} fontSize="13" fontWeight="900">
        {"> stream: tokens  tool.call()  pause_for_human()"}
      </text>
    </g>
  );
};

const BuilderNode: React.FC<{
  x: number;
  y: number;
  label: string;
  active: boolean;
  accent: string;
  wide?: boolean;
}> = ({ x, y, label, active, accent, wide = false }) => {
  const nodeWidth = wide ? 76 : 58;

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={-nodeWidth / 2}
        y="-18"
        width={nodeWidth}
        height="36"
        rx="10"
        fill={active ? accent : colors.paper}
        stroke={colors.ink}
        strokeWidth="4"
      />
      <circle cx={-nodeWidth / 2} cy="0" r="4" fill={colors.paper} stroke={colors.ink} strokeWidth="2" />
      <circle cx={nodeWidth / 2} cy="0" r="4" fill={colors.paper} stroke={colors.ink} strokeWidth="2" />
      <text x="0" y="5" textAnchor="middle" fill={colors.ink} fontFamily={handFont} fontSize={wide ? 11 : 12} fontWeight="900">
        {label}
      </text>
    </g>
  );
};

const Pool: React.FC<{ frame: number }> = ({ frame }) => {
  const points = Array.from({ length: 17 }, (_, index) => {
    const x = 40 + index * 75;
    return `${index === 0 ? "M" : "L"} ${x} ${392 + yWave(x, frame, 16)}`;
  }).join(" ");

  return (
    <g filter="url(#marker-wobble)">
      <path d={`${points} L 1240 690 L 40 690 Z`} fill={colors.water} stroke={colors.ink} strokeWidth="6" />
      <path d={`M 70 460 Q 220 ${436 + wiggle(frame, 4, 8)} 370 460 T 670 460 T 970 460 T 1210 460`} {...ink} strokeWidth="3" opacity="0.35" />
      <path d={`M 110 538 Q 250 ${520 + wiggle(frame, 4, 7)} 390 538 T 710 538 T 1080 538`} {...ink} strokeWidth="3" opacity="0.25" />
    </g>
  );
};

const SketchHorse: React.FC<{ frame: number }> = ({ frame }) => {
  const step = wiggle(frame, 18, 3);

  return (
    <g {...ink} strokeWidth="7" filter="url(#marker-wobble)">
      <path d="M -126 -18 Q -34 -48 74 -20" />
      <path d="M 60 -24 Q 104 -70 142 -54" />
      <circle cx="158" cy="-54" r="26" fill={colors.paper} />
      <path d="M 176 -62 L 210 -54 L 178 -42" />
      <path d="M -130 -18 Q -162 -40 -184 -64" />
      <path d={`M -84 -12 L ${-108 + step} 88`} />
      <path d={`M -20 -18 L ${-8 - step} 88`} />
      <path d={`M 42 -18 L ${24 + step} 88`} />
      <path d={`M 92 -26 L ${112 - step} 82`} />
      <path d="M -34 -42 L 54 -42 L 38 -70 L -22 -70 Z" fill={colors.yellow} />
      <path d="M 124 -80 Q 146 -106 174 -86" />
    </g>
  );
};

const ByteDog: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => {
  const tail = wiggle(frame, 26, 3);
  const paw = wiggle(frame, 8, 4);

  return (
    <g transform={`translate(${x} ${y})`} filter="url(#marker-wobble)">
      <g {...ink} strokeWidth="6">
        <path d="M -96 -8 Q -28 -34 48 -12" />
        <circle cx="86" cy="-32" r="34" fill={colors.paper} />
        <path d="M 62 -64 L 44 -100 L 84 -70" fill={colors.paper} />
        <path d="M 104 -64 L 132 -100 L 126 -54" fill={colors.paper} />
        <path d={`M -98 -12 Q ${-144 - tail} ${-28 - tail} ${-156 - tail * 0.2} -60`} />
        <path d={`M -62 -8 L ${-74 + paw} 62`} />
        <path d={`M -8 -10 L ${-14 - paw} 62`} />
        <path d={`M 40 -10 L ${48 + paw} 62`} />
        <path d={`M 84 -2 L ${92 - paw} 62`} />
        <path d="M 68 -17 Q 86 -3 106 -17" />
        <path d="M 52 10 L 120 10" stroke={colors.green} />
      </g>
      <circle cx="75" cy="-38" r="5" fill={colors.ink} />
      <circle cx="102" cy="-38" r="5" fill={colors.ink} />
      <circle cx="88" cy="10" r="9" fill={colors.yellow} stroke={colors.ink} strokeWidth="4" />
      <text x="-42" y="-44" fill={colors.ink} fontFamily={handFont} fontSize="20" fontWeight="900">
        Byte
      </text>
      <g {...ink} stroke={colors.ink} strokeWidth="3">
        <path d="M -22 -74 L 0 -96 L 22 -74 M 0 -96 L 0 -120 M 22 -74 L 48 -98" />
      </g>
      <circle cx="0" cy="-120" r="5" fill={colors.green} stroke={colors.ink} strokeWidth="3" />
      <circle cx="48" cy="-98" r="5" fill={colors.green} stroke={colors.ink} strokeWidth="3" />
    </g>
  );
};

const Woof: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => {
  const opacity = fadeIn(frame - 46, 8) * fadeOut(frame, 140, 16);

  return (
    <g transform={`translate(${x} ${y}) scale(${localPop(frame - 46)})`} opacity={opacity} filter="url(#marker-wobble)">
      <ellipse cx="0" cy="0" rx="78" ry="42" fill={colors.paper} stroke={colors.ink} strokeWidth="5" />
      <text x="0" y="10" textAnchor="middle" fill={colors.ink} fontFamily={handFont} fontSize="30" fontWeight="900">
        woof!
      </text>
    </g>
  );
};

const Heart: React.FC = () => (
  <path
    d="M 0 -12 C -30 -44 -78 -7 0 50 C 78 -7 30 -44 0 -12 Z"
    fill={colors.red}
    stroke={colors.ink}
    strokeWidth="5"
    filter="url(#marker-wobble)"
  />
);

const GroundLine: React.FC<{ frame: number }> = ({ frame }) => (
  <path
    d={`M 70 ${594 + wiggle(frame, 2, 11)} Q 320 ${570 + wiggle(frame, 4, 16)} 622 ${
      592 + wiggle(frame, 3, 13)
    } T 1210 ${584 + wiggle(frame, 2, 17)}`}
    {...ink}
    strokeWidth="4"
    opacity="0.55"
  />
);

const AgentDoodles: React.FC<{ frame: number }> = ({ frame }) => (
  <g opacity="0.7">
    <ScribbleNote x={116} y={154} text="streaming tokens" angle={-4} delay={10} frame={frame} />
    <ScribbleNote x={100} y={214} text="tool call" angle={3} delay={28} frame={frame} />
    <ScribbleNote x={108} y={274} text="human pause" angle={-2} delay={48} frame={frame} />
  </g>
);

const ScribbleNote: React.FC<{
  x: number;
  y: number;
  text: string;
  angle: number;
  delay: number;
  frame: number;
}> = ({ x, y, text, angle, delay, frame }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} opacity={fadeIn(frame - delay, 12)} filter="url(#marker-wobble)">
    <path d="M -10 9 Q 70 0 164 7" stroke={colors.yellow} strokeWidth="15" opacity="0.6" />
    <text x="0" y="12" fill={colors.ink} fontFamily={handFont} fontSize="20" fontWeight="900">
      {text}
    </text>
  </g>
);

const MotionLines: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => (
  <g transform={`translate(${x} ${y})`} opacity={fadeIn(frame - 20, 8)} filter="url(#marker-wobble)">
    <path d="M -72 -16 Q -112 -42 -134 -82" {...ink} strokeWidth="4" />
    <path d="M -38 -60 Q -56 -96 -44 -132" {...ink} strokeWidth="4" />
    <path d="M 34 -80 Q 72 -112 128 -114" {...ink} strokeWidth="4" />
  </g>
);

const MiniSketch: React.FC<{ x: number; y: number; label: string }> = ({ x, y, label }) => (
  <g transform={`translate(${x} ${y})`} opacity="0.65" filter="url(#marker-wobble)">
    <rect x="-82" y="-44" width="164" height="88" rx="18" fill={colors.paper} stroke={colors.ink} strokeWidth="5" />
    <circle cx="-34" cy="-10" r="14" fill={colors.paper} stroke={colors.ink} strokeWidth="4" />
    <circle cx="12" cy="-20" r="14" fill={colors.paper} stroke={colors.ink} strokeWidth="4" />
    <circle cx="48" cy="-4" r="14" fill={colors.paper} stroke={colors.ink} strokeWidth="4" />
    <path d="M -20 -14 L -2 -18 M 25 -16 L 38 -8" {...ink} strokeWidth="3" />
    <text x="0" y="32" textAnchor="middle" fill={colors.ink} fontFamily={handFont} fontSize="18" fontWeight="900">
      {label}
    </text>
  </g>
);
