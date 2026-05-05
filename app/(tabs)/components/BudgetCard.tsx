import React from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc';

export type Expense = { id: string; name: string; amount: number; date: Date };
export type Budget = { id: string; title: string; limit: number; expenses: Expense[] };

export const BudgetCard = ({ budget }: { budget: Budget }) => {
    const spent = budget.expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const progress = spent / budget.limit;

    return (
        <View style={tw`bg-white p-5 rounded-3xl mb-4 border border-gray-100 shadow-sm`}>
            <View style={tw`flex-row justify-between mb-3`}>
                <View>
                    <Text style={tw`text-gray-400 text-xs uppercase tracking-wider font-bold`}>Category</Text>
                    <Text style={tw`text-xl font-black text-gray-800`}>{budget.title}</Text>
                </View>
                <View style={tw`items-end`}>
                    <Text style={tw`text-gray-400 text-xs uppercase tracking-wider font-bold`}>Remaining</Text>
                    <Text style={tw`text-xl font-black ${spent > budget.limit ? 'text-red-500' : 'text-green-500'}`}>
                        ${(budget.limit - spent).toLocaleString()}
                    </Text>
                </View>
            </View>

            <View style={tw`h-3 w-full bg-gray-100 rounded-full overflow-hidden`}>
                <View
                    style={[
                        tw`h-full rounded-full ${progress > 0.9 ? 'bg-red-500' : 'bg-indigo-600'}`,
                        { width: `${Math.min(progress * 100, 100)}%` }
                    ]}
                />
            </View>
            <Text style={tw`text-gray-400 text-xs mt-2 font-medium`}>
                ${spent.toLocaleString()} spent of ${budget.limit.toLocaleString()}
            </Text>
        </View>
    );
};