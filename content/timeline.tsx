import { StarIcon } from "@heroicons/react/20/solid";
import { BookOpenIcon, BuildingOffice2Icon, ChartBarIcon, CodeBracketIcon, CodeBracketSquareIcon, ComputerDesktopIcon, FireIcon, SignalIcon, UserCircleIcon } from "@heroicons/react/24/solid";
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
  ],
  "2021": [
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
      date: "2023-08-01",
      heading: "Full Stack Development",
      description:
        "Expanded skills to include TypeScript, Angular, and React for building complete ML-powered web applications.",
      Icon: ({ className = "" }) => <CodeBracketSquareIcon className={className} />,
    },
  ],
};
