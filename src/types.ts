export type ScreenType = "discover" | "chat" | "profile";

export interface Bot {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  avatarUrl?: string; // If not provided, we will render a fallback icon styled beautifully
  icon: string; // Lucide icon name, or Material symbols icon name
  category: string;
  tags?: string[];
  trending?: boolean;
  highlightBorder?: string; // Tailwind border styling
  avatarBg?: string; // Tailwind background color styling for the icon bubble
  iconColor?: string; // Text color styling for the icon
}

export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  membership: "Pro Member" | "Free Tier";
  queriesThisMonth: number;
  maxQueries: number;
  subscriptionRenewal: string;
  preferences: {
    darkMode: boolean;
    hapticFeedback: boolean;
    saveChatHistory: boolean;
  };
}
