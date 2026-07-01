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
const playBtn = document.querySelector("#playBtn");
const playIcon = document.querySelector("#playIcon");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const progress = document.querySelector("#progress");

function getSongIdFromAudioPath(audioPath, index) {
  const fileName = audioPath.split("/").pop() || `song-${index + 1}`;
  return fileName.replace(/\.[^.]+$/, "");
}

function getRequestedSongId() {
  return new URLSearchParams(window.location.search).get("song");
}

function normalizeSong(song, index) {
  const audioPath = song.audio || "";

  return {
    id: song.id || getSongIdFromAudioPath(audioPath, index),
    title: song.title || `歌曲 ${index + 1}`,
    artist: song.artist || "未知歌手",
    audio: audioPath,
    cover: song.cover || DEFAULT_COVER,
  };
}

function setActiveSong(index, shouldPlay = false, shouldUpdateUrl = true) {
  if (!state.songs.length) return;

  state.currentIndex = (index + state.songs.length) % state.songs.length;
  const song = state.songs[state.currentIndex];

  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  cover.alt = `${song.title} 封面`;
  audio.src = song.audio;
  updateProgress();

  document.querySelectorAll(".song-card").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === state.currentIndex);
  });

  if (shouldUpdateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("song", song.id);
    window.history.replaceState({}, "", url);
  }

  if (shouldPlay) {
    audio.play().catch(() => {});
  }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function updateProgress() {
  const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progress.value = Math.round(percent * 10);
  progress.style.setProperty("--progress", `${percent}%`);
  currentTime.textContent = formatTime(audio.currentTime);
  duration.textContent = formatTime(audio.duration);
}

function updatePlayState() {
  const isPlaying = !audio.paused && !audio.ended;
  playIcon.textContent = isPlaying ? "❚❚" : "▶";
  playBtn.setAttribute("aria-label", isPlaying ? "暂停" : "播放");
}

function togglePlayback() {
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

function getInitialSongIndex() {
  const requestedSongId = getRequestedSongId();
  if (!requestedSongId) return 0;

  const requestedIndex = state.songs.findIndex((song) => song.id === requestedSongId);
  return requestedIndex >= 0 ? requestedIndex : 0;
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
    button.dataset.songId = song.id;
    button.addEventListener("click", () => setActiveSong(index, true));

    const songTitle = document.createElement("span");

    songTitle.className = "song-title";
    songTitle.textContent = song.title;

    button.append(songTitle);
    playlist.append(button);
  });

  setActiveSong(getInitialSongIndex(), true, Boolean(getRequestedSongId()));
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

playBtn.addEventListener("click", togglePlayback);
progress.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (Number(progress.value) / 1000) * audio.duration;
  updateProgress();
});
audio.addEventListener("loadedmetadata", updateProgress);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("play", updatePlayState);
audio.addEventListener("pause", updatePlayState);
audio.addEventListener("ended", () => setActiveSong(state.currentIndex + 1, true));
cover.addEventListener("error", () => {
  cover.src = DEFAULT_COVER;
});

loadSongs();
