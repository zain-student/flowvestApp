import { DashboardLayout } from "@/modules/Common/components/DashboardLayout";
import { PartnerDashboardStackParamList } from "@/navigation/PartnerStacks/PartnerDashboardStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerDashboard } from "@/shared/store/slices/partner/dashboard/partnerDashboardSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Button } from "@components/ui/Button";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RecentPaymentsLog } from "../components/RecentPaymentsLog";

type Props = NativeStackNavigationProp<
  PartnerDashboardStackParamList,
  "PartnersDashboard"
>;

export const PartnersDashboard = () => {
  const navigation = useNavigation<Props>();
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector(
    (state) => state.partnerDashboard,
  );
  const { formatCurrency } = useCurrencyFormatter();

  useEffect(() => {
    dispatch(fetchPartnerDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <DashboardLayout>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </DashboardLayout>
    );
  }
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
      icon: "dollar-sign",
      label: "Invested",
      value: formatCurrency(stats?.total_invested ?? 0),
      bg: "#fff", // pastel yellow
    },
    {
      icon: "percent",
      label: "Avg ROI",
      value:
        stats?.roi_percentage !== undefined
          ? `${stats?.roi_percentage.toFixed(1)}`
          : "--",
      bg: "#fff", // pastel pink
    },
  ];
  const pullToRefresh = () => {
    dispatch(fetchPartnerDashboard());
  };
  return (
    <DashboardLayout>
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primary, "#3a84fb"]} // left → right
          start={{ x: 0, y: 1 }}
          end={{ x: 2, y: 0 }}
          style={styles.balanceCardDark}
        >
          <Image
            source={require("../../../../../assets/images/upperDiv.png")}
            style={{
              position: "absolute",
              width: 100,
              height: 110,
              top: -30,
              right: -50,
            }}
          />
          {/* 💰 Portfolio Summary Card */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.balanceLabelDark}>Portfolio Value</Text>
            {/* Total Earned */}
            <View
              style={{
                alignSelf: "flex-end",
                backgroundColor: "#0AFF5C47",
                borderRadius: 8,
                height: 29,
                width: 75,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Ionicons name="add" size={16} color={Colors.green} />
              <Text style={styles.increment}>
                {formatCurrency(stats?.total_earned ?? 0)}
              </Text>
            </View>
          </View>
          <Text style={styles.balanceValueDark}>
            {formatCurrency(Number(stats?.portfolio_value ?? "--"))}
          </Text>

          <View style={styles.balanceActionsRow}>
            <Button
              title="Recent Payouts"
              size="small"
              icon={
                <Feather
                  name="arrow-down-right"
                  size={16}
                  color={"#FFD700"}
                  // style={{ marginLeft: 6 }}
                />
              }
              onPress={() => navigation.navigate("RecentPayouts")}
              variant="outline"
              style={styles.investmentsButton}
              textStyle={styles.investmentsButtonText}
            />
            <Button
              title="Upcoming Payouts"
              size="small"
              icon={
                <Feather
                  name="calendar"
                  size={16}
                  color={"#FFD700"}
                  // style={{ marginLeft: 6 }}
                />
              }
              onPress={() => navigation.navigate("UpcomingPayouts")}
              variant="outline"
              style={styles.investmentsButton}
              textStyle={styles.investmentsButtonText}
            />
          </View>
          {/* </View> */}
          <Image
            source={require("../../../../../assets/images/lowerDiv.png")}
            style={{
              position: "absolute",
              width: 200,
              height: 260,
              bottom: -190,
              left: -150,
            }}
          />
          {/* <View style={styles.balanceActionsRow}></View> */}
        </LinearGradient>

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
                  <View style={styles.iconWrapper}>
                    <Feather
                      name={card.icon as any}
                      size={22}
                      color={Colors.primary}
                    />
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.statLabel}>{card.label}:</Text>
                    <Text style={styles.statValue}>{card.value}</Text>
                  </View>
                </View>
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
  balanceLabelDark: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter_500Regular",
  },
  increment: {
    color: Colors.green,
    fontSize: 14,
    fontFamily: "Inter_500SemiBold",
  },
  balanceValueDark: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    fontWeight: "600",
    marginVertical: 2,
    alignSelf: "flex-start",
  },
  balanceChangeDark: {
    color: Colors.green,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  changeSubLabel: {
    color: Colors.gray,
    fontSize: 14,
  },
  balanceActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  investmentsButton: {
    width: "90%",
    borderRadius: 22,
    height: 10,
    borderColor: "#FFEC8B",
    // opacity: 0.9,
  },

  investmentsButtonText: {
    color: "#FFD700",
    fontWeight: "600",
    fontSize: 13,
  },
  mirror: {
    backgroundColor: Colors.mirror,
    width: "47%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 0.3,
    borderColor: Colors.white,
    opacity: 0.7,
    marginHorizontal: 6,
  },
  balanceActionTextDark: {
    color: Colors.yellow,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  scrollContent: {
    paddingHorizontal: 12,
    // paddingTop: 10,
    padding: 0,
    paddingBottom: 80,
    backgroundColor: Colors.background,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "space-around",
    // marginHorizontal: 12,
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
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGray, // 20% opacity
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statLabel: {
    color: Colors.gray,
    fontSize: 14,
    fontFamily: "Inter_500Regular",
  },
  statValue: {
    color: Colors.secondary,
    fontSize: 14,
    fontFamily: "Inter_500Bold",
    fontWeight: "700",
  },
});

export default PartnersDashboard;
