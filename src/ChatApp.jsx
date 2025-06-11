// ChatApp.jsx
import { useState, useEffect, useRef } from "react";
import FileUpload from "./components/FileUpload"; // Make sure the path is correct

const botAvatar = "🤖";
const userAvatar = "🧑";

function formatTimestamp(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function WelcomeCard({ onSuggestionClick }) {
  const suggestions = [
    "Generate flight plan for NYC to LAX",
    "Upload flight documents",
    "Help with flight regulations",
    "Show me last flight plan",
  ];
  return (
    <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg mb-4 shadow-md">
      <h3 className="font-semibold mb-2 text-indigo-800 dark:text-indigo-200">
        Try one of these:
      </h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((text, idx) => (
          <button
            key={idx}
            onClick={() => onSuggestionClick(text)}
            className="bg-indigo-300 dark:bg-indigo-700 hover:bg-indigo-400 dark:hover:bg-indigo-600 text-indigo-900 dark:text-indigo-100 px-3 py-1 rounded"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex space-x-1">
      <Dot delay="0" />
      <Dot delay="200" />
      <Dot delay="400" />
    </div>
  );
}

function Dot({ delay }) {
  return (
    <span
      className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full inline-block animate-bounce"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

export default function ChatApp() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: '👋 Hi! I can help you with flight plans. Try asking "When is Go Live?"',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://flightplanbackendsa01.azurewebsites.net/api/chatbotHandler",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        }
      );

      const botText = await response.text();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: botText, timestamp: new Date() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Error talking to backend.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileResult = (result) => {
    const flightPlanText = JSON.stringify(result.flight_plan, null, 2);
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: `📄 Extracted flight plan from uploaded document:\n${flightPlanText}`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage(input);
  };

  const onSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  return (
    <>
      {!messages.some((msg) => msg.role === "user") && (
        <WelcomeCard onSuggestionClick={onSuggestionClick} />
      )}

      <FileUpload onFileProcessed={handleFileResult} />

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-1">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "bot" && <div className="mr-2">{botAvatar}</div>}

            <div
              className={`max-w-[80%] px-4 py-3 rounded-xl whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 dark:bg-gray-600 text-white rounded-bl-none"
                }`}
            >
              <p>{msg.text}</p>
              <span className="block text-xs text-gray-300 mt-1 text-right">
                {formatTimestamp(msg.timestamp)}
              </span>
            </div>

            {msg.role === "user" && <div className="ml-2">{userAvatar}</div>}
          </div>
        ))}

        {loading && (
          <div className="flex items-end justify-start">
            <div className="mr-2">{botAvatar}</div>
            <div className="bg-gray-700 rounded-xl px-4 py-3 max-w-[80%]">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Message input"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </>
  );
}
