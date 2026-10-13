import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Plus,
  Send,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Bolt,
  Palette,
  Terminal,
  Sigma,
  BookOpen,
  Dumbbell,
  Bug,
  Sparkles
} from "lucide-react";
import { Message } from "../types";
import { BOTS, INSTANT_SUGGESTIONS } from "../data";

interface ChatScreenProps {
  botId: string;
  onBack: () => void;
  messages: Message[];
  onAddMessage: (msg: Message) => void;
  onClearHistory?: () => void;
}

export default function ChatScreen({
  botId,
  onBack,
  messages,
  onAddMessage,
  onClearHistory,
}: ChatScreenProps) {
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentBot = BOTS.find((b) => b.id === botId) || BOTS[0];
  const suggestions = INSTANT_SUGGESTIONS[botId] || INSTANT_SUGGESTIONS["nexus-7"];

  // Scroll to bottom when messages or isThinking state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const getBotIcon = (iconName: string) => {
    switch (iconName) {
      case "bolt": return <Bolt className="w-5 h-5" />;
      case "palette": return <Palette className="w-5 h-5" />;
      case "terminal": return <Terminal className="w-5 h-5" />;
      case "functions": return <Sigma className="w-5 h-5" />;
      case "edit_note": return <BookOpen className="w-5 h-5" />;
      case "fitness_center": return <Dumbbell className="w-5 h-5" />;
      case "bug_report": return <Bug className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const cleanFormattedTime = () => {
    const d = new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: text,
      timestamp: cleanFormattedTime(),
    };
    onAddMessage(userMsg);
    setInputText("");
    setIsThinking(true);
    setErrorMessage("");

    try {
      const chatPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          botId: currentBot.id,
          messages: chatPayload,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "System failed to compute logical response.");
      }

      const responseData = await res.json();

      const botMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "model",
        content: responseData.content,
        timestamp: cleanFormattedTime(),
      };
      onAddMessage(botMsg);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Network Timeout. Please verify that your Gemini API Key is configured correctly in the Secrets panel.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage(inputText);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] text-on-surface font-sans select-none overflow-hidden relative">

      {/* Header element mirroring the design exactly */}
      <div className="flex justify-between items-center py-3 border-b border-white/10 z-10 bg-background/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all rounded-full cursor-pointer focus:outline-none"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <div className={`w-10 h-10 rounded-full border border-primary/30 object-cover overflow-hidden flex items-center justify-center ${currentBot.avatarBg} ${currentBot.iconColor}`}>
              {getBotIcon(currentBot.icon)}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
          </div>

          <div className="flex flex-col">
            <span className="font-sans text-sm font-bold text-on-surface leading-tight">{currentBot.name}</span>
            <span className="font-sans text-[10px] text-green-500 font-semibold tracking-wider uppercase">ONLINE</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onClearHistory && (
            <button
              onClick={onClearHistory}
              className="text-xs px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-on-surface-variant hover:text-primary transition-all cursor-pointer mr-1"
            >
              Clear
            </button>
          )}
          <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors rounded-full focus:outline-none">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content scrollable chat feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 py-6 pr-1">
        {messages.map((msg) => {
          const isModel = msg.role === "model";
          return (
            <div
              key={msg.id}
              className={`flex flex-col w-full ${isModel ? "items-start" : "items-end"}`}
            >
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative overflow-hidden ${
                isModel
                  ? "glass-bubble ai-glow rounded-bl-none text-on-surface"
                  : "bg-primary-container/20 border border-primary-container/30 backdrop-blur-md rounded-br-none text-on-surface"
              }`}>
                {isModel && (
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/30 via-primary to-primary/30"></div>
                )}

                {/* Message Body with markdown friendly layouts */}
                <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap selection:bg-primary/45">
                  {msg.content}
                </div>

                <div className="mt-2 flex items-center justify-between gap-8">
                  <span className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-semibold font-sans">
                    {isModel ? `${currentBot.name} System` : "User Session"}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/40 font-sans">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator shimmer */}
        {isThinking && (
          <div className="flex flex-col items-start w-full">
            <div className="max-w-[85%] rounded-2xl rounded-bl-none p-4 shadow-sm relative overflow-hidden glass-bubble ai-glow">
              <div className="absolute top-0 left-0 w-full h-[2px] thinking-shimmer"></div>
              <div className="flex space-x-2 items-center py-2 px-1">
                <div className="w-2.5 h-2.5 bg-primary/75 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2.5 h-2.5 bg-primary/75 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2.5 h-2.5 bg-primary/75 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                <span className="text-xs text-on-surface-variant/70 font-sans pl-2">System decoding response...</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Error display if API Key is not configured correctly */}
        {errorMessage && (
          <div className="p-4 bg-error-container/20 border border-error/20 rounded-xl text-error text-xs flex items-start gap-2 max-w-full">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Execution Error</p>
              <p className="leading-normal">{errorMessage}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion tags chip container above prompt block */}
      {messages.length <= 1 && !isThinking && (
        <div className="mt-2 py-2">
          <p className="text-[10px] text-on-surface-variant/50 font-sans uppercase tracking-widest mb-2 px-1">Suggested prompts</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 opacity-70 hover:opacity-100 transition-opacity duration-300">
            {suggestions.map((sug) => (
              <button
                key={sug}
                onClick={() => handleSendMessage(sug)}
                className="glass-bubble p-2.5 rounded-xl text-left hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-primary cursor-pointer focus:outline-none"
              >
                <div className="w-6 h-6 rounded bg-primary/15 flex items-center justify-center shrink-0">
                  {getBotIcon(currentBot.icon)}
                </div>
                <span className="truncate">{sug}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom input section styled accurately */}
      <div className="pt-2 pb-4 bg-background z-10">
        <div className="relative">
          <div className="glass-bubble rounded-full p-1.5 pl-3 pr-1.5 flex items-center gap-2 shadow-xl ring-1 ring-white/10">
            <button
              className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors rounded-full focus:outline-none"
              title="Add media"
            >
              <Plus className="w-5 h-5" />
            </button>
            <input
              className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm font-sans text-on-surface placeholder:text-on-surface-variant/40 py-1"
              placeholder={`Send message to ${currentBot.name}...`}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isThinking}
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isThinking}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-transform shadow-lg ${
                inputText.trim() && !isThinking
                  ? "bg-primary-container text-on-primary-container hover:scale-105 cursor-pointer"
                  : "bg-surface-container-highest/20 text-on-surface-variant/40 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Secure micro system parameters indicators */}
          <div className="flex justify-center mt-3 gap-6 text-[10px] text-on-surface-variant/40 font-sans">
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>{currentBot.name} Engaged</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>End-to-End Encrypted</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
