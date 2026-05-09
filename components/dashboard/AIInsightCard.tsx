import { useFinanceStore } from "@/store/useFinanceStore";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import tw from "twrnc";

export default function AIInsightCard() {
    const store = useFinanceStore();

    const spendPercent = useMemo(() => {
        if (!store.monthlyBudget) return 0;

        return Math.round(
            (store.currentSpend / store.monthlyBudget) * 100
        );
    }, [store.currentSpend, store.monthlyBudget]);

    // FIXED: uses "spent" (your actual type)
    const topCategory = useMemo(() => {
        if (!store.categories?.length) return null;

        return store.categories.reduce((max, cat) =>
            cat.spent > max.spent ? cat : max
        );
    }, [store.categories]);

    const totalIncome = useMemo(() => {
        return (
            store.transactions
                ?.filter((t) => t.type === "income")
                .reduce((sum, t) => sum + (t.amount || 0), 0) || 0
        );
    }, [store.transactions]);

    const savingsRate = useMemo(() => {
        if (!totalIncome) return 0;

        return Math.max(
            0,
            Math.round(
                ((totalIncome - store.currentSpend) /
                    totalIncome) *
                100
            )
        );
    }, [totalIncome, store.currentSpend]);

    const insight = useMemo(() => {
        // 🚨 Critical budget warning (highest priority)
        if (spendPercent >= 100) {
            return "You've exceeded your monthly budget. Stop non-essential spending immediately.";
        }

        if (spendPercent >= 90) {
            return "You're close to your budget limit. Reduce unnecessary expenses.";
        }

        // ⚠️ Low savings warning
        if (totalIncome > 0 && savingsRate < 10) {
            return "Your savings rate is very low this month. Consider cutting expenses.";
        }

        // 📊 Spending insight
        if (topCategory) {
            return `${topCategory.name} is your highest spending category this month.`;
        }

        // 💪 Positive insight
        if (savingsRate >= 40) {
            return "Great job — your savings rate is strong this month.";
        }

        return "Your financial activity is stable this month.";
    }, [spendPercent, savingsRate, topCategory, totalIncome]);

    return (
        <View
            style={tw`bg-[#151515] rounded-[34px] p-6 border border-[#242424] mb-5`}
        >
            <Text
                style={tw`text-[#EBC351] text-xs font-bold uppercase mb-3`}
            >
                AI Insight
            </Text>

            <Text style={tw`text-gray-300 leading-6 text-sm`}>
                {insight}
            </Text>
        </View>
    );
}