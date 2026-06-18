import Groq from "groq-sdk";
import { FOUNDRY_FONTS } from "../data/fonts";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // We allow browser execution for this demo
});

// A lightweight mapping of our best fonts to provide context to the LLM
const FONT_CONTEXT = FOUNDRY_FONTS.map(f => `${f.name} (ID: ${f.id}) - Tags: ${f.tags.join(", ")} - Vibes: ${f.specimen}`).join("\n");

/**
 * Semantic Search using Groq
 * @param {string} query The user's search query (e.g. "cyberpunk font")
 * @returns {Promise<string[]>} Array of font IDs that match
 */
export async function getSemanticFontMatches(query) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
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
      ],
      model: "llama3-8b-8192",
      temperature: 0.1,
    });

    const content = completion.choices[0]?.message?.content || "[]";
    // Attempt to parse the JSON array
    const match = content.match(/\[.*\]/s);
    if (match) {
      return JSON.parse(match[0]);
    }
    return JSON.parse(content);
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
    const completion = await groq.chat.completions.create({
      messages: [
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
      ],
      model: "llama3-8b-8192",
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || "[]";
    const match = content.match(/\[.*\]/s);
    if (match) {
      return JSON.parse(match[0]);
    }
    return JSON.parse(content);
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

    const completion = await groq.chat.completions.create({
      messages: [systemPrompt, ...messages],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 200
    });

    return completion.choices[0]?.message?.content || "I apologize, I am having trouble connecting right now.";
  } catch (error) {
    console.error("Chat error:", error);
    return "I apologize, our connection to the server was interrupted. Please try again.";
  }
}
