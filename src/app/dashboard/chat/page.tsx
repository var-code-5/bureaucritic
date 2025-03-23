'use client';
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

function Chat() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = () => {
    if (input.trim() === "") return;
    
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "I'm just a bot, but I'm here to help!", sender: "bot" },
      ]);
    }, 1000);
  };
  
  return (
    <div className="min-w-full h-screen bg-foreground flex items-end p-12 text-background">
      {/* Sidebar */}
      <div className="w-[20%] h-[90%]">
        <div className="w-full h-[40%] flex justify-between flex-col pb-12">
          <h1 className="text-6xl font-bold font-inter">Dashboard</h1>
          <p className="font-roboto-mono text-2xl">Chat with our bot.</p>
        </div>
        <div className="w-full h-[60%] border-y-2 border-l-2 border-background">
          <h3 className="text-4xl font-bold text-left pl-2 border-2 border-background py-2">
            Recent forms
          </h3>
          <p className="text-3xl text-left pl-2 border-2 border-background py-2 cursor-pointer">
            Form 1
          </p>
          <p className="text-3xl text-left pl-2 border-2 border-background py-2 cursor-pointer">
            Form 2
          </p>
        </div>
      </div>
      
      {/* Chat Window */}
      <div className="w-[80%] h-[90%] border-2 border-background flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[60%] px-4 py-2 my-2 ${
                msg.sender === "user"
                  ? "bg-primary text-foreground self-end text-right rounded-lg rounded-tr-none" // User messages on right
                  : "bg-background text-foreground self-start text-left rounded-lg rounded-tl-none" // Bot messages on left
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Field */}
        <div className="p-4 flex items-center relative w-full">
          <input
            type="text"
            className="flex-1 p-4 text-black bg-white rounded-lg outline-none w-[90%]"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Send 
            className="absolute text-foreground right-8 cursor-pointer" 
            onClick={handleSend}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;