import { useState } from "react";
import {
  Menu, Compass, MessageSquare, User as UserIcon, Sparkles,
} from "lucide-react";

import { ScreenType, Message, UserProfile } from "./types";
import { INITIAL_USER_PROFILE, BOT_INITIAL_MESSAGES } from "./data";

import DiscoverScreen from "./components/DiscoverScreen";
import ChatScreen from "./components/ChatScreen";
import ProfileScreen from "./components/ProfileScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("discover");
  const [selectedBotId, setSelectedBotId] = useState<string>("nexus-7");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);

  const [conversations, setConversations] = useState<Record<string, Message[]>>({
    "nexus-7": [
      { id: "init", role: "model", content: BOT_INITIAL_MESSAGES["nexus-7"], timestamp: "10:02 AM" },
      { id: "user-1", role: "user", content: "Can you help me optimize this algorithm for better efficiency?", timestamp: "10:05 AM" },
      { id: "nexus-reply", role: "model", content: "I'd be happy to. Please share the code or the logic you're currently using, and I'll analyze the time complexity for you.", timestamp: "10:05 AM" }
    ],
    "creative-muse": [
      { id: "init", role: "model", content: BOT_INITIAL_MESSAGES["creative-muse"], timestamp: "11:15 AM" }
    ]
  });

  const handleSelectBot = (botId: string) => {
    setSelectedBotId(botId);
    if (!conversations[botId]) {
      setConversations(prev => ({
        ...prev,
        [botId]: [
          { id: "init", role: "model", content: BOT_INITIAL_MESSAGES[botId] || "Hello! How can I assist you today?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]
      }));
    }
    setCurrentScreen("chat");
  };

  const handleAddMessage = (botId: string, newMessage: Message) => {
    setConversations(prev => {
      const existing = prev[botId] || [];
      return { ...prev, [botId]: [...existing, newMessage] };
    });

    if (newMessage.role === "user") {
      setUserProfile(prev => ({
        ...prev,
        queriesThisMonth: Math.min(prev.queriesThisMonth + 1, prev.maxQueries),
        botUsageStats: prev.botUsageStats.map(stat =>
          stat.botId === botId
            ? { ...stat, messageCount: stat.messageCount + 1, lastUsed: "Today" }
            : stat
        ),
      }));
    }
  };

  const handleRemoveMessage = (botId: string, messageId: string) => {
    setConversations(prev => {
      const existing = prev[botId] || [];
      return { ...prev, [botId]: existing.filter(m => m.id !== messageId) };
    });
  };

  const handleClearHistory = (botId: string) => {
    setConversations(prev => ({
      ...prev,
      [botId]: [
        { id: "init", role: "model", content: BOT_INITIAL_MESSAGES[botId] || "Hello! Hello again.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]
    }));
  };

  const handleToggleFavoriteBot = (botId: string) => {
    setUserProfile(prev => ({
      ...prev,
      favoriteBots: prev.favoriteBots.includes(botId)
        ? prev.favoriteBots.filter(id => id !== botId)
        : [...prev.favoriteBots, botId]
    }));
  };

  const handleToggleMessageFavorite = (botId: string, messageId: string) => {
    setConversations(prev => {
      const existing = prev[botId] || [];
      return {
        ...prev,
        [botId]: existing.map(m => m.id === messageId ? { ...m, isFavorite: !m.isFavorite } : m),
      };
    });
  };

  const handleResetProfile = () => {
    setUserProfile(INITIAL_USER_PROFILE);
  };

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen relative flex flex-col justify-between">

      <header className="fixed top-0 left-0 w-full bg-surface/80 backdrop-blur-md z-50 border-b border-white/10 shadow-sm flex justify-between items-center px-6 py-3 h-16">
        <div className="flex items-center gap-4">
          <button
            className="text-primary hover:text-primary-container active:scale-95 transition-transform focus:outline-none cursor-pointer"
            onClick={() => setCurrentScreen("discover")}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer active:opacity-90 select-none" onClick={() => setCurrentScreen("discover")}>
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-extrabold tracking-tight text-primary">
              AI Navigator
            </h1>
          </div>
        </div>

        <div
          onClick={() => setCurrentScreen("profile")}
          className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
            currentScreen === "profile"
              ? "border-primary ring-2 ring-primary-container/20"
              : "border-primary/20 hover:border-primary/60"
          }`}
          title="View profile"
        >
          <img alt="User avatar" className="w-full h-full object-cover" src={userProfile.avatarUrl} />
        </div>
      </header>

      <main className="pt-20 pb-28 px-6 max-w-[800px] w-full mx-auto flex-grow flex flex-col justify-start">
        {currentScreen === "discover" && (
          <DiscoverScreen
            onSelectBot={handleSelectBot}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            favoriteBots={userProfile.favoriteBots}
            onToggleFavorite={handleToggleFavoriteBot}
          />
        )}

        {currentScreen === "chat" && (
          <ChatScreen
            botId={selectedBotId}
            onBack={() => setCurrentScreen("discover")}
            messages={conversations[selectedBotId] || []}
            onAddMessage={(msg) => handleAddMessage(selectedBotId, msg)}
            onClearHistory={() => handleClearHistory(selectedBotId)}
            onRemoveMessage={(msgId) => handleRemoveMessage(selectedBotId, msgId)}
            onToggleMessageFavorite={(msgId) => handleToggleMessageFavorite(selectedBotId, msgId)}
            conversations={conversations}
            onSelectBot={handleSelectBot}
          />
        )}

        {currentScreen === "profile" && (
          <ProfileScreen
            profile={userProfile}
            onUpdateProfile={setUserProfile}
            onLogout={handleResetProfile}
            conversations={conversations}
            onSelectBot={handleSelectBot}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-40 bg-surface/85 backdrop-blur-lg border-t border-white/10 flex justify-around items-center px-4 pb-4 pt-2 shadow-2xl">
        <button
          onClick={() => setCurrentScreen("discover")}
          className={`flex flex-col items-center justify-center py-1 transition-all focus:outline-none cursor-pointer ${
            currentScreen === "discover"
              ? "bg-primary-container/20 text-primary px-5 rounded-full ring-1 ring-primary/25 font-bold"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <Compass className="w-5 h-5 select-none" />
          <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Discover</span>
        </button>

        <button
          onClick={() => handleSelectBot(selectedBotId)}
          className={`flex flex-col items-center justify-center py-1 transition-all focus:outline-none cursor-pointer ${
            currentScreen === "chat"
              ? "bg-primary-container/20 text-primary px-5 rounded-full ring-1 ring-primary/25 font-bold"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <MessageSquare className="w-5 h-5 select-none" />
          <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Chats</span>
        </button>

        <button
          onClick={() => setCurrentScreen("profile")}
          className={`flex flex-col items-center justify-center py-1 transition-all focus:outline-none cursor-pointer ${
            currentScreen === "profile"
              ? "bg-primary-container/20 text-primary px-5 rounded-full ring-1 ring-primary/25 font-bold"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <UserIcon className="w-5 h-5 select-none" />
          <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Profile</span>
        </button>
      </nav>

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-15%] left-[-15%] w-[45%] h-[45%] bg-primary/10 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-blue-500/15 blur-[160px] rounded-full"></div>
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-cyan-500/8 blur-[120px] rounded-full"></div>
      </div>

    </div>
  );
}
