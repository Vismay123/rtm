import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Avatar } from "./Avatar";
import "../styles/Scene.css";

// --- Fake Rhubarb output for demo text ---
const demoMessage = "Hello, welcome to the 3D avatar demo!";
const phonemeSequence = [
  { phoneme: "A", start: 0, end: 0.3 },
  { phoneme: "B", start: 0.3, end: 0.6 },
  { phoneme: "C", start: 0.6, end: 0.9 },
  { phoneme: "D", start: 0.9, end: 1.2 },
  { phoneme: "E", start: 1.2, end: 1.6 },
  { phoneme: "rest", start: 1.6, end: 2.0 },
  { phoneme: "F", start: 2.0, end: 2.3 },
  { phoneme: "rest", start: 2.3, end: 3.0 },
];

const Scene = () => {
  const [currentPhoneme, setCurrentPhoneme] = useState("rest");

  useEffect(() => {
    let startTime = Date.now();
    let interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      const phoneme = phonemeSequence.find(
        (p) => elapsed >= p.start && elapsed < p.end
      );
      setCurrentPhoneme(phoneme ? phoneme.phoneme : "rest");
    }, 100);

    // stop after sequence ends
    setTimeout(() => clearInterval(interval), 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="scene-wrapper">
      <h2 className="demo-text">💬 {demoMessage}</h2>
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} />
        <OrbitControls />
        {/* Avatar with phoneme-driven mouth movement */}
        <Avatar phoneme={currentPhoneme} position={[0, -1, 0]} animateHands={true} />

      </Canvas>
    </div>
  );
};

export default Scene;
