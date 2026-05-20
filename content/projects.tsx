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
    type: ["AI Infrastructure"],
    tech: [TECH.go, TECH.postgresql, TECH.react, TECH.typescript, TECH.python],
    featuredImage: "/images/projects/continua-brand-card.svg",
    url: "https://www.continua.in/",
    repository: "https://github.com/aryanVijaywargia/Continua",
    description: `A Go/Postgres durable execution engine purpose-built for AI agents — event-sourced replay, byte-exact divergence detection, and lease-based crash recovery with p99 < 50 ms RTT.`,
    content: (
      <>
        <p>
          Continua is a durable execution engine purpose-built for AI agents. The core is a Go
          service backed by PostgreSQL: event-sourced replay with byte-exact divergence detection,{" "}
          <code>FOR UPDATE SKIP LOCKED</code> lease workers (consensus-free crash recovery),
          exponential-backoff retries, continue-as-new, and scope+key CAS dedup. p99 round-trip
          stays under 50 ms, and crash recovery completes within one poll interval.
        </p>
        <p>
          On top of the engine sits a React trace debugger built for time-travel replay over
          event-sourced history — a virtualized 1K+ span waterfall, <code>useDeferredValue</code>{" "}
          JSON search across 5K-node trees, an idempotency-aware retry-safety classifier, a
          state-diff viewer, and per-span LLM token/cost attribution with a cumulative-cost step
          chart.
        </p>
        <p>
          The Python SDK wraps it all with decorator-based agent tracing: <code>ContextVar</code>{" "}
          propagation, semantic decision/effect/tool events, and a remote activity worker with lease
          claim, 50% TTL heartbeats, and SIGTERM drain. The River-backed ingest pipeline sustains
          p95 &lt; 150 ms on 1 MB batches.
        </p>
      </>
    ),
    year: "2025",
  },
  {
    name: "Earthquake Precursor Detection — ISRO-NESAC",
    type: ["Machine Learning", "Research"],
    tech: [TECH.python, TECH.tensorflow],
    featuredImage: "/images/projects/earthquake-precursor-card.svg",
    url: "",
    repository: "https://github.com/aryanVijaywargia/EQ-prediction-research",
    links: [
      {
        label: "Report",
        href: "https://drive.google.com/file/d/1TVZKvFrsKzUoTK10MxhN6PfQ-PRd3yVr/view?usp=sharing",
      },
    ],
    description: `Earthquake precursor research from ionospheric signals using LSTM forecasting, anomaly detection, and SOM-based zone prediction.`,
    content: (
      <>
        <p>
          Built at ISRO-NESAC for earthquake precursor research over the North East Region of India.
          Designed stacked LSTM and LSTM-CNN models for multivariate ionospheric forecasting,
          reaching RMSE 0.22, and an LSTM-autoencoder anomaly pipeline reaching F1 0.78.
        </p>
        <p>
          Generated Mini SOM earthquake-prone zone clusters for 1-day forecasts at 53% accuracy and
          shipped a Dash interface that automated the research pipeline end-to-end.
        </p>
      </>
    ),
    year: "2021",
  },
  {
    name: "Forex Trading Recommendation System",
    type: ["Machine Learning"],
    tech: [TECH.python, TECH.tensorflow],
    featuredImage: "/images/projects/forex-nlp-card.svg",
    url: "",
    repository: "https://dagshub.com/aryanVijaywargia/Forex-Trend-Prediction-System",
    description: `A CNN-LSTM system combining finance-domain tweet sentiment with FOREX time-series signals to surface trading recommendations.`,
    content: (
      <>
        <p>
          Built a recommendation system that fuses Twitter sentiment on finance-domain tweets with
          FOREX time-series signals. The CNN-LSTM architecture captures both local phrase features
          and global temporal semantics, hitting an F1 validation score of 0.62.
        </p>
        <p>
          Key challenges: noisy social media data via <code>twint</code>, feature engineering for
          mixed text + time-series inputs, and tuning the hybrid CNN-LSTM head.
        </p>
      </>
    ),
    year: "2022",
  },
];
