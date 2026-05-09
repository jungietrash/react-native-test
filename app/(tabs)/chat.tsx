import { useFinanceStore } from "@/store/useFinanceStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import tw from "twrnc";

export default function ChatScreen() {
  const [input, setInput] =
    useState("");

  const [imageUri, setImageUri] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const {
    transactions,
    addTransaction,
    fetchInitialData,
    monthlyBudget,
    networth,
  } = useFinanceStore();

  const flatListRef =
    useRef<FlatList>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  /**
   * ======================================
   * PICK IMAGE
   * ======================================
   */

  const pickImage = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync(
        {
          mediaTypes:
            ImagePicker
              .MediaTypeOptions.Images,

          allowsEditing: false,

          quality: 1,

          base64: false,
        }
      );

    if (!result.canceled) {
      setImageUri(
        result.assets[0].uri
      );

      Haptics.impactAsync(
        Haptics
          .ImpactFeedbackStyle.Light
      );
    }
  };

  /**
   * ======================================
   * SEND MESSAGE
   * ======================================
   */

  const onSend = async () => {
    if (
      (!input.trim() &&
        !imageUri) ||
      isLoading
    ) {
      return;
    }

    try {
      setIsLoading(true);

      const formData =
        new FormData();

      /**
       * TEXT FIELDS
       */

      formData.append(
        "networth",
        String(networth)
      );

      formData.append(
        "monthly_budget",
        String(monthlyBudget)
      );

      formData.append(
        "description",
        input ||
        "Analyze image"
      );

      /**
       * IMAGE
       */

      if (imageUri) {
        /**
         * WEB
         */

        if (
          Platform.OS === "web"
        ) {
          const response =
            await fetch(imageUri);

          const blob =
            await response.blob();

          formData.append(
            "image",
            blob,
            "receipt.jpg"
          );
        }

        /**
         * NATIVE
         */

        else {
          const filename =
            imageUri
              .split("/")
              .pop() ||
            "receipt.jpg";

          const match =
            /\.(\w+)$/.exec(
              filename
            );

          const type = match
            ? `image/${match[1]}`
            : `image/jpeg`;

          formData.append(
            "image",
            {
              uri: imageUri,
              name: filename,
              type,
            } as any
          );
        }
      }

      /**
       * REQUEST
       */

      const response =
        await fetch(
          "https://jungie.site/api/analyze-chat",
          {
            method: "POST",
            body: formData,
          }
        );

      /**
       * DEBUG
       */

      // console.log(
      //   "STATUS:",
      //   response.status
      // );

      const raw =
        await response.text();

      // console.log(
      //   "RAW:",
      //   raw
      // );

      let aiData;

      try {
        aiData =
          JSON.parse(raw);
      } catch {
        throw new Error(
          "Invalid JSON response"
        );
      }

      // console.log(
      //   "AI:",
      //   aiData
      // );

      /**
       * SAVE
       */

      await addTransaction(
        input ||
        aiData.name ||
        "Logged Item",
        aiData
      );

      /**
       * RESET
       */

      setInput("");

      setImageUri(null);

      Haptics.notificationAsync(
        Haptics
          .NotificationFeedbackType
          .Success
      );
    } catch (e) {
      console.error(
        "UPLOAD ERROR:",
        e
      );

      Haptics.notificationAsync(
        Haptics
          .NotificationFeedbackType
          .Error
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ======================================
   * UI
   * ======================================
   */

  return (
    <SafeAreaView
      style={tw`flex-1 bg-black`}
    >
      {/* HEADER */}

      <View
        style={tw`px-6 pt-4 pb-2 flex-row justify-between items-center`}
      >
        <TouchableOpacity
          onPress={() =>
            router.push("/")
          }
          style={tw`p-2 -ml-2`}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#EBC351"
          />
        </TouchableOpacity>

        <Text
          style={[
            tw`text-white text-2xl`,
            {
              fontFamily:
                "Heading",
            },
          ]}
        >
          log it.
        </Text>

        <View style={tw`w-8`} />
      </View>

      {/* CHAT */}

      <FlatList
        ref={flatListRef}
        data={transactions}
        inverted
        keyExtractor={(item) =>
          item.id
        }
        contentContainerStyle={tw`p-6 pt-10`}
        renderItem={({ item }) => (
          <View
            style={tw`mb-8`}
          >
            {/* USER */}

            <View
              style={tw`items-end mb-3`}
            >
              <View
                style={tw`bg-[#222] px-5 py-3 rounded-[20px] rounded-tr-none max-w-[80%]`}
              >
                <Text
                  style={tw`text-white text-base`}
                >
                  {
                    item.description
                  }
                </Text>
              </View>
            </View>

            {/* AI */}

            <View
              style={tw`items-start`}
            >
              <View
                style={tw`bg-[#121212] border border-[#222] px-5 py-4 rounded-[20px] rounded-tl-none max-w-[85%]`}
              >
                <Text
                  style={tw`text-[#EBC351] text-[10px] font-bold uppercase mb-1 tracking-widest`}
                >
                  FinAI Coach
                </Text>

                <Text
                  style={tw`text-gray-300 leading-5`}
                >
                  {item.ai_reply ||
                    `Logged ₱${item.amount.toLocaleString()} for ${item.category}.`}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* INPUT */}

      <KeyboardAvoidingView
        behavior={
          Platform.OS ===
            "ios"
            ? "padding"
            : "height"
        }
        keyboardVerticalOffset={
          Platform.OS ===
            "ios"
            ? 90
            : 0
        }
      >
        {/* PREVIEW */}

        {imageUri && (
          <View
            style={tw`px-6 py-2 flex-row`}
          >
            <View
              style={tw`relative`}
            >
              <Image
                source={{
                  uri: imageUri,
                }}
                style={tw`w-16 h-16 rounded-xl border border-[#EBC351]`}
              />

              <TouchableOpacity
                onPress={() =>
                  setImageUri(
                    null
                  )
                }
                style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full p-1`}
              >
                <Ionicons
                  name="close"
                  size={12}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* BAR */}

        <View
          style={tw`p-6 bg-black border-t border-[#111]`}
        >
          <View
            style={tw`flex-row items-center bg-[#121212] rounded-[24px] px-2 py-2 border border-[#222]`}
          >
            <TouchableOpacity
              onPress={
                pickImage
              }
              style={tw`p-3`}
            >
              <Ionicons
                name="camera-outline"
                size={24}
                color={
                  imageUri
                    ? "#EBC351"
                    : "#444"
                }
              />
            </TouchableOpacity>

            <TextInput
              style={tw`flex-1 text-white px-2 py-3 text-base`}
              placeholder={
                isLoading
                  ? "Analyzing..."
                  : "Bought coffee for 250..."
              }
              placeholderTextColor="#444"
              value={input}
              onChangeText={
                setInput
              }
              editable={
                !isLoading
              }
            />

            <TouchableOpacity
              onPress={onSend}
              disabled={
                isLoading ||
                (!input.trim() &&
                  !imageUri)
              }
              style={[
                tw`h-12 w-12 rounded-[20px] items-center justify-center`,
                !input.trim() &&
                  !imageUri
                  ? tw`bg-[#222]`
                  : tw`bg-[#EBC351]`,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator
                  color="black"
                  size="small"
                />
              ) : (
                <Ionicons
                  name="arrow-up"
                  size={24}
                  color="black"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}