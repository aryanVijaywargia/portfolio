import "./index.css";
import { Composition } from "remotion";
import { AryanIntro, DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AryanIntro"
        component={AryanIntro}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
