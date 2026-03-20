// Quote storage utilities for localStorage persistence

export interface QuoteItem {
  id: string;
  createdAt: string;
  objectMeasures: {
    width: number;
    length: number;
    height: number;
    type: 'flat' | 'cylindrical';
  };
  selectedModels: string[];
  selectedAccessories: { modelId: string; accessoryId: string; name: string; price?: string }[];
  notes?: string;
}

const STORAGE_KEY = 'uv-led-quotes';

export function getStoredQuotes(): QuoteItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveQuote(quote: QuoteItem): void {
  const quotes = getStoredQuotes();
  const existingIndex = quotes.findIndex(q => q.id === quote.id);
  
  if (existingIndex >= 0) {
    quotes[existingIndex] = quote;
  } else {
    quotes.unshift(quote);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

export function deleteQuote(id: string): void {
  const quotes = getStoredQuotes().filter(q => q.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

export function generateQuoteId(): string {
  return `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
