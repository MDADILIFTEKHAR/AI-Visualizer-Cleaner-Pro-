import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { DataSet } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY not found in environment variables");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeDataWithAI = async (dataset: DataSet, query: string): Promise<string> => {
  try {
    const client = getClient();
    const model = client.models;

    // Create a summarized version of the dataset for the AI (avoid token limits)
    const summary = {
      columns: dataset.profile.map(p => ({ name: p.name, type: p.type, missing: p.missingCount })),
      totalRows: dataset.rows.length,
      sampleData: dataset.rows.slice(0, 5),
    };

    const prompt = `
      You are an expert Data Scientist assistant in an app called "AI Visualizer & Cleaner Pro+".
      The user has loaded a dataset. Here is the summary:
      ${JSON.stringify(summary, null, 2)}

      User Query: "${query}"

      Provide a helpful, professional, and concise response. 
      If the user asks for insights, analyze the columns and suggest what interesting trends might exist.
      If the user asks about cleaning, suggest strategies based on the missing count and types.
      Format your response with clean Markdown.
    `;

    const result = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI service. Please check your API key.";
  }
};

export const streamChat = async function* (history: { role: string, content: string }[], newMessage: string, dataset: DataSet | null) {
  const client = getClient();
  
  let systemContext = `You are the AI Assistant for "AI Visualizer & Cleaner Pro+". Help the user clean, analyze, and visualize their data.`;
  
  if (dataset) {
    const summary = {
      columns: dataset.columns,
      rowCount: dataset.rows.length,
      issues: dataset.issues.length
    };
    systemContext += ` Current dataset summary: ${JSON.stringify(summary)}.`;
  }

  const chat = client.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemContext,
    },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    }))
  });

  const result = await chat.sendMessageStream({ message: newMessage });

  for await (const chunk of result) {
    yield chunk.text;
  }
};
