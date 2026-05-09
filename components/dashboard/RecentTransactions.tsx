import { useFinanceStore } from "@/store/useFinanceStore";
import { getCategoryEmoji } from "@/utils/finance";
import React, {
    useMemo,
} from "react";
import {
    Text,
    View,
} from "react-native";
import tw from "twrnc";

export default function RecentTransactions() {
    const store = useFinanceStore();

    const recentTransactions =
        useMemo(() => {
            return store.transactions.slice(
                0,
                6
            );
        }, [store.transactions]);

    return (
        <View
            style={tw`bg-[#121212] rounded-[35px] p-6 border border-[#222]`}
        >
            <View
                style={tw`flex-row justify-between items-center mb-6`}
            >
                <Text
                    style={tw`text-[#EBC351] text-xs font-bold uppercase`}
                >
                    Recent Transactions
                </Text>

                <Text
                    style={tw`text-gray-500 text-xs`}
                >
                    {
                        store.transactions
                            .length
                    }{" "}
                    total
                </Text>
            </View>

            {recentTransactions.length >
                0 ? (
                recentTransactions.map(
                    (tx) => (
                        <View
                            key={tx.id}
                            style={tw`flex-row justify-between items-center py-4 border-b border-[#1E1E1E]`}
                        >
                            <View
                                style={tw`flex-row items-center flex-1`}
                            >
                                <View
                                    style={tw`w-12 h-12 rounded-2xl bg-[#1C1C1C] items-center justify-center mr-4`}
                                >
                                    <Text
                                        style={tw`text-lg`}
                                    >
                                        {getCategoryEmoji(
                                            tx.category
                                        )}
                                    </Text>
                                </View>

                                <View
                                    style={tw`flex-1`}
                                >
                                    <Text
                                        style={tw`text-white font-semibold`}
                                        numberOfLines={
                                            1
                                        }
                                    >
                                        {
                                            tx.description
                                        }
                                    </Text>

                                    <Text
                                        style={tw`text-gray-500 text-xs mt-1`}
                                    >
                                        {
                                            tx.category
                                        }{" "}
                                        •{" "}
                                        {new Date(
                                            tx.created_at
                                        ).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>

                            <Text
                                style={[
                                    tw`font-bold text-base`,
                                    {
                                        color:
                                            tx.type ===
                                                "income"
                                                ? "#22C55E"
                                                : "#EF4444",
                                    },
                                ]}
                            >
                                {tx.type ===
                                    "income"
                                    ? "+"
                                    : "-"}
                                ₱
                                {tx.amount.toLocaleString()}
                            </Text>
                        </View>
                    )
                )
            ) : (
                <Text
                    style={tw`text-gray-600 text-center py-10`}
                >
                    No transactions found.
                </Text>
            )}
        </View>
    );
}