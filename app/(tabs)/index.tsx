import { useFinanceStore } from '@/store/useFinanceStore';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function Dashboard() {
  const store = useFinanceStore();
  const [refreshing, setRefreshing] = React.useState(false);

  // useFocusEffect ensures data refreshes every time you navigate back from the Chat
  useFocusEffect(
    useCallback(() => {
      store.fetchInitialData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await store.fetchInitialData();
    setRefreshing(false);
  };

  const spendPercent = store.monthlyBudget > 0
    ? Math.min(Math.round((store.currentSpend / store.monthlyBudget) * 100), 100)
    : 0;

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <ScrollView
        contentContainerStyle={tw`p-5 pb-32`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EBC351" />}
      >
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <TouchableOpacity onPress={() => router.push('/chat')} style={tw`bg-[#121212] px-4 py-2 rounded-full border border-[#222]`}>
            <Text style={tw`text-[#EBC351] text-xs font-bold`}>+ LOG TRANSACTION</Text>
          </TouchableOpacity>
          <View style={tw`items-end`}>
            <Text style={tw`text-[#EBC351] text-[10px] uppercase font-bold`}>Financial Status</Text>
            <Text style={[tw`text-white text-lg`, { fontFamily: 'Heading' }]}>may 2026</Text>
          </View>
        </View>

        {/* Balance Hero */}
        <View style={tw`bg-[#121212] rounded-3xl p-6 mb-4 border border-[#222]`}>
          <Text style={tw`text-gray-500 text-[10px] font-bold uppercase tracking-widest`}>Total Balance</Text>
          <Text style={[tw`text-white text-5xl mt-1`, { fontFamily: 'Heading' }]}>
            ₱{store.networth.toLocaleString()}
          </Text>
          <View style={tw`flex-row mt-4 gap-x-4`}>
            <View>
              <Text style={tw`text-gray-500 text-[8px] uppercase`}>Monthly Income</Text>
              <Text style={tw`text-green-500 font-bold`}>₱{(store.networth + store.currentSpend).toLocaleString()}</Text>
            </View>
            <View>
              <Text style={tw`text-gray-500 text-[8px] uppercase`}>Monthly Out</Text>
              <Text style={tw`text-[#F84F4F] font-bold`}>₱{store.currentSpend.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Budget Progress */}
        <View style={tw`bg-[#121212] rounded-3xl p-6 mb-4 border border-[#222]`}>
          <View style={tw`flex-row justify-between items-end mb-4`}>
            <View>
              <Text style={tw`text-[#EBC351] text-[10px] font-bold uppercase`}>Budget Usage</Text>
              <Text style={[tw`text-white text-2xl mt-1`, { fontFamily: 'Heading' }]}>
                ₱{store.currentSpend.toLocaleString()} <Text style={tw`text-gray-500 text-sm`}>/ ₱{store.monthlyBudget.toLocaleString()}</Text>
              </Text>
            </View>
            <Text style={tw`text-white font-bold text-lg`}>{spendPercent}%</Text>
          </View>
          <View style={tw`h-2 w-full bg-[#222] rounded-full overflow-hidden`}>
            <View style={[tw`h-full bg-[#EBC351]`, { width: `${spendPercent}%` }]} />
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={tw`flex-row justify-between mb-8`}>
          <SmallStat label="Days Left" value="12" sub="until payday" />
          <SmallStat label="Remaining" value={`₱${store.bufferLeft.toLocaleString()}`} sub="safe to spend" red={store.bufferLeft < 5000} />
          {/* <SmallStat label="Streak" value={`${store.saveStreakMonths || 1} mo`} sub="saving well" /> */}
        </View>

        {/* Category Breakdown */}
        <View style={tw`bg-[#121212] rounded-3xl p-6 border border-[#222]`}>
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <Text style={tw`text-[#EBC351] text-[10px] font-bold uppercase`}>Spending by Category</Text>
            <Text style={tw`text-gray-500 text-[10px]`}>Highest First</Text>
          </View>

          {store.categories.length > 0 ? store.categories.map((cat, i) => (
            <View key={i} style={tw`mb-5`}>
              <View style={tw`flex-row justify-between mb-1`}>
                <Text style={tw`text-white text-sm`}>{cat.name}</Text>
                <Text style={[tw`text-white text-sm font-bold`, { fontFamily: 'Heading' }]}>₱{cat.spent.toLocaleString()}</Text>
              </View>
              <View style={tw`h-1 w-full bg-[#222] rounded-full overflow-hidden`}>
                <View
                  style={[
                    tw`h-full bg-[#EBC351]`,
                    { width: `${Math.min((cat.spent / store.monthlyBudget) * 100, 100)}%` }
                  ]}
                />
              </View>
            </View>
          )) : (
            <Text style={tw`text-gray-600 text-center py-4`}>No expenses logged yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SmallStat = ({ label, value, sub, red }: any) => (
  <View style={tw`w-[31%] bg-[#121212] p-4 rounded-2xl border border-[#222]`}>
    <Text style={tw`text-gray-500 text-[8px] font-bold uppercase mb-1`}>{label}</Text>
    <Text style={[tw`${red ? 'text-[#F84F4F]' : 'text-white'} text-lg`, { fontFamily: 'Heading' }]}>{value}</Text>
    <Text style={tw`text-gray-600 text-[9px]`}>{sub}</Text>
  </View>
);