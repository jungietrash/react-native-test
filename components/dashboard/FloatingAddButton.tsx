import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import tw from "twrnc";

export default function FloatingAddButton() {
    return (
        <View
            style={tw`absolute bottom-8 right-6 items-center`}
        >
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push("/chat")}
                style={tw`
          w-14 h-14 
          bg-[#EBC351] 
          rounded-full 
          items-center 
          justify-center 
          shadow-2xl
          border border-[#fff2]
        `}
            >
                <Ionicons name="add" size={26} color="black" />
            </TouchableOpacity>

        </View>
    );
}