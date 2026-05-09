import AryanHeic2 from "../public/images/about/IMG_3593.jpg";
import AryanPixelTrip from "../public/images/about/PXL_20241228_095508620.RAW-01.COVER_Original 2.jpg";
import Aryan1 from "../public/images/about/aryan-1.jpg";
import Aryan2 from "../public/images/about/aryan-2.jpg";
import Aryan5 from "../public/images/about/aryan-5.jpg";
import AryanPortrait from "../public/images/about/bb09f0d6-75a1-438b-92ae-cd3e5d4bba6f 2.jpg";

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
      src: AryanHeic2,
      alt: "Aryan candid photo",
    },
    {
      src: AryanPixelTrip,
      alt: "Aryan travel photo",
    },
    {
      src: Aryan1,
      alt: "Aryan at a tech event",
    },
    {
      src: Aryan2,
      alt: "Aryan working on ML projects",
    },
    {
      src: Aryan5,
      alt: "Aryan exploring new places",
    },
    {
      src: AryanPortrait,
      alt: "Aryan Vijaywargia portrait",
    },
  ],
};
