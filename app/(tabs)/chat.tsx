import { useFinanceStore } from '@/store/useFinanceStore';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const { transactions, addTransaction } = useFinanceStore();
  const tabBarHeight = useBottomTabBarHeight();

  const onSend = () => {
    if (!input.trim()) return;
    addTransaction(input);
    setInput('');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <FlatList
        data={transactions}
        contentContainerStyle={tw`p-6 pb-20`}
        ListHeaderComponent={(
          <View style={tw`mb-12`}>
            {/* Top Navigation Row */}
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

            {/* Hero Text */}
            <Text style={tw`text-[#EBC351] text-[10px] font-bold uppercase mb-2`}>Step 1 — Log It</Text>
            <Text style={[tw`text-white text-5xl leading-[55px]`, { fontFamily: 'Heading' }]}>
              just say what you <Text style={tw`text-[#EBC351]`}>spent.</Text>
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={tw`mb-6`}>
            {/* User Message */}
            <View style={tw`bg-[#F84F4F] p-4 rounded-2xl rounded-tr-none self-end mb-2 max-w-[85%]`}>
              <Text style={tw`text-white font-medium`}>{item.description}</Text>
            </View>
            {/* AI Response */}
            <View style={tw`bg-[#121212] p-4 rounded-2xl rounded-tl-none self-start border border-[#222] max-w-[85%]`}>
              <Text style={tw`text-gray-400 leading-5`}>
                logged <Text style={tw`text-[#EBC351] font-bold`}>₱{item.amount.toLocaleString()}</Text> to Food. you're ₱200 <Text style={tw`text-[#F84F4F]`}>over</Text> your budget.
              </Text>
              <Text style={tw`text-gray-600 text-[8px] mt-2 uppercase`}>12:42 PM · Auto-Categorized</Text>
            </View>
          </View>
        )}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={tabBarHeight}>
        <View style={tw`p-4 bg-black border-t border-[#111]`}>
          <View style={tw`flex-row items-center bg-[#121212] rounded-full px-5 py-2 border border-[#222]`}>
            <TextInput
              style={tw`flex-1 text-white py-3`}
              placeholder="ask anything about your money..."
              placeholderTextColor="#444"
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity onPress={onSend} style={tw`bg-[#EBC351] h-10 w-10 rounded-full items-center justify-center`}>
              <Text style={tw`text-black text-xl`}>↑</Text>
            </TouchableOpacity>
          </View>
          <Text style={tw`text-center text-white text-[10px] mt-3 font-bold uppercase tracking-widest`}>
            no forms. no categories. <Text style={tw`text-[#EBC351]`}>no receipts.</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}