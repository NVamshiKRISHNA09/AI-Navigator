import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, MoreVertical, Plus, Send, ShieldAlert, ShieldCheck, Zap,
  Copy, Check, RefreshCw, Star, Trash2, X, MessageSquare,
} from "lucide-react";
import { Message } from "../types";
import { BOTS, INSTANT_SUGGESTIONS } from "../data";
import { getBotIcon } from "./BotIcon";

interface ChatScreenProps {
  botId: string;
  onBack: () => void;
  messages: Message[];
  onAddMessage: (msg: Message) => void;
  onClearHistory?: () => void;
  onRemoveMessage?: (msgId: string) => void;
  onToggleMessageFavorite?: (msgId: string) => void;
  conversations?: Record<string, Message[]>;
  onSelectBot?: (botId: string) => void;
}

export default function ChatScreen({
  botId,
  onBack,
  messages,
  onAddMessage,
  onClearHistory,
  onRemoveMessage,
  onToggleMessageFavorite,
  conversations,
  onSelectBot,
}: ChatScreenProps) {
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentBot = BOTS.find((b) => b.id === botId) || BOTS[0];
  const suggestions = INSTANT_SUGGESTIONS[botId] || INSTANT_SUGGESTIONS["nexus-7"];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

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

  const handleSendMessage = async (text: string, regenerateAfterIndex?: number) => {
    if (!text.trim() && regenerateAfterIndex === undefined) return;

    let payloadMessages: Message[];

    if (regenerateAfterIndex !== undefined) {
      payloadMessages = messages.slice(0, regenerateAfterIndex + 1);
    } else {
      const userMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "user",
        content: text,
        timestamp: cleanFormattedTime(),
      };
      onAddMessage(userMsg);
      payloadMessages = [...messages, userMsg];
      setInputText("");
    }

    setIsThinking(true);
    setErrorMessage("");

    try {
      const chatPayload = payloadMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId: currentBot.id, messages: chatPayload }),
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
      setErrorMessage(err.message || "Network Timeout. Please verify that your Gemini API Key is configured correctly.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage(inputText);
    }
  };

  const handleCopy = async (msg: Message) => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleRegenerate = (msg: Message, index: number) => {
    if (!onRemoveMessage || isThinking) return;
    onRemoveMessage(msg.id);
    const prevMessages = messages.slice(0, index);
    if (prevMessages.length === 0) return;
    handleSendMessage("", index - 1);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] text-on-surface font-sans select-none overflow-hidden relative">

      {/* Header */}
      <div className="flex justify-between items-center py-3 border-b border-white/10 z-10 bg-background/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all rounded-full cursor-pointer focus:outline-none" title="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowSwitcher(true)}
            className="relative cursor-pointer hover:opacity-80 transition-opacity"
            title="Switch conversation"
          >
            <div className={`w-10 h-10 rounded-full border border-primary/30 overflow-hidden flex items-center justify-center ${currentBot.avatarBg} ${currentBot.iconColor}`}>
              {getBotIcon(currentBot.icon, "w-5 h-5")}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
          </button>

          <div className="flex flex-col">
            <span className="font-sans text-sm font-bold text-on-surface leading-tight">{currentBot.name}</span>
            <span className="font-sans text-[10px] text-green-500 font-semibold tracking-wider uppercase">ONLINE</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onClearHistory && (
            <button onClick={onClearHistory} className="text-xs px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-on-surface-variant hover:text-primary transition-all cursor-pointer mr-1">
              Clear
            </button>
          )}
          <button
            onClick={() => setShowSwitcher(true)}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors rounded-full focus:outline-none cursor-pointer"
            title="Switch conversation"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 py-6 pr-1">
        {messages.map((msg, index) => {
          const isModel = msg.role === "model";
          return (
            <div key={msg.id} className={`group flex flex-col w-full ${isModel ? "items-start" : "items-end"}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all ${
                isModel
                  ? "glass-bubble ai-glow rounded-bl-none text-on-surface"
                  : "bg-primary-container/20 border border-primary-container/30 backdrop-blur-md rounded-br-none text-on-surface"
              }`}>
                {isModel && (
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/30 via-primary to-primary/30"></div>
                )}

                {msg.isFavorite && (
                  <div className="absolute top-2 right-2">
                    <Star className="w-3.5 h-3.5 text-warning fill-current" />
                  </div>
                )}

                <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap selection:bg-primary/45">
                  {msg.content}
                </div>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-semibold font-sans">
                    {isModel ? `${currentBot.name} System` : "You"}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/40 font-sans">{msg.timestamp}</span>
                </div>
              </div>

              {/* Message action buttons */}
              <div className={`flex gap-1 mt-1 ${isModel ? "ml-2" : "mr-2"} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                <button
                  onClick={() => handleCopy(msg)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg glass-bubble text-on-surface-variant hover:text-primary transition-all cursor-pointer"
                  title="Copy"
                >
                  {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {isModel && (
                  <button
                    onClick={() => handleRegenerate(msg, index)}
                    disabled={isThinking}
                    className="w-7 h-7 flex items-center justify-center rounded-lg glass-bubble text-on-surface-variant hover:text-primary transition-all cursor-pointer disabled:opacity-40"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {onToggleMessageFavorite && (
                  <button
                    onClick={() => onToggleMessageFavorite(msg.id)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg glass-bubble transition-all cursor-pointer ${
                      msg.isFavorite ? "text-warning" : "text-on-surface-variant hover:text-warning"
                    }`}
                    title="Favorite"
                  >
                    <Star className={`w-3.5 h-3.5 ${msg.isFavorite ? "fill-current" : ""}`} />
                  </button>
                )}

                {onRemoveMessage && (
                  <button
                    onClick={() => onRemoveMessage(msg.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg glass-bubble text-on-surface-variant hover:text-error transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Thinking indicator */}
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

        {/* Error */}
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

      {/* Suggestions */}
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
                  {getBotIcon(currentBot.icon, "w-3.5 h-3.5")}
                </div>
                <span className="truncate">{sug}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="pt-2 pb-4 bg-background z-10">
        <div className="relative">
          <div className="glass-bubble rounded-full p-1.5 pl-3 pr-1.5 flex items-center gap-2 shadow-xl ring-1 ring-white/10">
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors rounded-full focus:outline-none" title="Add media">
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

      {/* Conversation Switcher Drawer */}
      {showSwitcher && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowSwitcher(false)}>
          <div
            className="w-80 max-w-[85vw] h-full bg-surface/95 backdrop-blur-xl border-l border-white/10 p-4 overflow-y-auto custom-scrollbar animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sans text-lg font-bold text-on-surface flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Conversations
              </h3>
              <button onClick={() => setShowSwitcher(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {BOTS.map((bot) => {
                const conv = conversations?.[bot.id];
                const isActive = bot.id === botId;
                const hasMessages = conv && conv.length > 0;
                return (
                  <button
                    key={bot.id}
                    onClick={() => { onSelectBot?.(bot.id); setShowSwitcher(false); }}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer text-left ${
                      isActive
                        ? "bg-primary-container/20 ring-1 ring-primary/30"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bot.avatarBg} ${bot.iconColor} ring-1 ring-white/10`}>
                      {getBotIcon(bot.icon, "w-5 h-5")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm font-bold text-on-surface">{bot.name}</span>
                        {hasMessages && (
                          <span className="text-[9px] text-on-surface-variant/50 font-semibold">
                            {conv!.length} msgs
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant truncate mt-0.5">
                        {hasMessages ? conv![conv!.length - 1].content : "No messages yet"}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-primary rounded-full shrink-0"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
