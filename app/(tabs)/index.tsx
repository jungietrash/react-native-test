import { useFinanceStore } from '@/store/useFinanceStore';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function Dashboard() {
  const store = useFinanceStore();
  const spendPercent = Math.round((store.currentSpend / store.monthlyBudget) * 100);

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <ScrollView contentContainerStyle={tw`p-5 pb-32`}>
        {/* Header Area */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <TouchableOpacity onPress={() => router.push('/chat')} style={tw`flex-row items-center`}>
            <Text style={tw`text-[#EBC351] text-sm`}>← Chat</Text>
          </TouchableOpacity>
          <View style={tw`items-end`}>
            <Text style={tw`text-[#EBC351] text-[10px] uppercase font-bold`}>Dashboard</Text>
            <Text style={[tw`text-white text-lg`, { fontFamily: 'Heading' }]}>may 2026</Text>
          </View>
        </View>

        {/* Net Worth Hero */}
        <View style={tw`bg-[#121212] rounded-3xl p-6 mb-4 border border-[#222]`}>
          <Text style={tw`text-[#EBC351] text-[10px] font-bold uppercase tracking-widest`}>Net Worth</Text>
          <Text style={[tw`text-white text-5xl mt-1`, { fontFamily: 'Heading' }]}>
            ₱{store.networth.toLocaleString()}
          </Text>
          <Text style={tw`text-[#EBC351] text-xs mt-2`}>↑ ₱8,200 this month</Text>
        </View>

        {/* Monthly Spend Card */}
        <View style={tw`bg-[#121212] rounded-3xl p-6 mb-4 border border-[#222]`}>
          <View style={tw`flex-row justify-between items-end mb-4`}>
            <View>
              <Text style={tw`text-[#EBC351] text-[10px] font-bold uppercase`}>This Month — Spend</Text>
              <Text style={[tw`text-white text-2xl mt-1`, { fontFamily: 'Heading' }]}>
                ₱{store.currentSpend.toLocaleString()} <Text style={tw`text-gray-500 text-sm`}>of ₱{store.monthlyBudget / 1000}k budget</Text>
              </Text>
            </View>
            <Text style={tw`text-white font-bold text-lg`}>{spendPercent}%</Text>
          </View>
          {/* Custom Progress Bar */}
          <View style={tw`h-1.5 w-full bg-[#222] rounded-full overflow-hidden`}>
            <View style={[tw`h-full bg-[#EBC351]`, { width: `${spendPercent}%` }]} />
          </View>
        </View>

        {/* Three-Column Stats */}
        <View style={tw`flex-row justify-between mb-8`}>
          <SmallStat label="Till Payday" value="12 days" sub="may 20" />
          <SmallStat label="Buffer Left" value={`₱${store.bufferLeft.toLocaleString()}`} sub="spendable" red />
          <SmallStat label="Save Streak" value={`${store.saveStreakMonths} mo`} sub="on track" />
        </View>

        {/* Top Categories Interactive List */}
        <View style={tw`bg-[#121212] rounded-3xl p-6 border border-[#222]`}>
          <Text style={tw`text-[#EBC351] text-[10px] font-bold uppercase mb-6`}>Top Categories</Text>
          {store.categories.map((cat, i) => (
            <View key={i} style={tw`flex-row items-center mb-5`}>
              <Text style={tw`text-white flex-1 text-sm`}>{cat.name}</Text>
              <View style={tw`h-1.5 w-24 bg-[#222] rounded-full mx-4 overflow-hidden`}>
                <View style={[tw`h-full bg-[#EBC351]`, { width: `${(cat.spent / 10000) * 100}%` }]} />
              </View>
              <Text style={[tw`text-white text-sm font-bold`, { fontFamily: 'Heading' }]}>₱{cat.spent.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SmallStat = ({ label, value, sub, red }: any) => (
  <View style={tw`w-[31%] bg-[#121212] p-3 rounded-2xl border border-[#222]`}>
    <Text style={tw`text-gray-500 text-[8px] font-bold uppercase mb-1`}>{label}</Text>
    <Text style={[tw`${red ? 'text-[#F84F4F]' : 'text-white'} text-base`, { fontFamily: 'Heading' }]}>{value}</Text>
    <Text style={tw`text-gray-600 text-[9px]`}>{sub}</Text>
  </View>
);