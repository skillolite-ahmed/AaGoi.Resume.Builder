import { GoogleGenerativeAI } from '@google/generative-ai';

export class ResumeParseError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ResumeParseError';
  }
}

export async function parseResumeWithGemini(
  rawText: string,
  options: {
    apiKey?: string;
    model?: string;
  } = {}
): Promise<any> {
  if (!rawText || !rawText.trim()) {
    throw new ResumeParseError('Resume input text is empty.');
  }

  const apiKey = options.apiKey ?? import.meta.env.VITE_GEMINI_API_KEY;
  const modelName = options.model ?? import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-1.5-flash';

  if (!apiKey) {
    throw new ResumeParseError('Missing Gemini API key. Set VITE_GEMINI_API_KEY.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: `
You are an expert resume parser. Extract structured information from the provided resume text into a strict JSON object with contact info and sections.
Return ONLY valid JSON. No markdown fences, no conversational text.
`,
  });

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: rawText }] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: 'application/json',
      },
    });

    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    return {
      ...parsed,
      rawText: rawText.trim(),
      templateId: 'professional-classic',
      density: 'auto',
    };
  } catch (error) {
    throw new ResumeParseError('Failed to parse resume with Gemini.', error);
  }
}

export default parseResumeWithGemini;
