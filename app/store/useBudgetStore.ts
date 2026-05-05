// store/useBudgetStore.ts
export type Expense = { id: string; name: string; amount: number; date: number };
export type Budget = { id: string; title: string; limit: number; expenses: Expense[] };

// Logic for calculating spent vs remaining lives here...