import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Avatar } from "./Avatar";
import useAudioRecorder from "../hooks/audio"; // ✅ your custom hook
import axios from "axios";
import "../styles/Home.css";

const STORAGE_KEY = "voice_cloning_responses";

const ThreeD = () => {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentPhoneme, setCurrentPhoneme] = useState("rest");
  const [file, setFile] = useState(null);
  const [responses, setResponses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [uploading, setUploading] = useState(false);
  const [targetLang, setTargetLang] = useState("en"); // ✅ default language

  const recognitionRef = useRef(null);

  // ✅ Hook for mic recording (sends to API)
  const { startRecording, stopRecording, recording, loading } = useAudioRecorder(
    (data) => {
      const updated = [...responses, data];
      setResponses(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      if (data.translated_text) {
        setTranscript(data.translated_text);
        speakWithAvatar(data.translated_text);
      }
    },
    targetLang
  );

  // ✅ Avatar speech (with lipsync)
  const speakWithAvatar = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang || "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;

    const phonemes = ["A", "B", "C", "D", "E", "F", "rest"];
    let phonemeIndex = 0;
    let interval;

    utterance.onstart = () => {
      interval = setInterval(() => {
        setCurrentPhoneme(phonemes[phonemeIndex % phonemes.length]);
        phonemeIndex++;
      }, 150);
    };

    utterance.onend = () => {
      clearInterval(interval);
      setCurrentPhoneme("rest");
    };

    window.speechSynthesis.speak(utterance);
  };

  // 📂 File Upload (send to backend)
  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

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

      if (res.data.translated_text) {
        setTranscript(res.data.translated_text);
        speakWithAvatar(res.data.translated_text);
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="home-wrappers">
      <h1 className="main-titles">🎤 3D Avatar Live Speech</h1>

      <div className="content-layouts">
        {/* 🎛 Controls */}
        <div className="left-panels">
          <h2 className="section-title">🎤 Live Recording</h2>
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

          {/* Language Selector */}
          <label className="lang-label">
            🌍 Output Language:
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

          {transcript && (
            <p className="demo-text">
              <strong>Transcript:</strong> {transcript}
            </p>
          )}

          {/* 📂 File Upload Section */}
          <div className="upload-card">
            <h2 className="section-title">📂 Upload File</h2>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload} className="primary-btnn">
              {uploading ? "Processing..." : "Upload & Process"}
            </button>
          </div>

          {/* ▶ Demo Play Button */}
          <div className="demo-btns">
            <button
              onClick={() => speakWithAvatar("Hello, I am your AI avatar demo, my name is Ai avatar my task is to read loud text and audio files.")}
              className="primary-btnn"
            >
              ▶ Play Demo
            </button>
          </div>
        </div>

        {/* 🧑 Avatar */}
        <div className="output-card">
          <h2 className="section-title">🧑 Avatar Output</h2>
          <div
            style={{ height: "450px", background: "#111", borderRadius: "10px" }}
          >
            <Canvas shadows camera={{ position: [0, 1.5, 2.5], fov: 30 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 50]} intensity={1.2} />
              <OrbitControls target={[0, 2, 0]} />
              <Avatar
                position={[0, -0.3, 0]}
                scale={1.5}
                phoneme={currentPhoneme}
                animateHands={recording || currentPhoneme !== "rest"}
              />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeD;
