const audioInput = document.getElementById("audioInput");
const playPauseBtn = document.getElementById("playPause");
const info = document.getElementById("info");

const wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "#64748b",
  progressColor: "#38bdf8",
  cursorColor: "#f8fafc",
  height: 140,
  barWidth: 2,
  responsive: true,
});

audioInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  info.textContent = "Loading audio...";

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const sampleRate = audioBuffer.sampleRate;

  if (sampleRate !== 47100) {
    info.textContent = `❌ Sample rate is ${sampleRate} Hz (Required: 47,100 Hz)`;
    playPauseBtn.disabled = true;
    wavesurfer.empty();
    return;
  }

  info.textContent = `✅ Sample rate: ${sampleRate} Hz`;
  wavesurfer.loadBlob(file);
  playPauseBtn.disabled = false;
});

playPauseBtn.addEventListener("click", () => {
  wavesurfer.playPause();
  playPauseBtn.textContent = wavesurfer.isPlaying() ? "Pause" : "Play";
});
