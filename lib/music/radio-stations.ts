export type RadioStation = {
  id: string;
  name: string;
  artists: string;
  description: string;
  streamUrl: string;
  spotifyUrl: string;
  previewSource: "Spotify" | "Apple Music";
};

export type MusicRequestKind = "favorite" | "play";

export const SPOTIFY_PLAYLIST_URL = "https://open.spotify.com/playlist/77kL8PBTbSKSoddcCCDIOY";

// The first ten tracks in Aryan's EDM and Techno mix, in playlist order.
// Spotify supplies public previews for nine tracks; COSMIC has no Spotify
// preview, so its matching Apple Music preview keeps the exact song playable.
export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "1MAEyM49A8aBSUX6QJp2Z4",
    name: "Axis",
    artists: "Trivecta",
    description: "The opening track in the EDM and Techno mix.",
    streamUrl: "https://p.scdn.co/mp3-preview/6bd4acd408997d0b1e0f9a9f7e94b0c8e94c3279",
    spotifyUrl: "https://open.spotify.com/track/1MAEyM49A8aBSUX6QJp2Z4",
    previewSource: "Spotify",
  },
  {
    id: "2BBaMarzDdcNlP2QUD4RBW",
    name: "NRG",
    artists: "Skeler",
    description: "Wave music from Skeler's vibe.digital release.",
    streamUrl: "https://p.scdn.co/mp3-preview/a5d446413931a71f81d0bcc651c9293e45f384ba",
    spotifyUrl: "https://open.spotify.com/track/2BBaMarzDdcNlP2QUD4RBW",
    previewSource: "Spotify",
  },
  {
    id: "3gX0jmOAYiGTq1JbyU9fHd",
    name: "Kaelo",
    artists: "Just Connor, KTrek",
    description: "A melodic collaboration from Just Connor and KTrek.",
    streamUrl: "https://p.scdn.co/mp3-preview/943a6382ce376567b41111133441af4f8b930784",
    spotifyUrl: "https://open.spotify.com/track/3gX0jmOAYiGTq1JbyU9fHd",
    previewSource: "Spotify",
  },
  {
    id: "64F0tid5vwapfuC4ERAHyA",
    name: "Pale Light",
    artists: "Skeler",
    description: "A dark, atmospheric Skeler track.",
    streamUrl: "https://p.scdn.co/mp3-preview/82419f38cc7afac1d1ef2ff5fa5be544b95b34c7",
    spotifyUrl: "https://open.spotify.com/track/64F0tid5vwapfuC4ERAHyA",
    previewSource: "Spotify",
  },
  {
    id: "4ByOgKVPgHZEFJJwc6C9dI",
    name: "Daeo",
    artists: "KTrek",
    description: "A compact hardwave cut from KTrek.",
    streamUrl: "https://p.scdn.co/mp3-preview/a03e255cea648ec0326a0734011f374e5dacf184",
    spotifyUrl: "https://open.spotify.com/track/4ByOgKVPgHZEFJJwc6C9dI",
    previewSource: "Spotify",
  },
  {
    id: "4IZQn7gDwsLmwSNUbhHhML",
    name: "Corrupted",
    artists: "Notaker, BlackGummy",
    description: "Dark electro from Notaker and BlackGummy.",
    streamUrl: "https://p.scdn.co/mp3-preview/74fa2a47d6b140a8926400c348ad25e0f540999b",
    spotifyUrl: "https://open.spotify.com/track/4IZQn7gDwsLmwSNUbhHhML",
    previewSource: "Spotify",
  },
  {
    id: "4MJImXaC86R6RlLrVkr5fy",
    name: "Nuova",
    artists: "KTrek",
    description: "A cinematic wave track from KTrek.",
    streamUrl: "https://p.scdn.co/mp3-preview/4d9451c7c417014b86a556ce24e515c743d779c1",
    spotifyUrl: "https://open.spotify.com/track/4MJImXaC86R6RlLrVkr5fy",
    previewSource: "Spotify",
  },
  {
    id: "16vgrYY9cYAaHikW4z8Msm",
    name: "COSMIC",
    artists: "SAGE, Jack Instinct",
    description: "The exact playlist track, using its matching Apple Music preview.",
    streamUrl:
      "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/5f/6c/dd/5f6cddab-5312-ec61-9ca0-78f3adee818d/mzaf_8054232356800623060.plus.aac.p.m4a",
    spotifyUrl: "https://open.spotify.com/track/16vgrYY9cYAaHikW4z8Msm",
    previewSource: "Apple Music",
  },
  {
    id: "4Ur5OyqeQyxzzlsdsKI9ZA",
    name: "Lohka",
    artists: "KTrek",
    description: "A bass-heavy KTrek track from the playlist.",
    streamUrl: "https://p.scdn.co/mp3-preview/4c23580a07179dd7ff4fb4b8305efdbff0cb016b",
    spotifyUrl: "https://open.spotify.com/track/4Ur5OyqeQyxzzlsdsKI9ZA",
    previewSource: "Spotify",
  },
  {
    id: "5pDFJgkTXczsJIIDspl8hF",
    name: "Hypersquare",
    artists: "Deadcrow, MYSTXRIVL",
    description: "A collaborative hardwave closer for the first-ten queue.",
    streamUrl: "https://p.scdn.co/mp3-preview/4bcfa306055fcf900bd256c7c7f54f672de2fd2d",
    spotifyUrl: "https://open.spotify.com/track/5pDFJgkTXczsJIIDspl8hF",
    previewSource: "Spotify",
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
