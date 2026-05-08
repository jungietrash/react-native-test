import { create } from 'zustand';

// 1. Define the shape of individual objects
interface Category {
    name: string;
    spent: number;
    color: string;
}

interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    category?: string; // Optional if you auto-categorize later
}

// 2. Define the Store's State and Actions
interface FinanceState {
    networth: number;
    monthlyBudget: number;
    currentSpend: number;
    bufferLeft: number;
    saveStreakMonths: number;
    categories: Category[];
    transactions: Transaction[];
    // Actions
    addTransaction: (text: string) => void;
}

// 3. Apply the interface to the create function
export const useFinanceStore = create<FinanceState>((set) => ({
    networth: 312400,
    monthlyBudget: 40000,
    currentSpend: 28400,
    bufferLeft: 18200,
    saveStreakMonths: 5,

    categories: [
        { name: 'Food delivery', spent: 9200, color: '#EBC351' },
        { name: 'Bills', spent: 8100, color: '#EBC351' },
        { name: 'Transport', spent: 4200, color: '#EBC351' },
        { name: 'Subscriptions', spent: 3400, color: '#EBC351' },
    ],

    transactions: [],

    addTransaction: (text: string) => {
        const amountMatch = text.match(/\d+/g);
        const amount = amountMatch ? parseInt(amountMatch.join('')) : 0;
        const isPayday = text.toLowerCase().includes('payday');

        set((state) => {
            const newSpend = isPayday ? state.currentSpend : state.currentSpend + amount;
            const newNetworth = isPayday ? state.networth + amount : state.networth - amount;

            const newTransaction: Transaction = {
                id: Math.random().toString(),
                description: text,
                amount,
                type: isPayday ? 'income' : 'expense',
                date: new Date().toISOString(),
            };

            return {
                currentSpend: newSpend,
                networth: newNetworth,
                transactions: [newTransaction, ...state.transactions],
            };
        });
    },
}));