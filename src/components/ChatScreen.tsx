import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, MoreVertical, Send, ShieldAlert, ShieldCheck, Zap,
  Copy, Check, RefreshCw, Star, Trash2, X, MessageSquare,
} from "lucide-react";
import { Message } from "../types";
import { BOTS, INSTANT_SUGGESTIONS } from "../data";
import { getBotIcon } from "./BotIcon";
import { renderMarkdown } from "../utils/markdown";

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
  const inputRef = useRef<HTMLInputElement>(null);

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
        throw new Error(errorData.error || "The AI service encountered an error.");
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
      let displayMsg = "Unable to reach the AI service. Please try again.";
      if (err?.message) {
        try {
          const parsed = JSON.parse(err.message);
          displayMsg = parsed?.error?.message || err.message;
        } catch {
          displayMsg = err.message;
        }
      }
      setErrorMessage(displayMsg);
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
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] text-on-surface font-sans overflow-hidden relative">

      {/* Header */}
      <div className="flex justify-between items-center py-3 border-b border-black/[0.06] z-10 bg-white/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-black/5 transition-all rounded-full cursor-pointer focus:outline-none" title="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowSwitcher(true)}
            className="relative cursor-pointer hover:opacity-80 transition-opacity"
            title="Switch conversation"
          >
            <div className={`w-10 h-10 rounded-2xl border border-black/10 overflow-hidden flex items-center justify-center ${currentBot.avatarBg} ${currentBot.iconColor}`}>
              {getBotIcon(currentBot.icon, "w-5 h-5")}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </button>

          <div className="flex flex-col">
            <span className="font-sans text-sm font-bold text-on-surface leading-tight">{currentBot.name}</span>
            <span className="font-sans text-[10px] text-green-600 font-semibold tracking-wider uppercase">Online</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onClearHistory && (
            <button onClick={onClearHistory} className="text-xs px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
              Clear
            </button>
          )}
          <button
            onClick={() => setShowSwitcher(true)}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-black/5 transition-colors rounded-full focus:outline-none cursor-pointer"
            title="Switch conversation"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat feed */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-5 py-6 pr-1">
        {messages.map((msg, index) => {
          const isModel = msg.role === "model";
          return (
            <div key={msg.id} className={`group flex flex-col w-full ${isModel ? "items-start" : "items-end"} animate-message-pop`}>
              <div className={`max-w-[85%] rounded-2xl p-4 relative overflow-hidden transition-all ${
                isModel
                  ? "glass-card rounded-bl-md text-on-surface"
                  : "bg-black text-white rounded-br-md"
              }`}>
                {isModel && (
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-black/15 to-transparent"></div>
                )}

                {msg.isFavorite && (
                  <div className="absolute top-2 right-2">
                    <Star className="w-3.5 h-3.5 text-warning fill-current" />
                  </div>
                )}

                {isModel ? (
                  <div
                    className="font-sans text-sm leading-relaxed chat-markdown selection:bg-black/20"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                ) : (
                  <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap selection:bg-black/20">
                    {msg.content}
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className={`text-[10px] uppercase tracking-widest font-semibold font-sans ${isModel ? "text-on-surface-variant/50" : "text-white/50"}`}>
                    {isModel ? currentBot.name : "You"}
                  </span>
                  <span className={`text-[10px] font-sans ${isModel ? "text-on-surface-variant/40" : "text-white/40"}`}>{msg.timestamp}</span>
                </div>
              </div>

              {/* Message action buttons */}
              <div className={`flex gap-1 mt-1.5 ${isModel ? "ml-2" : "mr-2"} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                <button
                  onClick={() => handleCopy(msg)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/5 text-on-surface-variant hover:text-on-surface hover:bg-black/10 transition-all cursor-pointer"
                  title="Copy"
                >
                  {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {isModel && (
                  <button
                    onClick={() => handleRegenerate(msg, index)}
                    disabled={isThinking}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/5 text-on-surface-variant hover:text-on-surface hover:bg-black/10 transition-all cursor-pointer disabled:opacity-40"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {onToggleMessageFavorite && (
                  <button
                    onClick={() => onToggleMessageFavorite(msg.id)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg bg-black/5 transition-all cursor-pointer ${
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
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/5 text-on-surface-variant hover:text-error hover:bg-error/10 transition-all cursor-pointer"
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
          <div className="flex flex-col items-start w-full animate-fade-in">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md p-4 glass-card">
              <div className="absolute top-0 left-0 w-full h-[2px] thinking-shimmer rounded-t-2xl"></div>
              <div className="flex space-x-1.5 items-center py-2 px-1">
                <div className="w-2 h-2 bg-black/60 rounded-full typing-dot" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-black/60 rounded-full typing-dot" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-black/60 rounded-full typing-dot" style={{ animationDelay: "300ms" }}></div>
                <span className="text-xs text-on-surface-variant/70 font-sans pl-2">{currentBot.name} is typing...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {errorMessage && (
          <div className="p-4 bg-error-container border border-error/20 rounded-xl text-error text-xs flex items-start gap-2 max-w-full">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Error</p>
              <p className="leading-normal">{errorMessage}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && !isThinking && !errorMessage && (
        <div className="mt-2 py-2 animate-slide-up">
          <p className="text-[10px] text-on-surface-variant/50 font-sans uppercase tracking-widest mb-2 px-1">Suggested prompts</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map((sug, i) => (
              <button
                key={sug}
                onClick={() => handleSendMessage(sug)}
                className="glass-card p-3 rounded-xl text-left hover:translate-x-0.5 transition-all flex items-center gap-2.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface cursor-pointer focus:outline-none animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-6 h-6 rounded bg-black/8 flex items-center justify-center shrink-0 text-on-surface">
                  {getBotIcon(currentBot.icon, "w-3.5 h-3.5")}
                </div>
                <span className="truncate">{sug}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="pt-2 pb-3 bg-white z-10">
        <div className="relative">
          <div className="glass-card rounded-2xl p-1.5 pl-2 pr-1.5 flex items-center gap-2 ring-1 ring-black/5">
            <input
              ref={inputRef}
              className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm font-sans text-on-surface placeholder:text-on-surface-variant/40 py-2 px-2"
              placeholder={`Message ${currentBot.name}...`}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isThinking}
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isThinking}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                inputText.trim() && !isThinking
                  ? "bg-black text-white hover:scale-105 active:scale-95 cursor-pointer"
                  : "bg-black/5 text-on-surface-variant/30 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-center mt-2.5 gap-6 text-[10px] text-on-surface-variant/40 font-sans">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>{currentBot.name} Active</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Secure Connection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Switcher Drawer */}
      {showSwitcher && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/30 backdrop-blur-sm animate-fade-in" onClick={() => setShowSwitcher(false)}>
          <div
            className="w-80 max-w-[85vw] h-full bg-white border-l border-black/5 p-5 overflow-y-auto custom-scrollbar animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sans text-lg font-bold text-on-surface flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-on-surface" />
                Conversations
              </h3>
              <button onClick={() => setShowSwitcher(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-black/5 transition-all cursor-pointer">
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
                        ? "bg-black/8 ring-1 ring-black/10"
                        : "hover:bg-black/5"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bot.avatarBg} ${bot.iconColor} ring-1 ring-black/5`}>
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
                      <div className="w-2 h-2 bg-black rounded-full shrink-0"></div>
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
