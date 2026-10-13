import { useState, useRef } from "react";
import {
  Search, Star, X, Zap, ArrowRight,
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
  const isDefaultView = searchTerm === "" && activeCategory === "All" && !showFavoritesOnly;

  return (
    <div className="text-on-surface font-sans selection:bg-black/10 min-h-screen pb-28">

      {/* Hero Title */}
      {isDefaultView && (
        <section className="mt-2 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
            AI Assistants
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            Twelve specialized AI agents, each engineered for a distinct domain. Choose one to start a conversation.
          </p>
        </section>
      )}

      {/* Search Bar */}
      <section className="mt-5">
        <div className="glass-card rounded-full p-2 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-black/15 transition-all duration-300">
          <div className="pl-4 text-on-surface-variant group-focus-within:text-on-surface transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            className="bg-transparent border-none focus:outline-none focus:ring-0 flex-grow text-sm placeholder:text-on-surface-variant/50 font-sans text-on-surface"
            placeholder="Search 12 AI assistants..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`w-10 h-10 flex items-center justify-center transition-all focus:outline-none rounded-full ${
              showFavoritesOnly ? "text-black bg-black/8" : "text-on-surface-variant hover:text-on-surface hover:bg-black/5"
            }`}
            title="Show favorites only"
          >
            <Star className={`w-5 h-5 ${showFavoritesOnly ? "fill-current" : ""}`} />
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowFavoritesOnly(false); }}
              className={`px-5 py-2 rounded-full font-sans text-xs font-semibold whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                activeCategory === cat && !showFavoritesOnly
                  ? "bg-black text-white"
                  : "glass-card text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Trending */}
      {isDefaultView && (
        <section className="mt-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-sans text-xl font-bold text-on-surface tracking-tight">Trending Now</h2>
            <button onClick={handleSeeAll} className="text-on-surface-variant font-semibold text-xs hover:text-on-surface transition-colors cursor-pointer flex items-center gap-1">
              See All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5 sm:-mx-6 sm:px-6">
            {trendingBots.map((bot, i) => (
              <div
                key={bot.id}
                onClick={() => setDetailBot(bot)}
                className={`min-w-[280px] md:min-w-[320px] glass-card rounded-2xl p-5 border-t-2 ${bot.highlightBorder || "border-t-black"} relative overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1 animate-slide-up`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {bot.isNew && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                    New
                  </div>
                )}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className={`w-12 h-12 rounded-xl ${bot.avatarBg} flex items-center justify-center mb-4 ${bot.iconColor}`}>
                      {getBotIcon(bot.icon)}
                    </div>
                    <h3 className="font-sans text-lg font-bold text-on-surface mb-1">{bot.name}</h3>
                    <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2 mb-4">
                      {bot.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    {bot.tags?.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full bg-black/5 text-on-surface-variant text-[10px] font-bold tracking-wider uppercase font-sans">
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
      {isDefaultView && newBots.length > 0 && (
        <section className="mt-10">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-sans text-xl font-bold text-on-surface tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-on-surface" />
              New Arrivals
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5 sm:-mx-6 sm:px-6">
            {newBots.map((bot, i) => (
              <div
                key={bot.id}
                onClick={() => setDetailBot(bot)}
                className={`min-w-[260px] glass-card rounded-2xl p-5 border-l-2 ${bot.highlightBorder || "border-l-black"} relative overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1 animate-slide-up`}
                style={{ animationDelay: `${i * 60}ms` }}
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
          {showFavoritesOnly ? "Favorite Assistants" : searchTerm || activeCategory !== "All" ? "Search Results" : "All Assistants"}
        </h2>

        {filteredBots.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center text-on-surface-variant">
            <Search className="w-10 h-10 mx-auto text-on-surface-variant/30 mb-3" />
            <p className="text-sm font-sans">
              {showFavoritesOnly ? "No favorites yet. Tap the star icon on any assistant to add it here." : "No AI assistants matched your search."}
            </p>
            <button
              onClick={() => { setSearchTerm(""); setActiveCategory("All"); setShowFavoritesOnly(false); }}
              className="mt-4 px-5 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-black/85 active:scale-95 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3 stagger">
            {filteredBots.map((bot) => (
              <div
                key={bot.id}
                onClick={() => setDetailBot(bot)}
                className="glass-card p-4 rounded-2xl flex items-center justify-between group hover:translate-x-1 transition-transform duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl ${bot.avatarBg} flex items-center justify-center ${bot.iconColor} ring-1 ring-black/5 shrink-0`}>
                    {getBotIcon(bot.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans text-sm font-bold text-on-surface">{bot.name}</h4>
                      {bot.isNew && (
                        <span className="px-1.5 py-0.5 bg-black text-white text-[8px] font-bold uppercase rounded">New</span>
                      )}
                    </div>
                    <p className="text-on-surface-variant text-xs line-clamp-1 truncate mt-0.5">{bot.description}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[9px] text-on-surface-variant/60 uppercase tracking-wider font-semibold">{bot.category}</span>
                      {bot.tags?.slice(0, 1).map(tag => (
                        <span key={tag} className="text-[9px] text-on-surface-variant/60 uppercase tracking-wider font-semibold">· {tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(bot.id); }}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer ${
                      favoriteBots.includes(bot.id)
                        ? "text-black bg-black/8"
                        : "text-on-surface-variant/40 hover:text-black hover:bg-black/5"
                    }`}
                    title={favoriteBots.includes(bot.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star className={`w-4 h-4 ${favoriteBots.includes(bot.id) ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectBot(bot.id); }}
                    className="bg-black hover:bg-black/85 text-white px-4 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-all cursor-pointer"
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
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setDetailBot(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-7 relative animate-scale-in shadow-2xl border border-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDetailBot(null)}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-black/5 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className={`w-16 h-16 rounded-2xl ${detailBot.avatarBg} flex items-center justify-center mb-4 ${detailBot.iconColor} ring-1 ring-black/5`}>
                {getBotIcon(detailBot.icon, "w-8 h-8")}
              </div>
              <h2 className="font-sans text-xl font-bold text-on-surface">{detailBot.name}</h2>
              <div className="flex gap-2 mt-2">
                {detailBot.tags?.map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full bg-black/5 text-on-surface-variant text-[9px] font-bold tracking-wider uppercase">
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
                    <span key={cap} className="px-3 py-1 bg-black/5 rounded-full text-xs font-semibold text-on-surface">
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
                    ? "bg-black/8 text-black"
                    : "bg-black/5 text-on-surface-variant hover:text-black"
                }`}
              >
                {favoriteBots.includes(detailBot.id) ? "Favorited" : "Add to Favorites"}
              </button>
              <button
                onClick={() => { onSelectBot(detailBot.id); setDetailBot(null); }}
                className="flex-1 py-3 rounded-xl bg-black text-white font-bold text-sm hover:bg-black/85 transition-all active:scale-95 cursor-pointer shadow-lg shadow-black/15"
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
