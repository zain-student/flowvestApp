// src/screens/PartnerPayoutsScreen.tsx
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerPayouts } from "@/shared/store/slices/investor/dashboard/addPartnerSlice";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
export const PartnerPayouts = ({ route }: any) => {
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const { isLoading, error, payouts, payoutSummary } = useAppSelector((state) => state.partner);

  useEffect(() => {
    dispatch(fetchPartnerPayouts(id));
  }, [id])
  // Dummy Summary Data
  const dummySummary = {
    total_paid: 15000,
    pending_amount: 5000,
    total_payouts: 4,
  };

  // Dummy Payout List
  const dummyPayouts = [
    {
      id: 1,
      date: "2025-08-15",
      amount: 4000,
      status: "paid",
      method: "Bank Transfer",
    },
    {
      id: 2,
      date: "2025-07-10",
      amount: 3500,
      status: "paid",
      method: "Cheque",
    },
    {
      id: 3,
      date: "2025-06-05",
      amount: 4000,
      status: "pending",
      method: "Bank Transfer",
    },
    {
      id: 4,
      date: "2025-05-02",
      amount: 2500,
      status: "paid",
      method: "Cash",
    },
  ];

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
        <Text style={styles.amount}>${item.amount}</Text>
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

  // if (error) {
  //   return (
  //     <View style={styles.center}>
  //       <Text style={{ color: "red" }}>{error}</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Paid</Text>
            <Text style={styles.summaryValue}>${payoutSummary?.total_paid}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summaryValue}>${payoutSummary?.pending_amount}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Payouts</Text>
            <Text style={styles.summaryValue}>{payoutSummary?.total_payouts}</Text>
          </View>
        </View>
      </View>

      {/* Payouts List */}
      {/* {payouts && payouts.length > 0 ? (
      <FlatList
        data={payouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPayout}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Recent Payouts</Text>
        }
      />
      ):(
        <View style={styles.center}>
          <Text style={styles.noDataText}> Payouts not availible</Text>
          </View>
      )
    } */}
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
