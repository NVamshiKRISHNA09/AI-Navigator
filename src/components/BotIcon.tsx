import {
  Bolt, Palette, Terminal, Sigma, BookOpen, Dumbbell, Bug,
  Sparkles, Globe, BarChart3, Heart, Feather, ChefHat,
  type LucideIcon,
} from "lucide-react";

export function getBotIcon(iconName: string, size: string = "w-6 h-6") {
  const iconMap: Record<string, LucideIcon> = {
    bolt: Bolt,
    palette: Palette,
    terminal: Terminal,
    functions: Sigma,
    edit_note: BookOpen,
    fitness_center: Dumbbell,
    bug_report: Bug,
    globe: Globe,
    bar_chart: BarChart3,
    heart: Heart,
    feather: Feather,
    chef_hat: ChefHat,
  };

  const IconComponent = iconMap[iconName] || Sparkles;
  return <IconComponent className={size} />;
}

