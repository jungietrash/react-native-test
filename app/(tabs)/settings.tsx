import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import tw from 'twrnc';

// Definitions for modern list items
interface SettingItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    value?: string;
    onPress?: () => void;
    destructive?: boolean;
    showChevron?: boolean;
}

// 1. Reusable modern setting row component matching FinAI design system
const SettingRow: React.FC<SettingItemProps> = ({
    icon,
    title,
    value,
    onPress,
    destructive = false,
    showChevron = true
}) => {
    const textColor = destructive ? 'text-red-400' : 'text-white';
    const iconColor = destructive ? '#ef4444' : '#EBC351'; // FinAI Gold or Red for logout

    return (
        <TouchableOpacity
            onPress={onPress}
            style={tw`flex-row items-center py-4.5 border-b border-[#222]`}
            activeOpacity={0.7}
            disabled={!onPress}
        >
            <View style={tw`w-10 items-center`}>
                <Ionicons name={icon} size={22} color={iconColor} />
            </View>
            <Text style={tw`flex-1 ${textColor} text-[17px] ml-1 font-medium`}>{title}</Text>

            {value && (
                <Text style={tw`text-gray-500 text-base mr-2`}>{value}</Text>
            )}

            {showChevron && onPress && (
                <Ionicons name="chevron-forward" size={18} color="#444" />
            )}
        </TouchableOpacity>
    );
};


export default function SettingsScreen() {
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // Fetch user on load
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserEmail(user?.email || 'FinAI User');
        };
        fetchUser();
    }, []);

    const handleSignOutRequest = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to log out of FinAI?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: executeSignOut
                }
            ]
        );
    };

    const executeSignOut = async () => {
        setIsSigningOut(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.replace('/login');
        } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert("Error", "Could not sign out. Please try again.");
        } finally {
            setIsSigningOut(false);
        }
    };

    // Memoize the initials placeholder
    const userInitials = useMemo(() => {
        if (!userEmail) return '?';
        return userEmail.substring(0, 2).toUpperCase();
    }, [userEmail]);

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <ScrollView contentContainerStyle={tw`p-6 pt-10`}>

                {/* 2. Page Heading - Matching Login Style */}
                <View style={tw`mb-10`}>
                    <Text style={[tw`text-white text-5xl mb-2`, { fontFamily: 'Heading' }]}>Account</Text>
                    <Text style={tw`text-gray-400 text-lg`}>Manage your FinAI profile and security.</Text>
                </View>

                {/* 3. Modern Profile Header Section */}
                <View style={tw`flex-row items-center bg-[#121212] p-5 rounded-3xl mb-8 border border-[#222]`}>
                    {/* Branded Profile Image Placeholder */}
                    <View style={tw`w-20 h-20 rounded-full bg-[#222] border-2 border-[#EBC351] items-center justify-center mr-5`}>
                        <Text style={tw`text-[#EBC351] text-3xl font-bold`}>{userInitials}</Text>
                    </View>

                    <View style={tw`flex-1`}>
                        {/* Example dynamic data fetching */}
                        <Text style={tw`text-white text-2xl font-bold mb-1`}>User Profile</Text>
                        <Text style={tw`text-gray-400 text-base`} numberOfLines={1}>{userEmail || 'Loading email...'}</Text>

                        <TouchableOpacity style={tw`mt-2 flex-row items-center`}>
                            <Text style={tw`text-[#EBC351] font-semibold text-sm`}>Edit Profile Image</Text>
                            <Ionicons name="camera-outline" size={14} color="#EBC351" style={tw`ml-1.5`} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 4. Settings List Sections */}
                <View style={tw`mb-10`}>
                    <Text style={tw`text-gray-500 uppercase text-xs font-bold tracking-widest mb-2 ml-1`}>Profile</Text>
                    <View style={tw`bg-[#121212] rounded-3xl px-1 border border-[#222]`}>
                        <SettingRow icon="person-outline" title="Personal Information" onPress={() => { }} />
                        <SettingRow icon="notifications-outline" title="Notifications" value="On" onPress={() => { }} />
                        <SettingRow icon="shield-checkmark-outline" title="Security" value="Biometrics" onPress={() => { }} />
                    </View>
                </View>

                <View style={tw`mb-10`}>
                    <Text style={tw`text-gray-500 uppercase text-xs font-bold tracking-widest mb-2 ml-1`}>App Settings</Text>
                    <View style={tw`bg-[#121212] rounded-3xl px-1 border border-[#222]`}>
                        <SettingRow icon="diamond-outline" title="Subscription Plan" value="Premium" onPress={() => { }} />
                        <SettingRow icon="moon-outline" title="Appearance" value="Dark" showChevron={false} />
                        <SettingRow icon="help-circle-outline" title="Help & Support" onPress={() => { }} />
                    </View>
                </View>

                {/* 5. Redesigned Sign Out Button - Senior Design approach */}
                <View style={tw`items-center mt-4 mb-10`}>
                    {isSigningOut ? (
                        <ActivityIndicator color="#ef4444" />
                    ) : (
                        <TouchableOpacity
                            onPress={handleSignOutRequest}
                            style={tw`items-center py-3 px-8`}
                        >
                            {/* Uses Red for high-risk action, but borderless for sophistication */}
                            <Text style={tw`text-red-500 font-bold text-[17px]`}>Sign Out of FinAI</Text>
                        </TouchableOpacity>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}