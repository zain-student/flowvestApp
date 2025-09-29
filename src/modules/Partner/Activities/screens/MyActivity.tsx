import { DashboardLayout } from "@/modules/Common/components/DashboardLayout";
import Colors from "@/shared/colors/Colors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { ActivityFilters } from "../components/ActivityFilters";
// import { NotesAdded } from "../components/NotesAdded";
// import { PayoutsHistory } from "../components/PayoutsHistory";
const stats = {
  total_investments: 12,
  active_investments: 5,
  total_payouts_scheduled: 3,
  overdue_payouts: 1,
  total_partners: 4,
  total_payout_amount: 8200,
  this_month_payouts: 2,
  roi_average: 8.2,
};
const dummyPayouts = [
  {
    id: 74,
    investment_title: "fddff",
    investment_id: 141,
    amount: 0,
    status: "scheduled",
    payout_type: "regular",
    scheduled_date: "2026-09-26",
    investment_roi: "13.0000",
    calculation_base: { method: "custom", base_amount: "6.00" },
  },
  {
    id: 73,
    investment_title: "vfd",
    investment_id: 142,
    amount: 0,
    status: "scheduled",
    payout_type: "regular",
    scheduled_date: "2026-09-26",
    investment_roi: "13.0000",
    calculation_base: { method: "custom", base_amount: "6.00" },
  },
   {
    id: 76,
    investment_title: "fddff",
    investment_id: 141,
    amount: 0,
    status: "scheduled",
    payout_type: "regular",
    scheduled_date: "2026-09-26",
    investment_roi: "13.0000",
    calculation_base: { method: "custom", base_amount: "6.00" },
  },
  {
    id: 75,
    investment_title: "vfd",
    investment_id: 142,
    amount: 0,
    status: "scheduled",
    payout_type: "regular",
    scheduled_date: "2026-09-26",
    investment_roi: "13.0000",
    calculation_base: { method: "custom", base_amount: "6.00" },
  },
  // ...you can paste more items here
];
export const MyActivity = () => {
  // return (
  //   <DashboardLayout>
  //     <View style={styles.container}>
  //     <View style={styles.balanceCardDark}>
  //       <Text style={styles.balanceLabelDark}>Total Investment</Text>
  //       <Text style={styles.balanceValueDark}>
  //         ${stats.total_payout_amount.toLocaleString()}
  //       </Text>
  //       <Text style={styles.balanceChangeDark}>
  //         +${(11915.28).toLocaleString()}{" "}
  //         <Text
  //           style={{
  //             color: Colors.gray,
  //             fontWeight: "400",
  //             fontFamily: "Inter_400Regular",
  //           }}
  //         >
  //           than last month
  //         </Text>
  //       </Text>
  //       <View style={styles.balanceActionsRow}>
  //         {/* <TouchableOpacity style={styles.balanceActionBtnDark}>
  //                   <Feather name="plus" size={18} color="#fff" />
  //                   <Text style={styles.balanceActionTextDark}>Top Up</Text>
  //                 </TouchableOpacity> */}
  //         <TouchableOpacity style={styles.balanceActionBtnDark}>
  //           <Feather name="arrow-up-right" size={18} color="#fff" />
  //           <Text style={styles.balanceActionTextDark}>
  //             Payouts History
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //     <ScrollView style={styles.innerContainer}
  //     showsVerticalScrollIndicator={false}
  //     >
  //       <ActivityFilters />
  //       <NotesAdded />
  //       <PayoutsHistory />
  //     </ScrollView>
  //     </View>
  //   </DashboardLayout>
  // );
  const renderItem = ({ item }: { item: typeof dummyPayouts[0] }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.title}>{item.investment_title}</Text>
        <Text
          style={[
            styles.status,
            item.status === "scheduled"
              ? styles.statusScheduled
              : styles.statusCancelled,
          ]}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.label}>
        Scheduled Date: <Text style={styles.value}>{item.scheduled_date}</Text>
      </Text>
      <Text style={styles.label}>
        Amount: <Text style={styles.value}>${item.amount.toFixed(2)}</Text>
      </Text>
      <Text style={styles.label}>
        ROI: <Text style={styles.value}>{item.investment_roi}%</Text>
      </Text>
      <Text style={styles.label}>
        Base Amount:{" "}
        <Text style={styles.value}>{item.calculation_base.base_amount}</Text>
      </Text>
    </View>
  );

  return (
    <DashboardLayout>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.balanceCardDark}>
            <Text style={styles.balanceLabelDark}>Total Investment</Text>
            <Text style={styles.balanceValueDark}>
              ${stats.total_payout_amount.toLocaleString()}
            </Text>
            <Text style={styles.balanceChangeDark}>
              +${(11915.28).toLocaleString()}{" "}
              <Text
                style={{
                  color: Colors.gray,
                  fontWeight: "400",
                  fontFamily: "Inter_400Regular",
                }}
              >
                than last month
              </Text>
            </Text>
            <View style={styles.balanceActionsRow}>
              {/* <TouchableOpacity style={styles.balanceActionBtnDark}>
                    <Feather name="plus" size={18} color="#fff" />
                    <Text style={styles.balanceActionTextDark}>Top Up</Text>
                  </TouchableOpacity> */}
              <TouchableOpacity style={styles.balanceActionBtnDark}>
                <Feather name="arrow-up-right" size={18} color="#fff" />
                <Text style={styles.balanceActionTextDark}>
                  Payouts History
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={dummyPayouts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        </View>
      </SafeAreaView>
    </DashboardLayout>
  );
};

// export default MyActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    // paddingHorizontal: 16,
    paddingBottom: 40,
  },
  innerContainer: {
    paddingHorizontal: 16,
  },
  listContent: { padding: 16 },
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
    marginBottom: 18,
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    // marginRight: 12,
  },
  balanceActionTextDark: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 7,
  },
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: { color: Colors.white, fontSize: 16, fontWeight: "700" },
  status: { fontSize: 12, fontWeight: "600", paddingHorizontal: 8 },
  statusScheduled: { color: Colors.green },
  statusCancelled: { color: Colors.error },
  label: { color: Colors.gray, marginTop: 4, fontSize: 13 },
  value: { color: Colors.white, fontWeight: "600" },
});
