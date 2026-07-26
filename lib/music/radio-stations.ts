export type RadioStation = {
  id: string;
  name: string;
  artists: string;
  description: string;
  streamUrl: string;
  spotifyUrl: string;
  playCount: number;
};

export type MusicRequestKind = "favorite" | "play";

export const SPOTIFY_PLAYLIST_URL = "https://open.spotify.com/playlist/77kL8PBTbSKSoddcCCDIOY";

// The ten most-played tracks in Aryan's EDM and Techno mix, ranked by the
// play counts shown on Spotify. Spotify's public MP3 previews keep playback
// inside the terminal and automatically hand off to the next track.
export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "1x5sYLZiu9r5E43kMlt9f8",
    name: "Symphony (feat. Zara Larsson)",
    artists: "Clean Bandit, Zara Larsson",
    description: "The playlist's most-played track.",
    streamUrl: "https://p.scdn.co/mp3-preview/de52d824478549b51de6aeeb0077b00c5f0e2ead",
    spotifyUrl: "https://open.spotify.com/track/1x5sYLZiu9r5E43kMlt9f8",
    playCount: 1_978_817_973,
  },
  {
    id: "6jAsmDJI8iPhGWtS27kZ67",
    name: "Only Girl (In The World)",
    artists: "Rihanna",
    description: "Rihanna's dance-pop anthem.",
    streamUrl: "https://p.scdn.co/mp3-preview/ee800fcd3f6b738d5ffe78de8c958eaa2c4de291",
    spotifyUrl: "https://open.spotify.com/track/6jAsmDJI8iPhGWtS27kZ67",
    playCount: 1_950_655_426,
  },
  {
    id: "3zu2CuVTJwaZn2m4rBzaUO",
    name: "Don't You Worry Child",
    artists: "Swedish House Mafia, John Martin",
    description: "Festival-sized progressive house.",
    streamUrl: "https://p.scdn.co/mp3-preview/abae7ffcd8c653c8500f5698a5b94b715a455fb6",
    spotifyUrl: "https://open.spotify.com/track/3zu2CuVTJwaZn2m4rBzaUO",
    playCount: 1_536_659_514,
  },
  {
    id: "4cG7HUWYHBV6R6tHn1gxrl",
    name: "Friday (feat. Mufasa & Hypeman) - Dopamine Re-Edit",
    artists: "Riton, Nightcrawlers, Mufasa & Hypeman, Dopamine",
    description: "A high-energy house re-edit.",
    streamUrl: "https://p.scdn.co/mp3-preview/0a9ed687dddcd95c83e37099958bdc6d54430e4d",
    spotifyUrl: "https://open.spotify.com/track/4cG7HUWYHBV6R6tHn1gxrl",
    playCount: 1_236_698_033,
  },
  {
    id: "0DiWol3AO6WpXZgp0goxAV",
    name: "One More Time",
    artists: "Daft Punk",
    description: "French house with an evergreen hook.",
    streamUrl: "https://p.scdn.co/mp3-preview/67a14210e33bf6d87d92faaed08ddf353d6b985f",
    spotifyUrl: "https://open.spotify.com/track/0DiWol3AO6WpXZgp0goxAV",
    playCount: 941_584_131,
  },
  {
    id: "2cGxRwrMyEAp8dEbuZaVv6",
    name: "Instant Crush (feat. Julian Casablancas)",
    artists: "Daft Punk, Julian Casablancas",
    description: "A synth-heavy Daft Punk favorite.",
    streamUrl: "https://p.scdn.co/mp3-preview/a52d000457fc91fdb18bfaa1f690c82bf7b1a036",
    spotifyUrl: "https://open.spotify.com/track/2cGxRwrMyEAp8dEbuZaVv6",
    playCount: 858_367_532,
  },
  {
    id: "2qwRUeQhsZwZaLKceoflwh",
    name: "Miracle (with Ellie Goulding)",
    artists: "Calvin Harris, Ellie Goulding",
    description: "A fast, melodic trance-pop crossover.",
    streamUrl: "https://p.scdn.co/mp3-preview/48a88093bc85e735791115290125fc354f8ed068",
    spotifyUrl: "https://open.spotify.com/track/2qwRUeQhsZwZaLKceoflwh",
    playCount: 579_061_336,
  },
  {
    id: "01kfSdF9zfcDLri5sSWEoL",
    name: "RAVE",
    artists: "Dxrk ダーク",
    description: "Dark phonk built for momentum.",
    streamUrl: "https://p.scdn.co/mp3-preview/c7a8d72c0241d5f90211ffae530ba6748d9d9f04",
    spotifyUrl: "https://open.spotify.com/track/01kfSdF9zfcDLri5sSWEoL",
    playCount: 532_951_135,
  },
  {
    id: "65G7XDGcybJiGywSCXJiL5",
    name: "Animals - Radio Edit",
    artists: "Martin Garrix",
    description: "A defining big-room instrumental.",
    streamUrl: "https://p.scdn.co/mp3-preview/e7ebce1b68f784a57b6d69fe8b956e679f4bf4f9",
    spotifyUrl: "https://open.spotify.com/track/65G7XDGcybJiGywSCXJiL5",
    playCount: 513_789_161,
  },
  {
    id: "5CMjjywI0eZMixPeqNd75R",
    name: "Lose Yourself to Dance (feat. Pharrell Williams)",
    artists: "Daft Punk, Pharrell Williams",
    description: "A disco-funk groove from Random Access Memories.",
    streamUrl: "https://p.scdn.co/mp3-preview/bf4be082dc59b009fb495dc6631cf188a3a07af9",
    spotifyUrl: "https://open.spotify.com/track/5CMjjywI0eZMixPeqNd75R",
    playCount: 412_093_515,
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
