import { PayoutStackParamList } from "@/navigation/InvestorStacks/PayoutStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import {
  bulkUpdatePayouts,
  fetchPayouts,
} from "@/shared/store/slices/investor/payouts/payoutSlice";
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
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { DashboardLayout } from "../../../Common/components/DashboardLayout";
import { MarkAsPaidModal } from "../components/MarkAsPaidModal";

const FILTERS = ["All", "Cancelled", "Scheduled", "Paid"];

export const PayoutsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { payouts, totalPayoutAmount, isLoading, isLoadingMore, pagination } =
    useAppSelector((state) => state.payout);
  const [filter, setFilter] = useState("All");
  const navigation =
    useNavigation<NativeStackNavigationProp<PayoutStackParamList>>();
  const { formatCurrency } = useCurrencyFormatter();
  // ✅ Selection state
  const [selectedPayouts, setSelectedPayouts] = useState<number[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState(false);

  const formattedPayouts = payouts.map((pay: any) => ({
    id: pay.id,
    title: pay.investment_title,
    participant: pay.participant_name,
    email: pay.participant_email,
    amount: pay.amount,
    status: pay.status.charAt(0).toUpperCase() + pay.status.slice(1),
    due_date: pay.scheduled_date,
  }));

  const filtered =
    filter === "All"
      ? formattedPayouts
      : formattedPayouts.filter((p) => p.status === filter);

  useEffect(() => {
    dispatch(fetchPayouts(1));
  }, []);

  // Pagination + Refresh
  const handleLoadMore = () => {
    if (!isLoadingMore && pagination.current_page !== pagination.last_page) {
      dispatch(fetchPayouts(pagination.current_page + 1));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchPayouts(1));
  };

  // ✅ Selection logic
  const toggleSelection = (id: number) => {
    setSelectedPayouts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleLongPress = (id: number) => {
    setSelectionMode(true);
    toggleSelection(id);
  };
  const handleOpenMarkAsPaid = () => {
    if (selectedPayouts.length === 0) return;
    setShowMarkAsPaidModal(true);
  };
  const handlePayoutPress = (item: any) => {
    if (selectionMode) {
      toggleSelection(item.id);
    } else {
      navigation.navigate("PayoutDetails", { id: item.id });
    }
  };

  const handleSelectAll = () => {
    if (selectedPayouts.length === filtered.length) {
      setSelectedPayouts([]);
    } else {
      setSelectedPayouts(filtered.map((p) => p.id));
    }
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedPayouts([]);
  };
  const handleBulkMarkAsPaid = async (formData: any) => {
    try {
      const payload = {
        payout_ids: selectedPayouts,
        ...formData, // includes status, payment_method, reference_number, notes
      };
      console.log("Bulk Mark as Paid payload:", payload);
      await dispatch(bulkUpdatePayouts(payload)).unwrap();

      setShowMarkAsPaidModal(false);
      setSelectionMode(false);
      setSelectedPayouts([]);
      dispatch(fetchPayouts(1)); // refresh list
    } catch (error: any) {
      ToastAndroid.show(
        error?.message || "Failed to mark payouts as paid.",
        ToastAndroid.SHORT,
      );
    }
  };
  const renderPayout = ({ item }: any) => {
    const isSelected = selectedPayouts.includes(item.id);
    const isScheduled = item.status === "Scheduled";

    return (
      <TouchableOpacity
        style={[styles.payoutCard, isSelected && styles.payoutSelected]}
        onPress={() => handlePayoutPress(item)}
        onLongPress={() => handleLongPress(item.id)}
        delayLongPress={300}
      >
        {/* Left */}
        <View style={styles.payoutLeft}>
          <View style={styles.payoutIconWrapper}>
            <Feather name="dollar-sign" size={22} color={Colors.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.payoutAmount}>
              {formatCurrency(item.amount)}
            </Text>
            <Text style={styles.payoutTitle}>{item.title}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="mail-outline"
                size={13}
                color={Colors.secondary}
              />
              <Text style={styles.payoutMeta}>{item.email}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color={Colors.secondary}
              />
              <Text style={styles.payoutMeta}>Scheduled: {item.due_date}</Text>
            </View>
          </View>
        </View>

        {/* Right */}
        {selectionMode ? (
          <Feather
            name={isSelected ? "check-circle" : "circle"}
            size={22}
            color={isSelected ? Colors.green : Colors.gray}
          />
        ) : (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <DashboardLayout>
      <View style={styles.container}>
        {/* Card Header */}
        <LinearGradient
          colors={[Colors.primary, "#3a84fb"]} // left → right
          start={{ x: 0, y: 1 }}
          end={{ x: 2, y: 0 }}
          style={styles.card}
        >
          <Image
            source={require("../../../../../assets/images/upperDiv.png")}
            style={{
              position: "absolute",
              width: 100,
              height: 110,
              top: -30,
              right: -50,
            }}
          />
          {/* <View style={styles.card}> */}

          <Text style={styles.cardTitle}>Total Payouts amount</Text>
          <Text style={styles.cardValue}>
            {formatCurrency(Number(totalPayoutAmount.toFixed(1) ?? "--"))}
          </Text>
          <View style={styles.mirror}>
            <Text
              style={{
                color: Colors.white,
                fontWeight: "400",
                fontFamily: "Inter_400Regular",
                fontSize: 12,
              }}
            >
              Total payouts:{" "}
              <Text style={styles.cardSubtitle}>
                {/* July 15, 2024 */}
                {pagination.total}
              </Text>
            </Text>
          </View>
          {/* <View style={styles.balanceActionsRow}></View> */}
          {/* </View> */}
          <Image
            source={require("../../../../../assets/images/lowerDiv.png")}
            style={{
              position: "absolute",
              width: 200,
              height: 260,
              bottom: -190,
              left: -150,
            }}
          />
          {/* <View style={styles.balanceActionsRow}></View> */}
        </LinearGradient>
        {/* Filters */}
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
        {/* ✅ Bulk Action Header */}
        {selectionMode && (
          <View style={styles.bulkHeader}>
            <TouchableOpacity onPress={handleCancelSelection}>
              <Feather name="x" size={20} color={Colors.error} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSelectAll}>
              <Text style={styles.bulkSelectAll}>
                {selectedPayouts.length === filtered.length
                  ? "Deselect All"
                  : "Select All"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bulkPaidBtn}
              onPress={handleOpenMarkAsPaid}
            >
              <Feather name="check" size={18} color="#fff" />
              <Text style={styles.bulkPaidText}>Mark as Paid</Text>
            </TouchableOpacity>
          </View>
        )}
        <MarkAsPaidModal
          visible={showMarkAsPaidModal}
          onClose={() => setShowMarkAsPaidModal(false)}
          onSubmit={handleBulkMarkAsPaid}
          isBulk={true} // 👈 Hide details
        />

        {/* List */}

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPayout}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={handleRefresh}
          ListHeaderComponent={
            payouts.length === 0 ? null : (
              <Text style={styles.sectionTitle}>Payouts</Text>
            )
          }
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color={Colors.green} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Image
                source={require("../../../../../assets/images/noInvestment.png")}
                style={{ width: 100, height: 100 }}
              />
              <Text style={styles.emptyText}>No payouts available.</Text>
            </View>
          }
          contentContainerStyle={styles.scrollContent}
        />
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    paddingBottom: 80,
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
  mirror: {
    backgroundColor: Colors.mirror,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 0.3,
    borderColor: Colors.white,
    opacity: 0.7,
    marginTop: 4,
  },
  cardValue: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    fontWeight: "600",
    marginVertical: 2,
  },
  cardSubtitle: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 18 },
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
    borderWidth: 1,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    marginTop: 70,
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 30,
    // paddingVertical: 16,
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
  payoutCard: {
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

  payoutSelected: {
    borderColor: Colors.green,
    borderWidth: 2,
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
    backgroundColor: Colors.statusbg,
  },

  statusText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.statusText,
  },

  // ✅ Bulk action styles
  bulkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 12,
    marginVertical: 2,
  },
  bulkSelectAll: { color: Colors.green, fontSize: 15, fontWeight: "600" },
  bulkPaidBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.green,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bulkPaidText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },
});

export default PayoutsScreen;
