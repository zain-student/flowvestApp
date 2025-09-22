import Colors from "@/shared/colors/Colors";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FILTERS = ["All", "Active", "Paused", "Completed"];

export const SharedInvestments: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<any[]>([]);

  // Simulate API call
  useEffect(() => {
    setTimeout(() => {
      setPrograms([
        {
          id: 3,
          name: "Stocks fund",
          description:
            "Shared Stocks fund investment program with monthly returns",
          status: "active",
          start_date: "2025-07-17",
          expected_return_rate: "20.0000",
          current_total_invested: "50000.00",
          total_target_amount: "5000000.00",
          total_participants: 1,
          creator: { id: 6, name: "Zain Malik" },
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const formattedPrograms = programs.map((p) => ({
    id: p.id,
    name: p.name,
    amount: Number(p.current_total_invested).toLocaleString(),
    status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
    roi: p.expected_return_rate,
    date: p.start_date,
    creator: p.creator.name,
    target: Number(p.total_target_amount).toLocaleString(),
    participants: p.total_participants,
  }));

  const filtered =
    filter === "All"
      ? formattedPrograms
      : formattedPrograms.filter((i) => i.status === filter);

  const handleRefresh = useCallback(() => {
    // 🔹 Replace with API refresh if needed
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.investmentCard}
      onPress={() => console.log("Go to shared program detail:", item.id)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.investmentName}>{item.name}</Text>
        <Text style={styles.investmentAmount}>
          Current: ${item.amount} / Target: ${item.target}
        </Text>
        <Text style={styles.investmentDate}>
          Started: {item.date} • ROI: {item.roi}%
        </Text>
        <Text style={styles.investmentDate}>
          Creator: {item.creator} • Participants: {item.participants}
        </Text>
      </View>
      <Text
        style={[
          styles.investmentStatus,
          item.status === "Active" ? styles.statusActive : styles.statusClosed,
        ]}
      >
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={handleRefresh}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No shared investments available.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  filterRow: {
    flexDirection: "row",
    marginBottom: 16,
    marginTop: 10,
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
  investmentCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  investmentName: { fontSize: 16, fontWeight: "600", color: Colors.white },
  investmentAmount: { fontSize: 15, color: Colors.gray, marginTop: 2 },
  investmentDate: { fontSize: 13, color: Colors.gray },
  investmentStatus: { fontSize: 13, fontWeight: "500", marginBottom: 2 },
  statusActive: { color: Colors.green },
  statusClosed: { color: "#6B7280" },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#6B7280" },
});

export default SharedInvestments;