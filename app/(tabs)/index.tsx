import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import tw from "twrnc";
import { Budget, BudgetCard } from "../../components/BudgetCard";
import NewBudget from "../../components/modals/BudgetFormModal";

export default function BudgetsScreen(): React.JSX.Element {
  const router = useRouter();

  // State Management
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newBudget, setNewBudget] = useState({ title: '', limit: '' });

  // Logic: Create Budget
  const createBudget = () => {
    if (!newBudget.title || !newBudget.limit) return;

    const b: Budget = {
      id: Date.now().toString(),
      title: newBudget.title,
      limit: parseFloat(newBudget.limit),
      expenses: []
    };

    setBudgets([b, ...budgets]);
    setAddModalVisible(false);
    setNewBudget({ title: '', limit: '' });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`p-6`}>
        {/* iOS Header Styling */}
        <View style={tw`flex-row justify-between items-end mb-8`}>
          <View>
            <Text style={tw`text-gray-400 text-[11px] font-bold uppercase tracking-widest`}>My Savings</Text>
            <Text style={tw`text-4xl font-black text-black tracking-tighter`}>Budgets</Text>
          </View>
          <TouchableOpacity
            onPress={() => setAddModalVisible(true)}
            style={tw`bg-gray-100 p-2 rounded-full`}
          >
            <Ionicons name="add" size={28} color={tw.color('blue-500')} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={budgets}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push({
                pathname: "/budget/[id]",
                params: { id: item.id, title: item.title, limit: item.limit }
              })}
              style={tw`mb-4`}
            >
              <BudgetCard budget={item} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={tw`mt-20 items-center`}>
              <Text style={tw`text-center text-gray-400 font-medium`}>No budgets. Tap + to start.</Text>
            </View>
          }
        />
      </View>

      {isAddModalVisible && <NewBudget isVisible={isAddModalVisible} onClose={() => setAddModalVisible(false)} newBudget={newBudget} setNewBudget={setNewBudget} onCreate={createBudget} />}
    </SafeAreaView>
  );
}