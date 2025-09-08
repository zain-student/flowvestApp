// src/screens/PartnerInvestmentsScreen.tsx
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerInvestments } from "@/shared/store/slices/addPartnerSlice";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
export const PartnerInvestments = ({ route }: any) => {
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const { isLoading, investments, investmentSummary, error } = useAppSelector((state) => state.partner)
  useEffect(() => {
    dispatch(fetchPartnerInvestments(id))
  }, [id])
  // const { summary } = dummyData;

  const renderInvestment = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.investmentTitle}>{item.title}</Text>
        <Text style={styles.date}>
          Start Date: {new Date(item.start_date).toDateString()}
        </Text>
      </View>
      <Text style={styles.amount}>Invested: ${item.amount_invested}</Text>
      <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
        <Text style={styles.amount}>Current Value: ${item.current_value}</Text>
        <Text
          style={[
            styles.status,
            item.status === "active" ? styles.active : styles.completed,
          ]}
        >
          {item.status.charAt(0).toUpperCase()}{item.status.slice(1)}
        </Text>
      </View>
      <Text style={styles.roi}>ROI: {item.roi_percentage}%</Text>

    </View>
  );
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.cardValue}>Total Invested: ${investmentSummary?.total_invested}</Text>
        <Text style={styles.cardValue}>Current Value: ${investmentSummary?.total_current_value}</Text>
        <Text style={styles.cardValue}>Total ROI: {investmentSummary?.total_roi}%</Text>
      </View>

      {/* Investments List */}
      <FlatList
        data={investments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderInvestment}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Investments</Text>
        }
      />
    </View>
  );
};

export default PartnerInvestments;

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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 16,
    // fontWeight: "bold",
    color: Colors.white,
    marginBottom: 8,
    fontFamily: "Inter_600SemiBold"
  },
  cardValue: {
    color: Colors.white,
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 16,
    // fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowRadius: 5,
    // elevation: 2,

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
  investmentTitle: {
    fontSize: 16,
    color: Colors.secondary,
    // fontWeight: "600",
    fontFamily: "Inter_600SemiBold"
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
  active: {
    backgroundColor: Colors.activeStatusBg,
    color: Colors.activeStatus
  },
  completed: {
    backgroundColor: Colors.inActiveStatusBg,
    color: Colors.inActiveStatus
  },
  amount: {
    fontSize: 14,
    color: Colors.secondary,
    // marginBottom: 4,
  },
  roi: {
    fontSize: 14,
    // fontWeight: "500",
    color: Colors.secondary,
    // marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
});
