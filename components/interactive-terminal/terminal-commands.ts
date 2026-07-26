// Terminal command definitions and content

export const TERMINAL_CONFIG = {
  username: "visitor",
  hostname: "aryancodes.com",
  prompt: "visitor@aryancodes.com:~$",
  password: "aryancodes",
  batmanPassword: "darknight",
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
    { text: '<span class="command">whoami</span>         Who are you?' },
    { text: '<span class="command">contact</span>        Show business card' },
    { text: '<span class="command">skills</span>         List the tech stack' },
    { text: '<span class="command">experience</span>     Show the work history' },
    { text: '<span class="command">achievements</span>   Check achievement progress' },
    { text: '<span class="command">code</span>           View the code editor' },
    { text: '<span class="command">secret</span>         Find the hidden command' },
    { text: '<span class="command">chatbot</span>        Launch Byte, the AI companion' },
    { text: '<span class="command">radio</span>          Play the EDM playlist first 10' },
    {
      text: '<a href="/boring" class="terminal-launch-command">boring</a>         Start the 3D portfolio mission',
    },
    { text: '<span class="command">clear</span>          Clear terminal' },
    { text: '<span class="command">help</span>           Show this help message' },
    { text: "" },
  ],

  projects: [
    { text: "" },
    { text: "$ ls ~/projects --featured" },
    { text: "" },
    {
      text: '  <span class="project-name">Continua</span>  <span class="cmt">2025 · AI Infrastructure</span>',
    },
    { text: "    Durable execution engine for AI agents. Go + Postgres," },
    { text: "    event-sourced replay, crash recovery, p99 &lt; 50ms RTT." },
    {
      text: '    <a href="https://github.com/aryanVijaywargia/Continua" target="_blank" class="terminal-link">github.com/aryanVijaywargia/Continua</a>',
    },
    { text: "" },
    {
      text: '  <span class="project-name">Earthquake Precursor Detection</span>  <span class="cmt">2021 · ISRO-NESAC Research</span>',
    },
    { text: "    LSTM forecasting + anomaly detection on ionospheric" },
    { text: "    signals. RMSE 0.22, F1 0.78, SOM zone prediction." },
    {
      text: '    <a href="https://github.com/aryanVijaywargia/EQ-prediction-research" target="_blank" class="terminal-link">github.com/aryanVijaywargia/EQ-prediction-research</a>',
    },
    { text: "" },
    {
      text: '  <span class="project-name">Forex Trading Recommendation</span>  <span class="cmt">2022 · Machine Learning</span>',
    },
    { text: "    CNN-LSTM fusing tweet sentiment with FOREX time-series" },
    { text: "    signals to surface trading recommendations." },
    {
      text: '    <a href="https://dagshub.com/aryanVijaywargia/Forex-Trend-Prediction-System" target="_blank" class="terminal-link">dagshub.com/aryanVijaywargia/Forex-Trend-Prediction-System</a>',
    },
    { text: "" },
    { text: '<span class="cmt">Scroll down to the Projects section for the full story.</span>' },
    { text: "" },
  ],

  skills: [
    { text: "" },
    { text: "$ cat ~/.stack" },
    { text: "" },
    { text: '  <span class="skill-category">languages</span>   Go · C# · TypeScript · Python' },
    {
      text: '  <span class="skill-category">backend</span>     .NET · Node.js · PostgreSQL · Elasticsearch',
    },
    {
      text: '  <span class="skill-category">ml / ai</span>     TensorFlow · PyTorch · LSTM/CNN · MLOps',
    },
    { text: '  <span class="skill-category">frontend</span>    React · Next.js · TailwindCSS' },
    { text: '  <span class="skill-category">infra</span>       Docker · CI/CD · Vercel · Git' },
    { text: "" },
  ],

  experience: [
    { text: "" },
    { text: "$ git log --career --oneline" },
    { text: "" },
    {
      text: '  <span class="exp-title">GEP Worldwide</span>               Senior Software Engineer  <span class="cmt">Jul \'23 - now</span>',
    },
    {
      text: '  <span class="exp-title">IHub-Data, IIIT Hyderabad</span>   ML Intern                 <span class="cmt">Jul \'22 - Jan \'23</span>',
    },
    {
      text: '  <span class="exp-title">India Meteorological Dept.</span>  Research Intern           <span class="cmt">Nov \'21 - Jun \'22</span>',
    },
    {
      text: '  <span class="exp-title">Omdena × EnergyHub</span>          ML Engineer               <span class="cmt">Dec \'21 - Feb \'22</span>',
    },
    {
      text: '  <span class="exp-title">NIT Agartala</span>                B.Tech CSE                <span class="cmt">Jul \'19 - Jul \'23</span>',
    },
    { text: "" },
    { text: '<span class="cmt">The Experience section below has the full chapters.</span>' },
    { text: "" },
  ],

  whoami: [
    { text: "" },
    { text: 'The paradox of "Who am I?" is: we never know, but we constantly find out.' },
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

  secret: [{ text: "" }, { text: "Hint: there might be more than one..." }, { text: "" }],

  initial: [
    {
      text: '<span class="inherit">Welcome! Type <span class="command">help</span> for available commands.</span>',
    },
  ],
};

