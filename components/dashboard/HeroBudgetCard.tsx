import React from "react";
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import tw from "twrnc";

interface Props {
    bufferLeft: number;
    budgetHealth: {
        label: string;
        color: string;
    };
    spendPercent: number;
    monthlyBudget: number;
    dailySafeSpend: number;
    onEditBudget: () => void;
}

export default function HeroBudgetCard({
    bufferLeft,
    budgetHealth,
    spendPercent,
    monthlyBudget,
    dailySafeSpend,
    onEditBudget,
}: Props) {
    return (
        <View
            style={tw`bg-[#101010] rounded-[40px] p-7 border border-[#1C1C1C] mb-5`}
        >
            <View
                style={tw`flex-row justify-between items-start`}
            >
                <View>
                    <Text
                        style={tw`text-[#EBC351] text-[11px] uppercase font-bold`}
                    >
                        Remaining Budget
                    </Text>

                    <Text
                        style={[
                            tw`text-white text-5xl mt-3`,
                            {
                                fontFamily: "Heading",
                            },
                        ]}
                    >
                        ₱
                        {bufferLeft.toLocaleString()}
                    </Text>
                </View>

                <View
                    style={tw`bg-[#171717] px-4 py-3 rounded-2xl border border-[#252525] absolute top-0 right-0`}
                >
                    <Text
                        style={tw`text-gray-500 text-[9px] uppercase`}
                    >
                        Health
                    </Text>

                    <Text
                        style={[
                            tw`font-bold text-sm mt-1`,
                            {
                                color:
                                    budgetHealth.color,
                            },
                        ]}
                    >
                        {budgetHealth.label}
                    </Text>
                </View>
            </View>

            <View style={tw`mt-8`}>
                <View
                    style={tw`flex-row justify-between mb-2`}
                >
                    <Text
                        style={tw`text-gray-500 text-xs`}
                    >
                        Budget Usage
                    </Text>

                    <Text
                        style={tw`text-white font-bold`}
                    >
                        {spendPercent}%
                    </Text>
                </View>

                <View
                    style={tw`h-3 bg-[#1C1C1C] rounded-full overflow-hidden`}
                >
                    <View
                        style={[
                            tw`h-full rounded-full`,
                            {
                                width: `${spendPercent}%`,
                                backgroundColor:
                                    spendPercent >= 90
                                        ? "#EF4444"
                                        : "#EBC351",
                            },
                        ]}
                    />
                </View>
            </View>

            <View
                style={tw`flex-row justify-between mt-8 pt-6 border-t border-[#1F1F1F]`}
            >
                <TouchableOpacity
                    onPress={onEditBudget}
                >
                    <Text
                        style={tw`text-white text-lg font-bold mt-1`}
                    >
                        ₱
                        {monthlyBudget.toLocaleString()}
                    </Text>

                    <Text
                        style={tw`text-gray-600 text-[10px] mt-1`}
                    >
                        Tap to edit
                    </Text>
                </TouchableOpacity>

                <View style={tw`items-end`}>
                    <Text
                        style={tw`text-gray-500 text-[10px] uppercase`}
                    >
                        Daily Safe Spend
                    </Text>

                    <Text
                        style={tw`text-white text-lg font-bold mt-1`}
                    >
                        ₱
                        {dailySafeSpend.toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    );
}