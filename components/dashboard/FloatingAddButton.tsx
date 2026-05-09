import { router } from "expo-router";
import React from "react";
import {
    Text,
    TouchableOpacity,
} from "react-native";
import tw from "twrnc";

export default function FloatingAddButton() {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
                router.push("/chat")
            }
            style={tw`absolute bottom-8 right-6 bg-[#EBC351] px-6 py-5 rounded-full shadow-2xl`}
        >
            <Text
                style={tw`text-black font-black text-xs`}
            >
                + ADD
            </Text>
        </TouchableOpacity>
    );
}