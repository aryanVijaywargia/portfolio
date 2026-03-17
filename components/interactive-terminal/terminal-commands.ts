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
    { text: '<span class="command">contact</span>        Show business card' },
    { text: '<span class="command">skills</span>         View technical skills' },
    { text: '<span class="command">resume</span>         Open resume' },
    { text: '<span class="command">code</span>           View the code editor' },
    { text: '<span class="command">history</span>        View command history' },
    { text: '<span class="command">secret</span>         Find the hidden command' },
    { text: '<span class="command">chatbot</span>        Launch Byte, the AI companion' },
    { text: '<span class="command">game</span>           Open the games menu' },
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

  contact: [
    { text: "" },
    { text: "  ╭──────────────────────────────────────────────────────╮" },
    { text: "  │                                                      │" },
    {
      text: '  │   <span class="exp-title">ARYAN VIJAYWARGIA</span>                               │',
    },
    {
      text: '  │   <span class="skill-category">Machine Learning Engineer</span>                       │',
    },
    { text: "  │   India                                              │" },
    { text: "  │                                                      │" },
    { text: "  │──────────────────────────────────────────────────────│" },
    { text: "  │                                                      │" },
    {
      text: `  │   <span class="skill-category">email</span>      <a href="${SOCIAL_LINKS.email}" class="terminal-link">aryanvijaywargia@gmail.com</a>        │`,
    },
    {
      text: '  │   <span class="skill-category">web</span>        <a href="https://aryancodes.com" target="_blank" class="terminal-link">aryancodes.com</a>                    │',
    },
    {
      text: `  │   <span class="skill-category">github</span>     <a href="${SOCIAL_LINKS.github}" target="_blank" class="terminal-link">AryanVijaywargia</a>                 │`,
    },
    {
      text: `  │   <span class="skill-category">linkedin</span>   <a href="${SOCIAL_LINKS.linkedin}" target="_blank" class="terminal-link">aryan-vijaywargia</a>                │`,
    },
    {
      text: `  │   <span class="skill-category">dagshub</span>    <a href="${SOCIAL_LINKS.dagshub}" target="_blank" class="terminal-link">aryanVijaywargia</a>                 │`,
    },
    { text: "  │                                                      │" },
    { text: "  ╰──────────────────────────────────────────────────────╯" },
    { text: "" },
  ],

  secret: [
    { text: "" },
    { text: '<span class="command">sudo</span>           Only use if you know the password' },
    { text: "" },
  ],

  banner: [
    { text: "" },
    { text: "    _                           ____          _           " },
    { text: "   / \\   _ __ _   _  __ _ _ __ / ___|___   __| | ___  ___ " },
    { text: "  / _ \\ | '__| | | |/ _` | '_ \\ |   / _ \\ / _` |/ _ \\/ __|" },
    { text: " / ___ \\| |  | |_| | (_| | | | | |__| (_) | (_| |  __/\\__ \\" },
    { text: "/_/   \\_\\_|   \\__, |\\__,_|_| |_|\\____\\___/ \\__,_|\\___||___/" },
    { text: "              |___/                                        " },
    { text: "" },
    { text: "Welcome to my interactive terminal portfolio!" },
    { text: 'Type <span class="command">help</span> for a list of available commands.' },
    { text: "" },
  ],

  initial: [
    {
      text: '<span class="inherit">Welcome! Type <span class="command">help</span> for available commands.</span>',
    },
  ],
};

export const SPECIAL_COMMANDS = ["clear", "history", "resume", "code", "sudo", "chatbot", "game"];

export function isSpecialCommand(cmd: string): boolean {
  return SPECIAL_COMMANDS.includes(cmd.toLowerCase().trim());
}

export function getCommandOutput(cmd: string): CommandOutput[] | null {
  const normalizedCmd = cmd.toLowerCase().trim();
  return COMMANDS[normalizedCmd] || null;
}
