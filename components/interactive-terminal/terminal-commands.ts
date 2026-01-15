// Terminal command definitions and content

export const TERMINAL_CONFIG = {
  username: "visitor",
  hostname: "aryancodes.com",
  prompt: "visitor@aryancodes.com:~$",
  password: "aryancodes",
};

export const SOCIAL_LINKS = {
  github: "https://github.com/AryanVijaywargia",
  linkedin: "https://www.linkedin.com/in/aryan-vijaywargia/",
  dagshub: "https://dagshub.com/aryanVijaywargia",
  email: "mailto:aryanvijaywargia@gmail.com",
};

export type CommandOutput = {
  text: string;
  className?: string;
};

export const COMMANDS: Record<string, CommandOutput[]> = {
  help: [
    { text: "" },
    { text: '<span class="command">whois</span>          Who is Aryan?' },
    { text: '<span class="command">whoami</span>         Who are you?' },
    { text: '<span class="command">social</span>         Display social networks' },
    { text: '<span class="command">skills</span>         View technical skills' },
    { text: '<span class="command">projects</span>       View coding projects' },
    { text: '<span class="command">experience</span>     View work experience' },
    { text: '<span class="command">education</span>      View education' },
    { text: '<span class="command">resume</span>         Open resume' },
    { text: '<span class="command">email</span>          Send me an email' },
    { text: '<span class="command">code</span>           View the code editor' },
    { text: '<span class="command">history</span>        View command history' },
    { text: '<span class="command">secret</span>         Find the hidden command' },
    { text: '<span class="command">chatbot</span>        Launch Byte, the AI companion' },
    { text: '<span class="command">clear</span>          Clear terminal' },
    { text: '<span class="command">banner</span>         Display the header' },
    { text: '<span class="command">help</span>           Show this help message' },
    { text: "" },
  ],

  whois: [
    { text: "" },
    { text: "Hey, I'm Aryan Vijaywargia!" },
    { text: "" },
    { text: "I'm a Machine Learning Engineer passionate about building" },
    { text: "intelligent systems and solving real-world problems with AI." },
    { text: "" },
    { text: "I specialize in Deep Learning, Computer Vision, NLP, and" },
    { text: "Time Series Forecasting. I've worked on earthquake prediction," },
    { text: "pothole detection, EV charging optimization, and more." },
    { text: "" },
    { text: "My tech stack includes Python, TensorFlow, PyTorch, Flask," },
    { text: "TypeScript, Angular, and various ML/DL frameworks." },
    { text: "" },
    { text: "I'm a former GDSC Lead at NIT Agartala and love contributing" },
    { text: "to open-source projects." },
    { text: "" },
  ],

  whoami: [
    { text: "" },
    { text: 'The paradox of "Who am I?" is: we never know, but we constantly find out.' },
    { text: "" },
  ],

  social: [
    { text: "" },
    {
      text: `github         <a href="${SOCIAL_LINKS.github}" target="_blank" class="terminal-link">github.com/AryanVijaywargia</a>`,
    },
    {
      text: `linkedin       <a href="${SOCIAL_LINKS.linkedin}" target="_blank" class="terminal-link">linkedin.com/in/aryan-vijaywargia</a>`,
    },
    {
      text: `dagshub        <a href="${SOCIAL_LINKS.dagshub}" target="_blank" class="terminal-link">dagshub.com/aryanVijaywargia</a>`,
    },
    { text: "" },
  ],

  skills: [
    { text: "" },
    { text: '<span class="skill-category">Languages:</span>' },
    { text: "  Python, C/C++, JavaScript, TypeScript, HTML/CSS, SQL" },
    { text: "" },
    { text: '<span class="skill-category">ML/DL Frameworks:</span>' },
    { text: "  TensorFlow, PyTorch, Scikit-Learn, OpenCV, Keras" },
    { text: "" },
    { text: '<span class="skill-category">Libraries:</span>' },
    { text: "  Flask, Dash, Plotly, Shapely, Pandas, NumPy" },
    { text: "" },
    { text: '<span class="skill-category">Developer Tools:</span>' },
    { text: "  Git, GitHub, DagsHub, MLFlow, Heroku, Weights & Biases" },
    { text: "" },
    { text: '<span class="skill-category">Frontend:</span>' },
    { text: "  Angular, React, TailwindCSS" },
    { text: "" },
  ],

  projects: [
    { text: "" },
    { text: "Here are some of my projects:" },
    { text: "" },
    { text: '<span class="project-name">Forex Trading Recommendation System</span>' },
    { text: "  CNN-LSTM for Twitter sentiment + FOREX time series analysis" },
    { text: "" },
    { text: '<span class="project-name">OpenCV Sudoku Solver</span>' },
    { text: "  Image processing + VGG-16 for digit recognition (99.3% accuracy)" },
    { text: "" },
    { text: '<span class="project-name">Deep Handwriting Synthesis</span>' },
    { text: "  Attention-based encoder-decoder RNN for handwriting generation" },
    { text: "" },
    { text: '<span class="project-name">Pothole & Triple Rider Detection</span>' },
    { text: "  YOLOv5-based real-time detection from dash cameras" },
    { text: "" },
    { text: 'Type <span class="command">social</span> to find my GitHub for more projects.' },
    { text: "" },
  ],

  experience: [
    { text: "" },
    { text: '<span class="exp-title">Machine Learning Intern</span> @ IHub-Data IIIT Hyderabad' },
    { text: "  July 2022 - December 2022" },
    { text: "  • Built pothole & triple rider detection using YOLOv5" },
    { text: "  • Reduced false positives by 20%" },
    { text: "" },
    { text: '<span class="exp-title">Research Assistant</span> @ ISRO-NESAC' },
    { text: "  September 2021 - January 2022" },
    { text: "  • LSTM models for ionospheric parameter forecasting" },
    { text: "  • Earthquake precursor anomaly detection (F1: 0.78)" },
    { text: "" },
    { text: '<span class="exp-title">ML Engineer</span> @ Omdena' },
    { text: "  December 2021 - February 2022" },
    { text: "  • EV charging optimization for EnergyHub" },
    { text: "  • Time series clustering for electricity profiles" },
    { text: "" },
    { text: '<span class="exp-title">Research Intern</span> @ IMD' },
    { text: "  November 2021 - June 2022" },
    { text: "  • LSTM-based hailstorm severity prediction" },
    { text: "" },
  ],

  education: [
    { text: "" },
    { text: '<span class="exp-title">National Institute of Technology Agartala</span>' },
    { text: "  July 2019 - July 2023" },
    { text: "  Bachelor of Technology in Computer Science & Engineering" },
    { text: "  CGPA: 8.59" },
    { text: "" },
    { text: '<span class="skill-category">Certifications:</span>' },
    { text: "  • Computer Vision Nanodegree - Udacity" },
    { text: "  • Deep Learning Specialization - Coursera" },
    { text: "" },
  ],

  secret: [
    { text: "" },
    { text: '<span class="command">sudo</span>           Only use if you know the password' },
    { text: "" },
  ],

  banner: [
    { text: "" },
    { text: '    _                           ____          _           ' },
    { text: '   / \\   _ __ _   _  __ _ _ __ / ___|___   __| | ___  ___ ' },
    { text: "  / _ \\ | '__| | | |/ _` | '_ \\ |   / _ \\ / _` |/ _ \\/ __|" },
    { text: ' / ___ \\| |  | |_| | (_| | | | | |__| (_) | (_| |  __/\\__ \\' },
    { text: '/_/   \\_\\_|   \\__, |\\__,_|_| |_|\\____\\___/ \\__,_|\\___||___/' },
    { text: '              |___/                                        ' },
    { text: "" },
    { text: "Welcome to my interactive terminal portfolio!" },
    { text: 'Type <span class="command">help</span> for a list of available commands.' },
    { text: "" },
  ],

  initial: [
    { text: '<span class="inherit">Welcome! Type <span class="command">help</span> for available commands.</span>' },
  ],
};

export const SPECIAL_COMMANDS = ["clear", "history", "email", "resume", "code", "sudo", "education", "chatbot"];

export function isSpecialCommand(cmd: string): boolean {
  return SPECIAL_COMMANDS.includes(cmd.toLowerCase().trim());
}

export function getCommandOutput(cmd: string): CommandOutput[] | null {
  const normalizedCmd = cmd.toLowerCase().trim();
  return COMMANDS[normalizedCmd] || null;
}
