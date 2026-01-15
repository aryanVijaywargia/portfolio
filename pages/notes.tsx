import { FC } from "react";

type IndexProps = {};

export const Notes: FC<IndexProps> = (props) => {
  return (
    <>
      <section className="intro">
        <div>Welcome</div>
        <h1>Hi, I am Aryan Vijaywargia.</h1>
        <p>
          I'm a Machine Learning Engineer specialized in Deep Learning, Computer Vision, NLP,
          and Time Series Forecasting. I love building intelligent systems that solve real-world
          problems, from earthquake prediction to autonomous vehicle safety systems.
          <br />
          I graduated from NIT Agartala with a B.Tech in Computer Science & Engineering.
          <br />
          Hey, I'm Aryan Vijaywargia. I'm a Machine Learning Engineer from India. I specialize
          in building ML models for real-world applications, automated data pipelines, and
          full-stack web applications using Python, TensorFlow, PyTorch, TypeScript, and Angular.
        </p>
      </section>
      <section>
        <h1>Experience Highlights</h1>
        <ul>
          <li>Machine Learning Intern at IHub-Data IIIT Hyderabad - Built pothole & triple rider detection using YOLOv5</li>
          <li>Research Assistant at ISRO-NESAC - LSTM models for earthquake precursor detection</li>
          <li>ML Engineer at Omdena - EV charging optimization using time series clustering</li>
          <li>Research Intern at IMD - Hailstorm severity prediction using LSTM</li>
          <li>GDSC Lead at NIT Agartala - Organized tech workshops and events</li>
        </ul>
      </section>
    </>
  );
};

export default Notes;
