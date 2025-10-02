import React, { useState, useRef } from "react";
import axios from "axios";
import "../styles/Talking.css";
import image from "./image.png";
import useAudioRecorder from "../hooks/audio";

const STORAGE_KEY = "voice_cloning_responses";

const Anime = () => {
  const [file, setFile] = useState(null);
  const [responses, setResponses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [mouthSize, setMouthSize] = useState(10);
  const [speaking, setSpeaking] = useState(false);
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

  const handleSpeak = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => {
      setSpeaking(true);
      const animate = () => {
        if (!speaking) return;
        setMouthSize(15 + Math.random() * 25);
        requestAnimationFrame(animate);
      };
      animate();
    };

    utterance.onend = () => {
      setSpeaking(false);
      setMouthSize(10);
    };

    window.speechSynthesis.speak(utterance);
  };

  const clearHistory = () => {
    setResponses([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="voice-layout">
      {(uploading || loading) && (
        <div className="overlay">
          <div className="loader"></div>
          <p>
            {uploading
              ? "Processing uploaded audio..."
              : "Processing your recording..."}
          </p>
        </div>
      )}

      {/* LEFT SIDE */}
      <div className="controls-panel">
        <h1 className="page-title">🎙 Voice Cloning 2D</h1>

        {/* Upload Section */}
        <div className="upload-box">
          <input type="file" accept="audio/*" onChange={handleFileChange} />

          {/* Language Selector */}
          <label className="lang-label">
            Output Language:
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="lang-select"
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
            className="btn primary-btn"
          >
            {uploading ? "Processing..." : "Upload & Transcribe"}
          </button>

          {/* Recording Section */}
          <h2 className="section-title">🎤 Live Speech Transcription</h2>
          <div className="record-btns">
            <button
              onClick={startRecording}
              disabled={recording || loading}
              className="btn record-btn start"
            >
              {recording ? "Recording..." : "Start Recording"}
            </button>
            <button
              onClick={stopRecording}
              disabled={!recording}
              className="btn record-btn stop"
            >
              Stop Recording
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      {responses.length > 0 && (
        <div className="output-panels">
          <div className="output-header">
            <h2 className="subtitle">📝 Transcription Outputs</h2>
            <button className="btn clear-btn" onClick={clearHistory}>
              🗑 Clear All
            </button>
          </div>

          {responses.map((resp, idx) => (
            <div key={idx} className="output-audio">
              <p>
                <strong>Original:</strong> {resp.original_text}
              </p>
              <p>
                <strong>Detected Language:</strong> {resp.detected_language}
              </p>
              <p>
                <strong>Translated:</strong> {resp.translated_text}
              </p>

              {resp.translated_audio_url && (
                <button
                  className="btn secondary-btn"
                  onClick={() =>
                    playWithLipSync(
                      `http://127.0.0.1:7000${resp.translated_audio_url}`
                    )
                  }
                >
                  ▶ Play with Lip Sync
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Face Panel */}
      <div className="right-panel">
        <div className="face-container">
          <img src={image} alt="Human Face" className="face-img" />
          <div
            className={`mouth-animation ${speaking ? "speaking" : ""}`}
            style={{ height: `${mouthSize}px` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Anime;
