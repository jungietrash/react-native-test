import { useFinanceStore } from "@/store/useFinanceStore";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";

export default function Dashboard() {
  const store = useFinanceStore();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      store.fetchInitialData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await store.fetchInitialData();
    setRefreshing(false);
  };

  /**
   * =========================
   * COMPUTED ANALYTICS
   * =========================
   */

  const spendPercent = useMemo(() => {
    if (store.monthlyBudget <= 0) return 0;

    return Math.min(
      Math.round((store.currentSpend / store.monthlyBudget) * 100),
      100
    );
  }, [store.currentSpend, store.monthlyBudget]);

  const dailySafeSpend = useMemo(() => {
    const remainingDays = Math.max(1, 30 - new Date().getDate());

    return Math.max(
      0,
      Math.floor(store.bufferLeft / remainingDays)
    ).toLocaleString();
  }, [store.bufferLeft]);

  const dailyAverageSpend = useMemo(() => {
    const today = new Date().getDate();

    return today > 0
      ? Math.floor(store.currentSpend / today).toLocaleString()
      : "0";
  }, [store.currentSpend]);

  const totalIncome = useMemo(() => {
    return store.transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [store.transactions]);

  const savingsRate = useMemo(() => {
    if (totalIncome <= 0) return 0;

    return Math.max(
      0,
      Math.round(
        ((totalIncome - store.currentSpend) / totalIncome) * 100
      )
    );
  }, [totalIncome, store.currentSpend]);

  const predictedMonthEndSpend = useMemo(() => {
    const today = new Date().getDate();

    if (today <= 0) return 0;

    return Math.floor((store.currentSpend / today) * 30);
  }, [store.currentSpend]);

  const budgetHealth = useMemo(() => {
    if (predictedMonthEndSpend >= store.monthlyBudget) {
      return {
        label: "Critical",
        color: "#EF4444",
      };
    }

    if (predictedMonthEndSpend >= store.monthlyBudget * 0.8) {
      return {
        label: "Warning",
        color: "#F59E0B",
      };
    }

    return {
      label: "Healthy",
      color: "#22C55E",
    };
  }, [predictedMonthEndSpend, store.monthlyBudget]);

  const topCategory = useMemo(() => {
    if (!store.categories.length) return null;

    return store.categories[0];
  }, [store.categories]);

  const recentTransactions = useMemo(() => {
    return store.transactions.slice(0, 5);
  }, [store.transactions]);

  const getCategoryEmoji = (category: string) => {
    const c = category.toLowerCase();

    if (c.includes("food")) return "🍔";
    if (c.includes("transport")) return "🚕";
    if (c.includes("shopping")) return "🛍️";
    if (c.includes("salary")) return "💼";
    if (c.includes("bills")) return "💡";
    if (c.includes("health")) return "🏥";
    if (c.includes("travel")) return "✈️";

    return "💳";
  };

  const aiInsight = useMemo(() => {
    if (spendPercent >= 90) {
      return "You're close to exceeding your monthly budget.";
    }

    if (topCategory) {
      return `${topCategory.name} is your highest expense category this month.`;
    }

    return "Your spending habits are looking stable this month.";
  }, [spendPercent, topCategory]);

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <ScrollView
        contentContainerStyle={tw`px-5 pt-5 pb-40`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#EBC351"
          />
        }
      >
        {/* HEADER */}
        <View style={tw`flex-row justify-between items-center mb-8`}>
          <View>
            <Text style={tw`text-gray-500 text-xs uppercase tracking-widest`}>
              Financial Dashboard
            </Text>

            <Text
              style={[
                tw`text-white text-3xl mt-1`,
                { fontFamily: "Heading" },
              ]}
            >
              MAY 2026
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/chat")}
            style={tw`bg-[#EBC351] px-5 py-4 rounded-3xl`}
          >
            <Text style={tw`text-black font-black text-xs`}>
              + LOG EXPENSE
            </Text>
          </TouchableOpacity>
        </View>

        {/* HERO CARD */}
        <View
          style={tw`bg-[#111111] rounded-[38px] p-7 border border-[#1F1F1F] mb-5`}
        >
          <Text style={tw`text-[#EBC351] text-[11px] font-bold uppercase`}>
            Remaining Budget
          </Text>

          <Text
            style={[
              tw`text-white text-4xl mt-3`,
              { fontFamily: "Heading" },
            ]}
          >
            ₱{store.bufferLeft.toLocaleString()}
          </Text>

          <View style={tw`mt-7`}>
            <View
              style={tw`flex-row justify-between items-center mb-2`}
            >
              <Text style={tw`text-gray-500 text-xs`}>
                Budget Utilized
              </Text>

              <Text style={tw`text-white font-bold`}>
                {spendPercent}%
              </Text>
            </View>

            <View
              style={tw`h-3 bg-[#1D1D1D] rounded-full overflow-hidden`}
            >
              <View
                style={[
                  tw`h-full bg-[#EBC351] rounded-full`,
                  {
                    width: `${spendPercent}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View
            style={tw`flex-row justify-between mt-8 pt-6 border-t border-[#1F1F1F]`}
          >
            <View>
              <Text style={tw`text-gray-500 text-[10px] uppercase`}>
                Daily Safe Spend
              </Text>

              <Text style={tw`text-white text-xl font-bold mt-1`}>
                ₱{dailySafeSpend}
              </Text>
            </View>

            <View style={tw`items-end`}>
              <Text style={tw`text-gray-500 text-[10px] uppercase`}>
                Budget Health
              </Text>

              <Text
                style={[
                  tw`text-xl font-bold mt-1`,
                  { color: budgetHealth.color },
                ]}
              >
                {budgetHealth.label}
              </Text>
            </View>
          </View>
        </View>

        {/* QUICK STATS */}
        <View style={tw`flex-row flex-wrap justify-between mb-5`}>
          <StatCard
            label="Net Worth"
            value={`₱${store.networth.toLocaleString()}`}
          />

          <StatCard
            label="Daily Avg"
            value={`₱${dailyAverageSpend}`}
          />

          <StatCard
            label="Savings"
            value={`${savingsRate}%`}
          />

          <StatCard
            label="Forecast"
            value={`₱${predictedMonthEndSpend.toLocaleString()}`}
          />
        </View>

        {/* AI INSIGHT */}
        <View
          style={tw`bg-[#171717] rounded-[32px] p-6 border border-[#242424] mb-5`}
        >
          <Text style={tw`text-[#EBC351] text-xs font-bold uppercase mb-3`}>
            AI Financial Insight
          </Text>

          <Text style={tw`text-gray-300 leading-6 text-sm`}>
            {aiInsight}
          </Text>
        </View>

        {/* CATEGORY BREAKDOWN */}
        <View
          style={tw`bg-[#121212] rounded-[35px] p-6 border border-[#222] mb-5`}
        >
          <Text style={tw`text-[#EBC351] text-xs font-bold uppercase mb-6`}>
            Spending Breakdown
          </Text>

          {store.categories.length > 0 ? (
            store.categories.map((cat, i) => {
              const percentage =
                store.currentSpend > 0
                  ? Math.round(
                    (cat.spent / store.currentSpend) * 100
                  )
                  : 0;

              return (
                <View key={i} style={tw`mb-6`}>
                  <View
                    style={tw`flex-row justify-between items-center mb-2`}
                  >
                    <View style={tw`flex-row items-center`}>
                      <Text style={tw`mr-2 text-base`}>
                        {getCategoryEmoji(cat.name)}
                      </Text>

                      <Text style={tw`text-gray-300 font-semibold`}>
                        {cat.name}
                      </Text>
                    </View>

                    <Text style={tw`text-white font-bold`}>
                      ₱{cat.spent.toLocaleString()}
                    </Text>
                  </View>

                  <View
                    style={tw`h-2 bg-[#1E1E1E] rounded-full overflow-hidden`}
                  >
                    <View
                      style={[
                        tw`h-full bg-[#EBC351] rounded-full`,
                        {
                          width: `${percentage}%`,
                        },
                      ]}
                    />
                  </View>

                  <Text style={tw`text-gray-500 text-xs mt-2`}>
                    {percentage}% of total expenses
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={tw`text-gray-600 text-center py-10`}>
              No expense data yet.
            </Text>
          )}
        </View>

        {/* RECENT TRANSACTIONS */}
        <View
          style={tw`bg-[#121212] rounded-[35px] p-6 border border-[#222]`}
        >
          <View
            style={tw`flex-row justify-between items-center mb-6`}
          >
            <Text style={tw`text-[#EBC351] text-xs font-bold uppercase`}>
              Recent Transactions
            </Text>

            <Text style={tw`text-gray-500 text-xs`}>
              {store.transactions.length} total
            </Text>
          </View>

          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => (
              <View
                key={tx.id}
                style={tw`flex-row justify-between items-center py-4 border-b border-[#1E1E1E]`}
              >
                <View style={tw`flex-row items-center flex-1`}>
                  <View
                    style={tw`w-12 h-12 rounded-2xl bg-[#1C1C1C] items-center justify-center mr-4`}
                  >
                    <Text style={tw`text-lg`}>
                      {getCategoryEmoji(tx.category)}
                    </Text>
                  </View>

                  <View style={tw`flex-1`}>
                    <Text
                      style={tw`text-white font-semibold`}
                      numberOfLines={1}
                    >
                      {tx.description}
                    </Text>

                    <Text style={tw`text-gray-500 text-xs mt-1`}>
                      {tx.category} •{" "}
                      {/* {new Date(tx.created_at).toLocaleDateString()} */}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    tw`font-bold text-base`,
                    {
                      color:
                        tx.type === "income"
                          ? "#22C55E"
                          : "#EF4444",
                    },
                  ]}
                >
                  {tx.type === "income" ? "+" : "-"}₱
                  {tx.amount.toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={tw`text-gray-600 text-center py-10`}>
              No transactions found.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* FLOATING BUTTON */}
      <TouchableOpacity
        onPress={() => router.push("/chat")}
        style={tw`absolute bottom-8 right-6 bg-[#EBC351] px-6 py-5 rounded-full shadow-2xl`}
      >
        <Text style={tw`text-black font-black text-xs`}>
          + ADD
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/**
 * =========================
 * SMALL STAT CARD
 * =========================
 */

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View
    style={tw`w-[48%] bg-[#161616] rounded-[28px] p-5 border border-[#232323] mb-4`}
  >
    <Text style={tw`text-gray-500 text-[10px] uppercase mb-3`}>
      {label}
    </Text>

    <Text
      style={[
        tw`text-white text-xl`,
        {
          fontFamily: "Heading",
        },
      ]}
    >
      {value}
    </Text>
  </View>
);