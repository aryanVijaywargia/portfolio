import { SiGo } from "@react-icons/all-files/si/SiGo";
import { SiPostgresql } from "@react-icons/all-files/si/SiPostgresql";
import { SiPython } from "@react-icons/all-files/si/SiPython";
import { SiReact } from "@react-icons/all-files/si/SiReact";
import { SiTypescript } from "@react-icons/all-files/si/SiTypescript";
import { SiTensorflow } from "@react-icons/all-files/si/SiTensorflow";
import { SiPytorch } from "@react-icons/all-files/si/SiPytorch";
import { SiFlask } from "@react-icons/all-files/si/SiFlask";

const TECH = {
  go: {
    name: "Go",
    Icon: ({ className }: { className?: string }) => <SiGo className={className} />,
  },
  postgresql: {
    name: "PostgreSQL",
    Icon: ({ className }: { className?: string }) => <SiPostgresql className={className} />,
  },
  python: {
    name: "Python",
    Icon: ({ className }: { className?: string }) => <SiPython className={className} />,
  },
  react: {
    name: "React",
    Icon: ({ className }: { className?: string }) => <SiReact className={className} />,
  },
  typescript: {
    name: "TypeScript",
    Icon: ({ className }: { className?: string }) => <SiTypescript className={className} />,
  },
  tensorflow: {
    name: "TensorFlow",
    Icon: ({ className }: { className?: string }) => <SiTensorflow className={className} />,
  },
  pytorch: {
    name: "PyTorch",
    Icon: ({ className }: { className?: string }) => <SiPytorch className={className} />,
  },
  flask: {
    name: "Flask",
    Icon: ({ className }: { className?: string }) => <SiFlask className={className} />,
  },
};

export const PROJECTS = [
  {
    name: "Continua",
    type: ["Durable Execution", "AI Infrastructure"],
    tech: [TECH.go, TECH.postgresql, TECH.react, TECH.typescript, TECH.python],
    featuredImage: "/images/projects/continua-brand-card.svg",
    url: "https://www.continua.in/",
    repository: "https://github.com/aryanVijaywargia/Continua",
    description: `A Go/Postgres durable execution engine purpose-built for AI agents — event-sourced replay, byte-exact divergence detection, and lease-based crash recovery with p99 < 50 ms RTT.`,
    content: (
      <>
        <p>
          Continua is a durable execution engine purpose-built for AI agents. The core is a Go service
          backed by PostgreSQL: event-sourced replay with byte-exact divergence detection,{" "}
          <code>FOR UPDATE SKIP LOCKED</code> lease workers (consensus-free crash recovery),
          exponential-backoff retries, continue-as-new, and scope+key CAS dedup. p99 round-trip
          stays under 50 ms, and crash recovery completes within one poll interval.
        </p>
        <p>
          On top of the engine sits a React trace debugger built for time-travel replay over
          event-sourced history — a virtualized 1K+ span waterfall, <code>useDeferredValue</code> JSON
          search across 5K-node trees, an idempotency-aware retry-safety classifier, a state-diff
          viewer, and per-span LLM token/cost attribution with a cumulative-cost step chart.
        </p>
        <p>
          The Python SDK wraps it all with decorator-based agent tracing: <code>ContextVar</code>{" "}
          propagation, semantic decision/effect/tool events, and a remote activity worker with
          lease claim, 50% TTL heartbeats, and SIGTERM drain. The River-backed ingest pipeline
          sustains p95 &lt; 150 ms on 1 MB batches.
        </p>
      </>
    ),
    year: "2025",
  },
  {
    name: "Forex Trading Recommendation System",
    type: ["Machine Learning", "NLP"],
    tech: [TECH.python, TECH.tensorflow],
    url: "",
    repository: "https://dagshub.com/aryanVijaywargia/Forex-Trend-Prediction-System",
    description: `A CNN-LSTM model amalgamating Twitter sentiment analysis from finance-domain tweets with FOREX time-series data to surface trading recommendations — F1 validation 0.62.`,
    content: (
      <>
        <p>
          Built a recommendation system that fuses Twitter sentiment on finance-domain tweets
          with FOREX time-series signals. The CNN-LSTM architecture captures both local phrase
          features and global temporal semantics, hitting an F1 validation score of 0.62.
        </p>
        <p>
          Key challenges: noisy social media data via <code>twint</code>, feature engineering for
          mixed text + time-series inputs, and tuning the hybrid CNN-LSTM head.
        </p>
      </>
    ),
    year: "2022",
  },
  {
    name: "OpenCV Sudoku Solver",
    type: ["Computer Vision", "Deep Learning"],
    tech: [TECH.python, TECH.tensorflow],
    url: "",
    repository: "https://github.com/aryanVijaywargia/Vision-Sudoku",
    description: `End-to-end Sudoku solver combining OpenCV image processing with a fine-tuned VGG-16 digit recognizer at 99.3% accuracy and a backtracking solver.`,
    content: (
      <>
        <p>
          Captures a Sudoku grid from an image, extracts and warps the grid using OpenCV,
          recognizes each digit with a fine-tuned VGG-16 model (99.3% accuracy), and solves the
          puzzle with a backtracking algorithm.
        </p>
      </>
    ),
    year: "2020",
  },
  {
    name: "Roadex — Triple-Rider & Pothole Detection",
    type: ["Computer Vision", "Object Detection"],
    tech: [TECH.python, TECH.tensorflow, TECH.pytorch, TECH.flask],
    url: "",
    repository: "",
    description: `A Flask web app running 3 YOLO-based CV pipelines on dash-cam video at ~12 FPS — including a cascaded TensorFlow YOLOv4 + PyTorch YOLOv5 triple-rider violation pipeline at 0.83 mAP@0.5.`,
    content: (
      <>
        <p>
          Built at IHub-Data, IIIT Hyderabad. The web app runs 3 YOLO-based CV pipelines (pothole,
          triple-rider, tree obstruction) on dash-cam video at ~12 FPS, streams annotated MJPEG
          frames, and persists run metadata in SQLite.
        </p>
        <p>
          The triple-rider violation pipeline cascades TensorFlow YOLOv4 (rider/motorcycle) with
          PyTorch YOLOv5 (helmet) — using IoU-based rider→motorcycle matching and Deep SORT tracking
          with frame interpolation. Hits 0.83 mAP@0.5 with 91% helmet accuracy.
        </p>
      </>
    ),
    year: "2022",
  },
];
