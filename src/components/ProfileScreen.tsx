import React, { useState } from "react";
import { 
  BarChart2, 
  Calendar, 
  Moon, 
  Smartphone, 
  History, 
  ShieldCheck, 
  Lock, 
  FileText, 
  HelpCircle, 
  Bug, 
  LogOut, 
  ChevronRight,
  Sparkles,
  Award
} from "lucide-react";
import { UserProfile } from "../types";

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (newProfile: UserProfile) => void;
  onLogout: () => void;
}

export default function ProfileScreen({
  profile,
  onUpdateProfile,
  onLogout,
}: ProfileScreenProps) {
  
  const handleTogglePreference = (key: keyof UserProfile["preferences"]) => {
    const updatedPreferences = {
      ...profile.preferences,
      [key]: !profile.preferences[key]
    };
    onUpdateProfile({
      ...profile,
      preferences: updatedPreferences
    });
  };

  const percentage = Math.min((profile.queriesThisMonth / profile.maxQueries) * 100, 100);

  return (
    <div className="text-on-surface font-sans select-none pb-28">
      
      {/* User Profile Hero Section */}
      <section className="flex flex-col items-center text-center space-y-4 pt-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 p-1 bg-surface-container-high overflow-hidden">
            <img 
              alt={profile.name} 
              className="w-full h-full rounded-full object-cover" 
              src={profile.avatarUrl} 
            />
          </div>
          <div className="absolute bottom-0 right-1 bg-primary text-on-primary rounded-full p-1 border-2 border-background shadow-md">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>
        
        <div>
          <h2 className="font-sans text-xl font-extrabold text-on-surface tracking-tight">{profile.name}</h2>
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full mt-2 ring-1 ring-primary/25">
            <Award className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="text-xs font-bold leading-none tracking-wide font-sans">{profile.membership}</span>
          </div>
        </div>
      </section>

      {/* Account Overview Section */}
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
              <div 
                className="h-full shimmer-progress rounded-full transition-all duration-500" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-white/5">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-on-surface-variant" />
              <span className="text-xs text-on-surface">Subscription Renewal</span>
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">{profile.subscriptionRenewal}</span>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="mt-8 space-y-4">
        <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 px-2 uppercase tracking-wider font-sans">
          <Smartphone className="w-4 h-4 text-primary" />
          Preferences
        </h3>
        
        <div className="glass-card rounded-xl divide-y divide-white/5">
          {/* Dark Mode toggle item */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary ring-1 ring-white/5">
                <Moon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-on-surface font-sans">Dark Mode</span>
            </div>
            <button 
              onClick={() => handleTogglePreference("darkMode")}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 pointer-events-auto cursor-pointer ${
                profile.preferences.darkMode ? "bg-primary" : "bg-surface-container-highest"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${
                profile.preferences.darkMode ? "right-1 bg-on-primary" : "left-1 bg-white/20"
              }`}></div>
            </button>
          </div>

          {/* Haptic Feedback toggle item */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary ring-1 ring-white/5">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-on-surface font-sans">Haptic Feedback</span>
            </div>
            <button 
              onClick={() => handleTogglePreference("hapticFeedback")}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 pointer-events-auto cursor-pointer ${
                profile.preferences.hapticFeedback ? "bg-primary" : "bg-surface-container-highest"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${
                profile.preferences.hapticFeedback ? "right-1 bg-on-primary" : "left-1 bg-white/20"
              }`}></div>
            </button>
          </div>

          {/* Save Chat History toggle item */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary ring-1 ring-white/5">
                <History className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-on-surface font-sans">Save Chat History</span>
            </div>
            <button 
              onClick={() => handleTogglePreference("saveChatHistory")}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 pointer-events-auto cursor-pointer ${
                profile.preferences.saveChatHistory ? "bg-primary" : "bg-surface-container-highest"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${
                profile.preferences.saveChatHistory ? "right-1 bg-on-primary" : "left-1 bg-white/20"
              }`}></div>
            </button>
          </div>
        </div>
      </section>

      {/* Security Section (styled seamlessly matching prompt guidelines) */}
      <section className="mt-8 space-y-4 font-sans">
        <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 px-2 uppercase tracking-wider">
          <Lock className="w-4 h-4 text-primary" />
          Security
        </h3>
        
        <div className="glass-card rounded-xl overflow-hidden divide-y divide-white/5">
          <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer text-left focus:outline-none">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-on-surface">Two-Factor Authentication</span>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant/50 group-hover:text-primary transition-colors" />
          </button>
          
          <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer text-left focus:outline-none">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-on-surface">Change Password</span>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant/50 group-hover:text-primary transition-colors" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer text-left focus:outline-none">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-on-surface">Privacy Policy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant/50 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </section>

      {/* Support Section */}
      <section className="mt-8 space-y-4">
        <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2 px-2 uppercase tracking-wider font-sans">
          <HelpCircle className="w-4 h-4 text-primary" />
          Support
        </h3>
        
        <div className="glass-card rounded-xl overflow-hidden divide-y divide-white/5">
          <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer text-left focus:outline-none font-sans">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-on-surface">Help Center</span>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant/50 group-hover:text-primary transition-colors" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer text-left focus:outline-none font-sans">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                <Bug className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-on-surface">Report a Bug</span>
            </div>
            <ChevronRight className="w-5 h-5 text-on-surface-variant/50 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </section>

      {/* Logout Action button */}
      <div className="pt-10 pb-16">
        <button 
          onClick={onLogout}
          className="w-full py-4 rounded-xl border-none bg-error-container/20 text-error flex items-center justify-center gap-2 font-bold hover:bg-error-container/30 transition-all active:scale-95 cursor-pointer"
        >
          <LogOut className="w-5 h-5 select-none" />
          Logout
        </button>
        
        <p className="text-center mt-6 text-xs font-semibold text-on-surface-variant/30 font-sans tracking-wide">
          v2.4.0 • Cognitive Nexus AI
        </p>
      </div>

    </div>
  );
}
