
export interface OriginalPerfume {
  name: string;
  brand: string;
  description: string;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
}

export interface SimilarPerfume {
  name: string;
  brand: string;
  origin: string;
  similarityReason: string;
}

export interface PerfumeDetailsResponse {
  originalPerfume: OriginalPerfume;
  similarPerfumes: SimilarPerfume[];
}

export interface PerfumeByNotes {
  name: string;
  brand: string;
  description: string;
}

export enum SearchType {
  BY_NAME = 'BY_NAME',
  BY_NOTES = 'BY_NOTES',
}
