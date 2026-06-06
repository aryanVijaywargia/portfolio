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
export const DURATION_IN_FRAMES = 1140;

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
  continua: 135,
  swim: 165,
  horse: 135,
  byte: 165,
  outro: 120,
};

const sceneStarts = {
  boot: 0,
  hello: sceneDurations.boot,
  agents: sceneDurations.boot + sceneDurations.hello,
  continua: sceneDurations.boot + sceneDurations.hello + sceneDurations.agents,
  swim:
    sceneDurations.boot +
    sceneDurations.hello +
    sceneDurations.agents +
    sceneDurations.continua,
  horse:
    sceneDurations.boot +
    sceneDurations.hello +
    sceneDurations.agents +
    sceneDurations.continua +
    sceneDurations.swim,
  byte:
    sceneDurations.boot +
    sceneDurations.hello +
    sceneDurations.agents +
    sceneDurations.continua +
    sceneDurations.swim +
    sceneDurations.horse,
  outro:
    sceneDurations.boot +
    sceneDurations.hello +
    sceneDurations.agents +
    sceneDurations.continua +
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
    <Sequence from={sceneStarts.continua} durationInFrames={sceneDurations.continua}>
      <ContinuaScene duration={sceneDurations.continua} />
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
      <g transform={`translate(0 ${slide})`}>
        <SketchChair x={250} y={560} />
        <g transform="translate(288 560) scale(0.95)">
          <StickFigure pose="sit-type" expression="focused" />
        </g>
        <DeskWithLaptop x={414} y={318} mode="agents" frame={frame} />
      </g>
      <ComicBubble
        x={760}
        y={88}
        width={428}
        lines={["mostly i build", "AI agent systems -"]}
        opacity={fadeIn(frame - 8, 12)}
      />
      <ComicBubble
        x={724}
        y={472}
        width={454}
        lines={["they stream, use tools,", "and pause for humans."]}
        opacity={fadeIn(frame - 80, 12)}
        accent={colors.green}
      />
      <AgentDoodles frame={frame} />
    </SceneLayer>
  );
};

