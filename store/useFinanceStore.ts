import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    category: string;
    ai_reply?: string;
}

interface FinanceState {
    networth: number;
    monthlyBudget: number;
    currentSpend: number;
    bufferLeft: number;
    transactions: Transaction[];
    categories: { name: string; spent: number; color: string }[];
    fetchInitialData: () => Promise<void>;
    addTransaction: (text: string, aiData: any) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
    networth: 0,
    monthlyBudget: 40000,
    currentSpend: 0,
    bufferLeft: 40000,
    transactions: [],
    categories: [],

    fetchInitialData: async () => {
        const { data: txs, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return console.error("Fetch error:", error.message);

        if (txs) {
            const totalSpend = txs
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalIncome = txs
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            // Calculate Save Streak (count months where income > expense)
            // For now, let's count unique months in the transaction list
            const uniqueMonths = new Set(txs.map(t => t.created_at.substring(0, 7))).size;

            // Group categories for the progress bars
            const categoryMap: Record<string, number> = {};
            txs.filter(t => t.type === 'expense').forEach(tx => {
                categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
            });

            const sortedCats = Object.keys(categoryMap).map(name => ({
                name,
                spent: categoryMap[name],
                color: '#EBC351'
            })).sort((a, b) => b.spent - a.spent);

            set({
                transactions: txs,
                currentSpend: totalSpend,
                bufferLeft: 40000 - totalSpend, // Assuming 40k is your target
                networth: totalIncome - totalSpend,
                categories: sortedCats,
            });
        }
    },

    addTransaction: async (text: string, aiData: any) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        const { data, error } = await supabase
            .from('transactions')
            .insert([{
                user_id: user.id,
                description: text,
                amount: aiData.price,
                type: text.toLowerCase().includes('payday') ? 'income' : 'expense',
                category: aiData.category || 'General',
                ai_reply: aiData.reply,
                created_at: new Date().toISOString()
            }])
            .select() // This is CRITICAL to get the saved row back
            .single();

        if (error) throw error;

        // Manually update the local state so the UI refreshes instantly
        set((state) => ({
            transactions: [data, ...state.transactions], // Prepend the new transaction
            // Optional: Recalculate your networth/spend here too
            currentSpend: data.type === 'expense' ? state.currentSpend + data.amount : state.currentSpend,
        }));
    }
}));