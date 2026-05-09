import { router } from "expo-router";
import React from "react";
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import tw from "twrnc";

export default function DashboardHeader() {
    return (
        <View
            style={tw`flex-row justify-between items-center mb-8`}
        >
            <View>
                <Text
                    style={tw`text-gray-500 text-xs uppercase tracking-widest`}
                >
                    Budget Dashboard
                </Text>

                <Text
                    style={[
                        tw`text-white text-3xl mt-1`,
                        {
                            fontFamily: "Heading",
                        },
                    ]}
                >
                    {new Date().toLocaleString(
                        "default",
                        {
                            month: "long",
                            year: "numeric",
                        }
                    )}
                </Text>
            </View>

            <TouchableOpacity
                onPress={() =>
                    router.push("/chat")
                }
                style={tw`bg-[#EBC351] px-5 py-4 rounded-3xl`}
            >
                <Text
                    style={tw`text-black font-black text-xs`}
                >
                    + ADD
                </Text>
            </TouchableOpacity>
        </View>
    );
}