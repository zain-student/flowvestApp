import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DashboardLayout } from "../../dashboard/components/DashboardLayout";
const mockAssets = [
  { id: 1, name: "Tech Growth Fund", value: 12000, growth: "+8.2%" },
  { id: 2, name: "Real Estate Trust", value: 5000, growth: "+2.1%" },
  { id: 3, name: "Green Energy Bonds", value: 3000, growth: "+5.7%" },
];

export const PortfolioScreen: React.FC = () => {
  return (
    <DashboardLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Net Worth</Text>
          <Text style={styles.cardValue}>$25,000.00</Text>
          <Text style={styles.cardSubtitle}>Asset Allocation</Text>
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
        <View style={styles.chartContainer}>
          <View style={styles.chartBar} />
          <Text style={styles.chartLabel}>Performance (Mock Chart)</Text>
        </View>
        <Text style={styles.sectionTitle}>Your Assets</Text>
        {mockAssets.map((asset) => (
          <View key={asset.id} style={styles.assetCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.assetName}>{asset.name}</Text>
              <Text style={styles.assetValue}>
                ${asset.value.toLocaleString()}
              </Text>
            </View>
            <Text style={styles.assetGrowth}>{asset.growth}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>⬇️</Text>
        <Text style={styles.fabLabel}>Export Report</Text>
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
  cardTitle: { fontSize: 15, color: "#6B7280", marginBottom: 6 },
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
  },
  balanceActionTextDark: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 7,
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 18 },
  chartContainer: { alignItems: "center", marginBottom: 18 },
  chartBar: {
    width: "90%",
    height: 80,
    backgroundColor: "#FDE68A",
    borderRadius: 16,
    marginBottom: 8,
  },
  chartLabel: { color: "#F59E42", fontWeight: "600", fontSize: 13 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
    marginHorizontal:12
  },
  assetCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
    marginHorizontal:12
  },
  assetName: { fontSize: 16, fontWeight: "600", color: "#18181B" },
  assetValue: { fontSize: 15, color: "#111827", marginTop: 2 },
  assetGrowth: { fontSize: 15, color: "#22C55E", fontWeight: "600" },
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
export default PortfolioScreen;
