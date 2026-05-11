import { StatusModal } from '@/components/modals/StatusModal';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import tw from 'twrnc';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // UI Toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Modal State
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });

    // Memoized styles for performance during rapid text input
    const inputStyle = useMemo(() => tw`bg-[#121212] border border-[#222] p-4 rounded-2xl text-white text-lg`, []);

    const validate = useCallback(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            setModal({ visible: true, title: 'Invalid Email', message: 'Please enter a valid email address.' });
            return false;
        }
        if (password.length < 6) {
            setModal({ visible: true, title: 'Weak Password', message: 'Password must be at least 6 characters long.' });
            return false;
        }
        if (password !== confirmPassword) {
            setModal({ visible: true, title: 'Password Mismatch', message: 'Your passwords do not match. Please try again.' });
            return false;
        }
        return true;
    }, [email, password, confirmPassword]);

    const handleSignUp = useCallback(async () => {
        if (!validate()) return;

        setLoading(true);
        Keyboard.dismiss();

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password
            });

            if (error) throw error;

            // Supabase requires email verification by default
            if (data.user && !data.session) {
                setModal({
                    visible: true,
                    title: 'Check Your Inbox',
                    message: 'We sent you a verification link. Please verify your email to log in.'
                });
                // Optionally clear form or redirect after a delay
            } else {
                router.replace('/');
            }
        } catch (err: any) {
            setModal({
                visible: true,
                title: 'Registration Error',
                message: err.message || 'Unable to create an account. Please try again later.'
            });
        } finally {
            setLoading(false);
        }
    }, [email, password, validate]);

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <StatusModal
                visible={modal.visible}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, visible: false })}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={tw`flex-1`}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={tw`flex-1 justify-center p-8 max-w-md self-center w-full`}>

                        {/* Header Section */}
                        <View style={tw`mb-10`}>
                            <Text style={[tw`text-white text-5xl mb-2`, { fontFamily: 'Heading' }]}>Create Account</Text>
                            <Text style={tw`text-gray-400 text-lg`}>Join FinAI and manage your assets.</Text>
                        </View>

                        <View style={tw`gap-y-4`}>
                            {/* Email Input */}
                            <View>
                                <TextInput
                                    style={inputStyle}
                                    placeholder="Email Address"
                                    placeholderTextColor="#444"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                    editable={!loading}
                                />
                            </View>

                            {/* Password Input */}
                            <View style={tw`relative`}>
                                <TextInput
                                    style={inputStyle}
                                    placeholder="Password"
                                    placeholderTextColor="#444"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={tw`absolute right-4 top-4 z-10`}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#444" />
                                </TouchableOpacity>
                            </View>

                            {/* Confirm Password Input */}
                            <View style={tw`relative mb-2`}>
                                <TextInput
                                    style={inputStyle}
                                    placeholder="Confirm Password"
                                    placeholderTextColor="#444"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={tw`absolute right-4 top-4 z-10`}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#444" />
                                </TouchableOpacity>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleSignUp}
                                disabled={loading}
                                style={[tw`p-4 rounded-2xl items-center mt-2`, loading ? tw`bg-[#222]` : tw`bg-[#EBC351]`]}
                                activeOpacity={0.8}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#EBC351" />
                                ) : (
                                    <Text style={tw`font-bold text-lg text-black`}>Create Account</Text>
                                )}
                            </TouchableOpacity>

                            {/* Navigation to Login */}
                            <TouchableOpacity
                                onPress={() => router.back()} // Or router.push('/login') depending on your stack
                                disabled={loading}
                                style={tw`items-center mt-4`}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Text style={tw`text-gray-400 font-medium`}>
                                    Already have an account? <Text style={tw`text-[#EBC351]`}>Sign In</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}