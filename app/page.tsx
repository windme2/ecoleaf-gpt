"use client";

import { useState } from "react";
import { Send, Bot, User, Leaf, BookOpen, ThumbsUp, ThumbsDown } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "assistant",
      text: "สวัสดีครับ! ผมคือ Ecoleaf GPT ผู้ช่วยค้นคว้า AI เพื่อสิ่งแวดล้อม มีหัวข้อไหนให้ผมช่วยค้นคว้าในวันนี้ครับ?",
      citations: [] as { id: string; title: string; url: string }[],
    },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), sender: "user", text: input, citations: [] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: data.answer,
          citations: data.citations || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: "เกิดข้อผิดพลาดในการเชื่อมต่อระบบ กรุณาลองใหม่อีกครั้ง",
          citations: [],
        },
      ]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-2 mb-6 text-emerald-600 font-bold text-lg">
            <Leaf className="w-6 h-6" />
            <span>Ecoleaf GPT</span>
          </div>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="w-full py-2 px-3 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 text-sm font-medium transition"
          >
            + เริ่มบทสนทนาใหม่
          </button>
        </div>
        <div className="text-xs text-slate-400">Sprint 1 Prototype Build</div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 max-w-3xl ${m.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.sender === "user" ? "bg-slate-700 text-white" : "bg-emerald-600 text-white"}`}>
                {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-xl text-sm ${m.sender === "user" ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 shadow-sm"}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                {/* Citations Box */}
                {m.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mb-1">
                      <BookOpen className="w-3 h-3" /> แหล่งอ้างอิง:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {m.citations.map((c) => (
                        <a key={c.id} href={c.url} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200">
                          {c.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {m.sender === "assistant" && (
                  <div className="mt-2 flex gap-2 text-slate-400">
                    <button className="hover:text-slate-600"><ThumbsUp className="w-3.5 h-3.5" /></button>
                    <button className="hover:text-slate-600"><ThumbsDown className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Container */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="ถามคำถามหรือค้นคว้าข้อมูลสิ่งแวดล้อม..."
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button onClick={handleSend} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}