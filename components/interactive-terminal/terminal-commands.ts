// Terminal command definitions and content

export const TERMINAL_CONFIG = {
  username: "visitor",
  hostname: "aryancodes.com",
  prompt: "visitor@aryancodes.com:~$",
  password: "aryancodes",
};

export const SOCIAL_LINKS = {
  github: "https://github.com/aryanvijaywargia",
  twitter: "https://twitter.com/aryanvijaywargia",
  linkedin: "https://www.linkedin.com/in/aryanvijaywargia",
  instagram: "https://www.instagram.com/aryanvijaywargia",
  email: "mailto:aryan@aryancodes.com",
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
    { text: '<span class="command">resume</span>         Open resume' },
    { text: '<span class="command">email</span>          Send me an email' },
    { text: '<span class="command">code</span>           View the code editor' },
    { text: '<span class="command">history</span>        View command history' },
    { text: '<span class="command">secret</span>         Find the hidden command' },
    { text: '<span class="command">clear</span>          Clear terminal' },
    { text: '<span class="command">banner</span>         Display the header' },
    { text: '<span class="command">help</span>           Show this help message' },
    { text: "" },
  ],

  whois: [
    { text: "" },
    { text: "Hey, I'm Aryan!" },
    { text: "" },
    { text: "I'm a Full Stack Developer who loves building things for the web." },
    { text: "I specialize in creating highly performant websites, automated API" },
    { text: "integrations, and stunning user experiences." },
    { text: "" },
    { text: "My tech stack includes Next.js, React, TypeScript, Node.js," },
    { text: "TailwindCSS, and various other modern technologies." },
    { text: "" },
    { text: "I'm always keen to learn and explore new technologies, frameworks" },
    { text: "and programming languages." },
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
      text: `github         <a href="${SOCIAL_LINKS.github}" target="_blank" class="terminal-link">github.com/aryanvijaywargia</a>`,
    },
    {
      text: `twitter        <a href="${SOCIAL_LINKS.twitter}" target="_blank" class="terminal-link">twitter.com/aryanvijaywargia</a>`,
    },
    {
      text: `linkedin       <a href="${SOCIAL_LINKS.linkedin}" target="_blank" class="terminal-link">linkedin.com/in/aryanvijaywargia</a>`,
    },
    {
      text: `instagram      <a href="${SOCIAL_LINKS.instagram}" target="_blank" class="terminal-link">instagram.com/aryanvijaywargia</a>`,
    },
    { text: "" },
  ],

  skills: [
    { text: "" },
    { text: '<span class="skill-category">Languages:</span>' },
    { text: "  TypeScript, JavaScript, Python, Go, SQL" },
    { text: "" },
    { text: '<span class="skill-category">Frontend:</span>' },
    { text: "  React, Next.js, TailwindCSS, Framer Motion" },
    { text: "" },
    { text: '<span class="skill-category">Backend:</span>' },
    { text: "  Node.js, Express, tRPC, GraphQL, Prisma" },
    { text: "" },
    { text: '<span class="skill-category">Database:</span>' },
    { text: "  PostgreSQL, MySQL, MongoDB, Redis, PlanetScale" },
    { text: "" },
    { text: '<span class="skill-category">DevOps:</span>' },
    { text: "  Docker, AWS, Vercel, GitHub Actions, CI/CD" },
    { text: "" },
  ],

  projects: [
    { text: "" },
    { text: "Here are some of my projects:" },
    { text: "" },
    { text: '<span class="project-name">Portfolio v2</span> - This website! Built with Next.js' },
    { text: '<span class="project-name">E-commerce Platform</span> - Full-stack shopping experience' },
    { text: '<span class="project-name">API Gateway</span> - Microservices architecture' },
    { text: '<span class="project-name">Dashboard Analytics</span> - Real-time data visualization' },
    { text: "" },
    { text: 'Type <span class="command">social</span> to find my GitHub for more projects.' },
    { text: "" },
  ],

  experience: [
    { text: "" },
    { text: '<span class="exp-title">Senior Full Stack Developer</span> @ Flext Solutions' },
    { text: "  2023 - Present | Remote" },
    { text: "  Leading development of scalable web applications" },
    { text: "" },
    { text: '<span class="exp-title">Full Stack Developer</span> @ TechCorp Inc' },
    { text: "  2021 - 2022 | Cape Town, SA" },
    { text: "  Built enterprise web applications for Fortune 500 clients" },
    { text: "" },
    { text: '<span class="exp-title">Freelance Developer</span>' },
    { text: "  2020 - 2021 | Remote" },
    { text: "  Delivered 15+ custom web solutions" },
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

export const SPECIAL_COMMANDS = ["clear", "history", "email", "resume", "code", "sudo"];

export function isSpecialCommand(cmd: string): boolean {
  return SPECIAL_COMMANDS.includes(cmd.toLowerCase().trim());
}

export function getCommandOutput(cmd: string): CommandOutput[] | null {
  const normalizedCmd = cmd.toLowerCase().trim();
  return COMMANDS[normalizedCmd] || null;
}
