import React from 'react';
import {
    Modal,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import tw from 'twrnc';

export const StatusModal = ({ visible, title, message, onClose }: any) => (
    <Modal visible={visible} transparent animationType="fade">
        <View style={tw`flex-1 justify-center items-center bg-black/80 px-6`}>
            <View style={tw`bg-[#121212] border border-[#222] p-8 rounded-3xl w-full max-w-sm`}>
                <Text style={[tw`text-white text-2xl mb-2`, { fontFamily: 'Heading' }]}>{title}</Text>
                <Text style={tw`text-gray-400 mb-6 text-base`}>{message}</Text>
                <TouchableOpacity
                    onPress={onClose}
                    style={tw`bg-[#EBC351] p-4 rounded-xl items-center`}
                >
                    <Text style={tw`text-black font-bold`}>Got it</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);