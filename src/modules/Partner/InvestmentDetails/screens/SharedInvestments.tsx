import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import type { PartnerInvestment } from "@/shared/store/slices/partner/investments/partnerInvestmentSlice";
import { fetchAvailableSharedPrograms } from "@/shared/store/slices/partner/investments/partnerInvestmentSlice";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const SharedInvestments: React.FC = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const { list, isLoading, error } = useAppSelector(
    (state) => state.userInvestments.sharedPrograms
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dispatch(fetchAvailableSharedPrograms());
  }, [dispatch]);
  if (isLoading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );

  if (error)
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );

  if (!list.length)
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No shared programs available.</Text>
      </View>
    );
  const summary = {
    totalPrograms: 8,
    totalInvested: 5000,
    avgRoi: 14.5,
    participants: 2,
  };

  const renderSummary = () => (
    <View style={styles.summaryRow}>
      <SummaryCard
        label="Total Invested"
        value={`$${summary.totalInvested.toLocaleString()}`}
        style={{ backgroundColor: "#E0F2FE" }}
      />
      <SummaryCard label="Programs" value={summary.totalPrograms}
        style={{ backgroundColor: "#FEF3C7" }}
      />
      <SummaryCard label="Avg ROI" value={`${summary.avgRoi.toFixed(1)}%`}
        style={{ backgroundColor: "#ECFDF5" }}
      />
      <SummaryCard label="Participants" value={summary.participants}
        style={{ backgroundColor: "#FEE2E2" }}
      />
    </View>
  );

  const renderItem = ({ item }: { item: PartnerInvestment }) => (

    <View style={{ marginHorizontal: 0 }}>
      {/* // Title: Shared Investments */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          // ✅ Navigate to details if needed
          navigation.navigate("SharedInvestmentDetail", { id: item.id });
        }}
      >

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.title}>{item.name}</Text>
            <Text
              style={[
                styles.status,
                item.status.toLowerCase() === "active"
                  ? styles.statusActive
                  : styles.statusClosed,
              ]}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.amount}>
              Amount: ${item.current_total_invested ?? "N/A"}/${item.total_target_amount ?? "N/A"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.meta}>
              ROI: {item.expected_return_rate !== undefined && item.expected_return_rate !== null
                ? Number(item.expected_return_rate).toFixed(1)
                : "N/A"}%
            </Text>
            <Text style={styles.meta}>
              Participants: {item.total_participants || "N/A"}
            </Text>
          </View>
            {/* Join Button */}
        <TouchableOpacity
          style={styles.joinBtn}
          activeOpacity={0.7}
          onPress={() => {
            console.log("Join investment tapped:", item.id);
          }}
        >
          <Ionicons name="add-circle-outline" size={18} color={Colors.white} />
          <Text style={styles.joinBtnText}>Join Investment</Text>
        </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (

    <View style={{ flex: 1, backgroundColor: Colors.background }} >

      <FlatList
        contentContainerStyle={{ padding: 12 }}
        data={list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderSummary}
        refreshing={loading}
      // onRefresh={handleRefresh}
      // ListEmptyComponent={
      //   <View style={styles.emptyState}>
      //     <Text style={styles.emptyText}>No shared investments available.</Text>
      //   </View>
      // }
      />
    </View>
  );
};
const SummaryCard = ({
  label,
  value,
  style,
}: {
  label: string;
  value: string | number;
  style?: object;
}) => (
  <View style={[styles.summaryCard, style]}>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  errorText: { color: Colors.error, fontSize: 16 },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: Colors.gray },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 6,

  },
  summaryCard: {
    // backgroundColor: Colors.white,
    // backgroundColor: "#6e204cff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 12,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: 4,
  },
  summaryLabel: { fontSize: 13, color: Colors.gray },
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "600", color: Colors.white },
  subText: { fontSize: 13, color: Colors.gray, marginTop: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  amount: { fontSize: 14, color: Colors.white, fontWeight: "500" },
  meta: { fontSize: 13, color: Colors.gray },
  status: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  statusActive: { color: Colors.green },
  statusClosed: { backgroundColor: Colors.inActiveStatusBg, color: Colors.gray },
  joinBtn: {
  marginTop: 10,
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "flex-end",
  backgroundColor: Colors.primary,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
},
joinBtnText: {
  color: Colors.white,
  fontSize: 14,
  fontWeight: "600",
  marginLeft: 6,
},

});