import { create } from 'zustand';

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
    category: string;
    ai_reply?: string; // Store the custom AI response here
}

interface FinanceState {
    networth: number;
    monthlyBudget: number;
    currentSpend: number;
    bufferLeft: number;
    saveStreakMonths: number;
    categories: Category[];
    transactions: Transaction[];
    // UPDATE: Interface now expects two arguments
    addTransaction: (text: string, aiData: any) => void;
}

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

    // UPDATE: Implementation now uses aiData
    addTransaction: (text: string, aiData: any) => {
        const { price, category, reply } = aiData;
        const isPayday = text.toLowerCase().includes('payday');
        const type = isPayday ? 'income' : 'expense';

        set((state) => {
            const newSpend = type === 'expense' ? state.currentSpend + price : state.currentSpend;
            const newNetworth = type === 'income' ? state.networth + price : state.networth - price;

            const newTransaction: Transaction = {
                id: Math.random().toString(),
                description: text,
                amount: price,
                type: type,
                category: category || 'General',
                ai_reply: reply, // This makes the demo output show up in the chat!
                date: new Date().toISOString(),
            };

            return {
                currentSpend: newSpend,
                networth: newNetworth,
                transactions: [newTransaction, ...state.transactions],
                // Update buffer for the dashboard
                bufferLeft: state.monthlyBudget - newSpend
            };
        });
    },
}));