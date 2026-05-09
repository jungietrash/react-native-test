import { useFinanceStore } from '@/store/useFinanceStore';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { transactions, addTransaction, fetchInitialData } = useFinanceStore();

  useEffect(() => {
    fetchInitialData(); // Ensure state is fresh when screen mounts
  }, []);

  const flatListRef = useRef<FlatList>(null);

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
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <FlatList
        ref={flatListRef}
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`p-6 pb-20`}
        ListHeaderComponent={(
          <View style={tw`mb-10`}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={tw`text-[#EBC351] mb-4`}>← Dashboard</Text>
            </TouchableOpacity>
            <Text style={[tw`text-white text-5xl`, { fontFamily: 'Heading' }]}>log it.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={tw`mb-6`}>
            <View style={tw`bg-[#F84F4F] p-4 rounded-2xl rounded-tr-none self-end max-w-[85%]`}>
              <Text style={tw`text-white font-medium`}>{item.description}</Text>
            </View>
            <View style={tw`bg-[#121212] p-4 mt-2 rounded-2xl rounded-tl-none self-start border border-[#222] max-w-[85%]`}>
              <Text style={tw`text-gray-400`}>{item.ai_reply || `Logged ₱${item.amount}`}</Text>
            </View>
          </View>
        )}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
        <View style={tw`p-4 bg-black border-t border-[#111]`}>
          <View style={tw`flex-row items-center bg-[#121212] rounded-full px-5 py-2 border border-[#222]`}>
            <TextInput
              style={tw`flex-1 text-white py-3`}
              placeholder={isLoading ? "Thinking..." : "What did you spend?"}
              placeholderTextColor="#444"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={onSend}
            />
            <TouchableOpacity onPress={onSend} disabled={isLoading} style={tw`bg-[#EBC351] h-10 w-10 rounded-full items-center justify-center`}>
              {isLoading ? <ActivityIndicator color="black" size="small" /> : <Text style={tw`font-bold`}>↑</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}