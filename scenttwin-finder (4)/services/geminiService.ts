import { GoogleGenAI, Type } from "@google/genai";
import { SearchType } from '../types';
import type { PerfumeDetailsResponse, PerfumeByNotes } from '../types';

// Schemas and prompts are moved back to the client-side service for the preview environment.
const perfumeDetailsSchema = {
    type: Type.OBJECT,
    properties: {
      originalPerfume: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Nome do perfume original." },
          brand: { type: Type.STRING, description: "Marca do perfume original." },
          description: { type: Type.STRING, description: "Breve descrição da fragrância do perfume original." },
          notes: {
            type: Type.OBJECT,
            properties: {
              top: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Notas de topo (saída)." },
              middle: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Notas de coração (corpo)." },
              base: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Notas de base (fundo)." }
            },
            required: ["top", "middle", "base"]
          }
        },
        required: ["name", "brand", "description", "notes"]
      },
      similarPerfumes: {
        type: Type.ARRAY,
        description: "Lista de perfumes similares, contratipos ou inspirados.",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Nome do perfume similar." },
            brand: { type: Type.STRING, description: "Marca do perfume similar." },
            origin: { type: Type.STRING, description: "Origem do perfume (ex: Brasileiro, Árabe, Francês)." },
            similarityReason: { type: Type.STRING, description: "Breve explicação sobre a similaridade com o original." }
          },
          required: ["name", "brand", "origin", "similarityReason"]
        }
      }
    },
    required: ["originalPerfume", "similarPerfumes"]
};

const perfumeByNotesSchema = {
    type: Type.ARRAY,
    description: "Lista de perfumes que combinam com as notas ou características fornecidas.",
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Nome do perfume sugerido." },
        brand: { type: Type.STRING, description: "Marca do perfume sugerido." },
        description: { type: Type.STRING, description: "Breve descrição da fragrância do perfume." }
      },
      required: ["name", "brand", "description"]
    }
};

// This assumes process.env.API_KEY is available in the preview environment
// which is a requirement from the instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });


export const findPerfumeDetailsAndDupes = async (perfumeName: string): Promise<PerfumeDetailsResponse> => {
    const prompt = `Você é um especialista em perfumes. Para o perfume '${perfumeName}', forneça seus detalhes e encontre até 3 perfumes similares (contratipos/inspirados). A resposta deve ser em formato JSON, seguindo o schema providenciado. Detalhe as notas de topo, coração e base do perfume original. Em seguida, liste os perfumes similares, incluindo o nome, a marca, a origem (ex: Brasileiro, Árabe) e uma breve descrição do porquê ele é considerado similar.`;
    
    const modelResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: perfumeDetailsSchema },
    });

    const resultText = modelResponse.text.trim();
    return JSON.parse(resultText);
};

export const findPerfumesByNotes = async (notes: string): Promise<PerfumeByNotes[]> => {
    const prompt = `Você é um especialista em perfumes. Com base nas seguintes características ou notas: '${notes}', sugira até 6 perfumes que correspondam a este perfil. Para cada perfume, forneça o nome, a marca e uma breve descrição da sua fragrância. A resposta deve ser em formato JSON seguindo o schema.`;

    const modelResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: perfumeByNotesSchema },
    });

    const resultText = modelResponse.text.trim();
    return JSON.parse(resultText);
};
