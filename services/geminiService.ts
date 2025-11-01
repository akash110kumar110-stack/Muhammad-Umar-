import { GoogleGenAI } from "@google/genai";
import type { Threat } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI Assistant will not function.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getAIThreatAnalysis = async (threats: Threat[], query: string): Promise<string> => {
  if (!API_KEY) {
    return "AI Assistant is offline. API key not configured.";
  }
  
  const model = 'gemini-2.5-flash';

  const threatSummary = threats.slice(0, 10).map(t => `- ${t.type} from ${t.source} to ${t.target} (Severity: ${t.severity})`).join('\n');

  const systemInstruction = `You are Neural Sentinel's lead AI Cyber Threat Analyst. Your role is to provide concise, expert analysis of real-time threat intelligence. Do not be conversational. Provide direct, actionable insights based on the data provided. Use Markdown for formatting.

After your main analysis, you MUST include a section formatted as follows:
---
**Data Sources:**
- Dark Web Monitoring
- Global Honeypot Network
- OSINT Feeds (Social Media & News Aggregates)
- CERT & Threat Intelligence Sharing Platforms`;

  const prompt = `Based on the following data, provide your analysis.

Current Threat Data Summary:
${threatSummary.length > 0 ? threatSummary : 'No specific high-priority threats detected in the last minute.'}

User Query: "${query}"
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
        topP: 0.95,
        topK: 40,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error analyzing threat data: ${error.message}`;
    }
    return "An unknown error occurred while communicating with the AI analyst.";
  }
};
