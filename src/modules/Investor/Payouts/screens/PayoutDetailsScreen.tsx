import { PayoutStackParamList } from "@/navigation/InvestorStacks/PayoutStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPayoutsById } from "@/shared/store/slices/payoutSlice";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const mockPayout = {
  id: 1,
  date: "2024-07-15",
  amount: 1200,
  status: "Upcoming",
  recipient: "You",
  method: "Bank Transfer",
  timeline: [
    { id: 1, label: "Requested", date: "2024-07-01" },
    { id: 2, label: "Scheduled", date: "2024-07-10" },
    { id: 3, label: "Processing", date: "2024-07-14" },
  ],
};
type Props = NativeStackScreenProps<PayoutStackParamList, "PayoutDetails">;
type RouteProps = RouteProp<PayoutStackParamList, "PayoutDetails">;
export const PayoutDetailsScreen = ({ navigation }: Props) => {
  const route = useRoute<RouteProps>();
    const { id } =
      useRoute<RouteProp<PayoutStackParamList, "PayoutDetails">>().params;
    const dispatch = useAppDispatch();
    const payouts = useAppSelector(
      (state) => state.payout.currentPayout
    );
    useEffect(() => {
        dispatch(fetchPayoutsById(String(id)));
      }, [id]);
      if (!payouts) {
        return (
          <View>
            <Text>Investment not found.</Text>
          </View>
        );
      }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
      >
        {/* <Text style={styles.closeText}>✕</Text> */}
        <Ionicons name="close" size={27}/>
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{payouts.investment_title}</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>
            ${payouts.amount}
          </Text>
          <Text style={styles.label}>Status</Text>
          <Text
            style={[
              styles.status,
              payouts.status === "scheduled"
                ? styles.statusScheduled
                : styles.statusCompleted,
            ]}
          >
            {payouts.status.charAt(0).toUpperCase()+ payouts.status.slice(1)}
          </Text>
          <Text style={styles.label}>Recipient</Text>
          <Text style={styles.value}>{mockPayout.recipient}</Text>
          <Text style={styles.label}>Method</Text>
          <Text style={styles.value}>{payouts.notes ?? "Not Paid Yet"}</Text>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{payouts.scheduled_date}</Text>
        </View>
        <Text style={styles.sectionTitle}>Timeline</Text>
        {mockPayout.timeline.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>{item.label}</Text>
            <Text style={styles.timelineDate}>{item.date}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  closeBtn: {
    position: "absolute",
    top: 32,
    right: 24,
    zIndex: 10,
    backgroundColor: Colors.white,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { fontSize: 22, fontWeight: "bold", color: Colors.secondary },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.secondary,
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
  },
  label: { fontSize: 13, color: Colors.gray , marginTop: 8 },
  value: { fontSize: 16, color: Colors.white, fontWeight: "600" },
  status: { fontSize: 15, fontWeight: "600", marginTop: 2 },
  statusScheduled: { color: Colors.green },
  statusCompleted: { color: Colors.gray },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 10,
  },
  timelineItem: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timelineLabel: { fontSize: 15, color: Colors.white, fontWeight: "600" },
  timelineDate: { fontSize: 13, color: Colors.gray  },
});
export default PayoutDetailsScreen;
