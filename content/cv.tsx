import { TECH } from "content/tech-stack";
import { Link } from "components/link";

export const CV = {
  name: "Aryan Vijaywargia",
  title: "Machine Learning Engineer",
  primary_stack: [TECH.python, TECH.tensorflow, TECH.pytorch, TECH.typescript, TECH.angular],
  address: "India",
  email: "aryanvijaywargia@gmail.com",
  website: "https://aryancodes.com",
  mobile: {
    href: `tel:+919876543210`,
    number: "+91 98765 43210",
  },
  intro: (
    <>
      I am a passionate Machine Learning Engineer with expertise in Deep Learning, Computer Vision,
      NLP, and Time Series Forecasting. I specialize in building intelligent systems and solving
      real-world problems with AI. I've worked on earthquake prediction, pothole detection,
      EV charging optimization, and more. I'm also experienced in full-stack development with
      Python, TensorFlow, PyTorch, TypeScript, and Angular.
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
      dateFrom: "2022-07-01",
      dateTo: "2022-12-01",
      city: "Hyderabad",
      country: "India",
      company: "IHub-Data IIIT Hyderabad",
      title: "Machine Learning Intern",
      type: ["web / tech dev", "relevant"],
      responsibilities: [
        {
          content: "Built pothole & triple rider detection system using YOLOv5",
          type: ["web / tech dev", "relevant"],
        },
        {
          content: "Trained custom models on annotated dash camera datasets",
          type: ["web / tech dev", "relevant"],
        },
        {
          content: "Reduced false positives by 20% through model optimization",
          type: ["web / tech dev", "relevant"],
        },
        {
          content: "Deployed real-time detection system for traffic monitoring",
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
          content: "Built LSTM models for ionospheric parameter forecasting",
          type: ["web / tech dev", "relevant"],
        },
        {
          content: "Developed earthquake precursor anomaly detection system (F1: 0.78)",
          type: ["web / tech dev", "relevant"],
        },
        {
          content: "Analyzed satellite data for geophysical predictions",
          type: ["web / tech dev", "relevant"],
        },
        {
          content: "Published research on time series forecasting for seismic activity",
          type: ["web / tech dev", "relevant"],
        },
      ],
    },
    {
      dateFrom: "2021-12-01",
      dateTo: "2022-02-01",
      city: "Remote",
      country: "USA",
      company: "Omdena",
      title: "ML Engineer",
      type: ["web / tech dev", "relevant"],
      responsibilities: [
        {
          content: "Worked on EV charging optimization for EnergyHub",
          type: ["web / tech dev", "relevant"],
        },
        {
          content: "Built time series clustering for electricity consumption profiles",
          type: ["web / tech dev", "relevant"],
        },
        {
          content: "Collaborated with global team on sustainable energy solutions",
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
          content: "Developed LSTM-based hailstorm severity prediction system",
          type: ["web / tech dev", "relevant"],
        },
        {
          content: "Analyzed meteorological data for weather forecasting",
          type: ["web / tech dev", "relevant"],
        },
        {
          content: "Built predictive models for extreme weather events",
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
      TECH.python,
      TECH.typescript,
      TECH.javascript,
      TECH.html_5,
      TECH.css_3,
      TECH.sql,
    ],
    librariesFrameworks: [
      TECH.tensorflow,
      TECH.pytorch,
      TECH.react,
      TECH.angular,
      TECH.tailwindcss,
      TECH.nodejs,
      TECH.flask,
    ],
    serviceProviders: [
      TECH.github,
      TECH.vercel,
      TECH.aws,
    ],
    marketing: [],
    dataProviders: [],
    tools: [
      TECH.git,
      TECH.npm,
      TECH.figma,
      TECH.intellij_idea,
    ],
  },
  certifications: [
    {
      date: "2022",
      name: "Computer Vision Nanodegree - Udacity",
      type: ["web / tech dev", "relevant"],
    },
    {
      date: "2021",
      name: "Deep Learning Specialization - Coursera (Andrew Ng)",
      type: ["web / tech dev", "relevant"],
    },
  ],
  other: [
    {
      name: "GDSC Lead - NIT Agartala",
    },
    {
      name: "Open Source Contributor",
    },
  ],
  references: [
    {
      author: "Research Supervisor",
      title: "Scientist",
      company: "ISRO-NESAC",
      reference:
        "Aryan demonstrated exceptional skills in machine learning and data analysis during his research internship. His work on earthquake prediction using LSTM models showed great promise and contributed valuable insights to our ongoing research.",
    },
  ],
  personal: `I'm a Machine Learning Engineer passionate about building intelligent systems that solve real-world problems. As a former GDSC Lead at NIT Agartala, I love contributing to open-source projects and sharing knowledge with the developer community. When I'm not coding, you can find me exploring new AI research papers or working on side projects involving computer vision and NLP.`,
};
