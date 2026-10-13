export type ScreenType = "discover" | "chat" | "profile";

export interface Bot {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  capabilities?: string[];
  icon: string;
  category: string;
  tags?: string[];
  trending?: boolean;
  isNew?: boolean;
  highlightBorder?: string;
  avatarBg?: string;
  iconColor?: string;
  accentColor?: string;
}

export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  isFavorite?: boolean;
}

export interface BotUsageStat {
  botId: string;
  messageCount: number;
  lastUsed: string | null;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  membership: "Pro Member" | "Free Tier";
  queriesThisMonth: number;
  maxQueries: number;
  subscriptionRenewal: string;
  joinDate: string;
  totalConversations: number;
  favoriteBots: string[];
  botUsageStats: BotUsageStat[];
  preferences: {
    darkMode: boolean;
    hapticFeedback: boolean;
    saveChatHistory: boolean;
    soundEffects: boolean;
    compactMode: boolean;
  };
}
