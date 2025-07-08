import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

// Re-define enum to avoid path issues in serverless environment
enum ServerSearchType {
  BY_NAME = 'BY_NAME',
  BY_NOTES = 'BY_NOTES',
}

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

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { query, type } = await req.json();

        if (!query || !type) {
            return new Response(JSON.stringify({ error: 'Missing query or type in request body' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

        let prompt;
        let schema;

        if (type === ServerSearchType.BY_NAME) {
            prompt = `Você é um especialista em perfumes. Para o perfume '${query}', forneça seus detalhes e encontre até 3 perfumes similares (contratipos/inspirados). A resposta deve ser em formato JSON, seguindo o schema providenciado. Detalhe as notas de topo, coração e base do perfume original. Em seguida, liste os perfumes similares, incluindo o nome, a marca, a origem (ex: Brasileiro, Árabe) e uma breve descrição do porquê ele é considerado similar.`;
            schema = perfumeDetailsSchema;
        } else if (type === ServerSearchType.BY_NOTES) {
            prompt = `Você é um especialista em perfumes. Com base nas seguintes características ou notas: '${query}', sugira até 6 perfumes que correspondam a este perfil. Para cada perfume, forneça o nome, a marca e uma breve descrição da sua fragrância. A resposta deve ser em formato JSON seguindo o schema.`;
            schema = perfumeByNotesSchema;
        } else {
            return new Response(JSON.stringify({ error: 'Invalid search type' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const modelResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema },
        });
        
        const resultText = modelResponse.text.trim();
        
        return new Response(resultText, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error in Vercel function:', error);
        return new Response(JSON.stringify({ error: 'Failed to get response from AI model.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}