
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// As definições de schema agora vivem no backend, onde são usadas.
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

// Esta é uma Vercel Serverless Function.
// O 'export default' a torna um endpoint de API.
export default async function handler(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Método não permitido' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Acessa a chave de API de forma segura a partir das Environment Variables da Vercel
    if (!process.env.API_KEY) {
        console.error('API_KEY não está configurada no ambiente da Vercel.');
        return new Response(JSON.stringify({ error: 'Erro de configuração no servidor.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const { query, searchType } = await request.json();

        if (!query || !searchType) {
            return new Response(JSON.stringify({ error: 'Faltando parâmetros "query" ou "searchType".' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        let modelResponse: GenerateContentResponse;

        if (searchType === 'BY_NAME') {
            const prompt = `Você é um especialista em perfumes. Para o perfume '${query}', forneça seus detalhes e encontre até 5 perfumes similares (contratipos/inspirados). A resposta deve ser em formato JSON, seguindo o schema providenciado. Detalhe as notas de topo, coração e base do perfume original. Em seguida, liste os perfumes similares, incluindo o nome, a marca, a origem (ex: Brasileiro, Árabe) e uma breve descrição do porquê ele é considerado similar.`;
            modelResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { 
                    responseMimeType: "application/json", 
                    responseSchema: perfumeDetailsSchema,
                    thinkingConfig: { thinkingBudget: 0 } 
                },
            });
        } else if (searchType === 'BY_NOTES') {
            const prompt = `Você é um especialista em perfumes. Com base nas seguintes características ou notas: '${query}', sugira até 6 perfumes que correspondam a este perfil. Para cada perfume, forneça o nome, a marca e uma breve descrição da sua fragrância. A resposta deve ser em formato JSON seguindo o schema.`;
            modelResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { 
                    responseMimeType: "application/json", 
                    responseSchema: perfumeByNotesSchema,
                    thinkingConfig: { thinkingBudget: 0 }
                },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Tipo de busca inválido.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        const jsonText = modelResponse.text.trim();
        return new Response(jsonText, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Erro na chamada da API Gemini:', error);
        return new Response(JSON.stringify({ error: 'Falha ao processar a requisição.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
