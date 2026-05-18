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
    { text: '<span class="command">whois</span>          Who is Aryan?' },
    { text: '<span class="command">whoami</span>         Who are you?' },
    { text: '<span class="command">contact</span>        Show business card' },
    { text: '<span class="command">code</span>           View the code editor' },
    { text: '<span class="command">history</span>        View command history' },
    { text: '<span class="command">secret</span>         Find the hidden command' },
    { text: '<span class="command">chatbot</span>        Launch Byte, the AI companion' },
    { text: '<span class="command">clear</span>          Clear terminal' },
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
  { text: '<span class="banner">                                                          |</span>', className: "banner-line" },
  { text: '<span class="banner">                                                       \\  |  /</span>', className: "banner-line" },
  { text: '<span class="banner">                                                    -=  (_)  =-</span>', className: "banner-line" },
  { text: '<span class="banner">                                                       /  |  \\</span>', className: "banner-line" },
  { text: '<span class="banner">                                                          |</span>', className: "banner-line" },
  { text: '<span class="banner">      .\\/ .                         ,\\/ .</span>', className: "banner-line" },
  { text: '<span class="banner">   . \\/o\\\\                          \\/o\\\\</span>', className: "banner-line" },
  { text: '<span class="banner">  /\\/o\\\\                            /\\/o\\\\</span>', className: "banner-line" },
  { text: '<span class="banner">  /\\/|,\\\\ .        ,,,,,      ,\\/|,\\\\                         ,~</span>', className: "banner-line" },
  { text: '<span class="banner">     | | /\\/o\\\\    /####/#\\    /\\/o\\\\   /o\\\\                    |\\</span>', className: "banner-line" },
  { text: '<span class="banner">  ^^ | ^^ | ^~ | ^^^ | .. | | ^^^ | ^^^^^ | ^^ | ^^^^!!!!!!!!!!!!(  "~~~~~~~~~/__|__\\~~~~~~~~~~~~</span>', className: "banner-line" },
  { text: '<span class="banner">     | . . |   . | .!!!!!!!. |   `===` | .   !!!! !!!! !!  ("  ~~~~~  ~ ~======~   ~~ ~</span>', className: "banner-line" },
  { text: '<span class="banner">  jgs^^   ^^^  ^ ^^^ ^^^^^ ^^^ ^^ ^^ !!!! !!!!!(  " ~~~~~~~ ~~~~~~   ~~~ ~</span>', className: "banner-line" },
  { text: "" },
  {
    text: '<span class="cmt">  systems, search, and small expeditions</span>',
  },
  { text: "" },
  {
    text: '<span class="inherit">Type <span class="command">help</span> for available commands.</span>',
  },
  { text: "" },
];

export const DESKTOP_GAME_HELP: CommandOutput = {
  text: '<span class="command">game</span>           Open the games menu',
};

export const SPECIAL_COMMANDS = ["clear", "history", "code", "sudo", "chatbot", "game"];

export function isSpecialCommand(cmd: string): boolean {
  return SPECIAL_COMMANDS.includes(cmd.toLowerCase().trim());
}

export function getCommandOutput(cmd: string): CommandOutput[] | null {
  const normalizedCmd = cmd.toLowerCase().trim();
  return COMMANDS[normalizedCmd] || null;
}
