// app/onboarding.tsx

import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import tw from 'twrnc';

export default function OnboardingScreen() {
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);

    const completeOnboarding = async () => {
        try {
            if (!displayName.trim()) {
                Alert.alert('Missing Name', 'Please enter your display name.');
                return;
            }

            setLoading(true);

            // Get authenticated user
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error('User session not found.');
            }

            // Upsert profile
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    display_name: displayName.trim(),
                    updated_at: new Date().toISOString(),
                });

            if (profileError) {
                throw profileError;
            }

            // Optional: also save to auth metadata
            await supabase.auth.updateUser({
                data: {
                    display_name: displayName.trim(),
                },
            });

            // Redirect to app
            router.replace('/(tabs)/chat');
        } catch (error: any) {
            console.error('[ONBOARDING ERROR]', error);

            Alert.alert(
                'Setup Failed',
                error?.message || 'Could not complete onboarding.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={tw`flex-1 bg-black justify-center px-6`}
        >
            {/* Logo / Title */}
            <View style={tw`mb-10`}>
                <Text
                    style={tw`text-white text-4xl font-bold mb-2`}
                >
                    Welcome to FinAI
                </Text>

                <Text
                    style={tw`text-[#8E8E93] text-base`}
                >
                    Let’s set up your profile.
                </Text>
            </View>

            {/* Name Input */}
            <View style={tw`mb-6`}>
                <Text
                    style={tw`text-white mb-2 text-sm font-medium`}
                >
                    Display Name
                </Text>

                <TextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter your name"
                    placeholderTextColor="#666"
                    autoCapitalize="words"
                    style={tw`
            bg-[#1C1C1E]
            text-white
            px-4
            py-4
            rounded-2xl
            text-base
            border
            border-[#2C2C2E]
          `}
                />
            </View>

            {/* Continue Button */}
            <TouchableOpacity
                onPress={completeOnboarding}
                disabled={loading}
                style={tw`
          bg-[#EBC351]
          py-4
          rounded-2xl
          items-center
          justify-center
        `}
            >
                {loading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text
                        style={tw`text-black font-bold text-base`}
                    >
                        Continue
                    </Text>
                )}
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}