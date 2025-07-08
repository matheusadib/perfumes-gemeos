import { GoogleGenAI, Type } from "@google/genai";
import type { PerfumeDetailsResponse, PerfumeByNotes } from '../types';

// Schemas moved from the backend file to be used directly on the client
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


// The API_KEY is expected to be available in the environment variables.
if (!process.env.API_KEY) {
    // This will be caught by the App's error handler and displayed to the user.
    throw new Error("A chave da API (API_KEY) não foi encontrada. Por favor, configure-a para usar o app.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findPerfumeDetailsAndDupes = async (perfumeName: string): Promise<PerfumeDetailsResponse> => {
    const prompt = `Você é um especialista em perfumes. Para o perfume '${perfumeName}', forneça seus detalhes e encontre até 3 perfumes similares (contratipos/inspirados). A resposta deve ser em formato JSON, seguindo o schema providenciado. Detalhe as notas de topo, coração e base do perfume original. Em seguida, liste os perfumes similares, incluindo o nome, a marca, a origem (ex: Brasileiro, Árabe) e uma breve descrição do porquê ele é considerado similar.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: perfumeDetailsSchema },
    });
    
    const result = JSON.parse(response.text.trim());
    return result;
};

export const findPerfumesByNotes = async (notes: string): Promise<PerfumeByNotes[]> => {
    const prompt = `Você é um especialista em perfumes. Com base nas seguintes características ou notas: '${notes}', sugira até 6 perfumes que correspondam a este perfil. Para cada perfume, forneça o nome, a marca e uma breve descrição da sua fragrância. A resposta deve ser em formato JSON seguindo o schema.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: perfumeByNotesSchema },
    });

    const result = JSON.parse(response.text.trim());
    return result;
};
