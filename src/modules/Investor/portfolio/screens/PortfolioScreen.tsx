import { DashboardLayout } from "@/modules/Common/components/DashboardLayout";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPortfolio } from "@/shared/store/slices/investor/portfolio/portfolioSlice";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;



const mockAssets = [
  { id: 1, name: "Tech Growth Fund", value: 12000, growth: "+8.2%" },
  { id: 2, name: "Real Estate Trust", value: 5000, growth: "+2.1%" },
  { id: 3, name: "Green Energy Bonds", value: 3000, growth: "+5.7%" },
  { id: 4, name: "Tech Growth Fund", value: 12000, growth: "+8.2%" },
  { id: 5, name: "Real Estate Trust", value: 5000, growth: "+2.1%" },
  { id: 6, name: "Green Energy Bonds", value: 3000, growth: "+5.7%" },
];

const renderAssets = ({ item }: any) => (
  <View style={styles.assetCard}>
    <View style={{ flex: 1 }}>
      <Text style={styles.assetName}>{item.name}</Text>
      <Text style={styles.assetValue}>
        ${item.value.toLocaleString()}
      </Text>
      <Text style={styles.assetValue}>
        Start: {item.start}
      </Text>
    </View>
    <Text style={styles.assetGrowth}>{item.expected_return_rate}</Text>
  </View>
)
// const handleLoadMore = () => {
//   if (!isLoadingMore && pagination.current_page!== pagination.last_page) {
//     dispatch(fetchPayouts(pagination.current_page + 1));
//   }
// }; 

// // Pull-to-refresh
// const handleRefresh = () => {
//   dispatch(fetchPayouts(1));
// };
export const PortfolioScreen: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading, error, data } = useAppSelector((state) => state.portfolio)
  useEffect(() => {
    dispatch(fetchPortfolio())
  }, [dispatch])
  const assets =
    data?.own_investments?.map((inv) => ({
      id: inv.id,
      name: inv.name,
      value: parseFloat(inv.initial_amount || "0"),
      // growth: `${inv.performance?.completion_percentage ?? 0}%`,
      expected_return_rate: `${Number(inv.expected_return_rate ?? 0).toFixed(2)}%`,
      start: inv.start_date,
    })) ?? [];
  return (
    <DashboardLayout>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Net Worth</Text>
        <Text style={styles.cardValue}>${data?.summary.total_earned}</Text>
        <Text style={styles.cardSubtitle}>Asset Allocation</Text>
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

      <View style={styles.chartContainer}>
        <BarChart
          data={{
            labels: ["All Time", "Year", "Quarter", "Month"],
            datasets: [
              {
                // take ROI percentage values from API
                data: [
                  data?.performance?.all_time?.roi_percentage ?? 0,
                  data?.performance?.year?.roi_percentage ?? 0,
                  data?.performance?.quarter?.roi_percentage ?? 0,
                  data?.performance?.month?.roi_percentage ?? 0,
                ],
              },
            ],
          }}
          width={screenWidth - 32}
          height={200}
          fromZero
          yAxisLabel=""
          yAxisSuffix="%"
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForBackgroundLines: {
              strokeWidth: 1,
              stroke: "#e3e3e3",
              strokeDasharray: "0",
            },
          }}
          style={{
            borderRadius: 12,
            // marginVertical: 8,
          }}
        />
        <Text style={styles.chartLabel}>Performance ROI %</Text>
      </View>

      <Text style={styles.sectionTitle}>Investments Assets</Text>
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAssets}
        // onEndReached={handleLoadMore}
        //   onEndReachedThreshold={0.5}
        //   refreshing={isLoading}
        //   onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="small" color={Colors.green} /> : null
        }
        contentContainerStyle={styles.scrollContent}
      />
      <TouchableOpacity style={styles.fab}>

        <Ionicons name="document-outline" size={24} color={"white"} />
        <Text style={styles.fabLabel}>Export Report</Text>
      </TouchableOpacity>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    // flex:1,
    paddingBottom: 100, backgroundColor: Colors.background
  },
  card: {
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    padding: 24,
    paddingTop: 36,
    // marginBottom: 18,
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

  cardSubtitle: { fontSize: 14, color: Colors.gray },
  balanceActionBtnDark: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.darkButton,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 12,
  },
  balanceActionTextDark: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 7,
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 18 },
  chartContainer: { alignItems: "center", marginBottom: 18 },
  chartBar: {
    width: "90%",
    height: 80,
    backgroundColor: "#FDE68A",
    borderRadius: 16,
    marginBottom: 8,
    marginTop: 10,
  },
  chartLabel: { color: Colors.green, fontWeight: "600", fontSize: 13 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 10,
    marginHorizontal: 12
  },
  assetCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
    marginHorizontal: 12
  },
  assetName: { fontSize: 16, fontWeight: "600", color: Colors.white },
  assetValue: { fontSize: 15, color: Colors.gray, marginTop: 2 },
  assetGrowth: { fontSize: 15, color: Colors.green, fontWeight: "600" },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 80,
    backgroundColor: Colors.green,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  fabIcon: { fontSize: 22, color: Colors.white, marginRight: 6 },
  fabLabel: { color: Colors.white, fontWeight: "bold", fontSize: 15 },
});
export default PortfolioScreen;
 