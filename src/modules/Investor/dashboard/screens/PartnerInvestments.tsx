// src/screens/PartnerInvestmentsScreen.tsx
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerInvestments } from "@/shared/store/slices/investor/dashboard/addPartnerSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
export const PartnerInvestments = ({ route }: any) => {
  const { id } = route.params;
  const { formatCurrency } = useCurrencyFormatter();
  const dispatch = useAppDispatch();
  const { isLoading, investments, investmentSummary, error } = useAppSelector(
    (state) => state.partner,
  );

  useEffect(() => {
    dispatch(fetchPartnerInvestments(id));
  }, [id]);

  const renderInvestment = ({ item }: any) => (
    <View style={styles.card}>
      {/* Title + Status */}
      <View style={styles.cardHeader}>
        <Text style={styles.investmentTitle}>{item.title}</Text>
        <Text
          style={[
            styles.status,
            item.status === "active" ? styles.active : styles.completed,
          ]}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>

      {/* Amounts */}
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Invested</Text>
        <Text style={styles.amountValue}>
          {formatCurrency(item.amount_invested)}
        </Text>
      </View>
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Current Value</Text>
        <Text style={styles.amountValue}>
          {formatCurrency(item.current_value)}
        </Text>
      </View>

      {/* ROI + Date */}
      <View style={styles.footerRow}>
        <Text style={styles.roi}>ROI: {item.roi_percentage.toFixed(1)}%</Text>
        <Text style={styles.date}>
          {new Date(item.start_date).toDateString()}
        </Text>
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
            <Text style={styles.summaryLabel}>Total Invested</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(investmentSummary?.total_invested ?? 0)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Current Value</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(investmentSummary?.total_current_value ?? 0)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total ROI</Text>
            <Text style={styles.summaryValue}>
              {investmentSummary?.total_roi}%
            </Text>
          </View>
        </View>
      </View>

      {/* Investments List */}
      {investments && investments.length > 0 ? (
        <FlatList
          data={investments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderInvestment}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>Investments</Text>
          }
        />
      ) : (
        <View style={styles.card}>
          <Text style={styles.noDataText}>Investments not available</Text>
        </View>
      )}
    </View>
  );
};

export default PartnerInvestments;

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
    fontSize: 15,
    color: "gray",
    textAlign: "center",
    fontFamily: "Inter_500Medium",
  },

  summaryCard: {
    backgroundColor: Colors.primary,
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
    marginBottom: 10,
  },
  investmentTitle: {
    fontSize: 16,
    color: Colors.secondary,
    fontFamily: "Inter_600SemiBold",
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
  active: {
    backgroundColor: Colors.activeStatusBg,
    color: Colors.activeStatus,
  },
  completed: {
    backgroundColor: Colors.inActiveStatusBg,
    color: Colors.inActiveStatus,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  amountLabel: {
    fontSize: 14,
    color: "gray",
    fontFamily: "Inter_500Medium",
  },
  amountValue: {
    fontSize: 15,
    color: Colors.secondary,
    fontFamily: "Inter_600SemiBold",
  },
  roi: {
    fontSize: 14,
    color: Colors.secondary,
    fontFamily: "Inter_500Medium",
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: 10,
  },
});
