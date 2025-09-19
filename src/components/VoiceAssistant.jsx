import React, { useState, useRef } from "react";

const VoiceAssistant = () => {
    const [listening, setListening] = useState(false);
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const recognitionRef = useRef(null);

    // 🎤 Start / Stop listening
    const startListening = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Speech recognition not supported in this browser!");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log("🎤 Listening started...");
            setListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("✅ Recognized:", transcript);
            setQuery(transcript);
            sendQuery(transcript);
        };

        recognition.onerror = (event) => {
            console.error("❌ Speech recognition error:", event.error);
            setListening(false);
        };

        recognition.onend = () => {
            console.log("🛑 Listening stopped.");
            setListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    // 🚀 Send query to backend
    const sendQuery = async (q) => {
        try {
            console.log("📤 Sending query:", q);
            const res = await fetch("https://smart-crop-advisory-backend.onrender.com/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: q }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log("📥 Response:", data);

            if (data.answer) {
                setResponse(data.answer);
                speakOut(data.answer);
            } else {
                setResponse("Sorry, no answer received.");
            }
        } catch (err) {
            console.error("Error fetching chatbot response:", err);
            setResponse("Error fetching response.");
        }
    };

    // 🔊 Text-to-Speech
    const speakOut = (text) => {
        if (!("speechSynthesis" in window)) {
            alert("Speech Synthesis not supported in this browser!");
            return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-IN"; // 👈 set voice language here
        speechSynthesis.speak(utterance);
    };


    return (
        <div className="p-4 fixed bottom-4 right-4 bg-white shadow-lg rounded-xl w-80">
            <h2 className="text-lg font-bold mb-2 text-green-600">🎙️ KisanMitra Voice Assistant</h2>

            <button
                onClick={startListening}
                className={`px-4 py-2 rounded-lg text-white font-bold ${listening ? "bg-red-500" : "bg-green-600"
                    }`}
            >
                {listening ? "Listening..." : "Ask your question"}
            </button>

            {query && (
                <p className="mt-3 text-gray-700">
                    <strong>You asked:</strong> {query}
                </p>
            )}

            {response && (
                <p className="mt-2 text-blue-700">
                    <strong>Answer:</strong> {response}
                </p>
            )}
        </div>
    );
};

export default VoiceAssistant;
