import { useFinanceStore } from '@/store/useFinanceStore';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

export default function Dashboard() {
  const store = useFinanceStore();
  const [refreshing, setRefreshing] = React.useState(false);

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

  const spendPercent = useMemo(() =>
    store.monthlyBudget > 0 ? Math.min(Math.round((store.currentSpend / store.monthlyBudget) * 100), 100) : 0
    , [store.currentSpend, store.monthlyBudget]);

  // Calculate daily allowance (assuming 30 days)
  const dailyAllowance = Math.max(0, Math.floor(store.bufferLeft / 15)).toLocaleString();

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <ScrollView
        contentContainerStyle={tw`p-5 pb-32`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EBC351" />}
      >
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-8`}>
          <TouchableOpacity
            onPress={() => router.push('/chat')}
            style={tw`bg-[#EBC351] px-6 py-3 rounded-2xl shadow-lg`}
          >
            <Text style={tw`text-black font-extrabold text-xs tracking-tighter`}>+ LOG SPEND</Text>
          </TouchableOpacity>
          <View style={tw`items-end`}>
            <Text style={tw`text-gray-600 text-[10px] uppercase font-bold tracking-widest`}>Asset Overview</Text>
            <Text style={[tw`text-white text-xl`, { fontFamily: 'Heading' }]}>MAY 2026</Text>
          </View>
        </View>

        {/* Total Liquidity */}
        <View style={tw`bg-[#121212] rounded-[40px] p-8 mb-4 border border-[#222]`}>
          <Text style={tw`text-[#EBC351] text-[10px] font-bold uppercase tracking-[3px]`}>Net Liquidity</Text>
          <Text style={[tw`text-white text-6xl mt-2`, { fontFamily: 'Heading' }]}>
            ₱{store.networth.toLocaleString()}
          </Text>

          <View style={tw`flex-row mt-8 pt-6 border-t border-[#222] justify-between`}>
            <View>
              <Text style={tw`text-gray-500 text-[9px] uppercase font-bold`}>Inflow</Text>
              <Text style={tw`text-white font-bold text-base`}>₱{(store.networth + store.currentSpend).toLocaleString()}</Text>
            </View>
            <View style={tw`items-end`}>
              <Text style={tw`text-gray-500 text-[9px] uppercase font-bold`}>Outflow</Text>
              <Text style={tw`text-[#F84F4F] font-bold text-base`}>₱{store.currentSpend.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Burn Rate Stats */}
        <View style={tw`flex-row justify-between mb-4`}>
          <SmallStat
            label="Safe Daily"
            value={`₱${dailyAllowance}`}
            sub="allowance"
          />
          <SmallStat
            label="Buffer"
            value={`₱${store.bufferLeft.toLocaleString()}`}
            sub="remaining"
            red={store.bufferLeft < 10000}
          />
          <SmallStat
            label="Status"
            value={spendPercent > 80 ? "Risky" : "Stable"}
            sub="efficiency"
          />
        </View>

        {/* Budget Visualization */}
        <View style={tw`bg-[#121212] rounded-[35px] p-7 mb-4 border border-[#222]`}>
          <View style={tw`flex-row justify-between items-end mb-5`}>
            <View>
              <Text style={tw`text-[#EBC351] text-[10px] font-bold uppercase mb-1`}>Monthly Ceiling</Text>
              <Text style={[tw`text-white text-3xl`, { fontFamily: 'Heading' }]}>
                {spendPercent}% <Text style={tw`text-gray-600 text-sm`}>utilized</Text>
              </Text>
            </View>
          </View>
          <View style={tw`h-1.5 w-full bg-[#222] rounded-full overflow-hidden`}>
            <View style={[tw`h-full bg-[#EBC351]`, { width: `${spendPercent}%` }]} />
          </View>
        </View>

        {/* Dynamic Category List */}
        <View style={tw`bg-[#121212] rounded-[35px] p-7 border border-[#222]`}>
          <Text style={tw`text-[#EBC351] text-[10px] font-bold uppercase mb-8 tracking-widest text-center`}>Category Distribution</Text>

          {store.categories.length > 0 ? store.categories.map((cat, i) => (
            <View key={i} style={tw`mb-6`}>
              <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-gray-400 text-xs font-bold`}>{cat.name.toUpperCase()}</Text>
                <Text style={[tw`text-white text-base`, { fontFamily: 'Heading' }]}>₱{cat.spent.toLocaleString()}</Text>
              </View>
              <View style={tw`h-[1px] w-full bg-[#333]`} />
            </View>
          )) : (
            <Text style={tw`text-gray-700 text-center py-10 italic`}>No data points discovered yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SmallStat = ({ label, value, sub, red }: any) => (
  <View style={tw`w-[31%] bg-[#121212] p-5 rounded-[25px] border border-[#222] items-center`}>
    <Text style={tw`text-gray-600 text-[7px] font-bold uppercase mb-2`}>{label}</Text>
    <Text style={[tw`${red ? 'text-[#F84F4F]' : 'text-white'} text-sm`, { fontFamily: 'Heading' }]}>{value}</Text>
    <Text style={tw`text-gray-700 text-[8px] mt-1`}>{sub}</Text>
  </View>
);