const ContinuaScene: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const shake = frame > 92 && frame < 118 ? wiggle(frame, 4, 2) : 0;

  return (
    <SceneLayer duration={duration}>
      <g transform={`translate(${shake} 0)`}>
        <ContinuaWorkspace frame={frame} />
        <g opacity={fadeIn(frame - 74, 10)}>
          <ServerPod x={918} y={304} frame={Math.max(0, frame - 72)} />
        </g>
      </g>
      <ComicBubble
        x={748}
        y={42}
        width={396}
        lines={["and Continua -", "my durable engine."]}
        opacity={fadeIn(frame - 58, 12)}
      />
      <ComicBubble
        x={538}
        y={486}
        width={586}
        lines={["when an agent face-plants", "mid-run, it picks back up."]}
        accent={colors.yellow}
        opacity={fadeIn(frame - 92, 12)}
      />
      <TurnArcs x={390} y={262} frame={frame} />
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
        <MiniSketch x={960} y={192} label="continua" />
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

const ContinuaWorkspace: React.FC<{ frame: number }> = ({ frame }) => {
  const reveal = fadeIn(frame - 56, 14);
  const pop = Math.max(0, localPop(frame - 62));
  const logOpacity = fadeIn(frame - 70, 10);

  return (
    <g filter="url(#marker-wobble)">
      <g {...ink} strokeWidth="7">
        <path d="M 205 558 L 842 558" />
        <path d="M 250 558 L 238 674" />
        <path d="M 792 558 L 802 674" />
        <path d="M 408 586 L 394 674" />
      </g>
      <SketchChair x={318} y={558} />
      <g transform="translate(346 558)">
        <BackTypingTurnFigure frame={frame} />
      </g>
      <TypingLaptop x={474} y={326} frame={frame} reveal={reveal} />
      <g
        transform={`translate(594 176) scale(${pop})`}
        opacity={reveal}
        style={{ transformOrigin: "140px 128px" }}
      >
        <ContinuaPopPanel frame={frame} opacity={logOpacity} />
      </g>
      <text
        x="236"
        y="182"
        fill={colors.faintInk}
        fontFamily={handFont}
        fontSize="22"
        fontWeight="900"
        opacity={fadeIn(frame - 12, 12) * (1 - reveal * 0.55)}
      >
        tap tap tap...
      </text>
    </g>
  );
};

const BackTypingTurnFigure: React.FC<{ frame: number }> = ({ frame }) => {
  const turn = smooth((frame - 34) / 42);
  const tap = Math.sin(frame / 2.4);
  const shoulderSway = Math.sin(frame / 8) * 4;
  const backOpacity = 1 - smooth((turn - 0.18) / 0.62);
  const sideOpacity = smooth((turn - 0.18) / 0.62);

  return (
    <g>
      <g opacity={backOpacity} transform={`translate(${turn * 16} ${wiggle(frame, 1.5, 10)})`}>
        <BackDoodleHead frame={frame} x={10 + turn * 18} y={-216} r={43} />
        <g {...ink} strokeWidth="7" filter="url(#marker-wobble)">
          <path d={`M 8 -170 Q ${-2 + shoulderSway} -112 10 -54`} />
          <path d={`M -54 ${-140 + shoulderSway * 0.3} Q 12 -126 74 ${-140 - shoulderSway * 0.25}`} />
          <path d={`M -48 -136 Q 28 -92 162 ${-36 + tap * 5}`} />
          <path d={`M 72 -136 Q 132 -96 196 ${-46 - tap * 5}`} />
          <path d="M 8 -54 Q -44 -18 -78 54" />
          <path d="M 8 -54 Q 54 -12 86 54" />
          <path d="M -78 54 Q -56 66 -34 58" />
          <path d="M 86 54 Q 110 66 132 58" />
        </g>
      </g>

      <g opacity={sideOpacity} transform={`translate(${14 + turn * 6} ${wiggle(frame, 1.2, 12)})`}>
        <g {...ink} strokeWidth="7" filter="url(#marker-wobble)">
          <path d="M 18 -168 Q 28 -110 20 -58" />
          <path d={`M 20 -136 Q 104 -92 180 ${-38 + tap * 3}`} />
          <path d={`M 20 -132 Q ${-22 - turn * 16} -108 ${-54 - turn * 10} -72`} />
          <path d="M 20 -58 Q -34 -12 -74 52" />
          <path d="M 20 -58 Q 70 -18 116 48" />
          <path d="M -74 52 Q -48 64 -24 56" />
          <path d="M 116 48 Q 140 62 166 54" />
        </g>
        <CartoonHead
          x={38}
          y={-214}
          r={43}
          expression="worried"
          frame={frame}
          look="right"
          facing="right"
          sweat={frame > 86}
        />
        <path
          d="M -86 -100 Q -128 -132 -152 -178"
          {...ink}
          strokeWidth="4"
          opacity={fadeIn(frame - 48, 10)}
          filter="url(#marker-wobble)"
        />
      </g>
    </g>
  );
};

const BackDoodleHead: React.FC<{ frame: number; x: number; y: number; r: number }> = ({
  frame,
  x,
  y,
  r,
}) => (
  <g filter="url(#marker-wobble)" transform={`translate(0 ${wiggle(frame, 1.4, 9)})`}>
    <circle cx={x} cy={y} r={r} fill={colors.paper} stroke={colors.ink} strokeWidth="6" />
    <path d={`M ${x - 30} ${y - r + 8} L ${x - 10} ${y - r - 20} L ${x - 5} ${y - r + 6}`} {...ink} strokeWidth="6" />
    <path d={`M ${x + 0} ${y - r + 4} L ${x + 22} ${y - r - 18} L ${x + 18} ${y - r + 8}`} {...ink} strokeWidth="6" />
    <path d={`M ${x + 24} ${y - r + 10} L ${x + 42} ${y - r - 3}`} {...ink} strokeWidth="5" />
    <path d={`M ${x - 22} ${y + 24} Q ${x + 2} ${y + 34} ${x + 28} ${y + 22}`} {...ink} strokeWidth="3" opacity="0.25" />
  </g>
);

const TypingLaptop: React.FC<{ x: number; y: number; frame: number; reveal: number }> = ({
  x,
  y,
  frame,
  reveal,
}) => {
  const cursor = Math.floor(frame / 8) % 2 === 0 ? "_" : " ";

  return (
    <g transform={`translate(${x} ${y})`} filter="url(#marker-wobble)">
      <rect x="0" y="0" width="318" height="204" rx="12" fill={colors.paper} stroke={colors.ink} strokeWidth="7" />
      <rect x="24" y="24" width="270" height="144" rx="9" fill={colors.blueSoft} stroke={colors.ink} strokeWidth="4" />
      <path d="M -76 204 L 352 204 L 408 238 L -124 238 Z" fill={colors.paper} stroke={colors.ink} strokeWidth="7" strokeLinejoin="round" />
      <g opacity={1 - reveal * 0.75}>
        <text x="48" y="78" fill={colors.ink} fontFamily={monoFont} fontSize="15" fontWeight="900">
          continua run{cursor}
        </text>
        <path d={`M 46 112 Q 104 ${104 + wiggle(frame, 3, 7)} 164 112 T 260 112`} {...ink} strokeWidth="4" opacity="0.35" />
      </g>
      <g opacity={reveal}>
        <text x="44" y="62" fill={colors.ink} fontFamily={handFont} fontSize="22" fontWeight="900">
          Continua
        </text>
        <path d="M 44 92 L 246 92 M 44 122 L 218 122 M 44 152 L 264 152" {...ink} strokeWidth="4" opacity="0.55" />
        <circle cx="250" cy="58" r="10" fill={colors.green} stroke={colors.ink} strokeWidth="3" />
      </g>
      <Pencil x={330} y={184} angle={-7} />
    </g>
  );
};

const ContinuaPopPanel: React.FC<{ frame: number; opacity: number }> = ({
  frame,
  opacity,
}) => {
  const rows = [
    "step 1  checkpoint",
    "step 2  tool call",
    "crash   saved",
    "resume  replay",
  ];

  return (
    <g opacity={opacity}>
      <rect x="0" y="0" width="318" height="214" rx="18" fill={colors.paper} stroke={colors.ink} strokeWidth="6" />
      <rect x="20" y="18" width="278" height="176" rx="12" fill={colors.blueSoft} stroke={colors.ink} strokeWidth="3" opacity="0.9" />
      <text x="36" y="52" fill={colors.ink} fontFamily={handFont} fontSize="25" fontWeight="900">
        durable event log
      </text>
      {rows.map((row, index) => (
        <text
          key={row}
          x="38"
          y={88 + index * 28}
          fill={colors.ink}
          fontFamily={monoFont}
          fontSize="14"
          fontWeight="900"
          opacity={fadeIn(frame - 70 - index * 7, 8)}
        >
          {row}
        </text>
      ))}
      <g transform="translate(246 158)" opacity={fadeIn(frame - 96, 10)}>
        <path d="M 0 -14 C 42 -34 52 30 8 38 C -36 46 -46 -18 -2 -24" {...ink} strokeWidth="5" />
        <path d="M 0 -14 L -4 -40 L 24 -28" {...ink} strokeWidth="5" />
      </g>
    </g>
  );
};

const DeskWithLaptop: React.FC<{
  x: number;
  y: number;
  mode: "agents" | "continua";
  frame: number;
}> = ({ x, y, mode, frame }) => {
  const laptopWidth = mode === "agents" ? 430 : 344;
  const screenWidth = laptopWidth - 44;
  const deskEnd = mode === "agents" ? 650 : 522;

  return (
    <g transform={`translate(${x} ${y})`} filter="url(#marker-wobble)">
      <g {...ink} strokeWidth="7">
        <path d={`M -112 226 L ${deskEnd} 226`} />
        <path d="M -64 226 L -64 368" />
        <path d={`M ${deskEnd - 50} 226 L ${deskEnd - 50} 368`} />
        <path d="M 42 256 L 42 360" />
      </g>
      <g transform="translate(66 0)">
        <rect
          x="0"
          y="0"
          width={laptopWidth}
          height="226"
          rx="12"
          fill={colors.paper}
          stroke={colors.ink}
          strokeWidth="7"
        />
        <rect
          x="22"
          y="22"
          width={screenWidth}
          height="170"
          rx="9"
          fill={colors.blueSoft}
          stroke={colors.ink}
          strokeWidth="4"
        />
        <path
          d={`M -40 226 L ${laptopWidth + 36} 226 L ${laptopWidth + 92} 260 L -92 260 Z`}
          fill={colors.paper}
          stroke={colors.ink}
          strokeWidth="7"
          strokeLinejoin="round"
        />
        {mode === "agents" ? (
          <AgentScreen frame={frame} width={screenWidth} />
        ) : (
          <ContinuaScreen frame={frame} />
        )}
      </g>
      <Pencil x={mode === "agents" ? 574 : 420} y={204} angle={-7} />
      <CrumpledPaper x={mode === "agents" ? 646 : 492} y={192} scale={0.8} />
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

const ContinuaScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const rows = [
    "run:start       ok",
    "span:tool       stream",
    "pod:faceplant   nope",
    "checkpoint      resume",
  ];

  return (
    <g transform="translate(42 44)">
      <text x="0" y="-8" fill={colors.ink} fontFamily={handFont} fontSize="22" fontWeight="900">
        event log
      </text>
      {rows.map((row, index) => (
        <text
          key={row}
          x="0"
          y={32 + index * 32}
          fill={colors.ink}
          fontFamily={monoFont}
          fontSize="15"
          fontWeight="900"
          opacity={fadeIn(frame - index * 16, 8)}
        >
          {row}
        </text>
      ))}
      <g transform="translate(238 124)" opacity={fadeIn(frame - 76, 10)}>
        <path d="M 0 -16 C 42 -36 54 30 8 38 C -38 46 -46 -20 -2 -24" {...ink} strokeWidth="5" />
        <path d="M 0 -16 L -4 -42 L 24 -28" {...ink} strokeWidth="5" />
      </g>
    </g>
  );
};

const SketchChair: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} {...ink} strokeWidth="6" filter="url(#marker-wobble)">
    <path d="M -86 -142 L -58 78" />
    <path d="M 72 -134 L 42 72" />
    <path d="M -74 -72 L 60 -92" />
    <path d="M -66 -20 L 52 -38" />
    <path d="M -86 0 L 82 0 L 66 42 L -70 42 Z" fill={colors.paper} />
    <path d="M -54 42 L -60 142" />
    <path d="M 52 42 L 48 142" />
  </g>
);

