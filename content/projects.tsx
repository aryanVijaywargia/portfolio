import { SiPython } from "@react-icons/all-files/si/SiPython";
import { SiTensorflow } from "@react-icons/all-files/si/SiTensorflow";

// Custom tech items for ML projects since they don't exist in tech-stack
const ML_TECH = {
  python: {
    name: "Python",
    Icon: ({ className }: { className?: string }) => <SiPython className={className} />,
  },
  tensorflow: {
    name: "TensorFlow",
    Icon: ({ className }: { className?: string }) => <SiTensorflow className={className} />,
  },
};

export const PROJECTS = [
  {
    name: "Forex Trading Recommendation System",
    type: ["Machine Learning", "NLP"],
    tech: [ML_TECH.python, ML_TECH.tensorflow],
    url: "",
    repository: "https://github.com/AryanVijaywargia/forex-trading-ml",
    description: `Built a CNN-LSTM model combining Twitter sentiment analysis with FOREX time series data to generate trading recommendations.`,
    content: (
      <>
        <p>
          This project combines natural language processing with time series analysis to predict
          currency pair movements. The model analyzes Twitter sentiment and correlates it with
          historical FOREX data.
        </p>
        <p>
          Key challenges included handling noisy social media data, feature engineering for
          time series, and optimizing the hybrid CNN-LSTM architecture.
        </p>
      </>
    ),
    year: "2022",
  },
  {
    name: "OpenCV Sudoku Solver",
    type: ["Computer Vision", "Deep Learning"],
    tech: [ML_TECH.python, ML_TECH.tensorflow],
    url: "",
    repository: "https://github.com/AryanVijaywargia/sudoku-solver",
    description: `Image processing pipeline using VGG-16 for digit recognition achieving 99.3% accuracy on handwritten digits.`,
    content: (
      <>
        <p>
          Built an end-to-end Sudoku solver that captures an image, extracts the grid using
          computer vision techniques, recognizes digits using a fine-tuned VGG-16 model, and
          solves the puzzle algorithmically.
        </p>
      </>
    ),
    year: "2022",
  },
  {
    name: "Deep Handwriting Synthesis",
    type: ["Deep Learning", "Generative AI"],
    tech: [ML_TECH.python],
    url: "",
    repository: "https://github.com/AryanVijaywargia/handwriting-synthesis",
    description: `Attention-based encoder-decoder RNN for generating realistic handwritten text from input strings.`,
    content: (
      <>
        <p>
          Implemented a sequence-to-sequence model with attention mechanism for handwriting
          generation. The model learns writing styles and can generate handwritten versions
          of any input text.
        </p>
      </>
    ),
    year: "2022",
  },
  {
    name: "Pothole & Triple Rider Detection",
    type: ["Computer Vision", "Object Detection"],
    tech: [ML_TECH.python],
    url: "",
    repository: "https://github.com/AryanVijaywargia/yolov5-detection",
    description: `Real-time detection system using YOLOv5 trained on dash camera footage for traffic safety monitoring.`,
    content: (
      <>
        <p>
          Developed at IHub-Data IIIT Hyderabad. Built custom YOLOv5 models trained on annotated
          dash camera datasets to detect potholes and triple riders in real-time.
        </p>
        <p>
          Achieved 20% reduction in false positives through data augmentation and model optimization.
        </p>
      </>
    ),
    year: "2022",
  },
  {
    name: "Earthquake Precursor Detection",
    type: ["Time Series", "Research"],
    tech: [ML_TECH.python, ML_TECH.tensorflow],
    url: "",
    repository: "https://github.com/AryanVijaywargia/earthquake-prediction",
    description: `LSTM-based system for ionospheric parameter forecasting and earthquake precursor anomaly detection with F1 score of 0.78.`,
    content: (
      <>
        <p>
          Research project at ISRO-NESAC analyzing satellite data to identify patterns that
          precede seismic activity. Built LSTM models for time series forecasting of
          ionospheric parameters.
        </p>
      </>
    ),
    year: "2021",
  },
  {
    name: "EV Charging Optimization",
    type: ["Machine Learning", "Clustering"],
    tech: [ML_TECH.python],
    url: "",
    repository: "https://github.com/AryanVijaywargia/ev-charging-optimization",
    description: `Time series clustering for electricity consumption profiles to optimize EV charging schedules for EnergyHub.`,
    content: (
      <>
        <p>
          Collaborated with Omdena's global team to build clustering models that identify
          patterns in electricity consumption, enabling smarter EV charging recommendations.
        </p>
      </>
    ),
    year: "2021",
  },
  {
    name: "Hailstorm Severity Prediction",
    type: ["Time Series", "Weather Forecasting"],
    tech: [ML_TECH.python, ML_TECH.tensorflow],
    url: "",
    repository: "https://github.com/AryanVijaywargia/hailstorm-prediction",
    description: `LSTM-based model for predicting hailstorm severity using meteorological data from IMD.`,
    content: (
      <>
        <p>
          Built during research internship at India Meteorological Department. The model
          analyzes multiple weather parameters to predict the likelihood and severity of
          hailstorm events.
        </p>
      </>
    ),
    year: "2021",
  },
];
