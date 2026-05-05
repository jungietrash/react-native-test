import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

interface ScannerProps {
    onScanResult: (data: { name: string; amount: number }) => void;
    mode: 'camera' | 'library';
    onClose: () => void;
}

export const ReceiptScanner = ({ onScanResult, mode, onClose }: ScannerProps) => {
    const [loading, setLoading] = useState(false);

    const handleProcess = async () => {
        const permission = mode === 'camera'
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Permission Denied", "We need access to your camera/photos to scan receipts.");
            return;
        }

        const result = mode === 'camera'
            ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.5 })
            : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.5 });

        if (!result.canceled) {
            setLoading(true);
            // SIMULATING AI OCR LOGIC
            setTimeout(() => {
                onScanResult({ name: "Detected Merchant", amount: 24.99 });
                setLoading(false);
                onClose();
            }, 2000);
        }
    };

    // Run automatically when the choice is made
    React.useEffect(() => {
        handleProcess();
    }, [mode]);

    if (loading) {
        return (
            <TouchableOpacity style={tw`bg-black w-16 h-16 rounded-2xl items-center justify-center absolute bottom-10 right-6`}>
                <ActivityIndicator color="white" />
            </TouchableOpacity>
        );
    }

    return null;
};