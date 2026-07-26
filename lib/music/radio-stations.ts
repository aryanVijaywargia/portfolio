export type RadioStation = {
  id: string;
  name: string;
  description: string;
  streamUrl: string;
  fallbackStreamUrl: string;
  vibe: string;
};

export type MusicRequestKind = "favorite" | "play";

// Reddit's recurring coding-music recommendations lean toward lyric-free ambient,
// downtempo, and DEF CON Radio. SomaFM exposes direct, commercial-free streams,
// so playback can stay inside the terminal without a third-party player widget.
export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "groove-salad",
    name: "Groove Salad",
    description: "Ambient and downtempo beats for long focus sessions.",
    streamUrl: "https://ice5.somafm.com/groovesalad-128-mp3",
    fallbackStreamUrl: "https://ice2.somafm.com/groovesalad-128-mp3",
    vibe: "chill / focus",
  },
  {
    id: "def-con",
    name: "DEF CON Radio",
    description: "Dark electronics and hacker-conference energy.",
    streamUrl: "https://ice5.somafm.com/defcon-128-mp3",
    fallbackStreamUrl: "https://ice2.somafm.com/defcon-128-mp3",
    vibe: "hacking / electronic",
  },
  {
    id: "drone-zone",
    name: "Drone Zone",
    description: "Atmospheric textures with almost no rhythmic distraction.",
    streamUrl: "https://ice5.somafm.com/dronezone-128-mp3",
    fallbackStreamUrl: "https://ice2.somafm.com/dronezone-128-mp3",
    vibe: "deep work / ambient",
  },
  {
    id: "deep-space-one",
    name: "Deep Space One",
    description: "Experimental space music for quiet problem solving.",
    streamUrl: "https://ice5.somafm.com/deepspaceone-128-mp3",
    fallbackStreamUrl: "https://ice2.somafm.com/deepspaceone-128-mp3",
    vibe: "space / minimal",
  },
  {
    id: "space-station",
    name: "Space Station Soma",
    description: "Mid-tempo electronica that stays out of the way.",
    streamUrl: "https://ice5.somafm.com/spacestation-128-mp3",
    fallbackStreamUrl: "https://ice2.somafm.com/spacestation-128-mp3",
    vibe: "flow / electronica",
  },
];

const MUSIC_WORDS = "music|song|songs|tune|tunes|beats|radio|playlist|station";
const PLAY_WORDS = "play|spin|spun|start|queue|shuffle|stream|put on|turn on";

export const getMusicRequestKind = (message: string): MusicRequestKind | null => {
  const normalized = message
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const asksForFavorite = new RegExp(
    `(?:favourite|favorite|fav).*(?:${MUSIC_WORDS})|(?:${MUSIC_WORDS}).*(?:favourite|favorite|fav)`
  ).test(normalized);

  if (asksForFavorite) return "favorite";

  const asksToPlay = new RegExp(
    `(?:${PLAY_WORDS}).*(?:${MUSIC_WORDS})|(?:${MUSIC_WORDS}).*(?:please|now)`
  ).test(normalized);

  return asksToPlay ? "play" : null;
};

export const pickRandomStationIndex = (random = Math.random): number =>
  Math.min(RADIO_STATIONS.length - 1, Math.floor(random() * RADIO_STATIONS.length));
