import React from "react";
import {
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import tw from "twrnc";

interface Props {
    visible: boolean;
    value: string;
    onChange: (text: string) => void;
    onClose: () => void;
    onSave: () => void;
}

export default function BudgetModal({
    visible,
    value,
    onChange,
    onClose,
    onSave,
}: Props) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View
                style={tw`flex-1 bg-black/80 justify-center items-center px-6`}
            >
                <View
                    style={tw`w-full bg-[#111] rounded-[35px] p-7 border border-[#222]`}
                >
                    <Text
                        style={[
                            tw`text-white text-2xl mb-2`,
                            {
                                fontFamily: "Heading",
                            },
                        ]}
                    >
                        Edit Monthly Budget
                    </Text>

                    <Text
                        style={tw`text-gray-500 mb-6`}
                    >
                        Set your monthly spending limit.
                    </Text>

                    <View
                        style={tw`bg-[#1A1A1A] rounded-2xl px-5 py-4 border border-[#2A2A2A]`}
                    >
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            placeholder="100000"
                            placeholderTextColor="#555"
                            style={[
                                tw`text-white text-2xl`,
                                {
                                    fontFamily: "Heading",
                                },
                            ]}
                        />
                    </View>

                    <View
                        style={tw`flex-row justify-between mt-7`}
                    >
                        <TouchableOpacity
                            onPress={onClose}
                            style={tw`bg-[#1C1C1C] py-4 rounded-2xl flex-1 mr-2`}
                        >
                            <Text
                                style={tw`text-white text-center font-bold`}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onSave}
                            style={tw`bg-[#EBC351] py-4 rounded-2xl flex-1 ml-2`}
                        >
                            <Text
                                style={tw`text-black text-center font-black`}
                            >
                                Save Budget
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}