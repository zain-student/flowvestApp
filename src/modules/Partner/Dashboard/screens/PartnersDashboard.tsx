import { DashboardLayout } from "@/modules/Common/components/DashboardLayout";
import { PartnerDashboardStackParamList } from "@/navigation/PartnerStacks/PartnerDashboardStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerDashboard } from "@/shared/store/slices/partner/dashboard/partnerDashboardSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { RecentPaymentsLog } from "../components/RecentPaymentsLog";

type Props = NativeStackNavigationProp<
  PartnerDashboardStackParamList,
  "PartnersDashboard"
>;

export const PartnersDashboard = () => {
  const navigation = useNavigation<Props>();
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.partnerDashboard);
  const { formatCurrency } = useCurrencyFormatter();

  useEffect(() => {
    dispatch(fetchPartnerDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <DashboardLayout>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
      </DashboardLayout>
    );
  }
  const statCards = [
    {
      icon: "layers",
      label: "Pending Payouts",
      value: stats?.pending_payouts_count ?? "--",
      bg: "#E0F2FE", // pastel blue
    },
    {
      icon: "activity",
      label: "Active Investments",
      value: stats?.active_investments ?? "--",
      bg: "#DCFCE7", // pastel green
    },
    {
      icon: "dollar-sign",
      label: "Total Invested",
      value: stats?.total_invested ?? "--",
      bg: "#FDE68A",  // pastel yellow
    },
    {
      icon: "percent",
      label: "ROI %",
      value:
        stats?.roi_percentage !== undefined
          ? `${stats?.roi_percentage.toFixed(1)}`
          : "--",
      bg: "#FCE7F3", // pastel pink
    },
  ];
  const pullToRefresh = () => {
    dispatch(fetchPartnerDashboard())
  }
  return (
    <DashboardLayout>
      <View style={styles.container}>
        {/* 💰 Portfolio Summary Card */}
        <View style={styles.balanceCardDark}>
          <Text style={styles.balanceLabelDark}>Portfolio Value</Text>
          <Text style={styles.balanceValueDark}>
            {formatCurrency(Number(stats?.portfolio_value ?? "--"))}
          </Text>
          <Text style={styles.changeSubLabel}>
            <Text style={styles.balanceChangeDark}>
              {formatCurrency(stats?.total_earned ?? 0)}{" "}
            </Text>
            Total Earned</Text>

          <View style={styles.balanceActionsRow}>
            <TouchableOpacity
              style={styles.balanceActionBtnDark}
              onPress={() =>
                navigation.navigate("RecentPayouts")}
            >
              <Feather name="arrow-down-right" size={18} color="#fff" />
              <Text style={styles.balanceActionTextDark}>Recent Payouts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.balanceActionBtnDark,
                // { backgroundColor: Colors.gray },
              ]}
              onPress={() =>
                navigation.navigate("UpcomingPayouts")
              }
            >
              <Feather name="calendar" size={18} color="#fff" />
              <Text style={styles.balanceActionTextDark}>Upcoming Payouts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 📊 Dashboard Content */}
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={pullToRefresh}
              tintColor={Colors.primary}
            />
          }
        >
          {/* 🔹 Stats Grid */}
          <View style={styles.statsGrid}>
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

                {/* <View style={styles.iconContainer}>
                  
                </View> */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.statLabel}>{card.label}</Text>
                  <Text style={styles.statValue}>{card.value}</Text>
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


          <RecentPaymentsLog />
        </ScrollView>
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    // paddingBottom: 80,
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
    marginVertical: 2
  },
  balanceChangeDark: {
    color: Colors.green,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  changeSubLabel: {
    color: Colors.gray,
    fontWeight: "400",
    fontSize: 14,
  },
  balanceActionsRow: {
    flexDirection: "row",
  },
  balanceActionBtnDark: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.green,
    borderRadius: 18,
    padding: 10,
    marginHorizontal: 5,
    width: '48%',
  },
  balanceActionTextDark: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    flexWrap: 'wrap'
    // marginLeft: 7,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
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
  statLabel: {
    color: "colors.secondary",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  statValue: {
    color: "colors.secondary",
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
});

export default PartnersDashboard;

