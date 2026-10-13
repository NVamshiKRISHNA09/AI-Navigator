import React, { useState, useRef } from "react";
import {
  Search, Star, X, Sparkles, Zap,
} from "lucide-react";
import { BOTS } from "../data";
import { Bot } from "../types";
import { getBotIcon } from "./BotIcon";

interface DiscoverScreenProps {
  onSelectBot: (botId: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  favoriteBots: string[];
  onToggleFavorite: (botId: string) => void;
}

export default function DiscoverScreen({
  onSelectBot,
  searchTerm,
  setSearchTerm,
  favoriteBots,
  onToggleFavorite,
}: DiscoverScreenProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [detailBot, setDetailBot] = useState<Bot | null>(null);
  const allBotsRef = useRef<HTMLDivElement>(null);

  const categories = ["All", "Productivity", "Creative", "Coding", "Math", "Science", "Lifestyle"];

  const handleSeeAll = () => {
    allBotsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredBots = BOTS.filter((bot) => {
    if (showFavoritesOnly && !favoriteBots.includes(bot.id)) return false;
    const matchesCategory = activeCategory === "All" || bot.category === activeCategory;
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bot.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const trendingBots = BOTS.filter(bot => bot.trending);
  const newBots = BOTS.filter(bot => bot.isNew);

  return (
    <div className="text-on-surface font-sans selection:bg-primary/30 min-h-screen pb-28">

      {/* Search Bar */}
      <section className="mt-4">
        <div className="glass-card rounded-full p-2 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-300">
          <div className="pl-4 text-on-surface-variant group-focus-within:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            className="bg-transparent border-none focus:outline-none focus:ring-0 flex-grow text-sm placeholder:text-on-surface-variant/50 font-sans"
            placeholder="Search 12 AI assistants..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`w-10 h-10 flex items-center justify-center transition-all focus:outline-none rounded-full ${
              showFavoritesOnly ? "text-warning bg-warning/10" : "text-on-surface-variant hover:text-primary"
            }`}
            title="Show favorites only"
          >
            <Star className={`w-5 h-5 ${showFavoritesOnly ? "fill-current" : ""}`} />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-8 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowFavoritesOnly(false); }}
              className={`px-6 py-2 rounded-full font-sans text-xs font-semibold whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                activeCategory === cat && !showFavoritesOnly
                  ? "bg-primary text-on-primary"
                  : "glass-card text-on-surface-variant hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Trending */}
      {searchTerm === "" && activeCategory === "All" && !showFavoritesOnly && (
        <section className="mt-10">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-sans text-xl font-bold text-on-surface tracking-tight">Trending Now</h2>
            <button onClick={handleSeeAll} className="text-primary font-semibold text-xs hover:underline cursor-pointer">
              See All
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
            {trendingBots.map((bot) => (
              <div
                key={bot.id}
                onClick={() => setDetailBot(bot)}
                className={`min-w-[280px] md:min-w-[320px] glass-card rounded-xl p-5 border-t-2 ${bot.highlightBorder || "border-t-primary"} relative overflow-hidden group cursor-pointer transition-all duration-300 hover:translate-y-[-4px]`}
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                {bot.isNew && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-accent/20 text-accent text-[9px] font-bold uppercase tracking-wider rounded-full">
                    New
                  </div>
                )}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className={`w-12 h-12 rounded-lg ${bot.avatarBg} flex items-center justify-center mb-4 ${bot.iconColor}`}>
                      {getBotIcon(bot.icon)}
                    </div>
                    <h3 className="font-sans text-lg font-bold text-primary mb-1">{bot.name}</h3>
                    <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2 mb-4">
                      {bot.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    {bot.tags?.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full bg-surface-variant/60 text-on-surface-variant text-[10px] font-bold tracking-wider uppercase font-sans">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {searchTerm === "" && activeCategory === "All" && !showFavoritesOnly && newBots.length > 0 && (
        <section className="mt-10">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-sans text-xl font-bold text-on-surface tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              New Arrivals
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
            {newBots.map((bot) => (
              <div
                key={bot.id}
                onClick={() => setDetailBot(bot)}
                className={`min-w-[260px] glass-card rounded-xl p-5 border-l-2 ${bot.highlightBorder || "border-l-accent/40"} relative overflow-hidden group cursor-pointer transition-all duration-300 hover:translate-y-[-4px]`}
              >
                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-lg ${bot.avatarBg} flex items-center justify-center mb-3 ${bot.iconColor}`}>
                    {getBotIcon(bot.icon, "w-5 h-5")}
                  </div>
                  <h3 className="font-sans text-base font-bold text-on-surface mb-1">{bot.name}</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2">
                    {bot.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All / Filtered Bots List */}
      <section ref={allBotsRef} className="mt-10 scroll-mt-20">
        <h2 className="font-sans text-xl font-bold text-on-surface tracking-tight mb-6">
          {showFavoritesOnly ? "Favorite Assistants" : searchTerm || activeCategory !== "All" ? "Filtered AI Assistants" : "All Chatbots"}
        </h2>

        {filteredBots.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-on-surface-variant">
            <Sparkles className="w-10 h-10 mx-auto text-primary/40 mb-3 animate-pulse" />
            <p className="text-sm font-sans">
              {showFavoritesOnly ? "No favorites yet. Tap the star icon on any bot to add it here." : "No cognitive models matched your request."}
            </p>
            <button
              onClick={() => { setSearchTerm(""); setActiveCategory("All"); setShowFavoritesOnly(false); }}
              className="mt-4 px-4 py-2 bg-primary/15 text-primary rounded-lg text-xs font-semibold hover:bg-primary/25 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBots.map((bot) => (
              <div
                key={bot.id}
                onClick={() => setDetailBot(bot)}
                className="glass-card p-4 rounded-xl flex items-center justify-between group hover:translate-x-1.5 transition-transform duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-full glass-card flex items-center justify-center ${bot.avatarBg} ${bot.iconColor} ring-1 ring-white/10 shrink-0`}>
                    {getBotIcon(bot.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans text-sm font-bold text-on-surface">{bot.name}</h4>
                      {bot.isNew && (
                        <span className="px-1.5 py-0.5 bg-accent/20 text-accent text-[8px] font-bold uppercase rounded">New</span>
                      )}
                    </div>
                    <p className="text-on-surface-variant text-xs line-clamp-1 truncate mt-0.5">{bot.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(bot.id); }}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer ${
                      favoriteBots.includes(bot.id)
                        ? "text-warning hover:bg-warning/10"
                        : "text-on-surface-variant/40 hover:text-warning hover:bg-white/5"
                    }`}
                    title={favoriteBots.includes(bot.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star className={`w-4 h-4 ${favoriteBots.includes(bot.id) ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectBot(bot.id); }}
                    className="bg-primary hover:bg-primary/90 text-on-primary px-4 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-sm shadow-primary/20 hover:shadow-primary/40"
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bot Detail Modal */}
      {detailBot && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setDetailBot(null)}
        >
          <div
            className="glass-card rounded-2xl max-w-md w-full p-6 relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDetailBot(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className={`w-16 h-16 rounded-2xl ${detailBot.avatarBg} flex items-center justify-center mb-4 ${detailBot.iconColor} ring-1 ring-white/10`}>
                {getBotIcon(detailBot.icon, "w-8 h-8")}
              </div>
              <h2 className="font-sans text-xl font-bold text-primary">{detailBot.name}</h2>
              <div className="flex gap-2 mt-2">
                {detailBot.tags?.map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full bg-surface-variant/60 text-on-surface-variant text-[9px] font-bold tracking-wider uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-on-surface-variant text-sm leading-relaxed text-center mb-6">
              {detailBot.longDescription || detailBot.description}
            </p>

            {detailBot.capabilities && detailBot.capabilities.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold mb-3">Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {detailBot.capabilities.map((cap) => (
                    <span key={cap} className="px-3 py-1 glass-bubble rounded-full text-xs font-semibold text-on-surface">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { onToggleFavorite(detailBot.id); }}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 cursor-pointer ${
                  favoriteBots.includes(detailBot.id)
                    ? "bg-warning/15 text-warning"
                    : "glass-bubble text-on-surface-variant hover:text-warning"
                }`}
              >
                {favoriteBots.includes(detailBot.id) ? "Favorited" : "Add to Favorites"}
              </button>
              <button
                onClick={() => { onSelectBot(detailBot.id); setDetailBot(null); }}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 transition-all active:scale-95 cursor-pointer shadow-lg shadow-primary/20"
              >
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
