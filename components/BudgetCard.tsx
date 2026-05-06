// components/BudgetCard.tsx
import { formatCurrency } from '@/utils/currency';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc';

export type Expense = { id: string; name: string; amount: number; date: Date };
export type Budget = { id: string; title: string; limit: number; expenses: Expense[] };

interface BudgetCardProps {
    budget: Budget;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget }) => {
    // Memoize calculations for performance (React 19 optimization)
    const { spent, remaining, progress } = useMemo(() => {
        const totalSpent = budget.expenses.reduce((acc, curr) => acc + curr.amount, 0);
        return {
            spent: totalSpent,
            remaining: budget.limit - totalSpent,
            progress: totalSpent / budget.limit,
        };
    }, [budget.expenses, budget.limit]);

    const isOverBudget = spent > budget.limit;

    return (
        <View style={tw`bg-white rounded-[24px] p-5 shadow-sm border border-gray-100`}>
            <View style={tw`flex-row justify-between items-start mb-4`}>
                <View style={tw`flex-row items-center`}>
                    <View style={tw`bg-indigo-50 p-3 rounded-2xl mr-4`}>
                        <Ionicons name="card" size={24} color={tw.color('indigo-600')} />
                    </View>
                    <View>
                        <Text style={tw`text-lg font-bold text-gray-900`}>{budget.title}</Text>
                        <Text style={tw`text-gray-500 text-sm`}>{formatCurrency(remaining)} remaining</Text>
                    </View>
                </View>
                <Text style={tw`text-lg font-bold text-gray-900`}>{formatCurrency(budget.limit)}</Text>
            </View>

            {/* iOS Progress Bar */}
            <View style={tw`h-2 w-full bg-gray-100 rounded-full overflow-hidden`}>
                <View
                    style={[
                        tw`h-full rounded-full`,
                        {
                            width: `${progress * 100}%`,
                            backgroundColor: progress > 0.9 ? '#EF4444' : '#4F46E5'
                        }
                    ]}
                />
            </View>
        </View>
    );
};