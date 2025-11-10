"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { processUserInput } from "../core/AuroraMessageManager";
import type { Message } from "../../../models/Message";

export const AuroraChatFrame: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    // Llama al gestor de mensajes
    const auroraReply = await processUserInput(input);

    const auroraMsg: Message = { sender: "aurora", text: auroraReply };
    setMessages((prev) => [...prev, auroraMsg]);
    setInput("");
  };

  return (
    <div className="w-[500px] bg-gray-900/70 backdrop-blur-md rounded-2xl p-4 mt-4 text-white shadow-xl border border-pink-400/20">
      <div className="h-[250px] overflow-y-auto mb-3 space-y-2 scrollbar-thin scrollbar-thumb-pink-500/50">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-2 rounded-xl max-w-[80%] ${
              msg.sender === "user"
                ? "ml-auto bg-pink-600/70 text-right"
                : "mr-auto bg-white/10 border border-pink-400/30"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe un mensaje para Aurora..."
          className="flex-1 bg-gray-800 rounded-xl px-3 py-2 outline-none border border-pink-400/20 text-sm placeholder-gray-400"
        />
        <button
          onClick={handleSend}
          className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-xl font-semibold transition"
        >
          💌
        </button>
      </div>
    </div>
  );
};
