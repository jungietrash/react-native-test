import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

type Transaction = { id: string; amount: number; note: string };
type Item = {
  id: string;
  title: string;
  total: number;
  transactions: Transaction[];
};

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const [view, setView] = useState<"savings" | "budgets">("savings");
  const [savings, setSavings] = useState<Item[]>([]);
  const [budgets, setBudgets] = useState<Item[]>([]);

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  // Determine grid columns based on screen width (Tablet vs Phone)
  const isTablet = width > 768;
  const numColumns = isTablet ? 2 : 1;

  const createNewCategory = () => {
    if (!title || !amount)
      return Alert.alert("Error", "Please enter a name and initial amount");
    const newItem: Item = {
      id: Date.now().toString(),
      title,
      total: parseFloat(amount),
      transactions: [],
    };

    if (view === "savings") setSavings([newItem, ...savings]);
    else setBudgets([newItem, ...budgets]);

    setTitle("");
    setAmount("");
  };

  const updateBalance = (id: string, val: string, isExpense: boolean) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;

    const updater = (prev: Item[]) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            total: isExpense ? item.total - num : item.total + num,
          };
        }
        return item;
      });

    if (view === "savings") setSavings(updater);
    else setBudgets(updater);
  };

  const renderCard = ({ item }: { item: Item }) => (
    <View style={[styles.cardContainer, { width: isTablet ? "50%" : "100%" }]}>
      <ThemedView style={styles.card}>
        <View style={styles.cardHeader}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            {item.title}
          </ThemedText>
          <ThemedText
            style={[
              styles.balance,
              { color: item.total < 0 ? "#FF3B30" : "#34C759" },
            ]}
          >
            $
            {item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </ThemedText>
        </View>

        <View style={styles.actionRow}>
          <TextInput
            style={styles.smallInput}
            placeholder={view === "savings" ? "+ Add money" : "- Add expense"}
            placeholderTextColor="#999"
            keyboardType="numeric"
            clearButtonMode="while-editing"
            onSubmitEditing={(e) => {
              updateBalance(item.id, e.nativeEvent.text, view === "budgets");
              e.currentTarget.setNativeProps({ text: "" }); // Clear input after enter
            }}
          />
          <Text style={styles.hint}>Enter to apply</Text>
        </View>
      </ThemedView>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.maxWidthWrapper}>
          {/* Header Section */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.mainTitle}>
              My Savings Application
            </ThemedText>
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tab, view === "savings" && styles.activeTab]}
                onPress={() => setView("savings")}
              >
                <Text
                  style={
                    view === "savings" ? styles.activeTabText : styles.tabText
                  }
                >
                  Savings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, view === "budgets" && styles.activeTab]}
                onPress={() => setView("budgets")}
              >
                <Text
                  style={
                    view === "budgets" ? styles.activeTabText : styles.tabText
                  }
                >
                  Budgets
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Input Section */}
          <ThemedView style={styles.inputCard}>
            <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
              Create New {view === "savings" ? "Saving Goal" : "Monthly Budget"}
            </ThemedText>
            <View
              style={isTablet ? styles.tabletInputRow : styles.phoneInputCol}
            >
              <TextInput
                style={[styles.input, isTablet && { flex: 2 }]}
                placeholder="Title (e.g. Vacation)"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={[styles.input, isTablet && { flex: 1 }]}
                placeholder="Initial Amount"
                value={amount}
                keyboardType="numeric"
                onChangeText={setAmount}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={createNewCategory}>
              <Text style={styles.buttonText}>Add to List</Text>
            </TouchableOpacity>
          </ThemedView>

          {/* List Section */}
          <FlatList
            key={isTablet ? "tablet" : "phone"} // Force re-render on orientation/size change
            data={view === "savings" ? savings : budgets}
            keyExtractor={(item) => item.id}
            renderItem={renderCard}
            numColumns={numColumns}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No {view} found. Start by adding one!
              </Text>
            }
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 60, paddingBottom: 50, alignItems: "center" },
  maxWidthWrapper: {
    width: "100%",
    maxWidth: 900, // Keeps layout from getting too wide on tablets
    paddingHorizontal: 16,
  },
  header: { marginBottom: 24, alignItems: "center" },
  mainTitle: { fontSize: 32, letterSpacing: -1 },
  tabBar: {
    flexDirection: "row",
    marginTop: 24,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 4,
    width: "100%",
    maxWidth: 400,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tabText: { color: "#8E8E93", fontWeight: "600", fontSize: 15 },
  activeTabText: { color: "#000", fontWeight: "700", fontSize: 15 },

  inputCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    marginBottom: 24,
    gap: 12,
  },
  sectionLabel: { marginBottom: 4, opacity: 0.6 },
  phoneInputCol: { gap: 10 },
  tabletInputRow: { flexDirection: "row", gap: 10 },
  input: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  listContainer: { paddingBottom: 20 },
  cardContainer: { padding: 8 }, // Adds spacing for grid items
  card: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F2F2F7",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 18, flex: 1, marginRight: 10 },
  balance: { fontSize: 24, fontWeight: "800" },
  actionRow: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  smallInput: { fontSize: 15, fontWeight: "600", color: "#000", flex: 1 },
  hint: {
    fontSize: 11,
    color: "#8E8E93",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  empty: { textAlign: "center", color: "#8E8E93", marginTop: 60, fontSize: 16 },
});
