
import { GoogleGenAI, Type } from "@google/genai";

// AI Analysis result interface
export interface AIAnalysisResult {
  accuracy: number;
  errors: string[];
  explanation: string;
  alternatives: string[]; // 3 xil boshqacha yo'li
  advice: string;
}

// Function to analyze homework using Gemini AI
export const analyzeHomework = async (fileData: string, mimeType: string = 'image/jpeg'): Promise<AIAnalysisResult | null> => {
  try {
    // Guideline: Always create a new GoogleGenAI instance right before making an API call for Gemini 3 series models.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: `Ushbu topshiriqni tahlil qiling (OCR). 
              Javobni FAQAT JSON formatida va O'zbek tilida bering. 
              Natija tarkibi: 
              1. accuracy: To'g'rilik foizi (0-100).
              2. errors: Topilgan xatolar ro'yxati.
              3. explanation: To'g'ri yechimning batafsil tushuntirilishi.
              4. alternatives: Masalani yechishning kamida 3 ta boshqa muqobil usuli.
              5. advice: O'quvchiga individual maslahat.` },
          { 
            inlineData: { 
              mimeType: mimeType.includes('image') ? 'image/jpeg' : 'application/pdf', 
              data: fileData.split(',')[1] 
            } 
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            accuracy: { type: Type.NUMBER },
            errors: { type: Type.ARRAY, items: { type: Type.STRING } },
            explanation: { type: Type.STRING },
            alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
            advice: { type: Type.STRING }
          },
          required: ['accuracy', 'errors', 'explanation', 'alternatives', 'advice']
        }
      }
    });

    // Guideline: response.text is a property, not a method.
    const jsonStr = response.text || '{}';
    const result = JSON.parse(jsonStr.trim());
    return result as AIAnalysisResult;
  } catch (error: any) {
    // Guideline: If the request fails with "Requested entity was not found.", prompt for key selection.
    if (error?.message?.includes("Requested entity was not found.")) {
      if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }
    console.error("AI Analysis Error:", error);
    return null;
  }
};
