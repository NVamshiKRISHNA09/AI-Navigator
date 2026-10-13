import React, { useState, useRef } from "react";
import {
  Search,
  SlidersHorizontal,
  Bolt,
  Palette,
  Terminal,
  Sigma,
  BookOpen,
  Dumbbell,
  Bug,
  Sparkles,
} from "lucide-react";
import { BOTS } from "../data";

interface DiscoverScreenProps {
  onSelectBot: (botId: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export default function DiscoverScreen({
  onSelectBot,
  searchTerm,
  setSearchTerm,
}: DiscoverScreenProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const allBotsRef = useRef<HTMLDivElement>(null);

  const categories = ["All", "Productivity", "Creative", "Coding", "Math", "Lifestyle"];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  const handleSeeAll = () => {
    allBotsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getBotIcon = (iconName: string) => {
    switch (iconName) {
      case "bolt": return <Bolt className="w-6 h-6" />;
      case "palette": return <Palette className="w-6 h-6" />;
      case "terminal": return <Terminal className="w-6 h-6" />;
      case "functions": return <Sigma className="w-6 h-6" />;
      case "edit_note": return <BookOpen className="w-6 h-6" />;
      case "fitness_center": return <Dumbbell className="w-6 h-6" />;
      case "bug_report": return <Bug className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  // Filter bots by category & search term
  const filteredBots = BOTS.filter((bot) => {
    const matchesCategory = activeCategory === "All" || bot.category === activeCategory;
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bot.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const trendingBots = BOTS.filter(bot => bot.trending);

  return (
    <div className="text-on-surface font-sans selection:bg-primary/30 min-h-screen pb-28">

      {/* Search Bar Section */}
      <section className="mt-4">
        <div className="glass-card rounded-full p-2 flex items-center gap-2 group focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-300">
          <div className="pl-4 text-on-surface-variant group-focus-within:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            className="bg-transparent border-none focus:outline-none focus:ring-0 flex-grow text-sm placeholder:text-on-surface-variant/50 font-sans"
            placeholder="Search chatbots..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
            title="Filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Categories horizontal scroll */}
      <section className="mt-8 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-6 py-2 rounded-full font-sans text-xs font-semibold whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-primary text-on-primary"
                  : "glass-card text-on-surface-variant hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      {searchTerm === "" && activeCategory === "All" && (
        <section className="mt-10">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-sans text-xl font-bold text-on-surface tracking-tight">Trending Now</h2>
            <button
              onClick={handleSeeAll}
              className="text-primary font-semibold text-xs hover:underline cursor-pointer"
            >
              See All
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
            {trendingBots.map((bot) => (
              <div
                key={bot.id}
                onClick={() => onSelectBot(bot.id)}
                className={`min-w-[280px] md:min-w-[320px] glass-card rounded-xl p-5 border-t-2 ${
                  bot.id === "creative-muse"
                    ? "border-t-[#10a37f]"
                    : bot.id === "dev-bot-x"
                    ? "border-t-[#3b82f6]"
                    : "border-t-primary"
                } relative overflow-hidden group cursor-pointer transition-all duration-300 hover:translate-y-[-4px]`}
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
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
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-surface-variant/60 text-on-surface-variant text-[10px] font-bold tracking-wider uppercase font-sans"
                      >
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

      {/* All Chatbots List */}
      <section ref={allBotsRef} className="mt-10 scroll-mt-20">
        <h2 className="font-sans text-xl font-bold text-on-surface tracking-tight mb-6">
          {searchTerm || activeCategory !== "All" ? "Filtered AI Assistants" : "All Chatbots"}
        </h2>

        {filteredBots.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-on-surface-variant">
            <Sparkles className="w-10 h-10 mx-auto text-primary/40 mb-3 animate-pulse" />
            <p className="text-sm font-sans">No cognitive models matched your request.</p>
            <button
              onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}
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
                onClick={() => onSelectBot(bot.id)}
                className="glass-card p-4 rounded-xl flex items-center justify-between group hover:translate-x-1.5 transition-transform duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full glass-card flex items-center justify-center ${bot.avatarBg} ${bot.iconColor} ring-1 ring-white/10`}>
                    {getBotIcon(bot.icon)}
                  </div>
                  <div className="max-w-[180px] sm:max-w-xs md:max-w-md">
                    <h4 className="font-sans text-sm font-bold text-on-surface">{bot.name}</h4>
                    <p className="text-on-surface-variant text-xs line-clamp-1 truncate mt-0.5">{bot.description}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBot(bot.id);
                  }}
                  className="bg-primary hover:bg-primary/90 text-on-primary px-4 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-sm shadow-primary/20 hover:shadow-primary/40"
                >
                  Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
