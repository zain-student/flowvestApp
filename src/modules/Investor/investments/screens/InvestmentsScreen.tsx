import { InvestmentStackParamList } from "@/navigation/InvestorStacks/InvestmentStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchInvestments } from "@/shared/store/slices/investmentSlice";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DashboardLayout } from "../../../Common/components/DashboardLayout";

const FILTERS = ["All", "Active", "Pending", "Completed"];
type Props = NativeStackNavigationProp<
  InvestmentStackParamList,
  "InvestmentScreen"
>;
export const InvestmentsScreen: React.FC = () => {
const dispatch=useAppDispatch();
  const {  investments,stats, isLoading }=useAppSelector((state)=>state.investments);
   const [filter, setFilter] = useState("All");
  const formattedInvestments = investments.map((inv:any) => ({
    id: inv.id,
    name: inv.name,
    amount: inv.initial_amount,
    status: inv.status.charAt(0).toUpperCase()+ inv.status.slice(1),
    returns: inv.expected_return_rate,
    date: inv.start_date,
  }));
//   const mockInvestments = [
//   {
//     id: 1,
//     name: "Tech Growth Fund",
//     // amount: 12000,
//     amount:stats?.initial_amount ?? "--",
//     status: "Active",
//     returns: "+8.2%",
//     date: "2024-06-01",
//   },
//   {
//     id: 2,
//     name: "Real Estate Trust",
//     amount: 5000,
//     status: "Pending",
//     returns: "+2.1%",
//     date: "2024-07-01",
//   },
//   {
//     id: 3,
//     name: "Green Energy Bonds",
//     amount: 3000,
//     status: "Completed",
//     returns: "+5.7%",
//     date: "2024-05-15",
//   },
//   {
//     id: 4,
//     name: "Tech Growth Fund",
//     amount: 12000,
//     status: "Active",
//     returns: "+8.2%",
//     date: "2024-06-01",
//   },
//   {
//     id: 5,
//     name: "Real Estate Trust",
//     amount: 5000,
//     status: "Pending",
//     returns: "+2.1%",
//     date: "2024-07-01",
//   },
//   {
//     id: 6,
//     name: "Green Energy Bonds",
//     amount: 3000,
//     status: "Completed",
//     returns: "+5.7%",
//     date: "2024-05-15",
//   },
// ];

 
  const navigation =
    useNavigation<NativeStackNavigationProp<InvestmentStackParamList>>();
  const filtered =
    filter === "All"
      ? formattedInvestments
      : formattedInvestments.filter((i:any) => i.status === filter);

   useEffect(() => {
      // if (!investments.length)
         dispatch(fetchInvestments());
      //  console.log("📦 Investments from Redux:", investments);
      // investments
    }, []);

  return (
    <DashboardLayout>
      <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Invested Amount</Text>
        <Text style={styles.cardValue}>${stats?.total_invested_amount.toFixed(1) ?? '--'}</Text>
        <Text style={styles.cardSubtitle}>
          +8.2%{" "}
          <Text
            style={{
              color: Colors.gray,
              fontWeight: "400",
              fontFamily: "Inter_400Regular",
            }}
          >
            this year
          </Text>{" "}
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
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Investments</Text>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No investments found.</Text>
          </View>
        ) : (

          filtered.map((i:any) => (
            <TouchableOpacity
              key={i.id}
              style={styles.investmentCard}
              onPress={() =>
                navigation.navigate("InvestmentDetails", { id: i.id })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.investmentName}>{i.name}</Text>
                <Text style={styles.investmentAmount}>
                  ${i.amount}
                </Text>
                <Text style={styles.investmentDate}>{i.date}</Text>
              </View>
              <Text
                style={[
                  styles.investmentStatus,
                  i.status === "Active"
                    ? styles.statusActive
                    : styles.statusClosed,
                ]}
              >
                {i.status}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <TouchableOpacity onPress={()=> navigation.navigate("AddInvestments")} style={styles.fab}>
        <Ionicons name="add" size={24} color={"white"} />
        <Text style={styles.fabLabel}>Add Investment</Text>
      </TouchableOpacity>
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.background},
  scrollContent: {
    // flex:1,
    // paddingBottom:100,
    // //  padding: 0,
    //   backgroundColor: Colors.background
    padding: 0,
    paddingBottom: 100,
    // backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    paddingTop: 36,
    // marginBottom: 1,
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
  cardSubtitle: { fontSize: 14, color: Colors.green },
  balanceActionBtnDark: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.darkButton,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 12,
    // marginTop:18
  },
  balanceActionTextDark: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 7,
    // marginBottom:8
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 18 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
    marginHorizontal: 12,
  },
  investmentCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  investmentName: { fontSize: 16, fontWeight: "600", color: Colors.white },
  investmentAmount: { fontSize: 15, color: Colors.gray, marginTop: 2 },
  investmentStatus: { fontSize: 13, fontWeight: "500", marginBottom: 2 },
  statusActive: { color: Colors.green },
  statusClosed: { color: "#6B7280" },
  investmentDate: { fontSize: 13, color: Colors.gray },

  filterRow: {
    flexDirection: "row",
    marginBottom: 16,
    marginTop: 10,
    gap: 10,
    marginHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 4,
    justifyContent: "space-around",
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  filterBtnActive: { backgroundColor: Colors.secondary },
  filterText: { color: "#6B7280", fontWeight: "500" },
  filterTextActive: { color: Colors.white },

  emptyState: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:'red'
  },
  emptyText: { fontSize: 16, color: "#6B7280" },
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
export default InvestmentsScreen;
