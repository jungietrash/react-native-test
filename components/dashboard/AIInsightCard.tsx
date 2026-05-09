import { useFinanceStore } from "@/store/useFinanceStore";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import tw from "twrnc";

export default function AIInsightCard() {
    const store = useFinanceStore();

    const spendPercent = useMemo(() => {
        if (store.monthlyBudget <= 0) return 0;

        return Math.round(
            (store.currentSpend /
                store.monthlyBudget) *
            100
        );
    }, [
        store.currentSpend,
        store.monthlyBudget,
    ]);

    const topCategory = useMemo(() => {
        if (!store.categories.length)
            return null;

        return store.categories[0];
    }, [store.categories]);

    const totalIncome = useMemo(() => {
        return store.transactions
            .filter(
                (t) => t.type === "income"
            )
            .reduce(
                (sum, t) => sum + t.amount,
                0
            );
    }, [store.transactions]);

    const savingsRate = useMemo(() => {
        if (totalIncome <= 0)
            return 0;

        return Math.max(
            0,
            Math.round(
                ((totalIncome -
                    store.currentSpend) /
                    totalIncome) *
                100
            )
        );
    }, [
        totalIncome,
        store.currentSpend,
    ]);

    const insight = useMemo(() => {
        if (spendPercent >= 95) {
            return "Your monthly budget is almost depleted. Reduce non-essential spending immediately.";
        }

        if (topCategory) {
            return `${topCategory.name} is currently your highest spending category this month.`;
        }

        if (savingsRate >= 40) {
            return "Your savings rate is performing strongly this month.";
        }

        return "Your financial activity is stable this month.";
    }, [
        spendPercent,
        topCategory,
        savingsRate,
    ]);

    return (
        <View
            style={tw`bg-[#151515] rounded-[34px] p-6 border border-[#242424] mb-5`}
        >
            <Text
                style={tw`text-[#EBC351] text-xs font-bold uppercase mb-3`}
            >
                AI Insight
            </Text>

            <Text
                style={tw`text-gray-300 leading-6 text-sm`}
            >
                {insight}
            </Text>
        </View>
    );
}