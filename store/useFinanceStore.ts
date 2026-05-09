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
    created_at: string;
}

export interface Profile {
    id: string;
    networth: number;
    monthly_budget: number;
    save_streak_months: number;
    updated_at: string;
}

interface FinanceState {
    profile: Profile | null;

    networth: number;
    monthlyBudget: number;
    currentSpend: number;
    bufferLeft: number;

    transactions: Transaction[];

    categories: {
        name: string;
        spent: number;
        color: string;
    }[];


    fetchInitialData: () => Promise<void>;

    addTransaction: (
        text: string,
        aiData: any
    ) => Promise<void>;

    updateMonthlyBudget: (amount: number) => Promise<void>;

}

export const useFinanceStore = create<FinanceState>((set, get) => ({
    profile: null,

    networth: 0,
    monthlyBudget: 100000,
    currentSpend: 0,
    bufferLeft: 100000,

    transactions: [],
    categories: [],

    fetchInitialData: async () => {
        try {
            /**
             * =========================
             * GET LOGGED IN USER
             * =========================
             */

            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error('Auth error:', authError?.message);
                return;
            }

            /**
             * =========================
             * FETCH PROFILE
             * =========================
             */

            const { data: profile, error: profileError } =
                await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

            if (profileError) {
                console.error(
                    'Profile fetch error:',
                    profileError.message
                );
            }

            /**
             * =========================
             * FETCH USER TRANSACTIONS
             * =========================
             */

            const { data: txs, error: txError } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', {
                    ascending: false,
                });

            if (txError) {
                console.error(
                    'Transaction fetch error:',
                    txError.message
                );

                return;
            }

            const transactions = txs || [];

            /**
             * =========================
             * CURRENT MONTH FILTER
             * =========================
             */

            const now = new Date();

            const currentMonthTxs = transactions.filter((tx) => {
                const txDate = new Date(tx.created_at);

                return (
                    txDate.getMonth() === now.getMonth() &&
                    txDate.getFullYear() === now.getFullYear()
                );
            });

            /**
             * =========================
             * CALCULATIONS
             * =========================
             */

            const totalSpend = currentMonthTxs
                .filter((t) => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalIncome = currentMonthTxs
                .filter((t) => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            /**
             * =========================
             * CATEGORY GROUPING
             * =========================
             */

            const categoryMap: Record<string, number> = {};

            currentMonthTxs
                .filter((t) => t.type === 'expense')
                .forEach((tx) => {
                    categoryMap[tx.category] =
                        (categoryMap[tx.category] || 0) +
                        tx.amount;
                });

            const sortedCats = Object.keys(categoryMap)
                .map((name) => ({
                    name,
                    spent: categoryMap[name],
                    color: '#EBC351',
                }))
                .sort((a, b) => b.spent - a.spent);

            /**
             * =========================
             * PROFILE VALUES
             * =========================
             */

            const monthlyBudget =
                profile?.monthly_budget || 100000;

            const calculatedNetworth =
                profile?.networth ??
                totalIncome - totalSpend;

            /**
             * =========================
             * UPDATE STORE
             * =========================
             */

            set({
                profile,

                transactions,

                monthlyBudget,

                networth: calculatedNetworth,

                currentSpend: totalSpend,

                bufferLeft: monthlyBudget - totalSpend,

                categories: sortedCats,
            });
        } catch (err) {
            console.error('Finance store error:', err);
        }
    },

    addTransaction: async (text: string, aiData: any) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('No authenticated user');
        }

        /**
         * =========================
         * DETERMINE TYPE
         * =========================
         */

        const isIncome =
            text.toLowerCase().includes('payday') ||
            text.toLowerCase().includes('salary') ||
            text.toLowerCase().includes('income');

        /**
         * =========================
         * INSERT TRANSACTION
         * =========================
         */

        const { data, error } = await supabase
            .from('transactions')
            .insert([
                {
                    user_id: user.id,

                    description: text,

                    amount: aiData.price,

                    type: isIncome ? 'income' : 'expense',

                    category:
                        aiData.category || 'General',

                    ai_reply: aiData.reply,

                    created_at:
                        new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (error) {
            throw error;
        }

        /**
         * =========================
         * REFRESH STORE
         * =========================
         */

        await get().fetchInitialData();
    },

    updateMonthlyBudget: async (amount: number) => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("No authenticated user");
            }

            const payload = {
                id: user.id,
                monthly_budget: amount,
                updated_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
                .from("profiles")
                .upsert(payload, {
                    onConflict: "id",
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            set((state) => ({
                monthlyBudget:
                    data.monthly_budget,

                bufferLeft:
                    data.monthly_budget -
                    state.currentSpend,

                profile: {
                    ...(state.profile || {}),
                    ...data,
                },
            }));
        } catch (err) {
            console.error(
                "Failed to update monthly budget:",
                err
            );
        }
    },
}));