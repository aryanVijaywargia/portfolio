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
      statistic: "15+",
      tooltip: "Research papers, projects, and professional work",
      caption: "Projects",
    },
  ],
  descriptions: {
    brief: (
      <p>
        I'm a Madhya Pradesh, India-based Web Developer and Entrepreneur. My focus area for the past few years
        has been front-end development with <strong>Next.js</strong>, <strong>Typescript</strong>,
        and <strong>TailwindCSS</strong> to create beautiful user- and developer experiences that
        bring delight.
      </p>
    ),
    standard: (
      <>
        <p>
          I'm a Madhya Pradesh, India-based Web Developer and Entrepreneur. My focus area for the past few years
          has been front-end development with <strong>Next.js</strong>, <strong>Typescript</strong>,
          and <strong>TailwindCSS</strong> to create beautiful user- and developer experiences that
          bring delight.
        </p>
        <p>
          I've spent most of my life deeply interested in technology and food, continuously building
          things with both. As a teenager, I was a classic computer nerd, spending most of my times
          messing with the computer, doing 1 of 4 things: Modding games and figuring things out.
          Tinkering with hardware, building computers. Developing websites with FrontPage 98 and
          Flash. And of course, playing games.
        </p>
      </>
    ),
    detailed: (
      <>
        <p>
          I'm a Madhya Pradesh, India-based Web Developer and Entrepreneur. My focus area for the past few years
          has been front-end development with <strong>Next.js</strong>, <strong>Typescript</strong>,
          and <strong>TailwindCSS</strong> to create beautiful user- and developer experiences that
          bring delight.
        </p>
        <p>
          I've spent most of my life deeply interested in technology and food, continuously building
          things with both. As a teenager, I was a classic computer nerd, spending most of my times
          messing with the computer, doing 1 of 4 things: Modding games and figuring things out.
          Tinkering with hardware, building computers. Developing websites with FrontPage 98 and
          Flash. And of course, playing games.
        </p>
        <p>Most of that is still true today.</p>
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
