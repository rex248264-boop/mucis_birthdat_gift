const DEFAULT_COVER = "assets/covers/default-cover.svg";

const state = {
  songs: [],
  currentIndex: 0,
};

const audio = document.querySelector("#audio");
const cover = document.querySelector("#cover");
const title = document.querySelector("#title");
const artist = document.querySelector("#artist");
const playlist = document.querySelector("#playlist");
const songCount = document.querySelector("#songCount");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

function normalizeSong(song, index) {
  return {
    title: song.title || `歌曲 ${index + 1}`,
    artist: song.artist || "未知歌手",
    audio: song.audio || "",
    cover: song.cover || DEFAULT_COVER,
  };
}

function setActiveSong(index, shouldPlay = false) {
  if (!state.songs.length) return;

  state.currentIndex = (index + state.songs.length) % state.songs.length;
  const song = state.songs[state.currentIndex];

  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  cover.alt = `${song.title} 封面`;
  audio.src = song.audio;

  document.querySelectorAll(".song-card").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === state.currentIndex);
  });

  if (shouldPlay) {
    audio.play().catch(() => {});
  }
}

function renderPlaylist() {
  playlist.textContent = "";

  if (!state.songs.length) {
    songCount.textContent = "0 首歌";
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "请在 songs.json 里添加歌曲，然后把 MP3 放到 assets/music/，封面放到 assets/covers/。";
    playlist.append(empty);
    return;
  }

  songCount.textContent = `${state.songs.length} 首歌`;

  state.songs.forEach((song, index) => {
    const button = document.createElement("button");
    button.className = "song-card";
    button.type = "button";
    button.addEventListener("click", () => setActiveSong(index, true));

    const image = document.createElement("img");
    image.src = song.cover;
    image.alt = "";

    const meta = document.createElement("span");
    const songTitle = document.createElement("span");
    const songArtist = document.createElement("span");

    songTitle.className = "song-title";
    songArtist.className = "song-artist";
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;

    meta.append(songTitle, songArtist);
    button.append(image, meta);
    playlist.append(button);
  });

  setActiveSong(0);
}

async function loadSongs() {
  try {
    const response = await fetch("songs.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const songs = await response.json();
    state.songs = Array.isArray(songs) ? songs.map(normalizeSong).filter((song) => song.audio) : [];
  } catch (error) {
    console.error("Failed to load songs.json", error);
    state.songs = [];
  }

  renderPlaylist();
}

prevBtn.addEventListener("click", () => setActiveSong(state.currentIndex - 1, true));
nextBtn.addEventListener("click", () => setActiveSong(state.currentIndex + 1, true));
audio.addEventListener("ended", () => setActiveSong(state.currentIndex + 1, true));
cover.addEventListener("error", () => {
  cover.src = DEFAULT_COVER;
});

loadSongs();
