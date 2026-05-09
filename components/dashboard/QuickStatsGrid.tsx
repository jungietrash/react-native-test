import React from "react";
import { View } from "react-native";
import tw from "twrnc";
import StatCard from "./StatCard";

interface Props {
    stats: {
        label: string;
        value: string;
        green?: boolean;
        red?: boolean;
    }[];
}

export default function QuickStatsGrid({
    stats,
}: Props) {
    return (
        <View
            style={tw`flex-row flex-wrap justify-between mb-2`}
        >
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    {...stat}
                />
            ))}
        </View>
    );
}