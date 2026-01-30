import { PartnerPayoutStackParamList } from "@/navigation/PartnerStacks/PartnersPayoutStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import {
  fetchPayouts,
  fetchPayoutStatistics,
} from "@/shared/store/slices/partner/payout/PartnerPayoutSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
        <View style={styles.payoutLeft}>
          <View style={styles.payoutIconWrapper}>
            <Feather name="dollar-sign" size={22} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.payoutAmount}>{formatCurrency(item.amount)}</Text>
            <Text style={styles.payoutTitle}>{item.title}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }} >
              <Ionicons name="calendar-outline" size={13} color={Colors.secondary} />
              <Text style={styles.payoutMeta}>Scheduled: {item.due_date}</Text>
            </View>
          </View>
        </View>


        {/* Right: Status */}
        <View
          style={
            styles.statusBadge}
        >
          <Text
            style={
              styles.statusText}
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
        {/* <View style={styles.card}> */}
        <LinearGradient
          colors={[Colors.primary, "#3a84fb"]} // left → right
          start={{ x: 0, y: 1 }}
          end={{ x: 2, y: 0 }}
          style={styles.card}
        >
          <Image source={require('../../../../../assets/images/upperDiv.png')} style={{ position: 'absolute', width: 100, height: 110, top: -30, right: -50 }} />
          <Text style={styles.cardTitle}>Total Payouts Amount</Text>
          <Text style={styles.cardValue}>
            {formatCurrency(
              Number(payoutStatistics?.total_amount.toFixed(2) ?? 0),
            )}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={styles.mirror}>
              <Text style={{
                color: Colors.white,
                fontWeight: "400",
                fontFamily: "Inter_400Regular",
                fontSize: 12,
              }}>
                Paid Amount:{" "}
                <Text style={styles.cardSubtitle}>
                  {formatCurrency(
                    Number(payoutStatistics?.paid_amount.toFixed(2) ?? 0),
                  )}
                </Text>
              </Text>
            </View>
            <View style={styles.mirror}>
              <Text style={{
                color: Colors.white,
                fontWeight: "400",
                fontFamily: "Inter_400Regular",
                fontSize: 12,
              }}>
                Total Payouts:{" "}
                <Text style={styles.cardSubtitle}>
                  {payoutStatistics?.total_payouts ?? 0}
                </Text>
              </Text>
            </View>
          </View>
          <Image source={require('../../../../../assets/images/lowerDiv.png')} style={{ position: 'absolute', width: 200, height: 260, bottom: -190, left: -150, }} />
          {/* <View style={styles.balanceActionsRow}></View> */}
        </LinearGradient>
        {/* <View style={styles.balanceActionsRow}></View> */}
        {/* </View> */}
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
              <Feather name="inbox" size={48} color={Colors.gray} />
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
    backgroundColor: Colors.primary,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 6,
    marginTop: 12,
    padding: 24,
    // paddingTop: 36,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter_500Regular",
  },
  cardValue: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    fontWeight: "600",
    marginVertical: 2,
  },
  mirror: { backgroundColor: Colors.mirror, width: '50%', justifyContent: 'center', alignItems: 'center', borderRadius: 18, paddingVertical: 4, paddingHorizontal: 6, borderWidth: 0.3, borderColor: Colors.white, opacity: 0.7, marginTop: 4, marginHorizontal: 2 },
  cardSubtitle: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 10 },
  filterRow: {
    flexDirection: "row",
    marginBottom: 4,
    // marginTop: 10,
    gap: 1,
    marginHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 4,
    justifyContent: "space-around",
    borderColor: "#E6EDFF",
    borderWidth: 1
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  filterBtnActive: { backgroundColor: Colors.primary },
  filterText: { color: Colors.gray, fontWeight: "400", fontSize: 16 },
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
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    marginVertical: 2,
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6EDFF",
  },
  payoutLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  payoutIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGray, // 20% opacity
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  payoutAmount: {
    color: Colors.secondary,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },

  payoutTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.secondary,
    marginTop: 2,
  },

  payoutMeta: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.statusbg
  },

  statusScheduled: { backgroundColor: "rgba(251,191,36,0.15)" }, // orange
  statusPaid: { backgroundColor: "rgba(16,185,129,0.15)" }, // green
  statusCancelled: { backgroundColor: "rgba(107,114,128,0.15)" }, // gray

  statusText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.statusText
  },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#6B7280" },
});
export default PartnerPayoutScreen;
