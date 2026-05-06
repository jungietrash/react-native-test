import React from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import tw from "twrnc";

interface NewBudgetProps {
    isVisible: boolean;
    onClose: () => void;
    newBudget: { title: string; limit: string };
    setNewBudget: (budget: { title: string; limit: string }) => void;
    onCreate: () => void;
}

export default function NewBudget({
    isVisible,
    onClose,
    newBudget,
    setNewBudget,
    onCreate,
}: NewBudgetProps) {
    return (
        <Modal visible={isVisible} animationType="fade" transparent onRequestClose={onClose}>
            <View style={tw`flex-1`}>
                <View style={tw`flex-1 justify-center bg-black/50 p-6`}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <View style={tw`bg-white p-8 rounded-3xl shadow-2xl`}>
                            <Text style={tw`text-2xl font-black mb-6 text-gray-900`}>New Wallet</Text>

                            <TextInput
                                placeholder="Budget Title"
                                placeholderTextColor="#9CA3AF"
                                style={tw`bg-gray-100 p-4 rounded-xl mb-4 text-gray-900 font-medium`}
                                onChangeText={(t) => setNewBudget({ ...newBudget, title: t })}
                                value={newBudget.title}
                            />

                            <TextInput
                                placeholder="Monthly Limit"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                                style={tw`bg-gray-100 p-4 rounded-xl mb-6 text-gray-900 font-bold`}
                                onChangeText={(t) => setNewBudget({ ...newBudget, limit: t })}
                                value={newBudget.limit}
                            />

                            <View style={tw`flex-row gap-3`}>
                                <TouchableOpacity
                                    style={tw`flex-1 bg-gray-100 p-4 rounded-xl items-center`}
                                    onPress={onClose}
                                >
                                    <Text style={tw`text-gray-500 font-bold`}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={tw`flex-2 bg-indigo-600 p-4 rounded-xl items-center`}
                                    onPress={onCreate}
                                >
                                    <Text style={tw`text-white font-bold`}>Create</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </View>
        </Modal>
    );
}