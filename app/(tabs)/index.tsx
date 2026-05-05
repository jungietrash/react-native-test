import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Budget, BudgetCard } from "./components/BudgetCard";
import BudgetDetailScreen from "./screens/BudgetDetailScreen";

export default function App() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newBudget, setNewBudget] = useState({ title: '', limit: '' });

  const activeBudget = budgets.find(b => b.id === selectedBudgetId);

  const createBudget = () => {
    if (!newBudget.title || !newBudget.limit) return;
    const b: Budget = { id: Date.now().toString(), title: newBudget.title, limit: parseFloat(newBudget.limit), expenses: [] };
    setBudgets([...budgets, b]);
    setAddModalVisible(false);
    setNewBudget({ title: '', limit: '' });
  };

  if (activeBudget) {
    return <BudgetDetailScreen
      budget={activeBudget}
      onBack={() => setSelectedBudgetId(null)}
      onUpdateBudget={(updated) => setBudgets(budgets.map(b => b.id === updated.id ? updated : b))}
    />;
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`p-6`}>
        <View style={tw`flex-row justify-between items-center mb-8`}>
          <Text style={tw`text-4xl font-black text-gray-900`}>Budgets</Text>
          <TouchableOpacity onPress={() => setAddModalVisible(true)} style={tw`bg-indigo-600 p-3 rounded-2xl`}>
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={budgets}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedBudgetId(item.id)}>
              <BudgetCard budget={item} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={tw`text-center text-gray-400 mt-20`}>No budgets. Tap + to start.</Text>}
        />
      </View>

      <Modal visible={isAddModalVisible} animationType="fade" transparent>
        <View style={tw`flex-1 justify-center bg-black/50 p-6`}>
          <View style={tw`bg-white p-8 rounded-3xl`}>
            <Text style={tw`text-2xl font-black mb-6`}>New Wallet</Text>
            <TextInput placeholder="Budget Title" style={tw`bg-gray-100 p-4 rounded-xl mb-4`} onChangeText={(t) => setNewBudget({ ...newBudget, title: t })} />
            <TextInput placeholder="Monthly Limit" keyboardType="numeric" style={tw`bg-gray-100 p-4 rounded-xl mb-6`} onChangeText={(t) => setNewBudget({ ...newBudget, limit: t })} />
            <TouchableOpacity style={tw`bg-indigo-600 p-4 rounded-xl items-center`} onPress={createBudget}>
              <Text style={tw`text-white font-bold`}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}