import { DashboardLayout } from "@/modules/Common/components/DashboardLayout";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { getCurrentUser } from "@/shared/store/slices/profile/profileSlice";
import { exportReport } from "@/shared/store/slices/shared/portfolio/exportReportSlice";
import { fetchPortfolio } from "@/shared/store/slices/shared/portfolio/portfolioSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
            <Feather name="briefcase" size={22} color={Colors.primary} />
          </View>

          <View>
            <Text style={styles.assetName}>{item.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
            <Ionicons name="wallet-outline" size={12} color={Colors.gray} />
            <Text style={styles.assetValue}>{formatCurrency(item.value)}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="calendar-outline" size={12} color={Colors.secondary} />
            <Text style={styles.assetMeta}>Start: {item.start}</Text>
            </View>
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
      {/* <View style={styles.card}> */}
      <LinearGradient
        colors={[Colors.primary, "#3a84fb"]} // left → right
        start={{ x: 0, y: 1 }}
        end={{ x: 2, y: 0 }}
        style={styles.balanceCardDark}
      >
        <Image source={require('../../../../../assets/images/upperDiv.png')} style={{ position: 'absolute', width: 170, height: 170, top: -100, right: -115 }} />
        <Text style={styles.cardTitle}>Total Earned</Text>
        <Text style={styles.cardValue}>
          {formatCurrency(Number(data?.summary.total_earned)) ?? 0}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.mirror}>
            <Text style={styles.cardSubtitle}>
              Total Investments:
              <Text style={styles.balanceChangeDark}>
                {data?.summary.total_investments}
              </Text>
            </Text>
          </View>
          <View style={styles.mirror}>
            <Text style={styles.cardSubtitle}>
              Active Investments:
              <Text style={styles.balanceChangeDark}>
                {data?.summary.active_investments}
              </Text>
            </Text>
          </View>
        </View>
        <Image source={require('../../../../../assets/images/lowerDiv.png')} style={{ position: 'absolute', width: 200, height: 260, bottom: -190, left: -150, }} />
      </LinearGradient>
      {/* </View> */}
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
          <View style={styles.toggleWrapper}>
            <TouchableOpacity
              style={[
                styles.toggleItem,
                activeChart === "roi" && styles.toggleItemActive,
              ]}
              onPress={() => setActiveChart("roi")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  activeChart === "roi" && styles.toggleTextActive,
                ]}
              >
                ROI %
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleItem,
                activeChart === "earned" && styles.toggleItemActive,
              ]}
              onPress={() => setActiveChart("earned")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  activeChart === "earned" && styles.toggleTextActive,
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
              <Image source={require('../../../../../assets/images/noInvestment.png')} style={{ width: 100, height: 100, alignSelf: 'center' }} />
              <Text style={styles.emptyText}>No investments assets found</Text>
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
  emptyState: { justifyContent: "center", alignItems: "center", padding: 2 },
  emptyText: { fontSize: 18, color: "#6B7280" },
  card: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    paddingTop: 36,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  balanceCardDark: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 12,
    padding: 24,
    // paddingTop: 36,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter_500Regular",
  },
  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: "#E6EDFF",
    borderRadius: 24,
    padding: 4,
    alignSelf: "flex-start",
    marginLeft: 16,
    marginTop: 12,
  },

  toggleItem: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  toggleItemActive: {
    backgroundColor: Colors.green,
  },

  toggleText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },

  toggleTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  cardValue: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    fontWeight: "600",
    marginVertical: 2,
  },
  chart: { borderRadius: 12, marginVertical: 8 },
  mirror: { backgroundColor: Colors.mirror, width: '47%', justifyContent: 'center', alignItems: 'center', borderRadius: 18, paddingVertical: 4, paddingHorizontal: 12, borderWidth: 0.3, borderColor: Colors.white, opacity: 0.7, marginTop: 4, },
  cardSubtitle: {
    color: Colors.white,
    fontWeight: "400",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  balanceChangeDark: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 18 },
  chartContainer: {
    alignItems: "center",
    marginBottom: 18,
    backgroundColor: Colors.white,
    margin: 12,
    borderRadius: 12,
    justifyContent: "center",
    borderColor: "#E6EDFF",
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 10,
    marginHorizontal: 12,
  },
  assetCard: {
    // backgroundColor: Colors.secondary,
    // borderRadius: 16,
    // padding: 14,
    // marginBottom: 12,
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
    // borderWidth: 1,
    // borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6EDFF",
  },
  assetLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  assetIconWrapper: {
    // width: 40,
    // height: 40,
    // borderRadius: 20,
    // backgroundColor: Colors.darkButton,
    // alignItems: "center",
    // justifyContent: "center",
    // marginRight: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGray, // 20% opacity
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  assetName: {
    color: Colors.secondary,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  assetValue: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  assetMeta: {
    color: Colors.secondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
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
    backgroundColor: Colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    // flexDirection: "row",
    alignItems: "center",
    // paddingHorizontal: 18,
    // paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  fabLabel: { color: Colors.white, fontWeight: "bold", fontSize: 15 },
});
export default PortfolioScreen;
