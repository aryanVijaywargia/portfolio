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
  description: (
    <>
      <p>
        I'm a Fullstack Engineer from India. My focus area for the past few years
        has been <strong>Deep Learning</strong>, <strong>Computer Vision</strong>,{" "}
        <strong>NLP</strong>, and <strong>Time Series Forecasting</strong> to create intelligent
        systems that solve real-world problems.
      </p>
      <p>
        I've worked on earthquake prediction at ISRO-NESAC, pothole detection at IHub-Data IIIT
        Hyderabad, EV charging optimization at Omdena, and hailstorm prediction at IMD.
        As a former GDSC Lead at NIT Agartala, I love contributing to open-source projects
        and sharing knowledge with the developer community.
      </p>
      <p>Currently exploring PyTorch, MLFlow, and building full-stack ML applications.</p>
    </>
  ),
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
