
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { SUPPORT_EMAIL } from '../constants';

// For text and metadata tasks, we use gemini-3-flash-preview as per quality guidelines.
const TEXT_MODEL = 'gemini-3-flash-preview';

export const getSupportResponse = async (userQuery: string, userName: string, language: string = 'English'): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const systemInstruction = `
      You are the AI Support Agent for the "videos" app.
      Help user "${userName}".
      Reply in ${language} language.
      If technical issue, refer to ${SUPPORT_EMAIL}.
      Keep answers short, professional and helpful.
    `;
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: userQuery,
      config: { systemInstruction },
    });
    return response.text || "I'm having trouble connecting right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Error connecting to support. Please try again or contact ${SUPPORT_EMAIL}.`;
  }
};

export const getAIVideoIdeas = async (language: string = 'English'): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const prompt = `Give me 3 short, viral video ideas for a content creator. Output must be in ${language} language. Return ONLY a raw JSON array of strings.`;
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text.trim() || '[]');
  } catch (e) {
    console.error("AI Ideas Error", e);
    return [];
  }
};

/**
 * Generates AI Metadata (Title & Description) for a video based on user interests.
 */
export const getAIVideoMetadata = async (language: string = 'English', interests: string[] = []): Promise<{ title: string; description: string }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const interestStr = interests.length > 0 ? `based on these interests: ${interests.join(', ')}` : "for a general daily topic";
    const prompt = `Create a catchy, trending title and a brief description for a short video ${interestStr}. Language: ${language}.`;

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'The suggested video title.' },
            description: { type: Type.STRING, description: 'The suggested video description.' },
          },
          required: ["title", "description"],
        },
      },
    });

    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("AI Metadata Error", e);
    return {
      title: language === 'Arabic' ? "موضوعي اليومي الجديد" : "My New Daily Topic",
      description: language === 'Arabic' ? "مشاركة سريعة لبعض الأفكار والاهتمامات اليومية." : "Sharing some quick daily thoughts and interests."
    };
  }
};

export const generateAIVideo = async (prompt: string, style: string): Promise<Blob | null> => {
  try {
    const apiKey = process.env.API_KEY || '';
    const ai = new GoogleGenAI({ apiKey });
    const augmentedPrompt = `${prompt}. Style: ${style}, cinematic.`;
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: augmentedPrompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) return null;
    const response = await fetch(`${videoUri}&key=${apiKey}`);
    return await response.blob();
  } catch (e) {
    console.error("Video Gen Error:", e);
    return null;
  }
};
