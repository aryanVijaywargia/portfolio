// @ts-ignore
import AryanProfile from "../public/images/about/aryan-profile.jpg";
import Aryan1 from "../public/images/about/aryan-1.jpg";
import Aryan2 from "../public/images/about/aryan-2.jpg";
import Aryan3 from "../public/images/about/aryan-3.jpg";
import Aryan4 from "../public/images/about/aryan-4.jpg";
import Aryan5 from "../public/images/about/aryan-5.jpg";

export const ABOUT = {
  stats: [
    {
      statistic: `${new Date(Date.now() - new Date("2000-01-01T00:00:00").getTime()).getFullYear() - 1970
        }`,
      tooltip: `Born in 2000`,
      caption: "Years Old",
    },
    {
      statistic: "4+",
      tooltip: "Started ML journey in 2020",
      caption: "Years ML/AI",
    },
    {
      statistic: "10+",
      tooltip: "TensorFlow, PyTorch, OpenCV, Scikit-Learn, and more",
      caption: "ML Frameworks",
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
        I'm a Cape Town based Web Developer and Entrepreneur. My focus area for the past few years
        has been front-end development with <strong>Next.js</strong>, <strong>Typescript</strong>,
        and <strong>TailwindCSS</strong> to create beautiful user- and developer experiences that
        bring delight.
      </p>
    ),
    standard: (
      <>
        <p>
          I'm a Cape Town based Web Developer and Entrepreneur. My focus area for the past few years
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
          I'm a Cape Town based Web Developer and Entrepreneur. My focus area for the past few years
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
      src: AryanProfile,
      alt: "Aryan Vijaywargia - Profile Photo",
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
      src: Aryan3,
      alt: "Aryan presenting research",
    },
    {
      src: Aryan4,
      alt: "Aryan at a conference",
    },
    {
      src: Aryan5,
      alt: "Aryan exploring new places",
    },
  ],
};
