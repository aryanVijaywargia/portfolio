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
      statistic: "200+",
      tooltip: "Pull requests merged across owned repos",
      caption: "PRs Merged",
    },
    {
      statistic: "∞",
      tooltip: "Coffee consumption is the one metric I refuse to track honestly",
      caption: "Coffees",
    },
  ],
  descriptions: {
    brief: (
      <p>I’m trying my very best.</p>
    ),
    standard: (
      <>
        <p>
          <strong>Senior Software Engineer</strong> at <strong>GEP Worldwide</strong>, based in
          India. I work on an AI agent orchestration builder platform, mostly around agent
          workflows, streaming experiences, tool integrations, and making complex systems feel
          easier to use.
        </p>
        <p>
          Outside work, I’m usually travelling, reading non-fiction suspiciously slowly, or
          trying to balance gym, swimming, and pretending I have a routine.
        </p>
        <p>
          I’m pretty sure AGI shows up eventually, so I’m trying my very best to understand
          where things are headed.
        </p>
      </>
    ),
    detailed: (
      <>
        <p>
          <strong>Senior Software Engineer</strong> at <strong>GEP Worldwide</strong>, based in
          India. I work on an AI agent orchestration builder platform - building the systems
          that let agent workflows stream responses, render interactive UI, connect with tools,
          and pause for human decisions when needed.
        </p>
        <p>
          I enjoy working on products where the hard part is not just making something work,
          but making it feel reliable, understandable, and useful for the people building on
          top of it. Most of my work sits somewhere between backend engineering, agent
          workflows, search, and developer experience.
        </p>
        <p>
          Outside work, I’m usually planning my next trip, reading non-fiction at a pace that
          can generously be called “ongoing,” lifting during the week, or swimming on weekends.
          I’m pretty sure AGI shows up eventually, so I’m trying my very best to understand
          where things are headed before it starts assigning me story points.
        </p>
      </>
    ),
  },
  images: [
    {
      src: Aryan1,
      alt: "Aryan candid photo",
      tooltip: "haven't taken a new one in years and don't plan to",
    },
    {
      src: Aryan2,
      alt: "Aryan travel photo",
      tooltip:
        "Hi, thanks for reaching out. I am currently out of office and will have limited access to messages. Please expect delays in response. For urgent matters, kindly reach out at.......",
    },
    {
      src: Aryan3,
      alt: "Aryan receiving his B.Tech degree",
      tooltip: "Graduated, was a big day for my family whatsapp group",
    },
    {
      src: Aryan4,
      alt: "Aryan with a deer in Nara, Japan",
      tooltip: "Selfie with the extrovert final boss",
    },
    {
      src: Aryan5,
      alt: "Aryan trekking in the Himalayas, Nepal",
      tooltip: "The mountains carried this picture.",
    },
    {
      src: Aryan6,
      alt: "Aryan Vijaywargia portrait",
      tooltip: "hehe",
    },
  ],
};
