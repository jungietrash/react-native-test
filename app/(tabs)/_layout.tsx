// import { BlurView } from "expo-blur";
// import { Tabs } from "expo-router";
// import { SymbolView } from "expo-symbols";
// import { Platform, StyleSheet } from "react-native";

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,

//         // ✅ FIX: DO NOT set height: 0
//         tabBarStyle: {
//           position: "absolute",
//           backgroundColor: "transparent",
//           borderTopWidth: 0,
//           elevation: 0,
//           height: 70, // IMPORTANT: visible height
//           paddingBottom: 10,
//         },

//         tabBarBackground: () => (
//           <BlurView
//             intensity={Platform.OS === "ios" ? 80 : 100}
//             style={StyleSheet.absoluteFill}
//             tint="dark"
//           />
//         ),

//         tabBarActiveTintColor: "#EBC351",
//         tabBarInactiveTintColor: "#666",

//         tabBarLabelStyle: {
//           fontSize: 10,
//           fontWeight: "700",
//           textTransform: "uppercase",
//         },
//       }}
//     >
//       {/* DASHBOARD */}
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Dashboard",
//           tabBarIcon: ({ color }) => (
//             <SymbolView
//               name="house.fill"
//               tintColor={color}
//               size={22}
//             />
//           ),
//         }}
//       />

//       {/* CHAT */}
//       <Tabs.Screen
//         name="chat"
//         options={{
//           title: "AI Chat",
//           tabBarIcon: ({ color }) => (
//             <SymbolView
//               name="message.fill"
//               tintColor={color}
//               size={22}
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }