import { PartnerPayoutStackParamList } from "@/navigation/PartnerStacks/PartnersPayoutStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import {
  fetchPayouts,
  fetchPayoutStatistics,
} from "@/shared/store/slices/partner/payout/PartnerPayoutSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DashboardLayout } from "../../../Common/components/DashboardLayout";
const FILTERS = ["All", "Cancelled", "Scheduled", "Paid"];
type props = NativeStackNavigationProp<
  PartnerPayoutStackParamList,
  "PartnerPayouts"
>;
export const PartnerPayoutScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    payouts,
    totalPayoutAmount,
    isLoading,
    isLoadingMore,
    pagination,
    payoutStatistics,
    isStatsLoading,
  } = useAppSelector((state) => state.userPayouts);
  const [filter, setFilter] = useState("All");
  const navigation =
    useNavigation<NativeStackNavigationProp<PartnerPayoutStackParamList>>();

  const formattedPayouts = payouts.map((pay: any) => ({
    id: pay.id,
    title: pay.investment_title,
    name: pay.participent_name,
    amount: pay.amount,
    status: pay.status.charAt(0).toUpperCase() + pay.status.slice(1),
    due_date: pay.scheduled_date,
  }));

  const filtered =
    filter === "All"
      ? formattedPayouts
      : formattedPayouts.filter((p) => p.status === filter);
  const { formatCurrency } = useCurrencyFormatter();
  useEffect(() => {
    dispatch(fetchPayouts(1));
    dispatch(fetchPayoutStatistics());
  }, []);
  //  Load more when reaching end
  const handleLoadMore = () => {
    if (!isLoadingMore && pagination.current_page !== pagination.last_page) {
      dispatch(fetchPayouts(pagination.current_page + 1));
    }
  };

  // Pull-to-refresh
  const handleRefresh = () => {
    dispatch(fetchPayouts(1));
  };
  if (!payouts) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Payouts not found.</Text>
      </View>
    );
  }
  const renderPayout = ({ item }: any) => {
    const statusLower = item.status.toLowerCase();
    const isScheduled = statusLower === "scheduled";
    const isPaid = statusLower === "paid";
    const isCancelled = statusLower === "cancelled";

    return (
      <TouchableOpacity
        style={styles.payoutCardContainer}
        activeOpacity={0.85}
        onPress={() => {
          console.log("Navigating to details for payout ID:", item.id);
          navigation.navigate("PartnerPayoutDetails", { id: item.id });
        }}
      >
        {/* Left: Amount + Participant */}
        <View style={{ flex: 1 }}>
          <Text style={styles.payoutAmount}>{formatCurrency(item.amount)}</Text>
          <Text style={styles.payoutTitle}>{item.title}</Text>
          <Text style={styles.payoutMeta}>{item.participant}</Text>
          <Text style={styles.payoutMeta}>Scheduled: {item.due_date}</Text>
        </View>

        {/* Right: Status */}
        <View
          style={[
            styles.statusBadge,
            isScheduled
              ? styles.statusScheduled
              : isPaid
                ? styles.statusPaid
                : styles.statusCancelled,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: isScheduled
                  ? Colors.green
                  : isPaid
                    ? Colors.green
                    : Colors.gray,
              },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <DashboardLayout>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Payouts Amount</Text>
          <Text style={styles.cardValue}>
            {formatCurrency(
              Number(payoutStatistics?.total_amount.toFixed(2) ?? 0),
            )}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: Colors.gray, fontSize: 14 }}>
              Paid Amount:{" "}
              <Text style={styles.cardSubtitle}>
                {formatCurrency(
                  Number(payoutStatistics?.paid_amount.toFixed(2) ?? 0),
                )}
              </Text>
            </Text>
            <Text style={{ color: Colors.gray, fontSize: 14 }}>
              Total Payouts:{" "}
              <Text style={styles.cardSubtitle}>
                {payoutStatistics?.total_payouts ?? 0}
              </Text>
            </Text>
          </View>
          <View style={styles.balanceActionsRow}></View>
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
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPayout}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={handleRefresh}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color={Colors.green} />
            ) : null
          }
          contentContainerStyle={styles.scrollContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No Payouts available.</Text>
            </View>
          }
        />
      </View>
    </DashboardLayout>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    // flex:1,
    paddingBottom: 100,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    paddingTop: 36,
    // marginBottom: 18,
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
  cardSubtitle: {
    fontSize: 14,
    color: Colors.green,
    fontFamily: "Inter_600SemiBold",
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 10 },
  filterRow: {
    flexDirection: "row",
    marginTop: 10,
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 16, color: Colors.secondary },

  payoutCardContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  payoutSelected: {
    borderWidth: 2,
    borderColor: Colors.green,
  },

  payoutAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: 2,
  },

  payoutTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },

  payoutMeta: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusScheduled: { backgroundColor: "rgba(251,191,36,0.15)" }, // orange
  statusPaid: { backgroundColor: "rgba(16,185,129,0.15)" }, // green
  statusCancelled: { backgroundColor: "rgba(107,114,128,0.15)" }, // gray

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#6B7280" },
});
export default PartnerPayoutScreen;
