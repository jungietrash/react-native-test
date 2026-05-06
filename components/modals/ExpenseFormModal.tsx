import { Expense } from '@/app/budget/[id]';
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import tw from "twrnc";

interface ExpenseFormModalProps {
    isVisible: boolean;
    initialData?: Expense | null;
    onClose: () => void;
    onSave: (expense: Omit<Expense, 'id' | 'date'>) => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
    isVisible,
    initialData,
    onClose,
    onSave
}) => {
    const [form, setForm] = useState({ name: '', amount: '' });
    const [isScanning, setIsScanning] = useState(false);

    // Sync form with initialData for Editing mode
    useEffect(() => {
        if (isVisible) {
            setForm({
                name: initialData?.name ?? '',
                amount: initialData?.amount ? initialData.amount.toString() : '',
            });
        }
    }, [initialData, isVisible]);

    const handleSave = () => {
        if (!form.name || !form.amount) return;
        onSave({
            name: form.name,
            amount: parseFloat(form.amount),
        });
    };

    const simulateScan = () => {
        setIsScanning(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setTimeout(() => {
            const merchants = ['Apple Store', 'Starbucks', 'Netflix', 'Amazon'];
            setForm({
                name: merchants[Math.floor(Math.random() * merchants.length)],
                amount: (Math.random() * 50 + 10).toFixed(2)
            });
            setIsScanning(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 1200);
    };

    return (
        <Modal visible={isVisible} animationType="fade" transparent onRequestClose={onClose}>
            <View style={tw`flex-1 justify-center bg-black/50 p-6`}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={tw`bg-white p-8 rounded-3xl shadow-2xl`}>
                        <View style={tw`flex-row justify-between items-center mb-6`}>
                            <Text style={tw`text-2xl font-black text-gray-900`}>
                                {initialData ? 'Edit Expense' : 'New Expense'}
                            </Text>
                            {isScanning && <ActivityIndicator color={tw.color('indigo-600')} />}
                        </View>

                        <TextInput
                            placeholder="Merchant Name"
                            placeholderTextColor="#9CA3AF"
                            style={tw`bg-gray-100 p-4 rounded-xl mb-4 text-gray-900 font-medium`}
                            onChangeText={(t) => setForm({ ...form, name: t })}
                            value={form.name}
                        />

                        <TextInput
                            placeholder="Amount (0.00)"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                            style={tw`bg-gray-100 p-4 rounded-xl mb-6 text-gray-900 font-bold`}
                            onChangeText={(t) => setForm({ ...form, amount: t })}
                            value={form.amount}
                        />

                        {!initialData && (
                            <View style={tw`mb-8`}>
                                <Text style={tw`text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1`}>
                                    Smart Receipt Scan
                                </Text>
                                <View style={tw`flex-row gap-3`}>
                                    <TouchableOpacity onPress={simulateScan} style={tw`flex-1 bg-indigo-50 p-4 rounded-2xl flex-row items-center justify-center border border-indigo-100`}>
                                        <Ionicons name="camera" size={18} color={tw.color('indigo-600')} style={tw`mr-2`} />
                                        <Text style={tw`text-indigo-600 font-bold text-xs`}>Camera</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={simulateScan} style={tw`flex-1 bg-indigo-50 p-4 rounded-2xl flex-row items-center justify-center border border-indigo-100`}>
                                        <Ionicons name="images" size={18} color={tw.color('indigo-600')} style={tw`mr-2`} />
                                        <Text style={tw`text-indigo-600 font-bold text-xs`}>Gallery</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        <View style={tw`flex-row gap-3`}>
                            <TouchableOpacity style={tw`flex-1 bg-gray-100 p-4 rounded-xl items-center`} onPress={onClose}>
                                <Text style={tw`text-gray-500 font-bold`}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={tw`flex-2 bg-indigo-600 p-4 rounded-xl items-center`} onPress={handleSave}>
                                <Text style={tw`text-white font-bold`}>
                                    {initialData ? 'Update' : 'Add Expense'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};