// src/screens/PartnerPayoutsScreen.tsx
import Colors from "@/shared/colors/Colors";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export const PartnerPayouts = () => {
  // Dummy Data (replace with API later)
  const dummySummary = {
    total_paid: 15000,
    pending_amount: 5000,
    total_payouts: 4,
  };

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
      <View style={styles.cardHeader}>
        <Text style={styles.payoutTitle}>Amount: ${item.amount}</Text>
        <Text style={styles.date}>
          {new Date(item.date).toDateString()}
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.method}>Method: {item.method}</Text>
        <Text
          style={[
            styles.status,
            item.status === "paid" ? styles.paid : styles.pending,
          ]}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.cardValue}>Total Paid: ${dummySummary.total_paid}</Text>
        <Text style={styles.cardValue}>Pending Amount: ${dummySummary.pending_amount}</Text>
        <Text style={styles.cardValue}>Total Payouts: {dummySummary.total_payouts}</Text>
      </View>

      {/* Payouts List */}
      <FlatList
        data={dummyPayouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPayout}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Payouts</Text>
        }
      />
    </View>
  );
};

export default PartnerPayouts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 12,
  },
  summaryCard: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 8,
    fontFamily: "Inter_600SemiBold",
  },
  cardValue: {
    color: Colors.white,
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  payoutTitle: {
    fontSize: 16,
    color: Colors.secondary,
    fontFamily: "Inter_600SemiBold",
  },
  method: {
    fontSize: 14,
    color: Colors.secondary,
  },
  status: {
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    color: "white",
  },
  paid: {
    backgroundColor: Colors.activeStatusBg,
    color: Colors.activeStatus,
  },
  pending: {
    backgroundColor: Colors.inActiveStatusBg,
    color: Colors.inActiveStatus,
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
});
