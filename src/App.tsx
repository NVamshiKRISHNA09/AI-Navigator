import { useState, useEffect } from "react";
import {
  Compass, MessageSquare, User as UserIcon,
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
  const [screenTransition, setScreenTransition] = useState(false);

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

  const switchScreen = (screen: ScreenType) => {
    if (screen === currentScreen) return;
    setScreenTransition(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setScreenTransition(false);
    }, 150);
  };

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
    switchScreen("chat");
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
        { id: "init", role: "model", content: BOT_INITIAL_MESSAGES[botId] || "Hello! How can I assist you today?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
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

  const activeChatCount = Object.keys(conversations).filter(k => conversations[k].length > 0).length;

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen relative flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-black/[0.06] flex justify-between items-center px-5 sm:px-6 py-3 h-16">
        <div className="flex items-center gap-3">
          <button
            className="text-on-surface hover:text-on-surface-variant active:scale-95 transition-transform focus:outline-none cursor-pointer"
            onClick={() => switchScreen("discover")}
          >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-3.5 h-3.5 border-2 border-white rounded-sm rotate-45" />
            </div>
          </button>
          <div className="flex items-center gap-2 cursor-pointer active:opacity-90 select-none group" onClick={() => switchScreen("discover")}>
            <h1 className="text-lg font-extrabold tracking-tight text-on-surface group-hover:text-on-surface-variant transition-colors">
              Cognitive Nexus
            </h1>
          </div>
        </div>

        <button
          onClick={() => switchScreen("profile")}
          className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all active:scale-95 ${
            currentScreen === "profile"
              ? "border-black ring-2 ring-black/10"
              : "border-black/15 hover:border-black/40"
          }`}
          title="View profile"
        >
          <img alt="User avatar" className="w-full h-full object-cover" src={userProfile.avatarUrl} />
        </button>
      </header>

      {/* Main content */}
      <main className={`pt-20 pb-28 px-5 sm:px-6 max-w-[820px] w-full mx-auto flex-grow flex flex-col justify-start transition-all duration-300 ${screenTransition ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
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
            onBack={() => switchScreen("discover")}
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-white/85 backdrop-blur-xl border-t border-black/[0.06] flex justify-around items-center px-4 pb-4 pt-2">
        <button
          onClick={() => switchScreen("discover")}
          className={`flex flex-col items-center justify-center py-1.5 px-5 transition-all focus:outline-none cursor-pointer rounded-full ${
            currentScreen === "discover"
              ? "bg-black text-white font-bold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Compass className="w-5 h-5 select-none" />
          <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Discover</span>
        </button>

        <button
          onClick={() => handleSelectBot(selectedBotId)}
          className={`flex flex-col items-center justify-center py-1.5 px-5 transition-all focus:outline-none cursor-pointer rounded-full relative ${
            currentScreen === "chat"
              ? "bg-black text-white font-bold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <MessageSquare className="w-5 h-5 select-none" />
          <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Chats</span>
          {activeChatCount > 0 && currentScreen !== "chat" && (
            <span className="absolute top-0 right-3 w-2 h-2 bg-black rounded-full" />
          )}
        </button>

        <button
          onClick={() => switchScreen("profile")}
          className={`flex flex-col items-center justify-center py-1.5 px-5 transition-all focus:outline-none cursor-pointer rounded-full ${
            currentScreen === "profile"
              ? "bg-black text-white font-bold"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <UserIcon className="w-5 h-5 select-none" />
          <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
