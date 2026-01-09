import { InvestorDashboardStackParamList } from "@/navigation/InvestorStacks/InvestorDashboardStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchAdminDashboard } from "@/shared/store/slices/investor/dashboard/adminDashboardSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { DashboardLayout } from "../../../Common/components/DashboardLayout";
SplashScreen.preventAutoHideAsync(); // Keep splash visible


type Props = NativeStackNavigationProp<
  InvestorDashboardStackParamList,
  "InvestorDashboard"
>;
export const DashboardScreen: React.FC = () => {

  const navigation =
    useNavigation<NativeStackNavigationProp<InvestorDashboardStackParamList>>();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  useEffect(() => {
    const hide = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await SplashScreen.hideAsync();
    };
    hide();
  }, []);
  const dispatch = useAppDispatch();
  const { stats, recent_activities, isLoading } = useAppSelector(
    (state) => state.adminDashboard
  );
  const { formatCurrency } = useCurrencyFormatter();
  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);
  const statCards = [
    {
      icon: "layers",
      label: "Pending Payouts",

      value: stats?.pending_payouts_count
        ?? "--",
      bg: "#E0F2FE", // pastel blue
    },
    {
      icon: "activity",
      label: "Active Investments",
      value: stats?.active_investments ?? "--",
      bg: "#DCFCE7", // pastel green
    },
    {
      icon: "users",
      label: "Partners",

      value: stats?.total_partners ?? "--",
      bg: "#FDE68A", // pastel yellow
    },
    {
      icon: "percent",
      label: "Avg ROI",
      value: stats?.roi_average.toFixed(1) ?? "--",
      bg: "#FCE7F3", // pastel pink
    },
  ];


  // const activeInvestments = investments.filter((i) => i.status === "active");
  if (!fontsLoaded) return null;
  const pullToRefresh = () => {
    dispatch(fetchAdminDashboard())
  }
  const renderActivityItem = ({ item }: any) => {
    const statusLower = item.status.toLowerCase();

    return (
      <View style={styles.activityCard}>
        {/* Left: Icon */}
        <View style={styles.iconWrapper}>
          <Feather
            name={
              item.type === "payout"
                ? "arrow-down-right"
                : item.type === "investment"
                  ? "arrow-up-right"
                  : "activity"
            }
            size={22}
            color={Colors.white}
          />
        </View>

        {/* Middle: Title & Dates */}
        <View style={styles.infoWrapper}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activitySubText}>Created: {formatDate(item.created_at ?? "N/A")}</Text>
          <Text style={styles.activitySubText}>Time: {item.time}</Text>
        </View>

        {/* Right: Amount & Status */}
        <View style={styles.rightWrapper}>
          <Text style={styles.activityAmount}>
            {item.amount ?? "0"}
          </Text>
          <Text
            style={[
              styles.activityStatus,
              statusLower === "completed"
                ? styles.statusCompleted
                : statusLower === "processing"
                  ? styles.statusProcessing
                  : styles.statusCancelled,
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <DashboardLayout headerStyle="dark">
      {/* Main Balance Card (dark, rounded) */}
      <View style={styles.container}>
        <View style={styles.balanceCardDark}>
          <Text style={styles.balanceLabelDark}>Total Managed Portfolio</Text>
          <Text style={styles.balanceValueDark}>
            {stats?.total_managed_portfolio ? formatCurrency(stats.total_managed_portfolio) : "--"}
          </Text>
          <Text style={styles.balanceChangeDark}>
            {stats?.new_investments_this_month ?? "--"}{" "}
            <Text
              style={{
                color: Colors.gray,
                fontWeight: "400",
                fontFamily: "Inter_400Regular",
              }}
            >
              {/* than last month */}
              investments this month
            </Text>
          </Text>
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={pullToRefresh}
              tintColor={Colors.primary}
            />
          }
        >
          {/* Stat Cards - 2x2 Grid */}
          <View style={styles.statCardGrid}>
            {statCards.map((card, idx) => (
              <View
                key={card.label}
                style={[
                  styles.statCardLarge,
                  {
                    backgroundColor: card.bg,
                    marginRight: idx % 2 === 0 ? 8 : 0,
                    marginLeft: idx % 2 === 1 ? 8 : 0,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.statLabelLarge}>{card.label}</Text>
                  <Text style={styles.statValueLarge}>{card.value}</Text>
                </View>
                <Feather
                  name={card.icon as any}
                  size={38}
                  color="#888"
                  style={{ alignSelf: "flex-end" }}
                />
              </View>
            ))}
          </View>
          <View style={styles.activityList}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            {isLoading ? (
              <Text style={styles.emptyText}>Loading...</Text>
            ) : recent_activities?.length === 0 ? (
              <Text style={styles.emptyText}>No recent activities.</Text>
            ) : (
              <FlatList
                data={recent_activities}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                renderItem={renderActivityItem}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                ListEmptyComponent={
                  !isLoading && (
                    <Text style={styles.emptyText}>No recent activities found</Text>
                  )
                }
              />

            )}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.fab}
          onPress={
            () => navigation.navigate("AddPartner", {}) // Adjust navigation to your stack
          }
        >
          {/* <Text style={styles.fabIcon}>＋</Text> */}
          <Ionicons name="add" size={24} color={"white"} />
          <Text style={styles.fabLabel}>Add Partner</Text>
        </TouchableOpacity>
      </View>
    </DashboardLayout>
  );
};
const formatDate = (d?: string | null) => {
  if (!d) return "N/A";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: "#E5E7EB", },
  logo: { fontSize: 22, fontWeight: "bold", color: "#2563EB" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#2563EB", alignItems: "center", justifyContent: "center", marginRight: 12, },
  avatarText: { color: Colors.white, fontWeight: "bold", fontSize: 16 },
  signOutBtn: { padding: 6 },
  signOutText: { fontSize: 22, color: "#EF4444" },
  scrollContent: { padding: 0, paddingBottom: 100, backgroundColor: Colors.background, },
  balanceCardDark: { backgroundColor: Colors.secondary, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, padding: 24, paddingTop: 36, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, elevation: 6, },
  balanceLabelDark: { color: Colors.gray, fontSize: 15, fontFamily: "Inter_400Regular", },
  balanceValueDark: { color: Colors.white, fontSize: 36, fontFamily: "Inter_700Bold", fontWeight: "700", marginVertical: 2, },
  balanceChangeDark: { color: Colors.green, fontSize: 14, fontFamily: "Inter_600SemiBold", },
  balanceActionsRow: { flexDirection: "row", marginTop: 18 },
  balanceActionBtnDark: { width: '40%', flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: Colors.darkButton, borderRadius: 18, paddingHorizontal: 18, paddingVertical: 8, marginRight: 12, },
  balanceActionTextDark: { color: Colors.white, fontSize: 15, fontFamily: "Inter_600SemiBold", marginLeft: 7, },
  statCardGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginHorizontal: 12, marginTop: 8, marginBottom: 24, },
  statCardLarge: {
    width: "47%", flexDirection: "row", alignItems: "center", borderRadius: 22, padding: 20, minHeight: 90, marginVertical: 8, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  statLabelLarge: { color: Colors.secondary, fontSize: 16, fontFamily: "Inter_400Regular", marginBottom: 2, },
  statValueLarge: { color: "colors.secondary", fontSize: 32, fontFamily: "Inter_700Bold", fontWeight: "700", },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginBottom: 6, },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", fontWeight: "700", color: "colors.secondary", },
  activityList: { paddingHorizontal: 8 },
  activityCard: { backgroundColor: Colors.secondary, borderRadius: 14, padding: 16, marginVertical: 6, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 3, },
  iconWrapper: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.green + "33", justifyContent: "center", alignItems: "center", marginRight: 12, },
  infoWrapper: { flex: 1 },
  rightWrapper: { alignItems: "flex-end" },
  activityTitle: { color: Colors.white, fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 2, },
  activitySubText: { color: Colors.gray, fontSize: 12, fontFamily: "Inter_400Regular", },
  activityAmount: { color: Colors.green, fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 2, },
  activityStatus: { fontSize: 13, fontFamily: "Inter_600SemiBold", },
  statusCompleted: { color: Colors.green },
  statusProcessing: { color: Colors.yellow },
  statusCancelled: { color: Colors.gray },
  list: { paddingBottom: 20 },
  emptyText: { color: Colors.gray, fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", paddingVertical: 16, },
  tabBar: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", height: 60, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: "#E5E7EB", position: "absolute", left: 0, right: 0, bottom: 0, },
  tabItem: { alignItems: "center", flex: 1 },
  tabIcon: { fontSize: 22, color: "#2563EB" },
  tabLabel: { fontSize: 12, color: "#374151", marginTop: 2 },
  fab: { position: "absolute", right: 24, bottom: 80, backgroundColor: Colors.green, borderRadius: 24, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 12, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 4, },
  fabIcon: { fontSize: 22, color: Colors.white, marginRight: 6 },
  fabLabel: { color: Colors.white, fontWeight: "bold", fontSize: 15 },
});
export default DashboardScreen;
