import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Phone,
  Heart,
  Activity,
  Zap,
  Wifi,
  Volume2,
} from "lucide-react";

const Frontdesk = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const API_BASE_URL = "http://localhost:4000";

  useEffect(() => {
    setIsClient(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;

    if (SpeechRecognition && SpeechSynthesis) {
      setIsSupported(true);

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        console.log("Speech recognition started");
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const conf = result[0].confidence;

          if (result.isFinal) {
            finalTranscript += transcript;
            setConfidence(conf || 0.8);
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          handleSpeechResult(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      synthRef.current = SpeechSynthesis;
    }

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSpeechResult = async (text) => {
    console.log("Processing speech:", text);

    // !! UPDATED FETCH URL
    const res = await fetch(`${API_BASE_URL}/api/auth/parse`, {
      // Assuming /api/auth/parse from file list
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: text }),
    });

    const { details } = await res.json();

    if (
      !details ||
      !details.patientName ||
      !details.doctorName ||
      !details.datetime
    ) {
      speakResponse(
        "Sorry, I couldn't understand the details clearly. Please try again."
      );
      return;
    }

    // !! UPDATED FETCH URL
    const appointmentRes = await fetch(`${API_BASE_URL}/api/auth/appointment`, {
      // Assuming /api/auth/appointment from file list
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });

    const result = await appointmentRes.json();
    speakResponse(result.message || "Something went wrong while scheduling.");
  };

  const speakResponse = (text) => {
    if (synthRef.current && isSupported) {
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(
        (voice) =>
          voice.name.includes("Google") ||
          voice.name.includes("Microsoft") ||
          voice.lang.startsWith("en")
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript("");
    } else {
      setTranscript("");
      setConfidence(0);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const simulateSpeaking = () => {
    speakResponse(
      "Hello! I am MediAssist AI, your digital hospital receptionist. How may I assist you today?"
    );
  };

  // Static particles data to prevent hydration mismatch
  const particles = [
    { left: 10, top: 20, size: 2, delay: 0.5, duration: 3 },
    { left: 80, top: 10, size: 1, delay: 1.2, duration: 2.5 },
    // ... (keep all particle data) ...
    { left: 20, top: 65, size: 2.5, delay: 0.9, duration: 2.6 },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* ... (All the JSX for particles, headers, orb, etc. remains the same) ... */}
      {/* ... (Omitted for brevity) ... */}

      {/* Custom CSS for animations - Converted from <style jsx> to <style> */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Frontdesk;
