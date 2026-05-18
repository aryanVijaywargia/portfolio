import { TECH } from "content/tech-stack";
import { Link } from "components/link";

export const CV = {
  name: "Aryan Vijaywargia",
  title: "Senior Software Engineer",
  primary_stack: [TECH.go, TECH.csharp, TECH.dotnet, TECH.typescript, TECH.python],
  address: "India",
  email: "aryanvijaywargia@gmail.com",
  website: "https://aryanvijaywargia.com",
  mobile: {
    href: `tel:+917424904411`,
    number: "+91 74249 04411",
  },
  intro: (
    <>
      I'm a Senior Software Engineer at <strong>GEP Worldwide</strong>, building the Leo Agentic
      Runtime and the Leo search platform — agentic streaming protocols, durable Human-in-the-Loop
      subsystems, a pluggable Elasticsearch query platform, and a Logstash CDC fabric spanning
      171 pipelines across 28 business domains. On the side I'm building{" "}
      <Link href="https://www.continua.in/">Continua</Link>, a Go/Postgres durable execution engine
      purpose-built for AI agents.
    </>
  ),
  eduction: [
    {
      dateFrom: "2019-07-01",
      dateTo: "2023-07-01",
      city: "Agartala",
      country: "India",
      institution: "National Institute of Technology Agartala",
      certificate: "Bachelor of Technology in Computer Science & Engineering",
      level: "Higher Education",
      type: ["relevant", "web / tech dev"],
    },
  ],
  experience: [
    {
      dateFrom: "2023-07-01",
      dateTo: "2099-12-31",
      city: "Mumbai",
      country: "India",
      company: "GEP Worldwide",
      title: "Senior Software Engineer (Jul 2025 — Present) · Software Engineer (Jul 2023 — Jul 2025)",
      type: ["web / tech dev", "relevant"],
      responsibilities: [
        {
          content:
            "Engineered the AG-UI streaming protocol adapter for the Leo Agentic Runtime — a real-time SSE bridge translating LangGraph executions into typed AG-UI events; cut time-to-first-token from ~5s batch to ~500ms streaming.",
          type: ["web / tech dev", "relevant"],
        },
        {
          content:
            "Engineered session-scoped MCP client pooling — 100-client LRU pool with a promise-chain mutex preventing overflow and delete-before-close races; measured 2.8× speedup (1250 ms → 450 ms) on a 5-tool workflow.",
          type: ["web / tech dev", "relevant"],
        },
        {
          content:
            "Architected the durable Human-in-the-Loop interrupt/resume subsystem — 4 interrupt types via custom LangChain middleware, MongoDB checkpointer; 100% in-flight survival across pod restarts, P95 < 500 ms resume latency.",
          type: ["web / tech dev", "relevant"],
        },
        {
          content:
            "Architected the Leo Search Runtime — a pluggable Elasticsearch query platform exposing 7 query types, a recursive expression evaluator over 6 operators, and a strategy-based text pipeline with 8 normalization strategies.",
          type: ["web / tech dev", "relevant"],
        },
        {
          content:
            "Built and operated the Leo Storage CDC platform — a Logstash fabric on secured Kafka (SCRAM-SHA-512), 171 pipelines spanning 28 business domains, keeping Elasticsearch in sync with MSSQL/MongoDB sources across Azure and AWS.",
          type: ["web / tech dev", "relevant"],
        },
        {
          content:
            "Shipped semantic search via a KNN dense-vector query builder over Elasticsearch backed by a 3-tier embedding cache — collapsed p95 vectorization latency from ~200 ms to <10 ms on cache hits.",
          type: ["web / tech dev", "relevant"],
        },
        {
          content:
            "Designed SearchOps, a REST API for Elasticsearch index lifecycle management — orchestrating ~1k bulk sync/reindex jobs/month across 80+ managed indices.",
          type: ["web / tech dev", "relevant"],
        },
      ],
    },
    {
      dateFrom: "2022-07-01",
      dateTo: "2023-01-01",
      city: "Hyderabad",
      country: "India",
      company: "IHub-Data, IIIT Hyderabad",
      title: "Machine Learning Intern",
      type: ["web / tech dev", "relevant"],
      responsibilities: [
        {
          content:
            "Built a Flask web app for the Roadex project running 3 YOLO-based CV pipelines (pothole, triple-rider, tree obstruction) on dash-cam video at ~12 FPS — streaming MJPEG frames and persisting run metadata in SQLite.",
          type: ["web / tech dev", "relevant"],
        },
        {
          content:
            "Built the triple-rider violation pipeline cascading TensorFlow YOLOv4 (rider/motorcycle) with PyTorch YOLOv5 (helmet) — 0.83 mAP@0.5, 91% helmet accuracy — using IoU-based matching and Deep SORT tracking.",
          type: ["web / tech dev", "relevant"],
        },
      ],
    },
    {
      dateFrom: "2021-11-01",
      dateTo: "2022-06-01",
      city: "Remote",
      country: "India",
      company: "India Meteorological Department (IMD)",
      title: "Research Intern",
      type: ["web / tech dev", "relevant"],
      responsibilities: [
        {
          content:
            "Engineered an LSTM-based prediction model outputting the next-day severity plot of a hailstorm to occur, from meteorological inputs.",
          type: ["web / tech dev", "relevant"],
        },
        {
          content:
            "Implemented mathematical functions and statistical reviews backing a peer-reviewed journal submission.",
          type: ["web / tech dev", "relevant"],
        },
      ],
    },
    {
      dateFrom: "2021-12-01",
      dateTo: "2022-02-01",
      city: "Remote",
      country: "USA",
      company: "Omdena × EnergyHub",
      title: "Machine Learning Engineer",
      type: ["web / tech dev", "relevant"],
      responsibilities: [
        {
          content:
            "Selected among 50 ML engineers from 20 countries for an Omdena resource project sponsored by EnergyHub — optimized EV distributed network service by analyzing EV charging data.",
          type: ["web / tech dev", "relevant"],
        },
        {
          content:
            "Designed clustering algorithms organizing unlabelled time-series data into clusters by electricity consumption profile — impacting 20+ business partners of C4Net and EnergyHub.",
          type: ["web / tech dev", "relevant"],
        },
      ],
    },
    {
      dateFrom: "2021-09-01",
      dateTo: "2022-01-01",
      city: "Shillong",
      country: "India",
      company: "ISRO-NESAC",
      title: "Research Assistant",
      type: ["web / tech dev", "relevant"],
      responsibilities: [
        {
          content:
            "Designed stacked LSTM and LSTM-CNN models for multivariate time-series forecasting of ionospheric parameters across the North East Region of India — RMSE 0.22.",
          type: ["web / tech dev", "relevant"],
        },
        {
          content:
            "Built an LSTM-autoencoder anomaly-detection pipeline for earthquake precursors (F1 0.78) and Mini-SOM zone clusters for 1-day forecasts at 53% accuracy.",
          type: ["web / tech dev", "relevant"],
        },
        {
          content:
            "Streamlined a Dash-framework web interface automating the full project pipeline for a minimalistic user experience.",
          type: ["web / tech dev", "relevant"],
        },
      ],
    },
  ],
  capabilities: {
    languages: [
      {
        name: "English - fluent",
        Icon: null,
      },
      {
        name: "Hindi - native",
        Icon: null,
      },
    ],
    programmingLanguages: [
      TECH.go,
      TECH.csharp,
      TECH.python,
      TECH.typescript,
      TECH.javascript,
      TECH.cplusplus,
      TECH.sql,
    ],
    librariesFrameworks: [
      TECH.dotnet,
      TECH.angular,
      TECH.react,
      TECH.tensorflow,
      TECH.pytorch,
      TECH.flask,
    ],
    serviceProviders: [
      TECH.github,
      TECH.aws,
    ],
    marketing: [],
    dataProviders: [
      TECH.postgresql,
      TECH.mongodb,
      TECH.elasticsearch,
      TECH.kafka,
    ],
    tools: [
      TECH.git,
      TECH.docker,
      TECH.kubernetes,
    ],
  },
  certifications: [
    {
      date: "2022",
      name: "Computer Vision Nanodegree — Udacity",
      type: ["web / tech dev", "relevant"],
    },
    {
      date: "2021",
      name: "Deep Learning Specialization — Coursera",
      type: ["web / tech dev", "relevant"],
    },
  ],
  other: [
    {
      name: "Continua — durable execution engine for AI agents (continua.in)",
    },
    {
      name: "GDSC Lead, NIT Agartala (Jul 2021 — Jul 2022) — hosted GDSC Explore fest",
    },
    {
      name: "Dockship.io — Bike Sharing Prediction: 6th of 250+ participants",
    },
    {
      name: "HakinCodes Contributor's Hack 2020: 23rd of 500+ contributors",
    },
    {
      name: "Publication: \"Forecasting Vertical Total Electron Content to Witness Seismic Perturbations prior to North Eastern Earthquake in India\" — IJPRAI (under review)",
    },
    {
      name: "Publication: \"Prediction of Future Earthquake Zones in the South East Asian Region viz. Ionospheric Precursors\" — AGU Earth & Space Science (in communication)",
    },
  ],
  references: [],
  personal: `I'm a Senior Software Engineer who likes building the infrastructure other people's agents and applications run on — durable execution engines, streaming protocol adapters, search platforms, and CDC fabrics. Outside of work, I'm building Continua, a Go/Postgres durable execution engine for AI agents.`,
};
