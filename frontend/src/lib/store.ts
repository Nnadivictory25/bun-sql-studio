import { Store } from "@tanstack/react-store";

const STORAGE_KEY = 'sql-studio-store';

type StoreData = {
    currentTable: string | null;
    currentQuery: string | null;
    queryHistory: string[];
}

// Load initial state from localStorage
const loadFromStorage = (): Partial<StoreData> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
};

// Save state to localStorage
const saveToStorage = (state: StoreData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const store = new Store<StoreData>({
    currentTable: null,
    queryHistory: [],
    currentQuery: null,
    ...loadFromStorage(),
});

// Subscribe to changes and save
store.subscribe(() => saveToStorage(store.state));