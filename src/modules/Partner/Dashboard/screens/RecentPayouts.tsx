import { PartnerDashboardStackParamList } from "@/navigation/PartnerStacks/PartnerDashboardStack";
import Colors from "@/shared/colors/Colors";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";

type Props = NativeStackScreenProps<
  PartnerDashboardStackParamList,
  "RecentPayouts"
>;

const recentPayouts = [
  {
    id: 85,
    amount: 0,
    paid_date: "2025-10-28",
    status: "paid",
    investment_name: "kdgddv",
    payout_type: "regular",
  },
  {
    id: 97,
    amount: 0,
    paid_date: "2025-10-27",
    status: "paid",
    investment_name: "ZainMalik",
    payout_type: "regular",
  },
  {
    id: 94,
    amount: 0,
    paid_date: "2025-10-27",
    status: "paid",
    investment_name: "AhmedZa",
    payout_type: "regular",
  },
];

export const RecentPayouts = ({ navigation }: Props) => {
  const renderPayoutItem = ({
    item,
  }: {
    item: (typeof recentPayouts)[0];
  }) => {
    const statusColor =
      item.status === "paid"
        ? Colors.green
        : item.status === "scheduled"
        ? Colors.gray
        : Colors.error;

    return (
      <View style={styles.card}>
        {/* Top Row */}
        <View style={styles.headerRow}>
          <View style={styles.leftRow}>
            <Feather
              name="arrow-down-right"
              size={20}
              color={statusColor}
              style={styles.icon}
            />
            <Text style={styles.investmentName}>{item.investment_name}</Text>
          </View>

          <Text
            style={[styles.statusBadge, { backgroundColor: statusColor }]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>

        {/* Middle Row */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            Type: {item.payout_type.replace(/_/g, " ")}
          </Text>
          <Text style={styles.metaText}>
            Date: {item.paid_date}
          </Text>
        </View>

        {/* Bottom Row */}
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>
            ${item.amount.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recentPayouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPayoutItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recent payouts found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    color: Colors.secondary,
    marginBottom: 12,
    alignSelf: "center",
  },
  listContainer: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  investmentName: {
    fontSize: 16,
    color: Colors.secondary,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  statusBadge: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: "hidden",
    textTransform: "capitalize",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 13,
    color: Colors.gray,
    fontFamily: "Inter_400Regular",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: "Inter_500Medium",
  },
  amountValue: {
    fontSize: 18,
    color: Colors.secondary,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    color: Colors.gray,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginTop: 40,
  },
});

export default RecentPayouts;
