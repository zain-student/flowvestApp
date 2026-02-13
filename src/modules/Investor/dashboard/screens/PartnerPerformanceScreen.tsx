// src/screens/PartnerPerformanceScreen.tsx
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerPerformance } from "@/shared/store/slices/investor/dashboard/addPartnerSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export const PartnerPerformanceScreen = ({ route }: any) => {
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const { isLoading, performance, error } = useAppSelector(
    (state) => state.partner,
  );
  const { formatCurrency } = useCurrencyFormatter();
  const breakdown = (performance?.investment_breakdown ?? []).map(
    (item, index) => ({
      name: item.investment_type,
      amount: item.amount,
      color: ["#4cafef", "#ff9800", "#8e44ad", "#2ecc71"][index % 4], // rotate colors
      legendFontColor: "#333",
      legendFontSize: 13,
    }),
  );
  const monthly = performance?.monthly_performance ?? [];
  useEffect(() => {
    dispatch(fetchPartnerPerformance(id));
  }, [id]);
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Overview Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Performance Overview</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Total Invested</Text>
            <Text style={styles.value}>
              {formatCurrency(
                Number(performance?.overview.total_invested ?? 0),
              )}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Current Value</Text>
            <Text style={styles.value}>
              {formatCurrency(
                performance?.overview.current_portfolio_value ?? 0,
              )}
            </Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Total Earned</Text>
            <Text style={styles.value}>
              {formatCurrency(performance?.overview.total_earned ?? 0)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>ROI</Text>
            <Text style={styles.value}>
              {performance?.overview.overall_roi}%
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Active</Text>
            <Text style={styles.value}>
              {performance?.overview.active_investments}
            </Text>
          </View>
        </View>
      </View>

      {/* Monthly Performance Chart */}
      <Text style={styles.sectionTitle}>Monthly Performance</Text>
      {monthly.length > 0 ? (
        <LineChart
          data={{
            labels: monthly.map((item) =>
              new Date(item.month + "-01").toLocaleString("default", {
                month: "short",
              }),
            ),
            datasets: [
              {
                data: monthly.map((item) => item.roi),
              },
            ],
          }}
          width={screenWidth - 30}
          height={220}
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: Colors.primary,
            backgroundGradientFrom: Colors.primary,
            backgroundGradientTo: Colors.primary,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: () => "#666",
          }}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noData}>No monthly performance available</Text>
      )}
      {/* Investment Breakdown */}
      <Text style={styles.sectionTitle}>Investment Breakdown</Text>
      <Text style={styles.sectionSubtitle}>
        Distribution of your total invested amount
      </Text>
      {(performance?.investment_breakdown ?? []).length > 0 ? (
        <View style={styles.breakdownContainer}>
          {performance?.investment_breakdown?.map((item, index) => {
            // const total = performance?.total_investment ?? 1;
            const total = Number(performance?.overview?.total_invested || 1);
            const percentage = ((item.amount / total) * 100).toFixed(1);

            return (
              <View key={index} style={styles.breakdownItem}>
                {/* Row: Investment Type + Amount */}
                <View style={styles.row}>
                  <Text style={styles.investType}>{item.investment_type}</Text>
                  <Text style={styles.investAmount}>
                    {formatCurrency(item.amount)}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${percentage}%` as any,
                        backgroundColor: [
                          "#4cafef",
                          "#ff9800",
                          "#8e44ad",
                          "#2ecc71",
                        ][index % 4],
                      },
                    ]}
                  />
                </View>

                {/* Percentage */}
                <Text style={styles.percentText}>{percentage}%</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.noData}>No breakdown available</Text>
      )}
    </ScrollView>
  );
};

export default PartnerPerformanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 15,
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    color: Colors.white,
    fontSize: 13,
    marginBottom: 4,
    fontFamily: "Inter_500Medium",
  },
  value: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    // marginBottom: 6,
    marginTop: 10,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6B7280", // soft gray (not too light, not too dark)
    // marginTop: 4,
    marginBottom: 12,
    lineHeight: 18,
  },

  chart: {
    borderRadius: 12,
    marginBottom: 20,
  },
  noData: {
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },

  breakdownContainer: {
    marginBottom: 20,
  },
  breakdownItem: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  investType: { fontSize: 14, fontWeight: "500", color: "#444" },
  investAmount: { fontSize: 14, fontWeight: "600", color: "#000" },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  percentText: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
});
