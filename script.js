const audioInput = document.getElementById("audioInput");
const playPauseBtn = document.getElementById("playPause");
const info = document.getElementById("info");

const EXPECTED_SAMPLE_RATE = 44100;

const wavesurfer = WaveSurfer.create({
  container: "#waveform",
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

  // Load waveform FIRST (important for MP4)
  wavesurfer.loadBlob(file);

  // Get metadata safely (works for MP3 + MP4)
  const media = document.createElement("audio");
  media.src = URL.createObjectURL(file);
  media.preload = "metadata";

  media.onloadedmetadata = async () => {
    const duration = media.duration;

    // Decode ONLY to read sample rate
    const audioContext = new AudioContext();
    const buffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    const sampleRate = audioBuffer.sampleRate;

    info.textContent = `
📄 ${file.name}
⏱️ ${duration.toFixed(1)} s
🎵 ${sampleRate} Hz
${sampleRate === EXPECTED_SAMPLE_RATE ? "✅ Valid sample rate" : "⚠️ Non-standard sample rate"}
`;

    playPauseBtn.disabled = false;
    URL.revokeObjectURL(media.src);
  };

  media.onerror = () => {
    info.textContent = "❌ Cannot read audio metadata";
  };
});

playPauseBtn.addEventListener("click", () => {
  wavesurfer.playPause();
  playPauseBtn.textContent = wavesurfer.isPlaying() ? "Pause" : "Play";
});