export const STARTUP_BANNER: CommandOutput[] = [
  { text: "" },
  {
    text: '<span class="banner">                                                          |</span>',
    className: "banner-line",
  },
  {
    text: '<span class="banner">                                                       \\  |  /</span>',
    className: "banner-line",
  },
  {
    text: '<span class="banner">                                                    -=  (_)  =-</span>',
    className: "banner-line",
  },
  {
    text: '<span class="banner">                                                       /  |  \\</span>',
    className: "banner-line",
  },
  {
    text: '<span class="banner">                                                          |</span>',
    className: "banner-line",
  },
  {
    text: '<span class="banner">      .\\/ .                         ,\\/ .</span>',
    className: "banner-line",
  },
  {
    text: '<span class="banner">   . \\/o\\\\                          \\/o\\\\</span>',
    className: "banner-line",
  },
  {
    text: '<span class="banner">  /\\/o\\\\                            /\\/o\\\\</span>',
    className: "banner-line",
  },
  {
    text: '<span class="banner">  /\\/|,\\\\ .        ,,,,,      ,\\/|,\\\\                         ,~</span>',
    className: "banner-line",
  },
  {
    text: '<span class="banner">     | | /\\/o\\\\    /####/#\\    /\\/o\\\\   /o\\\\                    |\\</span>',
    className: "banner-line",
  },
  {
    text: '<span class="banner">  ^^ | ^^ | ^~ | ^^^ | .. | | ^^^ | ^^^^^ | ^^ | ^^^^!!!!!!!!!!!!(  "~~~~~~~~~/__|__\\~~~~~~~~~~~~</span>',
    className: "banner-line",
  },
  {
    text: '<span class="banner">     | . . |   . | .!!!!!!!. |   `===` | .   !!!! !!!! !!  ("  ~~~~~  ~ ~======~   ~~ ~</span>',
    className: "banner-line",
  },
  {
    text: '<span class="banner">  jgs^^   ^^^  ^ ^^^ ^^^^^ ^^^ ^^ ^^ !!!! !!!!!(  " ~~~~~~~ ~~~~~~   ~~~ ~</span>',
    className: "banner-line",
  },
  { text: "" },
  {
    text: '<span class="cmt">  systems, search, and small expeditions</span>',
  },
  { text: "" },
  {
    text: '<span class="inherit">Type <span class="command">help</span> for available commands.</span>',
  },
  {
    text: '<span class="cmt">Or take the scenic route:</span> <a href="/boring" class="terminal-launch-command">launch /boring ↗</a>',
  },
  { text: "" },
];

export const DESKTOP_GAME_HELP: CommandOutput = {
  text: '<span class="command">game</span>           Open the games menu',
};

export const SPECIAL_COMMANDS = [
  "whois",
  "clear",
  "history",
  "code",
  "sudo",
  "chatbot",
  "radio",
  "achievements",
  "game",
  "email",
  "boring",
];

// Commands surfaced by tab completion and typo suggestions. Hidden commands
// (sudo, email) stay out so the easter eggs remain easter eggs.
export const AUTOCOMPLETE_COMMANDS = [
  "achievements",
  "chatbot",
  "radio",
  "boring",
  "clear",
  "code",
  "contact",
  "help",
  "secret",
  "skills",
  "whoami",
];

export function isSpecialCommand(cmd: string): boolean {
  return SPECIAL_COMMANDS.includes(cmd.toLowerCase().trim());
}

export function getCommandOutput(cmd: string): CommandOutput[] | null {
  const normalizedCmd = cmd.toLowerCase().trim();
  return COMMANDS[normalizedCmd] || null;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const levenshteinDistance = (a: string, b: string): number => {
  const distances = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      distances[i][j] = Math.min(
        distances[i - 1][j] + 1,
        distances[i][j - 1] + 1,
        distances[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }

  return distances[a.length][b.length];
};

export function getCommandSuggestion(input: string, commands: string[]): string | null {
  if (!input) return null;

  let bestMatch: string | null = null;
  let bestDistance = 3; // only suggest within 2 edits
  commands.forEach((command) => {
    const distance = levenshteinDistance(input, command);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = command;
    }
  });

  return bestMatch;
}
