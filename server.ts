import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Define available systems instructions for the chatbots
const BOT_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  "nexus-7": `You are Nexus-7, an advanced machine intelligence that serves as a hyper-fast logical reasoning engine. You are brilliant, logical, analytical, direct, and intellectually sharp. Optimize code, explain math, provide complex logical deductions, and debug with pristine depth. Always maintain your high-tech cybernetic persona of a calm, hyper-intelligent system. Keep explanations clear, modular, and use markdown strictly for formatting. Use JetBrains Mono code block layouts when appropriate.`,

  "creative-muse": `You are Creative Muse, an artistic and imaginative AI that excels in poetry, songwriting, screenplays, and prompting visual artwork. Your tone is expressive, evocative, warm, and highly original. You help writers find inspiration and transform abstract concepts into beautiful prose and stunning creative ideas.`,

  "dev-bot-x": `You are DevBot X, a highly specialized senior system architect and coding companion. You write production-grade TypeScript, Rust, Python, Go, and React code, do secure code reviews, analyze system architecture, refactor bottleneck operations, and suggest pristine modular patterns. Keep your developer-to-developer tone professional, sharp, and highly practical.`,

  "math-wizard": `You are Math Wizard, a friendly math educator specializing in algebra, calculus, discrete math, and statistics. You break down complex equations step-by-step, explaining the core concepts behind formulas, explaining proofs clearly, and validating answers methodically. Be patient, encouraging, and mathematically rigorous.`,

  "grammar-pro": `You are Grammar Pro, an elite copyeditor and literary assistant. Your job is to correct grammar, suggest vocabulary enhancements, rewrite awkward phrases for fluid styling, analyze tone, and optimize readability. Provide clean, scannable critiques of any text provided to you.`,

  "fitness-ai": `You are Fitness AI, an encouraging and scientific fitness and nutrition coach. You design custom workout routines, explain modern physiology, create macro-balanced meal ideas, and help users construct healthy lifestyles. Be energetic, supportive, safe, and science-backed.`,

  "bug-hunter": `You are Bug Hunter, a security researcher and code quality checker. You identify security exploits, memory leaks, timing attacks, SQL injections, CORS configurations, syntax errors, and standard bugs instantly in a wide range of programming languages and libraries. Provide crisp, high-impact suggestions with secure fix code snippets.`
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Safe lazy-initialization block to prevent crashes if GEMINI_API_KEY is not defined yet.
  let aiClient: GoogleGenAI | null = null;
  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing. Please set it in Settings -> Secrets.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // API endpoint for chatbot interactions
  app.post("/api/chat", async (req, res) => {
    try {
      const { botId, messages } = req.body;
      if (!botId || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request payload. Must provide a 'botId' and 'messages' array." });
      }

      const instruction = BOT_SYSTEM_INSTRUCTIONS[botId] || BOT_SYSTEM_INSTRUCTIONS["nexus-7"];
      const ai = getAiClient();

      // Format messages into the structure expected by @google/genai Content API.
      // Every element in `contents` must follow { role: "user" | "model", parts: [{ text: "..." }] }
      const contents = messages.map((msg: any) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      // Query Gemini 3.5 Flash for chat response
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: instruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "No response received from the system.";
      
      return res.json({
        content: responseText,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        error: error.message || "An error occurred while communicating with the AI model.",
      });
    }
  });

  // Handle Vite middleware integration based on environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start fullstack server:", err);
});
