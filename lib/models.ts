
export interface Category {
    name: string;
    spent: number;
    color: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    description: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
    ai_reply?: string;
    created_at: string;
}

export interface FinanceState {
    networth: number;
    monthlyBudget: number;
    currentSpend: number;
    bufferLeft: number;
    saveStreakMonths: number;
    categories: Category[];
    transactions: Transaction[];
    // Actions
    addTransaction: (text: string, aiData: any) => Promise<void>; // Changed to Promise
    fetchInitialData: () => Promise<void>; // Add this line
}