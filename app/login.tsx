import { StatusModal } from '@/components/modals/StatusModal';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have expo-vector-icons installed
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
export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Modal State
    const [modal, setModal] = useState({ visible: false, title: '', message: '' });

    // Memoize styles to prevent re-creation on every keystroke (Fixes Web Focus)
    const inputStyle = useMemo(() => tw`bg-[#121212] border border-[#222] p-4 rounded-2xl text-white text-lg`, []);

    const validate = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setModal({ visible: true, title: 'Check Email', message: 'Please enter a valid email address.' });
            return false;
        }
        if (password.length < 6) {
            setModal({ visible: true, title: 'Short Password', message: 'Password must be at least 6 characters.' });
            return false;
        }
        return true;
    };

    const handleAuth = useCallback(async (mode: 'LOGIN' | 'SIGNUP') => {
        if (!validate()) return;

        setLoading(true);
        Keyboard.dismiss();

        try {
            const { error, data } = mode === 'LOGIN'
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password });

            if (error) throw error;

            if (mode === 'SIGNUP' && data.user && !data.session) {
                setModal({
                    visible: true,
                    title: 'Success!',
                    message: 'Please check your inbox to verify your email.'
                });
            } else {
                router.replace('/');
            }
        } catch (err: any) {
            setModal({
                visible: true,
                title: 'Auth Error',
                message: err.message || 'Something went wrong. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    }, [email, password]);

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

                        <View style={tw`mb-12`}>
                            <Text style={[tw`text-white text-6xl mb-2`, { fontFamily: 'Heading' }]}>FinAI</Text>
                            <Text style={tw`text-gray-400 text-lg`}>Intelligence for your assets.</Text>
                        </View>

                        <View style={tw`gap-y-5`}>
                            {/* Email Input */}
                            <View>
                                <TextInput
                                    style={inputStyle}
                                    placeholder="Email"
                                    placeholderTextColor="#444"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
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
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={tw`absolute right-4 top-4`}
                                >
                                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#444" />
                                </TouchableOpacity>
                            </View>

                            {/* Action Buttons */}
                            <TouchableOpacity
                                onPress={() => handleAuth('LOGIN')}
                                disabled={loading}
                                style={[tw`p-4 rounded-2xl items-center mt-4`, loading ? tw`bg-[#222]` : tw`bg-[#EBC351]`]}
                            >
                                {loading ? <ActivityIndicator color="black" /> : <Text style={tw`font-bold text-lg text-black`}>Sign In</Text>}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleAuth('SIGNUP')}
                                disabled={loading}
                                style={tw`items-center`}
                            >
                                <Text style={tw`text-[#EBC351] font-medium`}>Don't have an account? Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}