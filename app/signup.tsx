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
    View,
} from 'react-native';
import tw from 'twrnc';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] =
        useState('');

    const [loading, setLoading] = useState(false);

    // Password visibility
    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    // Modal state
    const [modal, setModal] = useState({
        visible: false,
        title: '',
        message: '',
    });

    // Optimized style memo
    const inputStyle = useMemo(
        () =>
            tw`
        bg-[#121212]
        border
        border-[#222]
        p-4
        rounded-2xl
        text-white
        text-lg
      `,
        []
    );

    // Validation
    const validate = useCallback(() => {
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            setModal({
                visible: true,
                title: 'Invalid Email',
                message:
                    'Please enter a valid email address.',
            });

            return false;
        }

        if (password.length < 6) {
            setModal({
                visible: true,
                title: 'Weak Password',
                message:
                    'Password must be at least 6 characters.',
            });

            return false;
        }

        if (password !== confirmPassword) {
            setModal({
                visible: true,
                title: 'Password Mismatch',
                message:
                    'Passwords do not match.',
            });

            return false;
        }

        return true;
    }, [email, password, confirmPassword]);

    // Sign Up
    const handleSignUp = useCallback(async () => {
        if (!validate()) return;

        setLoading(true);

        Keyboard.dismiss();

        try {
            // Create auth account
            const {
                data,
                error,
            } = await supabase.auth.signUp({
                email: email.trim(),
                password,
            });

            if (error) {
                throw error;
            }

            // No user returned
            if (!data.user) {
                throw new Error(
                    'Account creation failed.'
                );
            }

            // EMAIL CONFIRMATION ENABLED
            // User must verify before login
            if (!data.session) {
                setModal({
                    visible: true,
                    title: 'Verify Your Email',
                    message:
                        'A verification email has been sent. Please verify your account before signing in.',
                });

                return;
            }

            // Create initial profile row
            const { error: profileError } =
                await supabase
                    .from('profiles')
                    .upsert({
                        id: data.user.id,
                        email: data.user.email,
                        updated_at: new Date().toISOString(),
                    });

            if (profileError) {
                throw profileError;
            }

            // Redirect to onboarding
            router.replace("/onboarding");
        } catch (err: any) {
            console.error('[SIGNUP ERROR]', err);

            setModal({
                visible: true,
                title: 'Registration Error',
                message:
                    err?.message ||
                    'Unable to create account.',
            });
        } finally {
            setLoading(false);
        }
    }, [
        email,
        password,
        validate,
    ]);

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            {/* Modal */}
            <StatusModal
                visible={modal.visible}
                title={modal.title}
                message={modal.message}
                onClose={() =>
                    setModal((prev) => ({
                        ...prev,
                        visible: false,
                    }))
                }
            />

            <KeyboardAvoidingView
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
                style={tw`flex-1`}
            >
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    <View
                        style={tw`
              flex-1
              justify-center
              p-8
              max-w-md
              self-center
              w-full
            `}
                    >
                        {/* Header */}
                        <View style={tw`mb-10`}>
                            <Text
                                style={[
                                    tw`text-white text-5xl mb-2`,
                                    {
                                        fontFamily: 'Heading',
                                    },
                                ]}
                            >
                                Create Account
                            </Text>

                            <Text
                                style={tw`text-gray-400 text-lg`}
                            >
                                Join FinAI and manage your assets.
                            </Text>
                        </View>

                        <View style={tw`gap-y-4`}>
                            {/* Email */}
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

                            {/* Password */}
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
                                    onPress={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    style={tw`
                    absolute
                    right-4
                    top-4
                    z-10
                  `}
                                >
                                    <Ionicons
                                        name={
                                            showPassword
                                                ? 'eye-off'
                                                : 'eye'
                                        }
                                        size={22}
                                        color="#444"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Confirm Password */}
                            <View style={tw`relative`}>
                                <TextInput
                                    style={inputStyle}
                                    placeholder="Confirm Password"
                                    placeholderTextColor="#444"
                                    value={confirmPassword}
                                    onChangeText={
                                        setConfirmPassword
                                    }
                                    secureTextEntry={
                                        !showConfirmPassword
                                    }
                                    editable={!loading}
                                />

                                <TouchableOpacity
                                    onPress={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    style={tw`
                    absolute
                    right-4
                    top-4
                    z-10
                  `}
                                >
                                    <Ionicons
                                        name={
                                            showConfirmPassword
                                                ? 'eye-off'
                                                : 'eye'
                                        }
                                        size={22}
                                        color="#444"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Button */}
                            <TouchableOpacity
                                onPress={handleSignUp}
                                disabled={loading}
                                activeOpacity={0.8}
                                style={[
                                    tw`
                    p-4
                    rounded-2xl
                    items-center
                    mt-2
                  `,
                                    loading
                                        ? tw`bg-[#222]`
                                        : tw`bg-[#EBC351]`,
                                ]}
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        color="#EBC351"
                                    />
                                ) : (
                                    <Text
                                        style={tw`
                      font-bold
                      text-lg
                      text-black
                    `}
                                    >
                                        Create Account
                                    </Text>
                                )}
                            </TouchableOpacity>

                            {/* Login Redirect */}
                            <TouchableOpacity
                                onPress={() =>
                                    router.back()
                                }
                                disabled={loading}
                                style={tw`
                  items-center
                  mt-4
                `}
                            >
                                <Text
                                    style={tw`
                    text-gray-400
                    font-medium
                  `}
                                >
                                    Already have an account?{' '}
                                    <Text
                                        style={tw`
                      text-[#EBC351]
                    `}
                                    >
                                        Sign In
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}