import { useRef, useState } from "react";
import axios from "axios";

const useAudioRecorder = (onTranscribe, targetLang) => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", audioBlob, "liveRecording.wav");
        formData.append("target_lang", targetLang); 

        setLoading(true);
        try {
          const res = await axios.post("http://127.0.0.1:7000/record/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (onTranscribe) onTranscribe(res.data);
        } catch (err) {
          console.error(err);
          alert("Error transcribing recording");
        }
        setLoading(false);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Mic access denied", err);
      alert("Microphone access required!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return {
    startRecording,
    stopRecording,
    recording,
    loading,
  };
};

export default useAudioRecorder;

