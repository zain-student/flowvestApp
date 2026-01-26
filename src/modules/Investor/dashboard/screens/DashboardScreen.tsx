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
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
    (state) => state.adminDashboard,
  );
  const { formatCurrency } = useCurrencyFormatter();
  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);
  const statCards = [
    {
      icon: "layers",
      label: "Pending Payouts",

      value: stats?.pending_payouts_count ?? "--",
      bg: "#fff", // pastel blue
    },
    {
      icon: "activity",
      label: "Active INV.",
      value: stats?.active_investments ?? "--",
      bg: "#fff", // pastel green
    },
    {
      icon: "users",
      label: "Partners",

      value: stats?.total_partners ?? "--",
      bg: "#fff", // pastel yellow
    },
    {
      icon: "percent",
      label: "Avg ROI",
      value: stats?.roi_average.toFixed(1) ?? "--",
      bg: "#fff", // pastel pink
    },
  ];

  // const activeInvestments = investments.filter((i) => i.status === "active");
  if (!fontsLoaded) return null;
  const pullToRefresh = () => {
    dispatch(fetchAdminDashboard());
  };
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
            color={Colors.primary}
          />
        </View>

        {/* Middle: Title & Dates */}
        <View style={styles.infoWrapper}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }} >
            <Ionicons name="calendar-outline" size={13} color={Colors.secondary} />
            <Text style={styles.createdDate}>
              Created: {formatDate(item.created_at ?? "N/A")}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }} >
            <Ionicons name="time-outline" size={13} color={Colors.secondary} />
            <Text style={styles.activitySubText}>
              {item.time}</Text>
          </View>
        </View>

        {/* Right: Amount & Status */}
        <View style={styles.rightWrapper}>
          <Text style={styles.activityAmount}>{item.amount ?? "0"}</Text>
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
        {/* <View style={styles.balanceCardDark}> */}
        <LinearGradient
          colors={[Colors.primary, "#3a84fb"]} // left → right
          start={{ x: 0, y: 1 }}
          end={{ x: 2, y: 0 }}
          style={styles.balanceCardDark}
        >
          <Image source={require('../../../../../assets/images/upperDiv.png')} style={{ position: 'absolute', width: 170, height: 170, top: -100, right: -115 }} />
          <Text style={styles.balanceLabelDark}>Total Managed Portfolio</Text>
          <Text style={styles.balanceValueDark}>
            {stats?.total_managed_portfolio
              ? formatCurrency(stats.total_managed_portfolio)
              : "--"}
          </Text>
          <View style={styles.mirror}  >
            {/* <Text style={styles.balanceChangeDark}> */}

            <Text
              style={{
                color: Colors.white,
                fontWeight: "400",
                fontFamily: "Inter_400Regular",
              }}
            >
              {/* than last month */}
              {stats?.new_investments_this_month ?? "--"} investments this month
              {/* </Text> */}
            </Text>
          </View>
          <Image source={require('../../../../../assets/images/lowerDiv.png')} style={{ position: 'absolute', width: 200, height: 260, bottom: -190, left: -150, }} />
          {/* <View style={styles.balanceActionsRow}></View> */}
        </LinearGradient>
        {/* </View> */}
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
                  {/* <View style={{ marginBottom: 6,backgroundColor:Colors.lightGray,width:'28%',height:'28%',justifyContent:'center',borderRadius:20,alignItems:'center' }} > */}

                  <Feather
                    name={card.icon as any}
                    size={22}
                    color={Colors.primary}
                    style={{ backgroundColor: Colors.lightGray, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', padding: 10 }}
                  />
                  {/* </View> */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <Text style={styles.statLabelLarge}>{card.label}: </Text>
                    <Text style={styles.statValueLarge}>{card.value}</Text>
                  </View>
                </View>

              </View>
            ))}
          </View>
          <View style={styles.activityList}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            {isLoading ? (
              <Text style={styles.emptyText}>Loading...</Text>
            ) : recent_activities?.length === 0 ? (
              <>
                <Image source={require('../../../../../assets/images/noRecentActivity.png')} style={{ width: 100, height: 100, alignSelf: 'center' }} />
                <Text style={styles.emptyText}>No recent activities availible</Text>
              </>
            ) : (
              <FlatList
                data={recent_activities}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                renderItem={renderActivityItem}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                // ListEmptyComponent={
                //   !isLoading && (
                //     <View style={styles.emptyState}>
                //       <Feather name="inbox" size={48} color={Colors.gray} />
                //       <Text style={styles.emptyText}>
                //         No recent activities found
                //       </Text>
                //     </View>
                //   )
                // }
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
          <Ionicons name="person-add-outline" size={24} color={"white"} />
        </TouchableOpacity>
      </View>
    </DashboardLayout>
  );
};
const formatDate = (d?: string | null) => {
  if (!d) return "N/A";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logo: { fontSize: 22, fontWeight: "bold", color: "#2563EB" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: Colors.white, fontWeight: "bold", fontSize: 16 },
  signOutBtn: { padding: 6 },
  signOutText: { fontSize: 22, color: "#EF4444" },
  scrollContent: {
    padding: 0,
    paddingBottom: 100,
    backgroundColor: Colors.background,
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
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
  balanceLabelDark: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter_500Regular",
  },
  balanceValueDark: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    fontWeight: "600",
    marginVertical: 2,
  },
  mirror: { backgroundColor: Colors.mirror, width: '70%', justifyContent: 'center', alignItems: 'center', borderRadius: 18, paddingVertical: 4, paddingHorizontal: 12, borderWidth: 0.3, borderColor: Colors.white, opacity: 0.7, marginTop: 4 },
  statCardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "space-around",
    marginHorizontal: 12,
    marginTop: 2,
    marginBottom: 2,
  },
  statCardLarge: {
    width: "47.5%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    paddingHorizontal: 15,
    minHeight: 100,
    marginVertical: 3,
    borderColor: "#E6EDFF",
    borderWidth: 1,
  },
  statLabelLarge: {
    color: Colors.gray,
    fontSize: 14,
    fontFamily: "Inter_500Regular",
    // marginBottom: 2,
  },
  statValueLarge: {
    color: Colors.secondary,
    fontSize: 14,
    fontFamily: "Inter_500Bold",
    fontWeight: "700",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    fontWeight: "500",
    color: "colors.secondary",
  },
  activityList: { paddingHorizontal: 8 },
  activityCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    marginVertical: 2,
    marginHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6EDFF",
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGray, // 20% opacity
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoWrapper: { flex: 1 },
  rightWrapper: { alignItems: "flex-end" },
  activityTitle: {
    color: Colors.secondary,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  createdDate: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  activitySubText: {
    color: Colors.secondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  activityAmount: {
    color: Colors.green,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  activityStatus: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  statusCompleted: { color: Colors.green },
  statusProcessing: { color: Colors.yellow },
  statusCancelled: { color: Colors.gray },
  list: { paddingBottom: 20 },
  emptyText: {
    color: Colors.gray,
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingVertical: 16,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabItem: { alignItems: "center", flex: 1 },
  tabIcon: { fontSize: 22, color: "#2563EB" },
  tabLabel: { fontSize: 12, color: "#374151", marginTop: 2 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 80,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  fabIcon: { fontSize: 22, color: Colors.white, marginRight: 6 },
  fabLabel: { color: Colors.white, fontWeight: "bold", fontSize: 15 },
});
export default DashboardScreen;
