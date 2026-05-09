import AIInsightCard from "@/components/dashboard/AIInsightCard";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FloatingAddButton from "@/components/dashboard/FloatingAddButton";
import HeroBudgetCard from "@/components/dashboard/HeroBudgetCard";
import QuickStatsGrid from "@/components/dashboard/QuickStatsGrid";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import BudgetModal from "@/components/modals/BudgetModal";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useFocusEffect } from "expo-router";
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from "react-native";
import tw from "twrnc";

export default function Dashboard() {
  const store = useFinanceStore();

  const [refreshing, setRefreshing] =
    useState(false);

  const [budgetModal, setBudgetModal] =
    useState(false);

  const [budgetInput, setBudgetInput] =
    useState(
      store.monthlyBudget.toString()
    );

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

  const spendPercent = useMemo(() => {
    if (store.monthlyBudget <= 0)
      return 0;

    return Math.min(
      Math.round(
        (store.currentSpend /
          store.monthlyBudget) *
        100
      ),
      100
    );
  }, [
    store.currentSpend,
    store.monthlyBudget,
  ]);

  const budgetHealth =
    spendPercent >= 90
      ? {
        label: "Critical",
        color: "#EF4444",
      }
      : {
        label: "Healthy",
        color: "#22C55E",
      };

  const stats = [
    {
      label: "Net Worth",
      value: `₱${store.networth.toLocaleString()}`,
    },
    {
      label: "Budget",
      value: `₱${store.monthlyBudget.toLocaleString()}`,
    },
  ];

  const saveBudget = async () => {
    const parsed = Number(
      budgetInput.replace(/,/g, "")
    );

    if (isNaN(parsed)) return;

    await store.updateMonthlyBudget(
      parsed
    );

    setBudgetModal(false);
  };

  return (
    <SafeAreaView
      style={tw`flex-1 bg-black`}
    >
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
        <DashboardHeader />

        <HeroBudgetCard
          bufferLeft={
            store.bufferLeft
          }
          budgetHealth={
            budgetHealth
          }
          spendPercent={
            spendPercent
          }
          monthlyBudget={
            store.monthlyBudget
          }
          dailySafeSpend={3000}
          onEditBudget={() => {
            setBudgetInput(
              store.monthlyBudget.toString()
            );

            setBudgetModal(true);
          }}
        />

        <QuickStatsGrid
          stats={stats}
        />

        <AIInsightCard />

        <CategoryBreakdown />

        <RecentTransactions />
      </ScrollView>

      <FloatingAddButton />

      <BudgetModal
        visible={budgetModal}
        value={budgetInput}
        onChange={setBudgetInput}
        onClose={() =>
          setBudgetModal(false)
        }
        onSave={saveBudget}
      />
    </SafeAreaView>
  );
}