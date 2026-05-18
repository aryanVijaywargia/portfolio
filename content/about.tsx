import Aryan1 from "../public/images/about/aryan-1.jpg";
import Aryan2 from "../public/images/about/aryan-2.jpg";
import Aryan3 from "../public/images/about/aryan-3.jpg";
import Aryan4 from "../public/images/about/aryan-4.jpg";
import Aryan5 from "../public/images/about/aryan-5.jpg";
import Aryan6 from "../public/images/about/aryan-6.jpg";

const getExperienceYearsSince = (startDate: Date) => {
  const now = new Date();
  let totalMonths =
    (now.getFullYear() - startDate.getFullYear()) * 12 + now.getMonth() - startDate.getMonth();

  if (now.getDate() < startDate.getDate()) {
    totalMonths -= 1;
  }

  return `${Math.max(0, Math.floor(totalMonths / 12))}+`;
};

export const ABOUT = {
  stats: [
    {
      statistic: getExperienceYearsSince(new Date("2023-06-01T00:00:00")),
      tooltip: "Full-time engineering experience since June 2023",
      caption: "Experience",
    },
    {
      statistic: "1K+",
      tooltip:
        "1,875 authored default-branch commits across owned non-fork repos, including private repos",
      caption: "Git Commits",
    },
    {
      statistic: "171",
      tooltip: "Logstash CDC pipelines spanning 28 business domains on the Leo Storage platform",
      caption: "CDC Pipelines",
    },
  ],
  descriptions: {
    brief: (
      <p>
        I'm an India-based <strong>Senior Software Engineer</strong> at <strong>GEP Worldwide</strong>,
        building the Leo Agentic Runtime and the Leo search platform. My focus is backend
        infrastructure — durable execution, streaming protocols, search, and CDC.
      </p>
    ),
    standard: (
      <>
        <p>
          I'm an India-based <strong>Senior Software Engineer</strong> at{" "}
          <strong>GEP Worldwide</strong>, building the Leo Agentic Runtime and the Leo search
          platform. My focus is backend infrastructure — durable execution, streaming protocols,
          search, and CDC.
        </p>
        <p>
          On the side, I'm building <strong>Continua</strong>, a Go/Postgres durable execution
          engine purpose-built for AI agents — event-sourced replay, lease-based crash recovery,
          and a React time-travel trace debugger over event-sourced history.
        </p>
      </>
    ),
    detailed: (
      <>
        <p>
          I'm an India-based <strong>Senior Software Engineer</strong> at{" "}
          <strong>GEP Worldwide</strong>, building the Leo Agentic Runtime and the Leo search
          platform. My focus is backend infrastructure — durable execution, streaming protocols,
          search, and CDC.
        </p>
        <p>
          On the side, I'm building <strong>Continua</strong>, a Go/Postgres durable execution
          engine purpose-built for AI agents — event-sourced replay, lease-based crash recovery,
          and a React time-travel trace debugger over event-sourced history.
        </p>
        <p>
          Before GEP I studied Computer Science & Engineering at <strong>NIT Agartala</strong>{" "}
          (CGPA 8.59) and interned at <strong>IHub-Data, IIIT Hyderabad</strong> building YOLO-based
          CV pipelines on dash-cam video. I work primarily in Go, C#, Python, and TypeScript.
        </p>
      </>
    ),
  },
  images: [
    {
      src: Aryan1,
      alt: "Aryan candid photo",
    },
    {
      src: Aryan2,
      alt: "Aryan travel photo",
    },
    {
      src: Aryan3,
      alt: "Aryan at a tech event",
    },
    {
      src: Aryan4,
      alt: "Aryan working on ML projects",
    },
    {
      src: Aryan5,
      alt: "Aryan exploring new places",
    },
    {
      src: Aryan6,
      alt: "Aryan Vijaywargia portrait",
    },
  ],
};
