import { PartnerDashboardStackParamList } from "@/navigation/PartnerStacks/PartnerDashboardStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchPartnerDashboard } from "@store/slices/partner/dashboard/partnerDashboardSlice";
import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from "react-native";

type Props = NativeStackScreenProps<
  PartnerDashboardStackParamList,
  "RecentPayouts"
>;
export const RecentPayouts = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { recent_payouts, loading } = useAppSelector((state) => state.partnerDashboard);
  const {formatCurrency} = useCurrencyFormatter();
  const pullToRefresh = () => {
      dispatch(fetchPartnerDashboard())
    }
  const renderPayoutItem = ({
    item,
  }: {
    item: (typeof recent_payouts)[0];
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
            Type: {item.payout_type.charAt(0).toUpperCase() + item.payout_type.slice(1)}
          </Text>
          <Text style={styles.metaText}>
            Paid : {item.paid_date}
          </Text>
        </View>

        {/* Bottom Row */}
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>
            {formatCurrency(item.amount)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recent_payouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPayoutItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recent payouts found.</Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={pullToRefresh}
            tintColor={Colors.primary}
          />
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
    backgroundColor: Colors.secondary,
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
    color: Colors.white,
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
    color: Colors.white,
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
