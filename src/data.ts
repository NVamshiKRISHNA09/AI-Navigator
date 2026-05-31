import { Bot, UserProfile } from "./types";

export const BOTS: Bot[] = [
  {
    id: "nexus-7",
    name: "Nexus-7",
    description: "A hyper-fast reasoning engine optimized for complex logical workflows and mathematical proofs.",
    longDescription: "An elite cognitive system trained on high-dimension analytical corpora. Excels at syntax mapping, logic optimization, system layout reviews, and advanced proofs.",
    icon: "bolt",
    category: "Productivity",
    tags: ["New", "Logic"],
    trending: true,
    highlightBorder: "border-primary/40",
    avatarBg: "bg-primary-container/20",
    iconColor: "text-primary"
  },
  {
    id: "creative-muse",
    name: "Creative Muse",
    description: "Transform abstract ideas into poetry, scripts, and stunning visual prompts with fluid intelligence.",
    longDescription: "An artistic engine engineered to stimulate lateral thinking and translate deep metaphors into expressive language and high-fidelity creative concepts.",
    icon: "palette",
    category: "Creative",
    tags: ["Popular", "Art"],
    trending: true,
    highlightBorder: "border-[#10a37f]/40",
    avatarBg: "bg-teal-500/10",
    iconColor: "text-teal-400"
  },
  {
    id: "dev-bot-x",
    name: "DevBot X",
    description: "The ultimate coding companion for debugging, refactoring, and system architecture design.",
    longDescription: "A fully integrated senior AI engineer proficient in systems design, standard codebases, multi-language translation, and operational refactoring.",
    icon: "terminal",
    category: "Coding",
    tags: ["Top Rated", "Code"],
    trending: true,
    highlightBorder: "border-[#3b82f6]/40",
    avatarBg: "bg-blue-500/10",
    iconColor: "text-blue-400"
  },
  {
    id: "math-wizard",
    name: "Math Wizard",
    description: "Solves step-by-step calculus and algebra problems.",
    icon: "functions",
    category: "Math",
    avatarBg: "bg-violet-500/10",
    iconColor: "text-violet-400"
  },
  {
    id: "grammar-pro",
    name: "Grammar Pro",
    description: "Real-time editing and style suggestions for any text.",
    icon: "edit_note",
    category: "Productivity",
    avatarBg: "bg-zinc-500/10",
    iconColor: "text-zinc-400"
  },
  {
    id: "fitness-ai",
    name: "Fitness AI",
    description: "Personalized workout and meal plans based on goals.",
    icon: "fitness_center",
    category: "Lifestyle",
    avatarBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400"
  },
  {
    id: "bug-hunter",
    name: "Bug Hunter",
    description: "Identify vulnerabilities and syntax errors instantly.",
    icon: "bug_report",
    category: "Coding",
    avatarBg: "bg-rose-500/10",
    iconColor: "text-rose-400"
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Alex Rivera",
  email: "alex.rivera@cognitive.ai",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAejYj_njSq2qPL9NW7n-CDC8sfauUiMxBWbv8iYx8-ogFEXIeJBoD0KgOJHmp8r5qseBuw4AkAh4SHlHQ9FVkP_Ztu78qOHR9J2M2kiuaGsonqHXoRPGgC1WplLPZ2FGJdpPZB2p5lxqUJ-YzdK908lAb_GYs9qp_Bb0HQ2gymU1rQj3I88fyAIYtkBAnkSaBauFQ7fw_eE2YjQaCRxj1Kmk1IX139Xn9pKQQ5GPoaFWr_SVADEVal5rQ4eHK1eqW2yASY2nad8TDl",
  membership: "Pro Member",
  queriesThisMonth: 1240,
  maxQueries: 5000,
  subscriptionRenewal: "October 24, 2026",
  preferences: {
    darkMode: true,
    hapticFeedback: true,
    saveChatHistory: false
  }
};

export const INSTANT_SUGGESTIONS: Record<string, string[]> = {
  "nexus-7": [
    "Refactor Python loop",
    "Explain Big O notation",
    "Find prime numbers in JS",
    "Compare quicksort vs mergesort"
  ],
  "creative-muse": [
    "Write a poem about neon labs",
    "Generate a prompt for sci-fi city",
    "Draft a plot for a techno thriller",
    "Write a futuristic haiku"
  ],
  "dev-bot-x": [
    "Explain React 19 server actions",
    "Design a Redis caching schema",
    "Refactor Node DB queries",
    "Review Rust error handling"
  ],
  "math-wizard": [
    "Derive the quadratic formula",
    "Explain Bayes' theorem simply",
    "Solve integral of ln(x)",
    "Explain eigenvectors"
  ],
  "grammar-pro": [
    "Critique my resume pitch",
    "Improve professional email clarity",
    "Make this text sound authoritative",
    "Check passive voice issues"
  ],
  "fitness-ai": [
    "Build a 3-day split weight routine",
    "Suggest a high protein keto recipe",
    "How to maintain core flexibility",
    "Explain zone 2 cardio benefit"
  ],
  "bug-hunter": [
    "Review SQL query for injection risk",
    "How to prevent CSRF in Express",
    "Find memory leaks in JS closures",
    "Analyze CORS policy vulnerabilities"
  ]
};

export const BOT_INITIAL_MESSAGES: Record<string, string> = {
  "nexus-7": "Hello! I am Nexus-7. How can I assist with your complex logical reasoning tasks today?",
  "creative-muse": "Welcome! I am Creative Muse. Shall we explore the boundaries of poetry or build stellar visual descriptions today?",
  "dev-bot-x": "Hey there. DevBot X ready for deployment. Send over your architecture files or tricky algorithms, and let's craft clean setups.",
  "math-wizard": "Greetings! I am the Math Wizard. Let's solve equations, break down proofs, or decipher statistical structures step-by-step.",
  "grammar-pro": "Greetings! Let me polish your sentences, upgrade structural syntax, or check styling tones. Paste your drafts below.",
  "fitness-ai": "Hey! Fitness AI here. Let's design some training schedules or macro recipes. Tell me your goals and let's crush them!",
  "bug-hunter": "Vulnerabilities beware. Bug Hunter is online and scanning. Send code snippets or configurations to audit for logical flaws."
};
