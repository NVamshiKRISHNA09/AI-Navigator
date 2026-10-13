import { Bot, UserProfile } from "./types";

export const BOTS: Bot[] = [
  {
    id: "nexus-7",
    name: "Nexus-7",
    description: "A hyper-fast reasoning engine optimized for complex logical workflows and mathematical proofs.",
    longDescription: "An elite cognitive system trained on high-dimension analytical corpora. Excels at syntax mapping, logic optimization, system layout reviews, and advanced proofs.",
    capabilities: ["Logical Deduction", "Code Optimization", "System Architecture", "Mathematical Proofs"],
    icon: "bolt",
    category: "Productivity",
    tags: ["New", "Logic"],
    trending: true,
    highlightBorder: "border-primary/40",
    avatarBg: "bg-primary-container/20",
    iconColor: "text-primary",
    accentColor: "#5b9fff"
  },
  {
    id: "creative-muse",
    name: "Creative Muse",
    description: "Transform abstract ideas into poetry, scripts, and stunning visual prompts with fluid intelligence.",
    longDescription: "An artistic engine engineered to stimulate lateral thinking and translate deep metaphors into expressive language and high-fidelity creative concepts.",
    capabilities: ["Poetry", "Songwriting", "Screenplays", "Visual Prompts"],
    icon: "palette",
    category: "Creative",
    tags: ["Popular", "Art"],
    trending: true,
    highlightBorder: "border-[#10a37f]/40",
    avatarBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    accentColor: "#10a37f"
  },
  {
    id: "dev-bot-x",
    name: "DevBot X",
    description: "The ultimate coding companion for debugging, refactoring, and system architecture design.",
    longDescription: "A fully integrated senior AI engineer proficient in systems design, standard codebases, multi-language translation, and operational refactoring.",
    capabilities: ["TypeScript", "Rust", "Python", "Go", "React", "Code Review"],
    icon: "terminal",
    category: "Coding",
    tags: ["Top Rated", "Code"],
    trending: true,
    highlightBorder: "border-[#3b82f6]/40",
    avatarBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    accentColor: "#3b82f6"
  },
  {
    id: "math-wizard",
    name: "Math Wizard",
    description: "Solves step-by-step calculus and algebra problems with clear conceptual explanations.",
    longDescription: "A patient math educator that breaks down complex equations into understandable steps, explains proofs, and validates answers methodically.",
    capabilities: ["Algebra", "Calculus", "Discrete Math", "Statistics"],
    icon: "functions",
    category: "Math",
    tags: ["Education", "Algebra"],
    trending: false,
    highlightBorder: "border-violet-500/40",
    avatarBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    accentColor: "#a78bfa"
  },
  {
    id: "grammar-pro",
    name: "Grammar Pro",
    description: "Real-time editing and style suggestions for any text.",
    longDescription: "An elite copyeditor that corrects grammar, suggests vocabulary enhancements, rewrites awkward phrasing, and optimizes readability and tone.",
    capabilities: ["Grammar Correction", "Style Enhancement", "Tone Analysis", "Readability"],
    icon: "edit_note",
    category: "Productivity",
    tags: ["Writing", "Editing"],
    trending: false,
    highlightBorder: "border-zinc-500/40",
    avatarBg: "bg-zinc-500/10",
    iconColor: "text-zinc-400",
    accentColor: "#a1a1aa"
  },
  {
    id: "fitness-ai",
    name: "Fitness AI",
    description: "Personalized workout and meal plans based on your goals.",
    longDescription: "A science-backed fitness and nutrition coach that designs custom workout routines, explains physiology, and creates macro-balanced meal ideas.",
    capabilities: ["Workout Plans", "Nutrition", "Physiology", "Meal Prep"],
    icon: "fitness_center",
    category: "Lifestyle",
    tags: ["Health", "Coaching"],
    trending: false,
    highlightBorder: "border-emerald-500/40",
    avatarBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    accentColor: "#34d399"
  },
  {
    id: "bug-hunter",
    name: "Bug Hunter",
    description: "Identify vulnerabilities and syntax errors instantly.",
    longDescription: "A security researcher and code quality checker that identifies exploits, memory leaks, injection risks, and syntax errors across many languages.",
    capabilities: ["Security Audit", "Memory Leaks", "Injection Risks", "CORS Analysis"],
    icon: "bug_report",
    category: "Coding",
    tags: ["Security", "Audit"],
    trending: false,
    highlightBorder: "border-rose-500/40",
    avatarBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    accentColor: "#fb7185"
  },
  {
    id: "lingua-flow",
    name: "Lingua Flow",
    description: "Real-time translation and cultural context across 50+ languages with nuance-aware accuracy.",
    longDescription: "A polyglot AI that doesn't just translate words but preserves cultural nuance, idiomatic expressions, and tone across more than 50 languages. Specializes in context-aware localization and bilingual conversation practice.",
    capabilities: ["50+ Languages", "Idiomatic Translation", "Cultural Context", "Conversation Practice"],
    icon: "globe",
    category: "Productivity",
    tags: ["New", "Languages"],
    trending: true,
    isNew: true,
    highlightBorder: "border-cyan-500/40",
    avatarBg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
    accentColor: "#22d3ee"
  },
  {
    id: "data-sage",
    name: "Data Sage",
    description: "Statistical analysis, data visualization guidance, and ML model selection from raw datasets.",
    longDescription: "A data science expert that helps you explore datasets, run statistical tests, choose the right ML models, and interpret results. From descriptive statistics to predictive modeling, Data Sage makes complex analytics accessible.",
    capabilities: ["Statistical Analysis", "ML Model Selection", "Data Visualization", "Python Pandas"],
    icon: "bar_chart",
    category: "Science",
    tags: ["New", "Data"],
    trending: true,
    isNew: true,
    highlightBorder: "border-amber-500/40",
    avatarBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    accentColor: "#fbbf24"
  },
  {
    id: "mind-guide",
    name: "Mind Guide",
    description: "Mindfulness exercises, stress management techniques, and daily mental wellness check-ins.",
    longDescription: "A compassionate wellness companion that guides you through mindfulness meditations, breathing exercises, stress-reduction techniques, and cognitive reframing. Provides a safe, non-judgmental space for mental wellness support.",
    capabilities: ["Mindfulness", "Breathing Exercises", "Stress Management", "Cognitive Reframing"],
    icon: "heart",
    category: "Lifestyle",
    tags: ["Wellness", "Mindfulness"],
    trending: false,
    isNew: true,
    highlightBorder: "border-pink-500/40",
    avatarBg: "bg-pink-500/10",
    iconColor: "text-pink-400",
    accentColor: "#f472b6"
  },
  {
    id: "story-weaver",
    name: "Story Weaver",
    description: "Crafts interactive narratives, branching storylines, and immersive world-building for games and fiction.",
    longDescription: "A master storyteller AI that builds interactive fiction with branching dialogue, rich character arcs, and vivid world-building. Perfect for game designers, novelists, and creative writers who want to explore narrative possibilities.",
    capabilities: ["Branching Narratives", "Character Arcs", "World Building", "Interactive Fiction"],
    icon: "feather",
    category: "Creative",
    tags: ["New", "Stories"],
    trending: false,
    isNew: true,
    highlightBorder: "border-orange-500/40",
    avatarBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    accentColor: "#fb923c"
  },
  {
    id: "chef-ai",
    name: "Chef AI",
    description: "Recipe generation from available ingredients, dietary restrictions, and cooking technique tutorials.",
    longDescription: "A culinary AI assistant that generates recipes based on what's in your pantry, accommodates dietary restrictions, teaches cooking techniques step-by-step, and suggests wine pairings. Your personal sous-chef in digital form.",
    capabilities: ["Recipe Generation", "Dietary Planning", "Cooking Techniques", "Wine Pairing"],
    icon: "chef_hat",
    category: "Lifestyle",
    tags: ["Cooking", "Recipes"],
    trending: false,
    isNew: true,
    highlightBorder: "border-yellow-500/40",
    avatarBg: "bg-yellow-500/10",
    iconColor: "text-yellow-400",
    accentColor: "#facc15"
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
  joinDate: "January 15, 2025",
  totalConversations: 2,
  favoriteBots: ["nexus-7", "dev-bot-x"],
  botUsageStats: [
    { botId: "nexus-7", messageCount: 3, lastUsed: "Today" },
    { botId: "creative-muse", messageCount: 1, lastUsed: "Yesterday" },
    { botId: "dev-bot-x", messageCount: 0, lastUsed: null },
    { botId: "math-wizard", messageCount: 0, lastUsed: null },
    { botId: "grammar-pro", messageCount: 0, lastUsed: null },
    { botId: "fitness-ai", messageCount: 0, lastUsed: null },
    { botId: "bug-hunter", messageCount: 0, lastUsed: null },
    { botId: "lingua-flow", messageCount: 0, lastUsed: null },
    { botId: "data-sage", messageCount: 0, lastUsed: null },
    { botId: "mind-guide", messageCount: 0, lastUsed: null },
    { botId: "story-weaver", messageCount: 0, lastUsed: null },
    { botId: "chef-ai", messageCount: 0, lastUsed: null },
  ],
  preferences: {
    darkMode: true,
    hapticFeedback: true,
    saveChatHistory: false,
    soundEffects: false,
    compactMode: false,
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
  ],
  "lingua-flow": [
    "Translate 'hello' to 10 languages",
    "Explain Japanese keigo politeness",
    "Practice a French cafe dialogue",
    "Translate a business email to Spanish"
  ],
  "data-sage": [
    "Explain p-values simply",
    "Choose ML model for text data",
    "How to handle missing data",
    "Explain bias-variance tradeoff"
  ],
  "mind-guide": [
    "Guide a 2-minute breathing exercise",
    "Help me reframe anxious thoughts",
    "Suggest a morning mindfulness routine",
    "Explain the 5-4-3-2-1 grounding technique"
  ],
  "story-weaver": [
    "Create a branching fantasy opening",
    "Build a cyberpunk city description",
    "Design a morally grey antagonist",
    "Write dialogue for a tense negotiation"
  ],
  "chef-ai": [
    "Recipe from chicken, rice, and kale",
    "Vegetarian meal under 20 minutes",
    "Explain the mother sauces",
    "Suggest a wine for grilled salmon"
  ]
};

export const BOT_INITIAL_MESSAGES: Record<string, string> = {
  "nexus-7": "Hello! I am Nexus-7. How can I assist with your complex logical reasoning tasks today?",
  "creative-muse": "Welcome! I am Creative Muse. Shall we explore the boundaries of poetry or build stellar visual descriptions today?",
  "dev-bot-x": "Hey there. DevBot X ready for deployment. Send over your architecture files or tricky algorithms, and let's craft clean setups.",
  "math-wizard": "Greetings! I am the Math Wizard. Let's solve equations, break down proofs, or decipher statistical structures step-by-step.",
  "grammar-pro": "Greetings! Let me polish your sentences, upgrade structural syntax, or check styling tones. Paste your drafts below.",
  "fitness-ai": "Hey! Fitness AI here. Let's design some training schedules or macro recipes. Tell me your goals and let's crush them!",
  "bug-hunter": "Vulnerabilities beware. Bug Hunter is online and scanning. Send code snippets or configurations to audit for logical flaws.",
  "lingua-flow": "Bonjour! Hola! Konnichiwa! I'm Lingua Flow, your multilingual companion. Want to translate something, practice a language, or explore cultural nuances? Just ask!",
  "data-sage": "Greetings, analyst. Data Sage at your service. Share your dataset questions, statistical curiosities, or ML model dilemmas, and let's extract insights together.",
  "mind-guide": "Hi there. I'm Mind Guide, and this is a safe space. Whether you need a breathing exercise, a moment of calm, or help reframing thoughts, I'm here for you.",
  "story-weaver": "Welcome, storyteller. I am Story Weaver. Tell me a genre, a character, or a single word, and we'll spin it into an immersive narrative together.",
  "chef-ai": "Hello, chef! I'm Chef AI. Tell me what ingredients you have, your dietary needs, or what cuisine you're craving, and let's cook something delicious together."
};
