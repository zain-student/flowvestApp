import { PayoutStackParamList } from "@/navigation/InvestorStacks/PayoutStack";
import Colors from "@/shared/colors/Colors";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DashboardLayout } from "../../dashboard/components/DashboardLayout";
const mockPayouts = [
  {
    id: 1,
    date: "2024-07-15",
    amount: 1200,
    status: "Upcoming",
    recipient: "You",
  },
  {
    id: 2,
    date: "2024-06-01",
    amount: 900,
    status: "Completed",
    recipient: "You",
  },
  {
    id: 3,
    date: "2024-05-01",
    amount: 800,
    status: "Completed",
    recipient: "You",
  },
];

const FILTERS = ["All", "Upcoming", "Completed"];
type props = NativeStackNavigationProp<PayoutStackParamList, "PayoutsScreen">;
export const PayoutsScreen: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const navigation =
    useNavigation<NativeStackNavigationProp<PayoutStackParamList>>();
  const filtered =
    filter === "All"
      ? mockPayouts
      : mockPayouts.filter((p) => p.status === filter);

  return (
    <DashboardLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Payouts</Text>
          <Text style={styles.cardValue}>$2,900.00</Text>
          <Text style={styles.cardSubtitle}>
            <Text
              style={{
                color: Colors.gray,
                fontWeight: "400",
                fontFamily: "Inter_400Regular",
              }}
            >
              Next payout:{" "}
            </Text>
            July 15, 2024
          </Text>
          <View style={styles.balanceActionsRow}>
            <TouchableOpacity style={styles.balanceActionBtnDark}>
              <Feather name="plus" size={18} color="#fff" />
              <Text style={styles.balanceActionTextDark}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceActionBtnDark}>
              <Feather name="arrow-up-right" size={18} color="#fff" />
              <Text style={styles.balanceActionTextDark}>Send Money</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Payouts</Text>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No payouts found.</Text>
          </View>
        ) : (
          filtered.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.payoutCard}
              onPress={() => navigation.navigate("PayoutDetails", { id: p.id })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.payoutAmount}>
                  ${p.amount.toLocaleString()}
                </Text>
                <Text style={styles.payoutDate}>{p.date}</Text>
              </View>
              <Text
                style={[
                  styles.payoutStatus,
                  p.status === "Upcoming"
                    ? styles.statusUpcoming
                    : styles.statusCompleted,
                ]}
              >
                {p.status}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 0,paddingBottom:100, backgroundColor: Colors.background },
  card: {
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    paddingTop: 36,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: { fontSize: 15, color: Colors.gray, marginBottom: 6 },
  cardValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 4,
  },
  cardSubtitle: { fontSize: 14, color: Colors.green },
  balanceActionBtnDark: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.darkButton,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 12,
  },
  balanceActionTextDark: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 7,
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 18 },
  filterRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
    marginHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 4,
    justifyContent: "space-around",
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  filterBtnActive: { backgroundColor: Colors.secondary },
  filterText: { color: "#6B7280", fontWeight: "500" },
  filterTextActive: { color: Colors.white },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
    marginHorizontal: 12,
  },
  payoutCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
    marginHorizontal: 12,
  },
  payoutAmount: { fontSize: 16, fontWeight: "600", color: Colors.white },
  payoutDate: { fontSize: 15, color: Colors.gray, marginTop: 2 },
  payoutStatus: { fontSize: 13, fontWeight: "500", marginLeft: 12 },
  statusUpcoming: { color: Colors.green },
  statusCompleted: { color: Colors.green },
  emptyState: { alignItems: "center", marginTop: 32 },
  emptyText: { color: "#6B7280", fontSize: 15 },
});
export default PayoutsScreen;
