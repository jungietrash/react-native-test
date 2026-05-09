import AIInsightCard from "@/components/dashboard/AIInsightCard";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HeroBudgetCard from "@/components/dashboard/HeroBudgetCard";
import QuickStatsGrid from "@/components/dashboard/QuickStatsGrid";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import BudgetModal from "@/components/modals/BudgetModal";
import { useFinanceStore } from "@/store/useFinanceStore";
import { Ionicons } from "@expo/vector-icons";
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
      value: `₱${(store.networth || 0).toLocaleString()}`,
      hint: "Total financial position",
      icon: <Ionicons name="wallet-outline" size={20} color="#EBC351" />,
    },
    {
      label: "Budget Remaining",
      value: `₱${Math.max(
        (store.monthlyBudget || 0) - (store.currentSpend || 0),
        0
      ).toLocaleString()}`,
      hint: "Available this month",
      icon: <Ionicons name="cash-outline" size={20} color="#22C55E" />,
    },
    {
      label: "Daily Spend",
      value: `₱${Math.floor(
        (store.currentSpend || 0) /
        Math.max(new Date().getDate(), 1)
      ).toLocaleString()}`,
      hint: "Current spending pace",
      icon: <Ionicons name="trending-up-outline" size={20} color="#F59E0B" />,
    },
    {
      label: "Risk Level",
      value:
        (store.currentSpend || 0) >
          (store.monthlyBudget || 0) * 0.9
          ? "High"
          : (store.currentSpend || 0) >
            (store.monthlyBudget || 0) * 0.75
            ? "Medium"
            : "Low",
      hint: "Overspending risk",
      icon: <Ionicons name="warning-outline" size={20} color="#EF4444" />,
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

  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  const dailySafeSpend = (store.monthlyBudget * 0.95) / daysInMonth;

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}
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
          dailySafeSpend={Math.floor(dailySafeSpend)}
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

      {/* <FloatingAddButton /> */}

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