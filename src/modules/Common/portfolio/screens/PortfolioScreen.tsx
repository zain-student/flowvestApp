import { DashboardLayout } from "@/modules/Common/components/DashboardLayout";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { getCurrentUser } from "@/shared/store/slices/profile/profileSlice";
import { exportReport } from "@/shared/store/slices/shared/portfolio/exportReportSlice";
import { fetchPortfolio } from "@/shared/store/slices/shared/portfolio/portfolioSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import ExportReportModal from "../components/ExportReportModal";

export const PortfolioScreen: React.FC = () => {
  const screenWidth = Dimensions.get("window").width;

  const dispatch = useAppDispatch();
  const { isLoading, error, data } = useAppSelector((state) => state.portfolio);
  const [activeChart, setActiveChart] = useState<"roi" | "earned">("roi");
  const { loading, dataExpo } = useAppSelector((state) => state.exportReport);
  const [showExportModal, setShowExportModal] = useState(false);
  const handleExport = (reportType: string, fileType: "pdf" | "csv") => {
    dispatch(exportReport({ reportType, fileType }));
  };
  const { user } = useAppSelector((state) => state.profile);
  const isAdmin = user?.roles?.includes("admin");
  const { formatCurrency } = useCurrencyFormatter();
  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(getCurrentUser());
  }, [dispatch]);
  const assets =
    data?.own_investments?.map((inv) => ({
      id: inv.id,
      name: inv.name,
      value: parseFloat(inv.current_total_invested || inv.initial_amount),
      type: inv.type,
      // growth: `${inv.performance?.completion_percentage ?? 0}%`,
      expected_return_rate: `${Number(inv.expected_return_rate ?? 0).toFixed(2)}%`,
      start: inv.start_date,
    })) ?? [];
  const renderAssets = ({ item }: any) => {
    return (
      <View style={styles.assetCard}>
        {/* Left */}
        <View style={styles.assetLeft}>
          <View style={styles.assetIconWrapper}>
            <Feather name="briefcase" size={18} color={Colors.white} />
          </View>

          <View>
            <Text style={styles.assetName}>{item.name}</Text>
            <Text style={styles.assetValue}>{formatCurrency(item.value)}</Text>
            <Text style={styles.assetMeta}>Start: {item.start}</Text>
          </View>
        </View>

        {/* Right */}
        <View style={styles.assetRight}>
          <View style={styles.assetBadge}>
            <Text style={styles.assetBadgeText}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>
          <Text style={styles.assetGrowth}>{item.expected_return_rate}</Text>
        </View>
      </View>
    );
  };

  // Prepare data for the chart
  const performance = data?.performance;

  const labels = ["All Time", "Year", "Quarter", "Month"];
  const roiValues = [
    performance?.all_time?.roi_percentage ?? 0,
    performance?.year?.roi_percentage ?? 0,
    performance?.quarter?.roi_percentage ?? 0,
    performance?.month?.roi_percentage ?? 0,
  ];
  const earnedValues = [
    performance?.all_time?.total_earned ?? 0,
    performance?.year?.total_earned ?? 0,
    performance?.quarter?.total_earned ?? 0,
    performance?.month?.total_earned ?? 0,
  ];
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    propsForDots: { r: "5", strokeWidth: "2" },
  };
  const pullToRefresh = () => {
    dispatch(fetchPortfolio());
  };
  return (
    <DashboardLayout>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Earned</Text>
        <Text style={styles.cardValue}>
          {formatCurrency(Number(data?.summary.total_earned)) ?? 0}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.cardSubtitle}>
            Total Investments:
            <Text style={styles.balanceChangeDark}>
              {data?.summary.total_investments}
            </Text>
          </Text>
          <Text style={styles.cardSubtitle}>
            Active Investments:
            <Text style={styles.balanceChangeDark}>
              {data?.summary.active_investments}
            </Text>
          </Text>
        </View>
        <View style={styles.balanceActionsRow}></View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={pullToRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.chartContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 3,
            }}
          >
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                activeChart === "roi" && styles.toggleBtnActive,
              ]}
              onPress={() => setActiveChart("roi")}
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  activeChart === "roi" && styles.toggleBtnTextActive,
                ]}
              >
                ROI %
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleBtn,
                activeChart === "earned" && styles.toggleBtnActive,
              ]}
              onPress={() => setActiveChart("earned")}
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  activeChart === "earned" && styles.toggleBtnTextActive,
                ]}
              >
                Earned
              </Text>
            </TouchableOpacity>
          </View>
          {activeChart === "roi" ? (
            <LineChart
              data={{
                labels,
                datasets: [
                  {
                    data: roiValues,
                    color: () => "rgba(34,197,94,1)",
                    strokeWidth: 2,
                  },
                ],
                legend: ["ROI %"],
              }}
              width={screenWidth - 32}
              height={220}
              fromZero
              bezier
              yAxisSuffix="%"
              chartConfig={chartConfig}
              style={styles.chart}
            />
          ) : (
            <LineChart
              data={{
                labels,
                datasets: [
                  {
                    data: earnedValues,
                    color: () => "rgba(59,130,246,1)",
                    strokeWidth: 2,
                  },
                ],
                legend: ["Total Earned"],
              }}
              width={screenWidth - 32}
              height={220}
              fromZero
              bezier
              yAxisLabel="$"
              chartConfig={chartConfig}
              style={styles.chart}
            />
          )}
        </View>

        <Text style={styles.sectionTitle}>Investments Assets</Text>
        <FlatList
          data={assets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAssets}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          ListFooterComponent={
            isLoading ? (
              <ActivityIndicator size="small" color={Colors.green} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="briefcase" size={48} color={Colors.gray} />
              <Text style={styles.emptyText}>No investments available.</Text>
            </View>
          }
          contentContainerStyle={styles.scrollContent}
        />
      </ScrollView>
      {!isAdmin ? null : (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setShowExportModal(true);
          }}
        >
          <Ionicons name="document-outline" size={24} color={"white"} />
          <Text style={styles.fabLabel}>Export Report</Text>
        </TouchableOpacity>
      )}
      <ExportReportModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 60, backgroundColor: Colors.background },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#6B7280" },
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
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.green,
    marginHorizontal: 6,
  },
  toggleBtnActive: { backgroundColor: Colors.green },
  toggleBtnText: { color: Colors.green, fontWeight: "600" },
  toggleBtnTextActive: { color: "#fff" },
  chart: { borderRadius: 12, marginVertical: 8 },
  cardSubtitle: { fontSize: 14, color: Colors.gray },
  balanceChangeDark: {
    color: Colors.green,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 18 },
  chartContainer: {
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: Colors.white,
    margin: 12,
    borderRadius: 25,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 10,
    marginHorizontal: 12,
  },
  assetCard: {
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
  assetLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  assetIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkButton,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  assetName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
  },
  assetValue: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
    marginTop: 2,
  },
  assetMeta: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.gray,
    marginTop: 2,
  },
  assetRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 48,
  },
  assetBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(59,130,246,0.15)",
  },
  assetBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#60A5FA",
  },
  assetGrowth: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.green,
  },
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
  fabLabel: { color: Colors.white, fontWeight: "bold", fontSize: 15 },
});
export default PortfolioScreen;
