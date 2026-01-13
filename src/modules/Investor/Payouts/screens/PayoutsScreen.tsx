import { PayoutStackParamList } from "@/navigation/InvestorStacks/PayoutStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { bulkUpdatePayouts, fetchPayouts } from "@/shared/store/slices/investor/payouts/payoutSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
      ToastAndroid.show(error?.message || "Failed to mark payouts as paid.", ToastAndroid.SHORT);
    }
  };
  const renderPayout = ({ item }: any) => {
    const isSelected = selectedPayouts.includes(item.id);
    const isScheduled = item.status === "Scheduled";

    return (
      <TouchableOpacity
        style={[
          styles.payoutCard,
          isSelected && styles.payoutSelected,
        ]}
        onPress={() => handlePayoutPress(item)}
        onLongPress={() => handleLongPress(item.id)}
        delayLongPress={300}
      >
        {/* Left */}
        <View style={styles.payoutLeft}>
          <View style={styles.payoutIconWrapper}>
            <Feather name="dollar-sign" size={18} color={Colors.white} />
          </View>

          <View>
            <Text style={styles.payoutAmount}>
              {formatCurrency(item.amount)}
            </Text>
            <Text style={styles.payoutTitle}>{item.title}</Text>
            <Text style={styles.payoutMeta}>{item.email}</Text>
            <Text style={styles.payoutMeta}>Scheduled: {item.due_date}</Text>
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
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isScheduled
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(156,163,175,0.15)",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isScheduled ? Colors.green : Colors.gray },
              ]}
            >
              {item.status}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <DashboardLayout>
      <View style={styles.container}>
        {/* Card Header */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Payouts</Text>
          <Text style={styles.cardValue}>
            {formatCurrency(Number(totalPayoutAmount.toFixed(1) ?? "--"))}
          </Text>
          <Text style={styles.cardSubtitle}>
            <Text style={{ color: Colors.gray, fontWeight: "400" }}>
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

            <TouchableOpacity style={styles.bulkPaidBtn} onPress={handleOpenMarkAsPaid}>
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
            payouts.length === 0 ? null : <Text style={styles.sectionTitle}>Payouts</Text>
          }
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color={Colors.green} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
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
  scrollContent: { paddingBottom: 100, backgroundColor: Colors.background },
  card: {
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    paddingTop: 36,
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
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.darkButton,
    borderRadius: 18,
    padding:10,
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
    marginTop: 10,
    marginBottom: 16,
    gap: 10,
    marginHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 4,
    justifyContent: "space-around",
  },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#6B7280" },
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
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.lightGray,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkButton,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  payoutAmount: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
  },

  payoutTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
    marginTop: 2,
  },

  payoutMeta: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.gray,
    marginTop: 1,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },

  statusCancelled: { color: Colors.gray },
  statusScheduled: { color: Colors.green },

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
