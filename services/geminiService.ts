import { SearchType } from '../types';
import type { PerfumeDetailsResponse, PerfumeByNotes } from '../types';

/**
 * Calls the backend API to get perfume details and dupes.
 * The backend will securely call the Gemini API.
 * @param perfumeName - The name of the perfume to search for.
 * @returns A promise that resolves to the perfume details.
 */
export const findPerfumeDetailsAndDupes = async (perfumeName: string): Promise<PerfumeDetailsResponse> => {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: perfumeName, type: SearchType.BY_NAME }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        console.error('Backend API Error:', errorData);
        throw new Error('Failed to fetch perfume details.');
    }

    return response.json();
};

/**
 * Calls the backend API to find perfumes by notes.
 * The backend will securely call the Gemini API.
 * @param notes - The notes or characteristics to search for.
 * @returns A promise that resolves to a list of suggested perfumes.
 */
export const findPerfumesByNotes = async (notes: string): Promise<PerfumeByNotes[]> => {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: notes, type: SearchType.BY_NOTES }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        console.error('Backend API Error:', errorData);
        throw new Error('Failed to fetch perfumes by notes.');
    }

    return response.json();
};