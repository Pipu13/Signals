const audioInput = document.getElementById("audioInput");
const playPauseBtn = document.getElementById("playPause");
const info = document.getElementById("info");

const wavesurfer = WaveSurfer.create({
  container: "#waveform",
  backend: "MediaElement",   // 🔑 MP4 SAFE
  waveColor: "#64748b",
  progressColor: "#38bdf8",
  cursorColor: "#f8fafc",
  height: 140,
  responsive: true,
});

audioInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  info.textContent = "Loading audio...";
  playPauseBtn.disabled = true;

  wavesurfer.loadBlob(file);
});

wavesurfer.on("ready", () => {
  playPauseBtn.disabled = false;
  info.textContent = "✅ Audio loaded (sample rate depends on source)";
});

wavesurfer.on("error", (e) => {
  info.textContent = "❌ Cannot decode this file";
  console.error(e);
});

playPauseBtn.addEventListener("click", () => {
  wavesurfer.playPause();
  playPauseBtn.textContent = wavesurfer.isPlaying() ? "Pause" : "Play";
});
