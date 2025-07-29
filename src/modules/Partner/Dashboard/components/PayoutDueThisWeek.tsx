import Colors from "@/shared/colors/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const mockPayouts = [
  {
    id: 1,
    investor: "Zain Malik",
    amount: "$500",
    dueDate: "July 27, 2025",
  },
  {
    id: 2,
    investor: "Ayesha Khan",
    amount: "$2,000",
    dueDate: "July 28, 2025",
  },
];

export const PayoutDueThisWeek: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Payouts Due This Week</Text>

      {mockPayouts.length === 0 ? (
        <Text style={styles.emptyText}>No payouts due this week.</Text>
      ) : (
        mockPayouts.map((payout) => (
          <View key={payout.id} style={styles.card}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.investor}>{payout.investor}</Text>
              <Text style={styles.subtext}>Due: {payout.dueDate}</Text>
            </View>
            <Text style={styles.subtext}>{payout.amount}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    color: "colors.secondary",
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  card: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: Colors.secondary,
    marginHorizontal: 7,
    borderRadius: 8,
  },
  investor: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    color: Colors.white,
  },
  subtext: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 15,
    textAlign: "center",
  },
});

export default PayoutDueThisWeek;
