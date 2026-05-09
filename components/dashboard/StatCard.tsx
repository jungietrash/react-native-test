import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";

interface Props {
    label: string;
    value: string;
    hint?: string;
    icon?: React.ReactNode;
    green?: boolean;
    red?: boolean;
}

export default function StatCard({
    label,
    value,
    hint,
    icon,
    green,
    red,
}: Props) {
    return (
        <View
            style={tw`bg-[#161616] rounded-[28px] p-5 border border-[#232323]`}
        >
            {/* HEADER */}
            <View style={tw`flex-row items-center mb-3`}>
                {icon ? (
                    <View style={tw`mr-2`}>
                        {icon}
                    </View>
                ) : null}

                <Text style={tw`text-gray-500 text-[10px] uppercase`}>
                    {label}
                </Text>
            </View>

            {/* VALUE */}
            <Text
                style={[
                    tw`text-lg font-bold`,
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

            {/* HINT */}
            {hint ? (
                <Text style={tw`text-gray-600 text-[10px] mt-1`}>
                    {hint}
                </Text>
            ) : null}
        </View>
    );
}