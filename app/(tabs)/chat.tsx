import { useFinanceStore } from '@/store/useFinanceStore';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
  const { transactions, addTransaction } = useFinanceStore();
  const tabBarHeight = useBottomTabBarHeight();

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

      // Save to Supabase & Store (Passing the AI's structured JSON)
      await addTransaction(input, aiData);

      setInput('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Chat Error:", error);
      alert("AI failed to respond. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        inverted={false} // Keep latest at the bottom or top depending on your fetch sort
        contentContainerStyle={tw`p-6 pb-20`}
        ListHeaderComponent={(
          <View style={tw`mb-12`}>
            <View style={tw`flex-row justify-between items-center mb-8`}>
              <Text style={[tw`text-white text-xl`, { fontFamily: 'Heading' }]}>FinAI</Text>
              <TouchableOpacity
                onPress={() => router.push('/')}
                style={tw`flex-row items-center bg-[#1A1A1A] border border-[#333] px-4 py-1.5 rounded-full`}
              >
                <View style={tw`w-1.5 h-1.5 bg-[#EBC351] rounded-full mr-2`} />
                <Text style={tw`text-[#EBC351] text-xs font-bold tracking-tight`}>Dashboard</Text>
              </TouchableOpacity>
            </View>

            <Text style={tw`text-[#EBC351] text-[10px] font-bold uppercase mb-2`}>Step 1 — Log It</Text>
            <Text style={[tw`text-white text-5xl leading-[55px]`, { fontFamily: 'Heading' }]}>
              just say what you <Text style={tw`text-[#EBC351]`}>spent.</Text>
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={tw`mb-6`}>
            {/* 1. USER MESSAGE (What you typed) */}
            <View style={tw`bg-[#F84F4F] p-4 rounded-2xl rounded-tr-none self-end mb-2 max-w-[85%]`}>
              <Text style={tw`text-white font-medium`}>{item.description}</Text>
            </View>

            {/* 2. AI RESPONSE (The Demo Output) */}
            <View style={tw`bg-[#121212] p-4 rounded-2xl rounded-tl-none self-start border border-[#222] max-w-[85%]`}>
              <Text style={tw`text-gray-400 leading-5`}>
                {/* 
                   Priority 1: The positive "reply" from AI
                   Priority 2: A fallback formatted string
                */}
                {item.ai_reply || `Logged ₱${item.amount.toLocaleString()} to ${item.category}.`}
              </Text>

              <Text style={tw`text-gray-600 text-[8px] mt-2 uppercase`}>
                {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {item.category}
              </Text>
            </View>
          </View>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={tabBarHeight}
      >
        <View style={tw`p-4 bg-black border-t border-[#111]`}>
          <View style={tw`flex-row items-center bg-[#121212] rounded-full px-5 py-2 border border-[#222]`}>
            <TextInput
              style={tw`flex-1 text-white py-3`}
              placeholder={isLoading ? "FinAI is thinking..." : "ask anything about your money..."}
              placeholderTextColor="#444"
              value={input}
              onChangeText={setInput}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={onSend}
              disabled={isLoading}
              style={tw`bg-[#EBC351] h-10 w-10 rounded-full items-center justify-center ${isLoading ? 'opacity-50' : ''}`}
            >
              {isLoading ? (
                <ActivityIndicator color="black" size="small" />
              ) : (
                <Text style={tw`text-black text-xl font-bold`}>↑</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}