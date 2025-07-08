import { InvestmentStackParamList } from "@/navigation/InvestmentStack";
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

const mockInvestments = [
  {
    id: 1,
    name: "Tech Growth Fund",
    amount: 12000,
    status: "Active",
    returns: "+8.2%",
    date: "2024-06-01",
  },
  {
    id: 2,
    name: "Real Estate Trust",
    amount: 5000,
    status: "Pending",
    returns: "+2.1%",
    date: "2024-07-01",
  },
  {
    id: 3,
    name: "Green Energy Bonds",
    amount: 3000,
    status: "Completed",
    returns: "+5.7%",
    date: "2024-05-15",
  },
];

const FILTERS = ["All", "Active", "Pending", "Completed"];
type Props= NativeStackNavigationProp<InvestmentStackParamList, 'InvestmentScreen'>
export const InvestmentsScreen: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const navigation =
    useNavigation<NativeStackNavigationProp<InvestmentStackParamList>>();
  const filtered =
    filter === "All"
      ? mockInvestments
      : mockInvestments.filter((i) => i.status === filter);

  return (
    <DashboardLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Invested</Text>
          <Text style={styles.cardValue}>$12,500.00</Text>
          <Text style={styles.cardSubtitle}>+8.2% this year</Text>
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
        <Text style={styles.sectionTitle}>Investments</Text>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No investments found.</Text>
          </View>
        ) : (
          filtered.map((i) => (
            <TouchableOpacity
              key={i.id}
              style={styles.investmentCard}
              onPress={() =>
                navigation.navigate("InvestmentDetails", { id: i.id })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.investmentName}>{i.name}</Text>
                <Text style={styles.investmentAmount}>
                  ${i.amount.toLocaleString()}
                </Text>
                <Text style={styles.investmentDate}>{i.date}</Text>
              </View>
              <Text
                style={[
                  styles.investmentStatus,
                  i.status === "Active"
                    ? styles.statusActive
                    : styles.statusClosed,
                ]}
              >
                {i.status}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>＋</Text>
        <Text style={styles.fabLabel}>Add Investment</Text>
      </TouchableOpacity>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  
  
  scrollContent: { padding: 0, paddingBottom: 100 },
  card: {
    backgroundColor: "#18181B",
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    padding: 24,
    paddingTop:36,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    
  },
  cardTitle: { fontSize: 15, color: "#A1A1AA", marginBottom: 6 },
  cardValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  cardSubtitle: { fontSize: 14, color: "#22C55E" },
  balanceActionBtnDark: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232326",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 12,
    // marginTop:18
  },
  balanceActionTextDark: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 7,
    // marginBottom:8
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 18 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
    marginHorizontal:12
  },
  investmentCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    marginHorizontal:12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  investmentName: { fontSize: 16, fontWeight: "600", color: "#18181B" },
  investmentAmount: { fontSize: 15, color: "#111827", marginTop: 2 },
  investmentStatus: { fontSize: 13, fontWeight: "500", marginBottom: 2 },
  statusActive: { color: "#22C55E" },
  statusClosed: { color: "#6B7280" },
  investmentDate: { fontSize: 13, color: "#A1A1AA" },

filterRow: { flexDirection: "row", marginBottom: 16, gap: 10,marginHorizontal:12 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  filterBtnActive: { backgroundColor: "#18181B" },
  filterText: { color: "#6B7280", fontWeight: "500" },
  filterTextActive: { color: "#fff" },

  
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 16, color: "#6B7280" },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 80,
    backgroundColor: "#F97316",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  fabIcon: { fontSize: 22, color: "#fff", marginRight: 6 },
  fabLabel: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
export default InvestmentsScreen;
