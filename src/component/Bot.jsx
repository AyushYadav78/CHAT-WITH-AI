import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

function Bot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { text: userText, sender: "user" },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4002/bot/v1/message",
        { text: userText }
      );

      if (res.data.image) {
        setMessages((prev) => [
          ...prev,
          { image: res.data.image, sender: "bot" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: res.data.botMessage, sender: "bot" },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "❌ Error connecting", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

return (
  <div className="flex flex-col h-screen bg-[#0b0b0b] text-white">

    {/* HEADER */}
    <header className="sticky top-0 z-10 flex justify-between items-center px-4 py-3 border-b border-gray-800 bg-[#0b0b0b]">
      <h1 className="font-semibold text-sm sm:text-lg">Chat with AI</h1>
      <FaUserCircle className="text-2xl" />
    </header>

    {/* CHAT AREA */}
    <main className="flex-1 overflow-y-auto px-2 sm:px-4 py-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">

        {/* EMPTY STATE */}
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20 text-sm sm:text-base">
            👋 Ask anything or try: <br />
            <span className="text-green-400">
              "generate image of cat"
            </span>
          </div>
        )}

        {/* MESSAGES */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl text-sm sm:text-base leading-relaxed max-w-[85%] sm:max-w-[70%] break-words ${
                msg.sender === "user"
                  ? "bg-blue-600 rounded-br-md"
                  : "bg-[#1a1a1a] rounded-bl-md"
              }`}
            >
              {msg.text && <p>{msg.text}</p>}

              {msg.image && (
                <img
                  src={msg.image}
                  alt="AI"
                  className="rounded-lg mt-2 w-full max-h-64 object-cover"
                />
              )}
            </div>
          </div>
        ))}

        {/* LOADING */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] px-4 py-2 rounded-xl text-sm animate-pulse">
              Typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </main>

    {/* INPUT BAR */}
    <footer className="sticky bottom-0 bg-[#0b0b0b] border-t border-gray-800 px-2 sm:px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center gap-2 bg-[#1a1a1a] rounded-full px-3 py-2">

        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-sm sm:text-base px-2"
          placeholder="Message BotSpoof..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button
          onClick={handleSendMessage}
          className="bg-green-500 hover:bg-green-600 px-4 py-1.5 rounded-full text-sm sm:text-base transition"
        >
          Send
        </button>

      </div>
    </footer>
  </div>

  );
}

export default Bot;