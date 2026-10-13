import {
  BarChart2, Calendar, Moon, Smartphone, History, ShieldCheck, Lock, FileText,
  HelpCircle, Bug, LogOut, ChevronRight, Sparkles, Award, Star, MessageSquare,
  TrendingUp, Volume2, AlignJustify,
} from "lucide-react";
import { UserProfile, Message } from "../types";
import { BOTS } from "../data";
import { getBotIcon } from "./BotIcon";

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
  onLogout: () => void;
  conversations: Record<string, Message[]>;
  onSelectBot: (botId: string) => void;
}

export default function ProfileScreen({
  profile,
  onUpdateProfile,
  onLogout,
  conversations,
  onSelectBot,
}: ProfileScreenProps) {

  const handleTogglePreference = (key: keyof UserProfile["preferences"]) => {
    const updatedPreferences = {
      ...profile.preferences,
      [key]: !profile.preferences[key]
    };
    onUpdateProfile({ ...profile, preferences: updatedPreferences });
  };

  const percentage = Math.min((profile.queriesThisMonth / profile.maxQueries) * 100, 100);

  const sortedStats = [...profile.botUsageStats]
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, 6);

  const maxMessageCount = Math.max(...profile.botUsageStats.map(s => s.messageCount), 1);

  const toggleConfig: { key: keyof UserProfile["preferences"]; label: string; icon: typeof Moon }[] = [
    { key: "darkMode", label: "Dark Mode", icon: Moon },
    { key: "hapticFeedback", label: "Haptic Feedback", icon: Smartphone },
    { key: "saveChatHistory", label: "Save Chat History", icon: History },
    { key: "soundEffects", label: "Sound Effects", icon: Volume2 },
    { key: "compactMode", label: "Compact Mode", icon: AlignJustify },
  ];

  return (
    <div className="text-on-surface font-sans select-none pb-28">

      {/* Hero */}
      <section className="flex flex-col items-center text-center space-y-4 pt-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 p-1 bg-surface-container-high overflow-hidden">
            <img alt={profile.name} className="w-full h-full rounded-full object-cover" src={profile.avatarUrl} />
          </div>
          <div className="absolute bottom-0 right-1 bg-primary text-on-primary rounded-full p-1 border-2 border-background shadow-md">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>
        <div>
          <h2 className="font-sans text-xl font-extrabold text-on-surface tracking-tight">{profile.name}</h2>
          <p className="text-xs text-on-surface-variant mt-1">{profile.email}</p>
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full mt-3 ring-1 ring-primary/25">
            <Award className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="text-xs font-bold leading-none tracking-wide">{profile.membership}</span>
          </div>
        </div>
      </section>

      {/* Quick Stats Row */}
      <section className="mt-6 grid grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="font-mono text-lg font-bold text-primary">{Object.keys(conversations).filter(k => conversations[k].length > 0).length}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mt-1">Active Chats</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="font-mono text-lg font-bold text-accent">{profile.favoriteBots.length}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mt-1">Favorites</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="font-mono text-lg font-bold text-success">{BOTS.length}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mt-1">Total Bots</p>
        </div>
      </section>

      {/* Account Overview */}
      <section className="mt-8 space-y-4">
        <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 px-2 uppercase tracking-wider font-sans">
          <BarChart2 className="w-4 h-4 text-primary" />
          Account Overview
        </h3>
        <div className="glass-card rounded-xl p-5 space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-sans text-on-surface-variant">Queries this month</span>
              <span className="font-mono text-xs font-semibold text-primary">
                {profile.queriesThisMonth.toLocaleString()} / {profile.maxQueries.toLocaleString()}
              </span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full shimmer-progress rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-white/5">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-on-surface-variant" />
              <span className="text-xs text-on-surface">Subscription Renewal</span>
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">{profile.subscriptionRenewal}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-on-surface-variant" />
              <span className="text-xs text-on-surface">Member Since</span>
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">{profile.joinDate}</span>
          </div>
        </div>
      </section>

      {/* Bot Usage Stats */}
      <section className="mt-8 space-y-4">
        <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 px-2 uppercase tracking-wider font-sans">
          <TrendingUp className="w-4 h-4 text-primary" />
          Bot Usage
        </h3>
        <div className="glass-card rounded-xl p-5 space-y-4">
          {sortedStats.map((stat) => {
            const bot = BOTS.find(b => b.id === stat.botId);
            if (!bot) return null;
            const barWidth = Math.max((stat.messageCount / maxMessageCount) * 100, 4);
            return (
              <div
                key={stat.botId}
                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded-lg p-1 -m-1 transition-colors"
                onClick={() => onSelectBot(stat.botId)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bot.avatarBg} ${bot.iconColor} ring-1 ring-white/10`}>
                  {getBotIcon(bot.icon, "w-4 h-4")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-semibold text-on-surface">{bot.name}</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">{stat.messageCount} msgs</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%`, backgroundColor: bot.accentColor || "#5b9fff" }}
                    ></div>
                  </div>
                </div>
                <span className="text-[9px] text-on-surface-variant/50 uppercase tracking-wider shrink-0 w-16 text-right">
                  {stat.lastUsed || "Never"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Favorite Bots */}
      {profile.favoriteBots.length > 0 && (
        <section className="mt-8 space-y-4">
          <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 px-2 uppercase tracking-wider font-sans">
            <Star className="w-4 h-4 text-primary" />
            Favorite Assistants
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.favoriteBots.map((botId) => {
              const bot = BOTS.find(b => b.id === botId);
              if (!bot) return null;
              return (
                <button
                  key={botId}
                  onClick={() => onSelectBot(botId)}
                  className="glass-card px-3 py-2 rounded-full flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${bot.avatarBg} ${bot.iconColor}`}>
                    {getBotIcon(bot.icon, "w-3.5 h-3.5")}
                  </div>
                  <span className="text-xs font-semibold text-on-surface">{bot.name}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Preferences */}
      <section className="mt-8 space-y-4">
        <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 px-2 uppercase tracking-wider font-sans">
          <Smartphone className="w-4 h-4 text-primary" />
          Preferences
        </h3>
        <div className="glass-card rounded-xl divide-y divide-white/5">
          {toggleConfig.map(({ key, label, icon: Icon }) => (
            <div key={key} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary ring-1 ring-white/5">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-on-surface font-sans">{label}</span>
              </div>
              <button
                onClick={() => handleTogglePreference(key)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 pointer-events-auto cursor-pointer ${
                  profile.preferences[key] ? "bg-primary" : "bg-surface-container-highest"
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${
                  profile.preferences[key] ? "right-1 bg-on-primary" : "left-1 bg-white/20"
                }`}></div>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="mt-8 space-y-4 font-sans">
        <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 px-2 uppercase tracking-wider">
          <Lock className="w-4 h-4 text-primary" />
          Security
        </h3>
        <div className="glass-card rounded-xl overflow-hidden divide-y divide-white/5">
          {[
            { icon: ShieldCheck, label: "Two-Factor Authentication" },
            { icon: Lock, label: "Change Password" },
            { icon: FileText, label: "Privacy Policy" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer text-left focus:outline-none">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-on-surface">{label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-on-surface-variant/50 group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </section>

      {/* Support */}
      <section className="mt-8 space-y-4">
        <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 px-2 uppercase tracking-wider font-sans">
          <HelpCircle className="w-4 h-4 text-primary" />
          Support
        </h3>
        <div className="glass-card rounded-xl overflow-hidden divide-y divide-white/5">
          {[
            { icon: HelpCircle, label: "Help Center" },
            { icon: MessageSquare, label: "Community Forum" },
            { icon: Bug, label: "Report a Bug" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer text-left focus:outline-none font-sans">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-on-surface">{label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-on-surface-variant/50 group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </section>

      {/* Logout */}
      <div className="pt-10 pb-16">
        <button
          onClick={onLogout}
          className="w-full py-4 rounded-xl border-none bg-error-container/20 text-error flex items-center justify-center gap-2 font-bold hover:bg-error-container/30 transition-all active:scale-95 cursor-pointer"
        >
          <LogOut className="w-5 h-5 select-none" />
          Logout
        </button>
        <p className="text-center mt-6 text-xs font-semibold text-on-surface-variant/30 font-sans tracking-wide">
          v3.0.0 • Cognitive Nexus AI
        </p>
      </div>

    </div>
  );
}
