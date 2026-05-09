import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";

interface Props {
    label: string;
    value: string;
    green?: boolean;
    red?: boolean;
}

export default function StatCard({
    label,
    value,
    green,
    red,
}: Props) {
    return (
        <View
            style={tw`w-[48%] bg-[#161616] rounded-[28px] p-5 border border-[#232323] mb-4`}
        >
            <Text
                style={tw`text-gray-500 text-[10px] uppercase mb-3`}
            >
                {label}
            </Text>

            <Text
                style={[
                    tw`text-lg`,
                    {
                        fontFamily: "Heading",
                        color: green
                            ? "#22C55E"
                            : red
                                ? "#EF4444"
                                : "white",
                    },
                ]}
                numberOfLines={1}
            >
                {value}
            </Text>
        </View>
    );
}