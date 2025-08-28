import { InvestorDashboardStackParamList } from "@/navigation/InvestorStacks/InvestorDashboardStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchAdminDashboard } from "@/shared/store/slices/adminDashboardSlice";
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
  const { overview, recent_activities, upcoming_payouts } = useAppSelector(
    (state) => state.dashboard
  );
  const statCards = [
    {
      icon: "layers",
      label: "Total Investments",

      value: overview?.total_investments ?? "--",
      bg: "#E0F2FE", // pastel blue
    },
    {
      icon: "activity",
      label: "Active Investments",
    
      value: overview?.active_investments ?? "--",
      bg: "#DCFCE7", // pastel green
    },
    {
      icon: "users",
      label: "Partners",
    
      value: overview?.total_partners ?? "--",
      bg: "#FDE68A", // pastel yellow
    },
    {
      icon: "percent",
      label: "Avg ROI",
      value: overview?.roi_average ? `${overview.roi_average.toFixed(2)}` : "--",
      bg: "#FCE7F3", // pastel pink
    },
  ];
  // Mock dashboard data (structure matches backend)
const dashboardData = {
  recent_activities: [
    {
      id: 1,
      icon: "arrow-down-right",
      text: "Payout received",
      date: "Jul 1",
      amount: "+$1,200",
    },
    {
      id: 2,
      icon: "arrow-up-right",
      text: 'Invested in "Tech Fund"',
      date: "Jun 28",
      amount: "-$500",
    },
  ],
  upcoming_payouts: [
    {
      id: 1,
      icon: "calendar",
      text: "Payout scheduled",
      date: "Jul 15",
      amount: "$2,000",
    },
  ],
  investment_performance: [],
};

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, []);
  // const activeInvestments = investments.filter((i) => i.status === "active");
  if (!fontsLoaded) return null;

  return (
    <DashboardLayout headerStyle="dark">
      {/* Main Balance Card (dark, rounded) */}
      <View style={styles.balanceCardDark}>
        <Text style={styles.balanceLabelDark}>Total Payout Amount</Text>
        <Text style={styles.balanceValueDark}>
          ${overview?.total_payout_amount ?? "--"}
        </Text>
        <Text style={styles.balanceChangeDark}>
          ${overview?.this_month_payouts ?? "--"}{" "}
          <Text
            style={{
              color: Colors.gray,
              fontWeight: "400",
              fontFamily: "Inter_400Regular",
            }}
          >
            {/* than last month */}
            this month payouts
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

        {/* Recent Activities */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
        </View>
        <View style={styles.activityList}>
          {recent_activities?.length === 0 ? (
            <Text style={styles.emptyText}>No recent activities.</Text>
          ) : (
            recent_activities.map((act) => (
              <View key={act.id} style={styles.activityItem}>
                <Feather
                  name={ act.type.includes("payout")
              ? "arrow-down-right"
              : "arrow-up-right"}
                  size={20}
                  color="colors.secondary"
                  style={styles.activityIcon}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityText}>{act.type}</Text>
                  <Text style={styles.activityDate}>{
                    new Date(act.timestamp).toLocaleDateString()
                    }</Text>
                </View>
                <Text style={styles.activityAmount}>{act.user}</Text>
              </View>
            ))
          )}
        </View>

        {/* Upcoming Payouts */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Upcoming Payouts</Text>
        </View>
        <View style={styles.activityList}>
          {upcoming_payouts.length === 0 ? (
            <Text style={styles.emptyText}>No upcoming payouts.</Text>
          ) : (
            upcoming_payouts.map((up) => (
              <View key={up.id} style={styles.activityItem}>
                <Feather
                  name="calendar"
                  size={20}
                  color="colors.secondary"
                  style={styles.activityIcon}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityText}>{up.investment}</Text>
                  <Text style={styles.activityDate}>{
                  
                  new Date(up.due_date).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.activityAmount}>${up.amount}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={
          () => navigation.navigate("AddPartner") // Adjust navigation to your stack
        }
      >
        {/* <Text style={styles.fabIcon}>＋</Text> */}
        <Ionicons name="add" size={24} color={"white"} />
        <Text style={styles.fabLabel}>Add Partner</Text>
      </TouchableOpacity>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 80, backgroundColor: Colors.background },
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
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    paddingTop: 36,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    // marginBottom: 18,
  },
  balanceLabelDark: {
    color: Colors.gray,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  balanceValueDark: {
    color: Colors.white,
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    marginVertical: 2,
  },
  balanceChangeDark: {
    color: Colors.green,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    // marginBottom: 8
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 18 },
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
  statCardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  statCardLarge: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    padding: 20,
    minHeight: 90,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statLabelLarge: {
    color: "colors.secondary",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  statValueLarge: {
    color: "colors.secondary",
    fontSize: 32,
    fontFamily: "Inter_700Bold",
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
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    color: "colors.secondary",
  },
  activityList: { paddingHorizontal: 8 },
  activityItem: {
    backgroundColor: Colors.white,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  activityIcon: { marginRight: 12 },
  activityText: {
    color: Colors.secondary,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  activityDate: {
    color: Colors.gray,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  activityAmount: {
    color: "colors.secondary",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 15,
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

export default DashboardScreen;
