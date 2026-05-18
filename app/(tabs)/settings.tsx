import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

interface SettingItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    value?: string;
    onPress?: () => void;
    destructive?: boolean;
    showChevron?: boolean;
    isLast?: boolean;
}

// iOS Native Style Row Component
const SettingRow: React.FC<SettingItemProps> = ({
    icon,
    title,
    value,
    onPress,
    destructive = false,
    showChevron = true,
    isLast = false
}) => {
    const textColor = destructive ? 'text-[#FF3B30]' : 'text-white';
    const iconColor = destructive ? '#FF3B30' : '#EBC351';

    return (
        <TouchableOpacity
            onPress={onPress}
            style={tw`flex-row items-center py-3.5 px-4 bg-[#1C1C1E] ${!isLast ? 'border-b border-[#2C2C2E]' : ''}`}
            activeOpacity={0.7}
            disabled={!onPress}
        >
            <View style={tw`w-8 items-start`}>
                <Ionicons name={icon} size={22} color={iconColor} />
            </View>
            <Text style={tw`flex-1 ${textColor} text-[17px] font-normal`}>{title}</Text>
            {value && <Text style={tw`text-[#8E8E93] text-[17px] mr-1`}>{value}</Text>}
            {showChevron && onPress && <Ionicons name="chevron-forward" size={16} color="#48484A" />}
        </TouchableOpacity>
    );
};

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // RETRIEVAL: Fetch user details and current avatar url on mount
    useEffect(() => {
        let isMounted = true;
        const fetchUserAndAvatar = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('[Settings] Error fetching user data:', error.message);
                return;
            }
            if (isMounted && user) {
                setUserEmail(user.email ?? 'FinAI User');
                const userAvatar = user.user_metadata?.avatar_url;
                if (userAvatar) {
                    setAvatarUrl(`${userAvatar}?t=${new Date().getTime()}`);
                }
            }
        };

        fetchUserAndAvatar();
        return () => { isMounted = false; };
    }, []);

    // SENIOR LEVEL WORKFLOW: Cross-Platform (Web + Native) Asset Streamer
    const uploadImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert("Permission Required", "FinAI needs camera roll access to upload a profile image.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) return;

            setIsUploading(true);
            const selectedImage = result.assets[0];

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User session token not verified.");

            // SENIOR FIX: Safe File Extension Resolver (Handles web blobs and native paths cleanly)
            let fileExt = 'jpg'; // Defend with an optimized default fallback format
            if (selectedImage.uri.includes('data:image/')) {
                fileExt = selectedImage.uri.split(';')[0].split('/')[1];
            } else if (!selectedImage.uri.startsWith('blob:')) {
                const cleanedUri = selectedImage.uri.split('?')[0];
                fileExt = cleanedUri.split('.').pop()?.toLowerCase() || 'jpg';
            }

            // Limit extension strings to alphanumeric values only to avoid trailing colon bugs
            fileExt = fileExt.replace(/[^a-z0-9]/gi, '');
            const fileName = `${user.id}/avatar.${fileExt}`;

            // Promisified native request to safely convert local file paths into a clean Blob
            const uploadBody = await new Promise<Blob>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.error('[XHR Error]', e);
                    reject(new TypeError("Network request failed to convert asset data structure."));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', selectedImage.uri, true);
                xhr.send(null);
            });

            console.log(`[Upload] Sending native blob storage payload to avatars/${fileName}`);

            // Stream payload data to Supabase Storage Bucket
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, uploadBody, {
                    contentType: `image/${fileExt}`,
                    upsert: true,
                    cacheControl: '3600'
                });

            console.log("[Upload] Raw Telemetry Gateway Data:", uploadData);
            console.log("[Upload] Raw Telemetry Gateway Error:", uploadError);

            if (uploadError) {
                throw new Error(`Supabase Storage Error: ${uploadError.message}`);
            }

            // Build public serving reference link
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            // Update user identity metadata record properties
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) throw updateError;

            // Force local session token hydration mapping
            await supabase.auth.refreshSession();

            setAvatarUrl(`${publicUrl}?t=${new Date().getTime()}`);
            Alert.alert("Success", "Profile image updated successfully!");

        } catch (error: any) {
            console.error('[Upload Process Failed]:', error.message || error);
            Alert.alert("Upload Error", error.message || "Failed to finalize profile image mapping.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSignOutRequest = (): void => {
        Alert.alert("Sign Out", "Are you sure you want to log out of FinAI?", [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Out", style: "destructive", onPress: executeSignOut }
        ]);
    };

    const executeSignOut = async (): Promise<void> => {
        if (isSigningOut) return;
        setIsSigningOut(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.replace('/login');
        } catch (error: any) {
            Alert.alert("Sign Out Failed", error.message || "Could not sign out.");
        } finally {
            setIsSigningOut(false);
        }
    };

    const userInitials = useMemo(() => {
        if (!userEmail || userEmail === 'FinAI User') return 'U';
        return userEmail.substring(0, 2).toUpperCase();
    }, [userEmail]);

    return (
        <View style={tw`flex-1 bg-black`}>
            <ScrollView
                contentContainerStyle={[tw`px-4 pb-12`, { paddingTop: insets.top + 20 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* iOS Large Title Header */}
                <View style={tw`mb-6 px-1`}>
                    <Text style={tw`text-white text-[34px] font-bold tracking-tight`}>Account</Text>
                    <Text style={tw`text-[#8E8E93] text-[15px] mt-1`}>Manage your FinAI profile and security.</Text>
                </View>

                {/* Profile Header Block */}
                <View style={tw`flex-row items-center bg-[#1C1C1E] p-4 rounded-2xl mb-8`}>
                    <View style={tw`w-16 h-16 rounded-full bg-[#2C2C2E] border border-[#EBC351]/30 items-center justify-center mr-4 overflow-hidden`}>
                        {avatarUrl ? (
                            <Image
                                source={{ uri: avatarUrl }}
                                style={tw`w-full h-full`}
                                contentFit="cover"
                                transition={200}
                            />
                        ) : (
                            <Text style={tw`text-[#EBC351] text-2xl font-semibold`}>{userInitials}</Text>
                        )}
                    </View>

                    <View style={tw`flex-1`}>
                        <Text style={tw`text-white text-[20px] font-semibold tracking-tight`}>User Profile</Text>
                        <Text style={tw`text-[#8E8E93] text-[15px] mt-0.5`} numberOfLines={1}>{userEmail || 'Loading email...'}</Text>

                        <TouchableOpacity
                            style={tw`mt-1.5 flex-row items-center`}
                            onPress={uploadImage}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <ActivityIndicator size="small" color="#EBC351" />
                            ) : (
                                <>
                                    <Text style={tw`text-[#EBC351] font-medium text-[14px]`}>Edit Profile Image</Text>
                                    <Ionicons name="camera-outline" size={14} color="#EBC351" style={tw`ml-1`} />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Section: Profile */}
                <Text style={tw`text-[#8E8E93] text-[13px] uppercase mb-2 ml-4 tracking-wider`}>Profile</Text>
                <View style={tw`bg-[#1C1C1E] rounded-2xl mb-6 overflow-hidden`}>
                    <SettingRow icon="person-outline" title="Personal Information" onPress={() => { }} />
                    <SettingRow icon="notifications-outline" title="Notifications" value="On" onPress={() => { }} />
                    <SettingRow icon="shield-checkmark-outline" title="Security" value="Biometrics" onPress={() => { }} isLast={true} />
                </View>

                {/* Section: App Settings */}
                <Text style={tw`text-[#8E8E93] text-[13px] uppercase mb-2 ml-4 tracking-wider`}>App Settings</Text>
                <View style={tw`bg-[#1C1C1E] rounded-2xl mb-8 overflow-hidden`}>
                    <SettingRow icon="diamond-outline" title="Subscription Plan" value="Premium" onPress={() => { }} />
                    <SettingRow icon="moon-outline" title="Appearance" value="Dark" showChevron={false} />
                    <SettingRow icon="help-circle-outline" title="Help & Support" onPress={() => { }} isLast={true} />
                </View>

                {/* Section: Sign Out */}
                <View style={tw`bg-[#1C1C1E] rounded-2xl overflow-hidden`}>
                    {isSigningOut ? (
                        <View style={tw`py-4 items-center`}>
                            <ActivityIndicator color="#FF3B30" />
                        </View>
                    ) : (
                        <SettingRow
                            icon="log-out-outline"
                            title="Sign Out of FinAI"
                            destructive={true}
                            showChevron={false}
                            isLast={true}
                            onPress={handleSignOutRequest}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}