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
          <h1 className="text-6xl font-bold font-inter">Manage <br/>Approvals</h1>
          <p className="font-roboto-mono text-2xl">Approve, reject and append forms here.</p>
        </div>
        <div className="w-full h-[60%]">
          
        </div>
      </div>
      
      {/* Chat Window */}
      <div className="w-[80%] h-[90%] border-2 border-background flex flex-col">
      </div>
    </div>
  );
}

export default Chat;