const ServerPod: React.FC<{ x: number; y: number; frame: number }> = ({
  x,
  y,
  frame,
}) => {
  const fall = interpolate(frame, [24, 54, 88, 118], [0, 66, 66, 0], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const resume = fadeIn(frame - 82, 12);

  return (
    <g transform={`translate(${x} ${y})`} filter="url(#marker-wobble)">
      <g transform={`rotate(${fall} 70 92)`}>
        <rect x="0" y="0" width="140" height="172" rx="14" fill={colors.paper} stroke={colors.ink} strokeWidth="6" />
        <path d="M 22 42 L 118 42 M 22 86 L 118 86 M 22 130 L 118 130" {...ink} strokeWidth="4" />
        <circle cx="34" cy="24" r="7" fill={frame > 38 && frame < 90 ? colors.red : colors.green} stroke={colors.ink} strokeWidth="3" />
        <text x="70" y="158" textAnchor="middle" fill={colors.ink} fontFamily={handFont} fontSize="20" fontWeight="900">
          pod
        </text>
      </g>
      <text x="18" y="214" fill={colors.ink} fontFamily={handFont} fontSize="24" fontWeight="900" opacity={frame > 38 && frame < 90 ? 1 : 0}>
        faceplant
      </text>
      <g transform="translate(48 -32)" opacity={resume}>
        <path d="M 48 0 C 98 14 88 84 36 88 C -14 92 -26 28 24 16" {...ink} strokeWidth="6" />
        <path d="M 48 0 L 36 24 L 68 18" {...ink} strokeWidth="6" />
      </g>
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

const Pencil: React.FC<{ x: number; y: number; angle: number }> = ({ x, y, angle }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} filter="url(#marker-wobble)">
    <rect x="-54" y="-8" width="92" height="16" rx="4" fill={colors.yellow} stroke={colors.ink} strokeWidth="4" />
    <path d="M 38 -8 L 62 0 L 38 8 Z" fill={colors.paper} stroke={colors.ink} strokeWidth="4" />
    <line x1="-30" y1="-8" x2="-30" y2="8" stroke={colors.ink} strokeWidth="3" />
  </g>
);

const CrumpledPaper: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} filter="url(#marker-wobble)">
    <path d="M -26 -22 L -2 -34 L 20 -22 L 34 6 L 10 30 L -18 24 L -36 4 Z" fill={colors.paper} stroke={colors.ink} strokeWidth="5" />
    <path d="M -22 -4 L -2 -12 L 18 10 M -2 -34 L 0 10 M 20 -22 L 8 -4" {...ink} strokeWidth="3" />
  </g>
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

const TurnArcs: React.FC<{ x: number; y: number; frame: number }> = ({
  x,
  y,
  frame,
}) => {
  const opacity = fadeIn(frame - 34, 8) * fadeOut(frame, 86, 14);

  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity} filter="url(#marker-wobble)">
      <path d="M -70 -34 Q -28 -70 30 -58" {...ink} strokeWidth="4" />
      <path d="M -56 -6 Q -16 -34 36 -28" {...ink} strokeWidth="3" opacity="0.75" />
      <path d="M 28 -58 L 10 -48 L 22 -78" {...ink} strokeWidth="4" />
    </g>
  );
};

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
