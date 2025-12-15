import { Store } from "@tanstack/react-store";

const STORAGE_KEY = 'sql-studio-store';

type StoreData = {
    currentTable: string | null;
    currentQuery: string | null;
    queryHistory: string[];
}

// Load initial state from localStorage
const loadFromStorage = (): Partial<StoreData> => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

// Save state to localStorage
const saveToStorage = (state: StoreData) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn('Failed to save to localStorage:', error);
    }
};

export const store = new Store<StoreData>({
    currentTable: null,
    queryHistory: [],
    currentQuery: null,
    ...loadFromStorage(), // Merge with stored data
});

// Subscribe to changes and save
store.subscribe(() => saveToStorage(store.state));