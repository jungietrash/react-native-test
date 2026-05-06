import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInRight,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

// --- DATA TYPES (Fundamental: TypeScript Interfaces) ---
interface BankCard {
  id: string;
  bank: string;
  number: string;
  balance: string;
  expiry: string;
  colors: [string, string];
  type: 'visa' | 'mastercard';
}

const CARDS: BankCard[] = [
  { id: '1', bank: 'Apple Card', number: '•••• 4242', balance: '12,450.00', expiry: '09/28', colors: ['#0F172A', '#334155'], type: 'visa' },
  { id: '2', bank: 'Gold Savings', number: '•••• 8812', balance: '3,120.50', expiry: '12/27', colors: ['#1E3A8A', '#3B82F6'], type: 'mastercard' },
];

export default function ExploreDashboard(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  // Fundamental: Shared Value for micro-interactions
  const pressScale = useSharedValue(1);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const animatedPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(pressScale.value) }]
  }));

  return (
    <ScrollView
      style={tw`flex-1 bg-white`}
      contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 100 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={tw.color('indigo-600')}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* 1. HEADER (Fundamental: Layout & Safe Areas) */}
      <View style={tw`px-6 flex-row justify-between items-center mb-8`}>
        <View>
          <Text style={tw`text-gray-400 font-bold text-[10px] uppercase tracking-[1.5px]`}>Welcome Back</Text>
          <Text style={tw`text-3xl font-black text-black tracking-tighter`}>Dashboard</Text>
        </View>
        <TouchableOpacity
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          style={tw`bg-gray-100 w-11 h-11 items-center justify-center rounded-full`}
        >
          <Ionicons name="notifications-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>

      {/* 2. ATM CARDS (Fundamental: Horizontal Paging & Linear Gradients) */}
      <View style={tw`mb-10`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.85 + 16}
          decelerationRate="fast"
          contentContainerStyle={tw`px-6 gap-4`}
        >
          {CARDS.map((card, index) => (
            <Animated.View
              key={card.id}
              entering={FadeInRight.delay(index * 200).springify()}
              style={[tw`w-[${width * 0.85}px] h-52 rounded-[28px] overflow-hidden shadow-xl shadow-black/15`]}
            >
              <LinearGradient
                colors={card.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={tw`flex-1 p-7 justify-between`}
              >
                <View style={tw`flex-row justify-between items-start`}>
                  <View>
                    <Text style={tw`text-white/60 text-[10px] font-bold uppercase tracking-widest`}>{card.bank}</Text>
                    <Text style={tw`text-white font-bold text-lg`}>Premium Credit</Text>
                  </View>
                  <Ionicons name="wifi-outline" size={24} color="white" style={[tw`opacity-60`, { transform: [{ rotate: '90deg' }] }]} />
                </View>

                <View>
                  <Text style={tw`text-white font-medium text-xl tracking-[4px] mb-5`}>{card.number}</Text>
                  <View style={tw`flex-row justify-between items-end`}>
                    <View>
                      <Text style={tw`text-white/50 text-[9px] font-bold uppercase`}>Available Balance</Text>
                      <Text style={tw`text-white font-black text-2xl tracking-tighter`}>${card.balance}</Text>
                    </View>
                    <View style={tw`items-end`}>
                      <Text style={tw`text-white font-bold text-xs mb-1`}>{card.expiry}</Text>
                      {card.type === 'visa' ? (
                        <Text style={tw`text-white font-black italic text-xl`}>VISA</Text>
                      ) : (
                        <View style={tw`flex-row gap-[-8px]`}>
                          <View style={tw`w-6 h-6 rounded-full bg-red-500 opacity-90`} />
                          <View style={tw`w-6 h-6 rounded-full bg-yellow-500 opacity-90`} />
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* 3. QUICK ACTIONS (Fundamental: Grid Math & Interaction Design) */}
      <View style={tw`px-6 mb-10`}>
        <Text style={tw`text-black font-black text-xl tracking-tight mb-4`}>Quick Actions</Text>
        <View style={tw`flex-row flex-wrap gap-4`}>
          {[
            { label: 'Send', icon: 'paper-plane-outline', color: 'indigo-600' },
            { label: 'Pay', icon: 'wallet-outline', color: 'blue-500' },
            { label: 'Top Up', icon: 'add-outline', color: 'emerald-500' },
            { label: 'Stats', icon: 'bar-chart-outline', color: 'slate-600' }
          ].map((action, i) => (
            <Animated.View key={i} entering={FadeInUp.delay(i * 100)}>
              <TouchableOpacity
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                activeOpacity={0.7}
                style={tw`bg-gray-50 w-[${(width - 64) / 2}px] p-5 rounded-[24px] border border-gray-100 items-center`}
              >
                <View style={tw`bg-white w-12 h-12 rounded-2xl shadow-sm mb-3 items-center justify-center`}>
                  <Ionicons name={action.icon as any} size={22} color={tw.color(action.color)} />
                </View>
                <Text style={tw`text-gray-900 font-bold text-sm`}>{action.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* 4. RECENT TRANSACTIONS (Fundamental: List Rendering & Conditional Styling) */}
      <View style={tw`px-6`}>
        <View style={tw`flex-row justify-between items-center mb-5`}>
          <Text style={tw`text-black font-black text-xl tracking-tight`}>Transactions</Text>
          <TouchableOpacity>
            <Text style={tw`text-blue-500 font-bold text-sm`}>View All</Text>
          </TouchableOpacity>
        </View>

        {[
          { name: 'Apple Store', date: 'Today, 10:45 AM', amount: '-$1,299.00', icon: 'logo-apple' },
          { name: 'Starbucks', date: 'Yesterday, 08:20 AM', amount: '-$12.50', icon: 'cafe-outline' },
          { name: 'Monthly Salary', date: 'May 01', amount: '+$4,500.00', icon: 'cash-outline', green: true },
        ].map((tx, i) => (
          <Pressable
            key={i}
            onPress={() => Haptics.selectionAsync()}
            style={({ pressed }) => [
              tw`flex-row items-center py-4 border-b border-gray-50`,
              pressed && tw`bg-gray-50 -mx-4 px-4 rounded-xl`
            ]}
          >
            <View style={tw`bg-gray-100 w-12 h-12 rounded-2xl items-center justify-center mr-4`}>
              <Ionicons name={tx.icon as any} size={20} color="black" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-black font-bold text-[15px]`}>{tx.name}</Text>
              <Text style={tw`text-gray-400 text-xs mt-0.5`}>{tx.date}</Text>
            </View>
            <Text style={[tw`font-black text-[15px]`, tx.green ? tw`text-emerald-500` : tw`text-black`]}>
              {tx.amount}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}