import { FOUNDRY_FONTS } from "../data/fonts";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// A lightweight mapping of our best fonts to provide context to the LLM
const FONT_CONTEXT = FOUNDRY_FONTS.map(f => `${f.name} (ID: ${f.id}) - Tags: ${f.tags?.join(", ")} - Vibes: ${f.specimen}`).join("\n");

async function fetchGroq(messages, temperature = 0.3) {
  if (!API_KEY) {
    console.error("Missing VITE_GROQ_API_KEY in .env");
    throw new Error("Missing API Key");
  }
  
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages,
      temperature,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Groq API error:", errorText);
    throw new Error(`Groq API returned ${response.status}`);
  }

  return await response.json();
}

/**
 * Semantic Search using Groq
 * @param {string} query The user's search query (e.g. "cyberpunk font")
 * @returns {Promise<string[]>} Array of font IDs that match
 */
export async function getSemanticFontMatches(query) {
  try {
    const data = await fetchGroq([
      {
        role: "system",
        content: `You are an AI font matcher for "The Foundry". 
Here is a list of our premium fonts:
${FONT_CONTEXT}

The user will provide a vibe, project description, or style. 
Return ONLY a JSON array of up to 6 font IDs that best match the query. 
Example response: ["foundry-noir", "foundry-grotesque"]
Do not return any other text, just the raw JSON array.`
      },
      {
        role: "user",
        content: query
      }
    ], 0.1);

    const content = data.choices?.[0]?.message?.content || "[]";
    const match = content.match(/\[.*\]/s);
    const parsed = JSON.parse(match ? match[0] : content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Semantic search error:", error);
    return [];
  }
}

/**
 * Smart Pairings using Groq
 * @param {string} fontName The name of the font to pair with
 * @returns {Promise<Array<{fontName: string, reason: string}>>}
 */
export async function getSmartPairings(fontName) {
  try {
    const data = await fetchGroq([
      {
        role: "system",
        content: `You are a world-class typography expert at "The Foundry". 
The user is viewing the font: ${fontName}.
Recommend 2 distinct fonts from our library (or standard Google Fonts) that pair perfectly with it.
Return ONLY valid JSON in this exact format:
[
  { "fontName": "Name of Font 1", "reason": "1-sentence explanation of why it pairs well." },
  { "fontName": "Name of Font 2", "reason": "1-sentence explanation of why it pairs well." }
]
Do not return any markdown formatting or extra text.`
      }
    ], 0.3);

    const content = data.choices?.[0]?.message?.content || "[]";
    const match = content.match(/\[.*\]/s);
    const parsed = JSON.parse(match ? match[0] : content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Smart pairings error:", error);
    return [];
  }
}

/**
 * Chat Assistant completion
 */
export async function chatWithConcierge(messages) {
  try {
    const systemPrompt = {
      role: "system",
      content: `You are the Font Concierge for "The Foundry", a premium typography studio.
You are helpful, concise, and have an elegant, slightly luxurious tone.
We offer 3 licenses:
1. Desktop (₹299) - Static images, logos, 3 devices.
2. Web (₹499) - @font-face embedding, 10k pageviews/mo.
3. App/Broadcast (₹1,499) - Mobile apps, games, broadcasting, unlimited.

If a user asks for font recommendations, you can suggest from our catalog:
${FONT_CONTEXT}

Keep your responses short (1-3 sentences) and formatting clean.`
    };

    const data = await fetchGroq([systemPrompt, ...messages], 0.5);
    return data.choices?.[0]?.message?.content || "I apologize, I am having trouble connecting right now.";
  } catch (error) {
    console.error("Chat error:", error);
    return "I apologize, our connection to the server was interrupted. Please try again or check your API key.";
  }
}
