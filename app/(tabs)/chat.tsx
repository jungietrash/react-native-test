import { useFinanceStore } from '@/store/useFinanceStore';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import tw from 'twrnc';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { transactions, addTransaction, fetchInitialData } = useFinanceStore();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Sort transactions to show newest at the bottom (for Inverted List)
  const displayTransactions = useMemo(() => {
    return [...transactions]
  }, [transactions]);

  const onSend = async () => {
    if (!input.trim() || isLoading) return;
    try {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const response = await fetch('https://jungie.site/api/analyze-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: input }),
      });

      const aiData = await response.json();
      if (aiData.error) throw new Error(aiData.error);

      await addTransaction(input, aiData);

      setInput('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      {/* Header */}
      <View style={tw`px-6 pt-4 pb-2 flex-row justify-between items-center`}>
        <TouchableOpacity onPress={() => router.push('/')} style={tw`p-2 -ml-2`}>
          <Ionicons name="chevron-back" size={28} color="#EBC351" />
        </TouchableOpacity>
        <Text style={[tw`text-white text-2xl`, { fontFamily: 'Heading' }]}>log it.</Text>
        <View style={tw`w-8`} /> {/* Spacer for centering */}
      </View>

      <FlatList
        ref={flatListRef}
        data={displayTransactions}
        inverted // New messages at the bottom
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`p-6 pt-10`}
        renderItem={({ item }) => (
          <View style={tw`mb-8`}>
            {/* User Message */}
            <View style={tw`items-end mb-3`}>
              <View style={tw`bg-[#222] px-5 py-3 rounded-[20px] rounded-tr-none max-w-[80%]`}>
                <Text style={tw`text-white text-base`}>{item.description}</Text>
              </View>
              <Text style={tw`text-gray-600 text-[9px] mt-1 uppercase font-bold mr-1`}>You</Text>
            </View>

            {/* AI/FinAI Response */}
            <View style={tw`items-start`}>
              <View style={tw`bg-[#121212] border border-[#222] px-5 py-4 rounded-[20px] rounded-tl-none max-w-[85%] shadow-sm`}>
                <Text style={tw`text-[#EBC351] text-[10px] font-bold uppercase mb-1 tracking-widest`}>FinAI Assistant</Text>
                <Text style={tw`text-gray-300 leading-5`}>
                  {item.ai_reply || `Successfully logged ₱${item.amount.toLocaleString()} under ${item.category}.`}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={tw`flex-1 items-center justify-center pt-20 opacity-30`}>
            <Ionicons name="chatbubble-ellipses-outline" size={60} color="#EBC351" />
            <Text style={tw`text-white mt-4 font-bold`}>Start your first log.</Text>
          </View>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={tw`p-6 bg-black border-t border-[#111]`}>
          <View style={tw`flex-row items-center bg-[#121212] rounded-[24px] px-2 py-2 border border-[#222]`}>
            <TextInput
              style={tw`flex-1 text-white px-4 py-3 text-base`}
              placeholder={isLoading ? "Analyzing..." : "Dinner for ₱500..."}
              placeholderTextColor="#444"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={onSend}
              multiline={false}
            />
            <TouchableOpacity
              onPress={onSend}
              disabled={isLoading || !input.trim()}
              style={[
                tw`h-12 w-12 rounded-[20px] items-center justify-center`,
                !input.trim() ? tw`bg-[#222]` : tw`bg-[#EBC351]`
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="black" size="small" />
              ) : (
                <Ionicons name="arrow-up" size={24} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}