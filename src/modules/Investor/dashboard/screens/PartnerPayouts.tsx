// src/screens/PartnerPayoutsScreen.tsx
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerPayouts } from "@/shared/store/slices/investor/dashboard/addPartnerSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
export const PartnerPayouts = ({ route }: any) => {
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const { isLoading, error, payouts, payoutSummary } = useAppSelector((state) => state.partner);
const {formatCurrency}=useCurrencyFormatter();
  useEffect(() => {
    dispatch(fetchPartnerPayouts(id));
  }, [id])
  const renderPayout = ({ item }: any) => (

    <View style={styles.card}>
      {/* Amount + Status */}
      <View style={styles.cardHeader}>
        <Text style={styles.inveName}>{item.investment}</Text>
        <Text
          style={[
            styles.status,
            item.status === "paid" ? styles.paid : styles.pending,
          ]}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>

      {/* Method + Date */}
      <View style={styles.cardFooter}>
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
        <Text style={styles.date}>{new Date(item.paid_date).toDateString()}</Text>
      </View>
    </View>
  );
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Paid</Text>
            <Text style={styles.summaryValue}>{formatCurrency(payoutSummary?.total_paid ?? 0)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summaryValue}>{formatCurrency(payoutSummary?.pending_amount ?? 0)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Payouts</Text>
            <Text style={styles.summaryValue}>{payoutSummary?.total_payouts}</Text>
          </View>
        </View>
      </View>

     
      {payouts && payouts.length > 0 ? (
        <FlatList
          data={payouts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPayout}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>Recent Payouts</Text>
          }
        />
      ) : (
        <View style={styles.card}>
          <Text style={styles.noDataText}>Payouts not available</Text>
        </View>
      )}
    </View>
  );
};

export default PartnerPayouts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    fontFamily: "Inter_500Medium",
  },

  summaryCard: {
    backgroundColor: Colors.secondary,
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 12,
    fontFamily: "Inter_600SemiBold",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    color: Colors.white,
    fontSize: 13,
    marginBottom: 4,
    fontFamily: "Inter_500Medium",
  },
  summaryValue: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  inveName: {
    fontSize: 18,
    color: Colors.secondary,
    fontFamily: "Inter_700Bold",
  },
  status: {
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    overflow: "hidden",
    color: "white",
    fontFamily: "Inter_600SemiBold",
  },
  paid: {
    backgroundColor: Colors.activeStatusBg,
    color: Colors.activeStatus,
  },
  pending: {
    backgroundColor: Colors.inActiveStatusBg,
    color: Colors.inActiveStatus,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amount: {
    color: Colors.secondary,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  date: {
    fontSize: 16,
    color: "gray",
  },
});
