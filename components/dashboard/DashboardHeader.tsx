import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";

export default function DashboardHeader() {
    const now = new Date();

    const monthYear = now.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    const dayName = now.toLocaleString("default", {
        weekday: "long",
    });

    return (
        <View style={tw`mb-8`}>
            {/* TOP ROW */}
            <View style={tw`flex-row items-center justify-between`}>
                <View>
                    <Text style={tw`text-gray-500 text-[10px] uppercase tracking-widest`}>
                        Financial Overview
                    </Text>

                    <Text
                        style={[
                            tw`text-white text-3xl mt-1`,
                            { fontFamily: "Heading" },
                        ]}
                    >
                        {monthYear}
                    </Text>
                </View>

                {/* STATUS DOT */}
                <View style={tw`items-end`}>
                    <View style={tw`flex-row items-center`}>
                        <View style={tw`w-2 h-2 bg-[#22C55E] rounded-full mr-2`} />
                        <Text style={tw`text-gray-400 text-xs`}>
                            Active
                        </Text>
                    </View>

                    <Text style={tw`text-gray-600 text-[10px] mt-1`}>
                        {dayName}
                    </Text>
                </View>
            </View>

        </View>
    );
}