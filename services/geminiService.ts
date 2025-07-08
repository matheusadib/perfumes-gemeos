import type { PerfumeDetailsResponse, PerfumeByNotes, SearchType } from '../types';
import { SearchType as SearchTypeEnum } from '../types';

// Função auxiliar para chamar nosso backend seguro na Vercel
const callApiProxy = async (query: string, searchType: SearchType): Promise<any> => {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, searchType }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Ocorreu um erro desconhecido.' }));
        console.error('API Proxy Error:', errorData);
        throw new Error(errorData.error || `A requisição falhou com o status ${response.status}`);
    }

    return response.json();
};

export const findPerfumeDetailsAndDupes = async (perfumeName: string): Promise<PerfumeDetailsResponse> => {
    return callApiProxy(perfumeName, SearchTypeEnum.BY_NAME);
};

export const findPerfumesByNotes = async (notes: string): Promise<PerfumeByNotes[]> => {
    return callApiProxy(notes, SearchTypeEnum.BY_NOTES);
};
