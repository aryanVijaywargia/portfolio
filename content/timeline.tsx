import { StarIcon } from "@heroicons/react/20/solid";
import { BoltIcon, BookOpenIcon, BuildingOffice2Icon, ChartBarIcon, CodeBracketIcon, CodeBracketSquareIcon, CommandLineIcon, ComputerDesktopIcon, CpuChipIcon, FireIcon, MagnifyingGlassIcon, RocketLaunchIcon, ServerStackIcon, SignalIcon, SparklesIcon, TrophyIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { FaGraduationCap } from "@react-icons/all-files/fa/FaGraduationCap";
import { FaRobot } from "react-icons/fa";
import { SiTensorflow } from "@react-icons/all-files/si/SiTensorflow";
import { SiPython } from "@react-icons/all-files/si/SiPython";
import { GiArtificialIntelligence } from "react-icons/gi";
import { MdScience } from "react-icons/md";
import { IoSchool } from "react-icons/io5";

export const TIMELINEOBJECT = {
  "2019": [
    {
      date: "2019-07-01",
      heading: "Started B.Tech at NIT Agartala",
      description:
        "Began my journey in Computer Science & Engineering at National Institute of Technology Agartala.",
      Icon: ({ className = "" }) => <FaGraduationCap className={className} />,
    },
    {
      date: "2019-09-01",
      heading: "First Python Project",
      description:
        "Wrote my first Python script and fell in love with programming. Started exploring data science and machine learning.",
      Icon: ({ className = "" }) => <CodeBracketIcon className={className} />,
    },
  ],
  "2020": [
    {
      date: "2020-03-01",
      heading: "Deep Dive into ML",
      description:
        "Started learning Machine Learning and Deep Learning through online courses. Completed Andrew Ng's Deep Learning Specialization.",
      Icon: ({ className = "" }) => <BookOpenIcon className={className} />,
    },
    {
      date: "2020-08-01",
      heading: "First ML Project",
      description:
        "Built my first machine learning project - a sentiment analysis model for movie reviews using NLP techniques.",
      Icon: ({ className = "" }) => <CodeBracketSquareIcon className={className} />,
    },
    {
      date: "2020-12-01",
      heading: "OpenCV Sudoku Solver",
      description:
        "Shipped a Sudoku solver combining OpenCV image processing with a fine-tuned VGG-16 digit recognizer at 99.3% accuracy, plus a backtracking solver.",
      Icon: ({ className = "" }) => <CodeBracketSquareIcon className={className} />,
    },
  ],
  "2021": [
    {
      date: "2021-07-01",
      heading: "GDSC Lead at NIT Agartala",
      description:
        "Became the Google Developer Student Clubs Lead at NIT Agartala, leading a chapter of 20+ members for the developer community across Northeast India.",
      Icon: ({ className = "" }) => <UserCircleIcon className={className} />,
    },
    {
      date: "2021-01-01",
      heading: "Computer Vision Focus",
      description:
        "Started specializing in Computer Vision. Completed Udacity's Computer Vision Nanodegree.",
      Icon: ({ className = "" }) => <ComputerDesktopIcon className={className} />,
    },
    {
      date: "2021-09-01",
      heading: "ISRO-NESAC Research",
      description:
        "Joined ISRO-NESAC as a Research Assistant. Worked on earthquake prediction using LSTM models and ionospheric parameter forecasting.",
      Icon: ({ className = "" }) => <BuildingOffice2Icon className={className} />,
    },
    {
      date: "2021-09-15",
      heading: "Omdena Netherlands Chapter",
      description:
        "Joined Omdena Netherlands as an open-source contributor - worked on AI for food security and crop yield, building a pest-detection pipeline with TensorFlow Lite.",
      Icon: ({ className = "" }) => <FaRobot className={className} />,
    },
    {
      date: "2021-11-01",
      heading: "IMD Research Intern",
      description:
        "Started working with India Meteorological Department on LSTM-based hailstorm severity prediction.",
      Icon: ({ className = "" }) => <SignalIcon className={className} />,
    },
    {
      date: "2021-12-01",
      heading: "Omdena ML Engineer",
      description:
        "Joined Omdena as an ML Engineer. Worked on EV charging optimization for EnergyHub using time series clustering.",
      Icon: ({ className = "" }) => <ChartBarIcon className={className} />,
    },
  ],
  "2022": [
    {
      date: "2022-01-01",
      heading: "GDSC Lead",
      description:
        "Became the Google Developer Student Clubs Lead at NIT Agartala. Organized workshops and events for the developer community.",
      Icon: ({ className = "" }) => <UserCircleIcon className={className} />,
    },
    {
      date: "2022-04-01",
      heading: "Forex Trading ML System",
      description:
        "Built a CNN-LSTM model for FOREX trading recommendations using Twitter sentiment analysis.",
      Icon: ({ className = "" }) => <ChartBarIcon className={className} />,
    },
    {
      date: "2022-05-01",
      heading: "OpenCV Sudoku Solver",
      description:
        "Created an image processing project using VGG-16 for digit recognition with 99.3% accuracy.",
      Icon: ({ className = "" }) => <CodeBracketSquareIcon className={className} />,
    },
    {
      date: "2022-07-01",
      heading: "IHub-Data IIIT Hyderabad",
      description:
        "Joined as ML Intern. Built pothole & triple rider detection using YOLOv5 from dash camera footage.",
      Icon: ({ className = "" }) => <BuildingOffice2Icon className={className} />,
    },
    {
      date: "2022-09-01",
      heading: "Deep Handwriting Synthesis",
      description:
        "Developed an attention-based encoder-decoder RNN for handwriting generation.",
      Icon: ({ className = "" }) => <CodeBracketIcon className={className} />,
    },
  ],
  "2023": [
    {
      date: "2023-07-01",
      heading: "Graduated from NIT Agartala",
      description:
        "Completed B.Tech in Computer Science & Engineering with CGPA 8.59. Ready for the next chapter!",
      Icon: ({ className = "" }) => <FaGraduationCap className={className} />,
    },
    {
      date: "2023-07-15",
      heading: "Joined GEP Worldwide",
      description:
        "Started as a Software Engineer at GEP Worldwide, working on the Leo platform across search, storage, and agentic runtimes - Go, C#, .NET, Angular, Elasticsearch.",
      Icon: ({ className = "" }) => <BuildingOffice2Icon className={className} />,
    },
  ],
  "2024": [
    {
      date: "2024-03-01",
      heading: "Leo Storage CDC platform shipped",
      description:
        "Built and operated a Logstash fabric over secured Kafka (SCRAM-SHA-512) - 171 CDC pipelines across 28 business domains, keeping Elasticsearch in sync with MSSQL/MongoDB sources on Azure and AWS.",
      Icon: ({ className = "" }) => <ServerStackIcon className={className} />,
    },
    {
      date: "2024-09-01",
      heading: "Leo Search Runtime + semantic search",
      description:
        "Architected a pluggable Elasticsearch query platform with 7 query types and shipped semantic KNN search backed by a 3-tier embedding cache - collapsed p95 vectorization latency from ~200 ms to <10 ms on cache hits.",
      Icon: ({ className = "" }) => <MagnifyingGlassIcon className={className} />,
    },
  ],
  "2025": [
    {
      date: "2025-07-01",
      heading: "Promoted to Senior Software Engineer",
      description:
        "Promoted to Senior Software Engineer at GEP Worldwide, leading work on the Leo Agentic Runtime.",
      Icon: ({ className = "" }) => <TrophyIcon className={className} />,
    },
    {
      date: "2025-08-01",
      heading: "AG-UI streaming protocol adapter",
      description:
        "Shipped a real-time SSE bridge translating LangGraph executions into typed AG-UI events - cut time-to-first-token from ~5 s batch to ~500 ms streaming on typical multi-step workflows.",
      Icon: ({ className = "" }) => <BoltIcon className={className} />,
    },
    {
      date: "2025-09-01",
      heading: "Continua launched",
      description:
        "Started Continua - a Go/Postgres durable execution engine purpose-built for AI agents, with event-sourced replay, byte-exact divergence detection, and a React time-travel trace debugger.",
      Icon: ({ className = "" }) => <RocketLaunchIcon className={className} />,
    },
  ],
  "2026": [
    {
      date: "2026-02-01",
      heading: "MCP pooling + durable HITL live",
      description:
        "Session-scoped MCP client pooling (2.8× speedup on 5-tool workflows) and a durable Human-in-the-Loop interrupt/resume subsystem (100% survival across pod restarts, P95 < 500 ms resume) shipped to production.",
      Icon: ({ className = "" }) => <CpuChipIcon className={className} />,
    },
  ],
};
