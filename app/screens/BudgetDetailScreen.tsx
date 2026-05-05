import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Budget } from "../(tabs)/components/BudgetCard"; // Ensure this path is correct
import { ReceiptScanner } from "../(tabs)/components/ReceiptScanner"; // Ensure this is a Named Export

export default function BudgetDetailScreen({ budget, onBack, onUpdateBudget }: { budget: Budget, onBack: () => void, onUpdateBudget: (b: Budget) => void }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [scanMode, setScanMode] = useState<'camera' | 'library' | null>(null);
    const [form, setForm] = useState({ id: '', name: '', amount: '' });

    const totalSpent = budget.expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const handleSaveExpense = () => {
        if (!form.name || !form.amount) return;
        const newEntry = {
            id: Date.now().toString(),
            name: form.name,
            amount: parseFloat(form.amount),
            date: new Date()
        };

        onUpdateBudget({
            ...budget,
            expenses: [newEntry, ...budget.expenses]
        });

        setModalVisible(false);
        setForm({ id: '', name: '', amount: '' });
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            {/* Header Section */}
            <View style={tw`bg-indigo-600 pt-16 pb-12 px-6 rounded-b-5xl shadow-2xl`}>
                <TouchableOpacity onPress={onBack} style={tw`mb-4 w-10`}>
                    <Ionicons name="chevron-back" size={30} color="white" />
                </TouchableOpacity>
                <Text style={tw`text-white/70 text-lg font-medium`}>{budget.title}</Text>
                <Text style={tw`text-white text-5xl font-black`}>
                    ${(budget.limit - totalSpent).toLocaleString()}
                </Text>
            </View>

            {/* Expenses List */}
            <View style={tw`flex-1 px-6 pt-10`}>
                <Text style={tw`text-2xl font-black text-gray-900 mb-6`}>History</Text>
                <FlatList
                    data={budget.expenses}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={tw`flex-row items-center justify-between mb-6 bg-gray-50 p-4 rounded-2xl`}>
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`bg-white p-3 rounded-xl mr-4 shadow-sm`}>
                                    <Ionicons name="receipt-outline" size={20} color="#4F46E5" />
                                </View>
                                <View>
                                    <Text style={tw`font-bold text-gray-900 text-base`}>{item.name}</Text>
                                    <Text style={tw`text-gray-400 text-xs`}>{new Date(item.date).toLocaleDateString()}</Text>
                                </View>
                            </View>
                            <Text style={tw`font-black text-lg text-gray-900`}>-${item.amount}</Text>
                        </View>
                    )}
                />
            </View>

            {/* MANUAL ENTRY MODAL */}
            <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={tw`flex-1 bg-gray-50`}
                >
                    <ScrollView contentContainerStyle={tw`p-8`}>
                        <View style={tw`flex-row justify-between items-center mb-8`}>
                            <Text style={tw`text-3xl font-black text-gray-900`}>Add Expense</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close-circle" size={32} color="#D1D5DB" />
                            </TouchableOpacity>
                        </View>

                        <Text style={tw`text-gray-400 mb-2 ml-1 font-bold text-xs tracking-widest`}>MERCHANT NAME</Text>
                        <TextInput
                            placeholder="e.g. Starbucks"
                            style={tw`bg-white p-5 rounded-2xl mb-6 shadow-sm text-lg font-bold`}
                            value={form.name}
                            onChangeText={(t) => setForm({ ...form, name: t })}
                        />

                        <Text style={tw`text-gray-400 mb-2 ml-1 font-bold text-xs tracking-widest`}>AMOUNT</Text>
                        <TextInput
                            placeholder="0.00"
                            keyboardType="numeric"
                            style={tw`bg-white p-5 rounded-2xl mb-10 shadow-sm text-2xl font-black text-indigo-600`}
                            value={form.amount}
                            onChangeText={(t) => setForm({ ...form, amount: t })}
                        />

                        <TouchableOpacity
                            style={tw`bg-indigo-600 p-5 rounded-2xl items-center shadow-lg shadow-indigo-200 mb-10`}
                            onPress={handleSaveExpense}
                        >
                            <Text style={tw`text-white font-bold text-xl`}>Confirm Purchase</Text>
                        </TouchableOpacity>

                        {/* AI / PHOTO OPTIONS AT BOTTOM */}
                        <View style={tw`border-t border-gray-200 pt-8`}>
                            <Text style={tw`text-center text-gray-400 font-bold mb-4 text-xs uppercase tracking-widest`}>Or Scan Receipt</Text>
                            <View style={tw`flex-row gap-4`}>
                                <TouchableOpacity
                                    onPress={() => setScanMode('camera')}
                                    style={tw`flex-1 flex-row items-center justify-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm`}
                                >
                                    <Ionicons name="camera" size={20} color="#4F46E5" style={tw`mr-2`} />
                                    <Text style={tw`font-bold text-gray-700`}>Camera</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setScanMode('library')}
                                    style={tw`flex-1 flex-row items-center justify-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm`}
                                >
                                    <Ionicons name="images" size={20} color="#4F46E5" style={tw`mr-2`} />
                                    <Text style={tw`font-bold text-gray-700`}>Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>

            {/* FAB */}
            <TouchableOpacity
                style={tw`bg-black w-16 h-16 rounded-full items-center justify-center absolute bottom-10 right-6 shadow-xl`}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={35} color="white" />
            </TouchableOpacity>

            {/* Scanner Component (Only active when scanMode is set) */}
            {scanMode && (
                <ReceiptScanner
                    mode={scanMode}
                    onClose={() => setScanMode(null)}
                    onScanResult={(res) => {
                        setForm({ id: '', name: res.name, amount: res.amount.toString() });
                        setScanMode(null); // Close scanner but keep form modal open for review
                    }}
                />
            )}
        </View>
    );
}