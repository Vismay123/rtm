import React, { useState, useRef } from "react";
import axios from "axios";
import "../styles/Home.css";
import useAudioRecorder from "../hooks/audio";

const STORAGE_KEY = "speech_transcription_responses";

const Home = () => {
  const [file, setFile] = useState(null);
  const [responses, setResponses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [mouthSize, setMouthSize] = useState(10);
  const [uploading, setUploading] = useState(false);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const [targetLang, setTargetLang] = useState("hi");

  // Recording hook
  const { startRecording, stopRecording, recording, loading } =
    useAudioRecorder((data) => {
      const updated = [...responses, data];
      setResponses(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }, targetLang);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select an audio file.");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_lang", targetLang);

    try {
      setUploading(true);
      const res = await axios.post("http://127.0.0.1:7000/record/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updated = [...responses, res.data];
      setResponses(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const playWithLipSync = async (url) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = document.createElement("audio");
      audio.src = url;
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      await audioCtx.resume();

      const source = audioCtx.createMediaElementSource(audio);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const animate = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setMouthSize(10 + avg / 5);
        requestAnimationFrame(animate);
      };
      animate();

      audio.onended = () => setMouthSize(10);
      audio.play();
    } catch (err) {
      console.error("Audio play error:", err);
    }
  };

  const clearHistory = () => {
    setResponses([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="home-wrappers">
      {(uploading || loading) && (
        <div className="overlays">
          <div className="loaders"></div>
          <p>{uploading ? "Processing uploaded audio..." : "Processing..."}</p>
        </div>
      )}

      <h1 className="main-titles">🎤 Real-time Multilingual Speech-to-Text</h1>

      <div className="content-layouts">
        {/* Left side: Upload + Recording */}
        <div className="left-panels">
          <div className="upload-cards">
            <input type="file" accept="audio/*" onChange={handleFileChange} />

            <label className="lang-labels">
              Output Language:
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="lang-selects"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="te">Telugu</option>
                <option value="ta">Tamil</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="ar">Arabic</option>
                <option value="ru">Russian</option>
                <option value="pt">Portuguese</option>
                <option value="bn">Bengali</option>
                <option value="ur">Urdu</option>
                <option value="pa">Punjabi</option>
                <option value="gu">Gujarati</option>
                <option value="mr">Marathi</option>
                <option value="tr">Turkish</option>
              </select>
            </label>

            <button
              onClick={handleUpload}
              disabled={loading || uploading}
              className="primary-btnn"
            >
              {uploading ? "Processing..." : "Upload & Transcribe"}
            </button>
          </div>

          <div className="recording-card">
            <h2 className="section-title">🎤 Live Speech Transcription</h2>
            <div className="record-btns">
              <button
                onClick={startRecording}
                disabled={recording || loading}
                className="record-btn start"
              >
                {recording ? "Recording..." : "Start Recording"}
              </button>
              <button
                onClick={stopRecording}
                disabled={!recording}
                className="record-btn stop"
              >
                Stop Recording
              </button>
            </div>
          </div>
        </div>

        {/* Right side: Outputs */}
        {responses.length > 0 && (
          <div className="output-card">
            <div className="output-header">
              <h2 className="section-title">📝 Transcription Outputs</h2>
              <button className="clear-btn" onClick={clearHistory}>
                🗑 Clear All
              </button>
            </div>

            {responses.map((resp, idx) => (
              <div key={idx} className="single-output">
                <p><strong>Original:</strong> {resp.original_text}</p>
                <p><strong>Detected Language:</strong> {resp.detected_language}</p>
                <p><strong>Translated:</strong> {resp.translated_text}</p>

                {resp.translated_audio_url && (
                  <button
                    className="secondary-btn"
                    onClick={() =>
                      playWithLipSync(
                        `http://127.0.0.1:7000${resp.translated_audio_url}`
                      )
                    }
                  >
                    ▶ Play
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
