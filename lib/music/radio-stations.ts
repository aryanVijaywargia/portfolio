export type RadioStation = {
  id: string;
  name: string;
  description: string;
  streamUrl: string;
  vibe: string;
};

// Reddit's recurring coding-music recommendations lean toward lyric-free ambient,
// downtempo, and DEF CON Radio. SomaFM exposes direct, commercial-free streams,
// so playback can stay inside the terminal without a third-party player widget.
export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "groove-salad",
    name: "Groove Salad",
    description: "Ambient and downtempo beats for long focus sessions.",
    streamUrl: "https://ice.somafm.com/groovesalad",
    vibe: "chill / focus",
  },
  {
    id: "def-con",
    name: "DEF CON Radio",
    description: "Dark electronics and hacker-conference energy.",
    streamUrl: "https://ice.somafm.com/defcon",
    vibe: "hacking / electronic",
  },
  {
    id: "drone-zone",
    name: "Drone Zone",
    description: "Atmospheric textures with almost no rhythmic distraction.",
    streamUrl: "https://ice.somafm.com/dronezone",
    vibe: "deep work / ambient",
  },
  {
    id: "deep-space-one",
    name: "Deep Space One",
    description: "Experimental space music for quiet problem solving.",
    streamUrl: "https://ice.somafm.com/deepspaceone",
    vibe: "space / minimal",
  },
  {
    id: "space-station",
    name: "Space Station Soma",
    description: "Mid-tempo electronica that stays out of the way.",
    streamUrl: "https://ice.somafm.com/spacestation",
    vibe: "flow / electronica",
  },
];
