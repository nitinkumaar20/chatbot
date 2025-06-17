'use client';

import React, { useState, useEffect } from 'react';

interface Message {
  _id?: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatModal() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');



  useEffect(() => {
  fetch("/api/messages")
    .then(async (res) => {
      if (!res.ok) throw new Error("API error: " + res.status);
      const text = await res.text();
      if (!text) return []; 
      return JSON.parse(text);
    })
    .then((data) => setMessages(data))
    .catch((err) => console.error("Fetch error:", err));
}, []);


  const sendMessage = async () => {
    if (!input.trim()) return;

    const res = await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ text: input }),
    });
    const data = await res.json();
    setMessages(prev => [...prev, data.user, data.ai]);
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 w-80 h-[500px] bg-white border shadow-lg rounded-lg flex flex-col">
          <div className="p-2 bg-blue-600 text-white text-center rounded-t">Chat with Gemini AI</div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  msg.sender === 'user' ? 'bg-blue-100 text-right ml-auto text-black' : 'bg-gray-100 text-left mr-auto text-black'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex border-t p-2">
            <input
              type="text"
              className="flex-1 border rounded px-2 py-1 text-sm text-black"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <button
              className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-1 right-1 text-gray-600 hover:text-red-500"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
