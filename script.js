const audioInput = document.getElementById("audioInput");
const playPauseBtn = document.getElementById("playPause");
const info = document.getElementById("info");

const EXPECTED_SAMPLE_RATE = 44100;

// 👇 FORCE MediaElement backend (REQUIRED for MP4)
const wavesurfer = WaveSurfer.create({
  container: "#waveform",
  backend: "MediaElement",
  waveColor: "#64748b",
  progressColor: "#38bdf8",
  cursorColor: "#f8fafc",
  height: 140,
  responsive: true,
});

audioInput.addEventListener("change", async () => {
  const file = audioInput.files[0];
  if (!file) return;

  playPauseBtn.disabled = true;
  info.textContent = "Loading...";

  // Load waveform FIRST (works for MP3 + MP4 now)
  wavesurfer.loadBlob(file);

  // Read metadata safely
  const media = document.createElement("audio");
  media.src = URL.createObjectURL(file);
  media.preload = "metadata";

  media.onloadedmetadata = async () => {
    const duration = media.duration;

    const audioContext = new AudioContext();
    const buffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    const sampleRate = audioBuffer.sampleRate;

    info.textContent = `
📄 ${file.name}
⏱️ ${duration.toFixed(1)} s
🎵 ${sampleRate} Hz
${sampleRate === EXPECTED_SAMPLE_RATE ? "✅ 44.1 kHz" : "⚠️ Non-44.1 kHz"}
`;

    playPauseBtn.disabled = false;
    URL.revokeObjectURL(media.src);
  };

  media.onerror = () => {
    info.textContent = "❌ Unsupported media";
  };
});

playPauseBtn.addEventListener("click", () => {
  wavesurfer.playPause();
  playPauseBtn.textContent = wavesurfer.isPlaying() ? "Pause" : "Play";
});
