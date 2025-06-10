// App.js
import { useState, useEffect } from "react";
import ChatApp from "./ChatApp";
import "./App.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode on html tag
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col h-[85vh]">
        {/* Header + Dark mode toggle */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-center w-full">
            🛫 Flight Plan Chatbot
          </h1>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="ml-auto px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Chat UI component */}
        <ChatApp />
      </div>
    </div>
  );
}

