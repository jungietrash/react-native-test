import { formatCurrency } from '@/utils/currency';
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Platform, Pressable, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import tw from "twrnc";
import { ExpenseFormModal } from '../../components/modals/ExpenseFormModal';

export interface Expense {
    id: string;
    name: string;
    amount: number;
    date: Date;
}

export default function BudgetDetailScreen(): React.JSX.Element {
    // 1. Extract dynamic route params
    const { id, title, limit } = useLocalSearchParams<{
        id: string;
        title: string;
        limit: string
    }>();

    const router = useRouter();
    const scrollY = useSharedValue(0);

    // 2. Local States
    const [isModalVisible, setModalVisible] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    // Initialize budget data from route params
    const [budget, setBudget] = useState({
        id: id,
        title: title || 'Wallet',
        limit: limit ? parseFloat(limit) : 0,
        expenses: [] as Expense[]
    });

    // 3. Computed Metrics
    const totalSpent = useMemo(() =>
        budget.expenses.reduce((s, e) => s + e.amount, 0),
        [budget.expenses]
    );

    const balance = budget.limit - totalSpent;

    // 4. Handlers
    const onScroll = useAnimatedScrollHandler((e) => {
        scrollY.value = e.contentOffset.y;
    });

    const handleSaveExpense = (data: Omit<Expense, 'id' | 'date'>) => {
        if (editingExpense) {
            // Update existing
            setBudget(prev => ({
                ...prev,
                expenses: prev.expenses.map(e => e.id === editingExpense.id ? { ...e, ...data } : e)
            }));
        } else {
            // Add new
            const entry: Expense = {
                ...data,
                id: Date.now().toString(),
                date: new Date()
            };
            setBudget(prev => ({ ...prev, expenses: [entry, ...prev.expenses] }));
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setModalVisible(false);
        setEditingExpense(null);
    };

    const handleOpenEdit = (item: Expense) => {
        Haptics.selectionAsync();
        setEditingExpense(item);
        setModalVisible(true);
    };

    const handleOpenAdd = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setEditingExpense(null);
        setModalVisible(true);
    };

    // 5. Animated Styles
    const headerBlurStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [20, 60], [0, 1], Extrapolation.CLAMP),
    }));

    const smallTitleStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [70, 90], [0, 1], Extrapolation.CLAMP),
        transform: [{ translateY: interpolate(scrollY.value, [70, 90], [5, 0], Extrapolation.CLAMP) }]
    }));

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            {/* Sticky Apple-Style Header */}
            <Animated.View style={[tw`absolute top-0 left-0 right-0 z-30 pt-14 pb-3 px-4`, { height: 105 }]}>
                <Animated.View style={[tw`absolute inset-0 bg-white/80`, headerBlurStyle]}>
                    <BlurView intensity={Platform.OS === 'ios' ? 80 : 100} style={tw`flex-1`} />
                </Animated.View>
                <View style={tw`flex-row justify-between items-center`}>
                    <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center`}>
                        <Ionicons name="chevron-back" size={28} color={tw.color('blue-500')} />
                        <Text style={tw`text-blue-500 text-lg ml-[-4px]`}>Back</Text>
                    </TouchableOpacity>

                    <Animated.View style={[tw`items-center`, smallTitleStyle]}>
                        <Text style={tw`font-bold text-gray-900`}>{budget.title}</Text>
                        <Text style={tw`text-[10px] text-gray-500 font-bold uppercase tracking-tight`}>
                            {formatCurrency(balance)} left
                        </Text>
                    </Animated.View>

                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal-circle" size={26} color={tw.color('blue-500')} />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <Animated.FlatList
                data={budget.expenses}
                onScroll={onScroll}
                scrollEventThrottle={16}
                contentContainerStyle={tw`pt-28 px-5 pb-32`}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={(
                    <View style={tw`mb-8`}>
                        <Text style={tw`text-gray-400 font-bold text-[11px] uppercase tracking-widest mb-1`}>
                            {budget.title} Available
                        </Text>
                        <Text style={tw`text-5xl font-black text-black tracking-tighter`}>
                            {formatCurrency(balance)}
                        </Text>

                        <View style={tw`flex-row gap-4 mt-8`}>
                            <View style={tw`flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100`}>
                                <Text style={tw`text-gray-400 text-[10px] font-black uppercase mb-1`}>Limit</Text>
                                <Text style={tw`text-gray-900 font-bold text-lg`}>{formatCurrency(budget.limit)}</Text>
                            </View>
                            <View style={tw`flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100`}>
                                <Text style={tw`text-gray-400 text-[10px] font-black uppercase mb-1`}>Spent</Text>
                                <Text style={tw`text-gray-900 font-bold text-lg`}>{formatCurrency(totalSpent)}</Text>
                            </View>
                        </View>
                    </View>
                )}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => handleOpenEdit(item)}
                        style={({ pressed }) => [
                            tw`flex-row items-center py-4 border-b border-gray-50`,
                            pressed && tw`bg-gray-50 opacity-80`
                        ]}
                    >
                        <View style={tw`bg-gray-100 w-11 h-11 rounded-full items-center justify-center mr-4`}>
                            <Ionicons name="cart" size={20} color={tw.color('gray-600')} />
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={tw`font-semibold text-gray-900 text-[17px]`}>{item.name}</Text>
                            <Text style={tw`text-gray-400 text-sm`}>
                                {item.date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                            </Text>
                        </View>
                        <Text style={tw`font-semibold text-[17px] text-gray-900`}>
                            -{formatCurrency(item.amount)}
                        </Text>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <View style={tw`mt-10 items-center`}>
                        <Text style={tw`text-gray-300 font-medium`}>No transactions yet</Text>
                    </View>
                }
            />

            {/* Floating Action Pill */}
            <View style={tw`absolute bottom-10 left-0 right-0 px-8`}>
                <Pressable
                    onPress={handleOpenAdd}
                    style={({ pressed }) => [
                        tw`bg-blue-500 h-14 rounded-2xl flex-row items-center justify-center shadow-xl shadow-blue-200`,
                        { transform: [{ scale: pressed ? 0.97 : 1 }] }
                    ]}
                >
                    <Ionicons name="add-circle" size={24} color="white" style={tw`mr-2`} />
                    <Text style={tw`text-white font-bold text-lg`}>Add Expense</Text>
                </Pressable>
            </View>

            {/* Shared Modal for Add/Edit */}
            <ExpenseFormModal
                isVisible={isModalVisible}
                initialData={editingExpense}
                onClose={() => {
                    setModalVisible(false);
                    setEditingExpense(null);
                }}
                onSave={handleSaveExpense}
            />
        </View>
    );
}