# Cognitive Nexus

An AI-powered navigator platform that connects users with 12 specialized AI assistants, each tailored for a distinct domain — from coding and mathematics to creative writing, fitness, cooking, and mental wellness. Built with React, Vite, and Google's Gemini AI, Cognitive Nexus delivers a premium, mobile-first chat experience with a clean white-and-black aesthetic.

## Features

### 12 Specialized AI Assistants
| Assistant | Category | What It Does |
|-----------|----------|-------------|
| **Nexus-7** | Productivity | Complex logical reasoning, code optimization, system architecture |
| **Creative Muse** | Creative | Poetry, songwriting, screenplays, visual prompts |
| **DevBot X** | Coding | Multi-language debugging, refactoring, code review |
| **Math Wizard** | Math | Step-by-step algebra, calculus, discrete math, statistics |
| **Grammar Pro** | Productivity | Grammar correction, style enhancement, tone analysis |
| **Fitness AI** | Lifestyle | Custom workout plans, nutrition coaching, meal prep |
| **Bug Hunter** | Coding | Security audits, vulnerability detection, CORS analysis |
| **Lingua Flow** | Productivity | 50+ language translation with cultural context |
| **Data Sage** | Science | Statistical analysis, ML model selection, data visualization |
| **Mind Guide** | Lifestyle | Mindfulness exercises, stress management, cognitive reframing |
| **Story Weaver** | Creative | Branching narratives, character arcs, world-building |
| **Chef AI** | Lifestyle | Recipe generation, dietary planning, cooking techniques |

### Core Capabilities
- **Discover Screen** — Browse, search, and filter AI assistants by category. Mark bots as favorites for quick access. Trending and "New" badges highlight popular and recently added assistants.
- **Chat Screen** — Real-time conversations powered by Gemini 2.0 Flash. Full Markdown rendering with code block syntax highlighting. Instant suggestion chips per bot to kickstart conversations. Clear chat history, delete individual messages, and star favorite responses.
- **Profile Screen** — Usage analytics showing queries used vs. quota, per-bot message counts, membership details, and conversation history. Customizable preferences including dark mode, haptics, and chat history settings.

### Design
- Premium white-and-black visual language with glassmorphism headers and navigation
- Staggered card entrance animations and smooth screen transitions
- Mobile-first responsive layout with a fixed bottom navigation bar
- Per-bot accent colors that individualize each assistant's identity
- Consistent 8px spacing system and carefully tuned typography

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Build Tool | Vite 6 |
| AI Engine | Google Gemini 2.0 Flash (`@google/genai`) |
| Server | Express.js (proxies Gemini API calls) |
| Icons | Lucide React |
| Animations | Motion (Framer Motion) |

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- A Google Gemini API key — get one at [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NVamshiKRISHNA09/cognitive-nexus.git
   cd cognitive-nexus
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your Gemini API key to a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`).

### Build for Production

```bash
npm run build
npm start
```

This bundles the frontend with Vite and compiles the Express server into a single deployable file.

## Project Structure

```
cognitive-nexus/
├── src/
│   ├── components/
│   │   ├── BotIcon.tsx          # Dynamic icon renderer for each assistant
│   │   ├── ChatScreen.tsx       # Chat interface with Markdown + Gemini integration
│   │   ├── DiscoverScreen.tsx   # Bot browsing, search, and filtering
│   │   └── ProfileScreen.tsx    # User profile, usage stats, and settings
│   ├── utils/
│   │   └── markdown.ts          # Markdown-to-HTML parser with code formatting
│   ├── App.tsx                  # Root component, screen routing, state management
│   ├── data.ts                  # Bot definitions, suggestions, and user profile
│   ├── types.ts                 # TypeScript type definitions
│   ├── index.css                # Global styles and Tailwind configuration
│   └── main.tsx                 # Application entry point
├── server.ts                    # Express server proxying Gemini API requests
├── vite.config.ts               # Vite + Tailwind build configuration
├── tsconfig.json                # TypeScript compiler configuration
└── package.json                 # Dependencies and scripts
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build frontend and server for production |
| `npm start` | Run the production server |
| `npm run lint` | Type-check the project with TypeScript |
| `npm run clean` | Remove build artifacts |

## License

This project is for personal/educational use. Feel free to extend and customize it for your own needs.
