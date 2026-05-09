import React from "react";
import { View } from "react-native";
import tw from "twrnc";
import StatCard from "./StatCard";

interface StatItem {
    label: string;
    value: string;
    hint?: string;
    icon?: React.ReactNode;
    green?: boolean;
    red?: boolean;
}

interface Props {
    stats: StatItem[];
}

export default function QuickStatsGrid({ stats }: Props) {
    return (
        <View style={tw`flex-row flex-wrap justify-between mb-2`}>
            {stats.map((stat, index) => (
                <View
                    key={index}
                    style={tw`w-[48%] mb-4`}
                >
                    <StatCard {...stat} />
                </View>
            ))}
        </View>
    );
}