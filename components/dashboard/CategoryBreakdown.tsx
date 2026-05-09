import { useFinanceStore } from "@/store/useFinanceStore";
import { getCategoryEmoji } from "@/utils/finance";
import React from "react";
import {
    Text,
    View,
} from "react-native";
import tw from "twrnc";

export default function CategoryBreakdown() {
    const store = useFinanceStore();

    return (
        <View
            style={tw`bg-[#121212] rounded-[35px] p-6 border border-[#222] mb-5`}
        >
            <View
                style={tw`flex-row justify-between items-center mb-6`}
            >
                <Text
                    style={tw`text-[#EBC351] text-xs font-bold uppercase`}
                >
                    Spending Breakdown
                </Text>

                <Text
                    style={tw`text-gray-500 text-xs`}
                >
                    {
                        store.categories.length
                    }{" "}
                    categories
                </Text>
            </View>

            {store.categories.length >
                0 ? (
                store.categories.map(
                    (cat, i) => {
                        const percentage =
                            store.currentSpend >
                                0
                                ? Math.round(
                                    (cat.spent /
                                        store.currentSpend) *
                                    100
                                )
                                : 0;

                        return (
                            <View
                                key={i}
                                style={tw`mb-6`}
                            >
                                <View
                                    style={tw`flex-row justify-between items-center mb-2`}
                                >
                                    <View
                                        style={tw`flex-row items-center`}
                                    >
                                        <Text
                                            style={tw`mr-2 text-base`}
                                        >
                                            {getCategoryEmoji(
                                                cat.name
                                            )}
                                        </Text>

                                        <Text
                                            style={tw`text-gray-300 font-semibold`}
                                        >
                                            {cat.name}
                                        </Text>
                                    </View>

                                    <Text
                                        style={tw`text-white font-bold`}
                                    >
                                        ₱
                                        {cat.spent.toLocaleString()}
                                    </Text>
                                </View>

                                <View
                                    style={tw`h-2 bg-[#1D1D1D] rounded-full overflow-hidden`}
                                >
                                    <View
                                        style={[
                                            tw`h-full bg-[#EBC351] rounded-full`,
                                            {
                                                width: `${percentage}%`,
                                            },
                                        ]}
                                    />
                                </View>

                                <Text
                                    style={tw`text-gray-500 text-xs mt-2`}
                                >
                                    {percentage}% of
                                    total spending
                                </Text>
                            </View>
                        );
                    }
                )
            ) : (
                <Text
                    style={tw`text-gray-600 text-center py-10`}
                >
                    No expense data yet.
                </Text>
            )}
        </View>
    );
}