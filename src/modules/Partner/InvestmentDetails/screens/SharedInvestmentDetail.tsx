import type { PartnersInvestmentDetailStackParamList } from "@/navigation/PartnerStacks/PartnersInvestmentDetailStack";
import Colors from "@/shared/colors/Colors";
import { useAppSelector } from "@/shared/store";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = NativeStackScreenProps<
  PartnersInvestmentDetailStackParamList,
  "SharedInvestmentDetail"
>;

export const SharedInvestmentDetail: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;

  const { list, isLoading } = useAppSelector(
    (state) => state.userInvestments.sharedPrograms
  );

  // ✅ memoize for performance
  const currentInvestment = useMemo(
    () => list.find((inv) => inv.id === id),
    [list, id]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  if (!currentInvestment) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Investment not found.</Text>
      </View>
    );
  }

  // ✅ everything below stays EXACTLY the same
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={27} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{currentInvestment.name}</Text>

        <View style={styles.summaryCard}>
          <LabelValue label="Amount Invested" value={`$${currentInvestment.current_total_invested ?? "0"}`} />
          <LabelValue
            label="Status"
            value={capitalize(currentInvestment.status)}
            valueStyle={currentInvestment.status === "active" ? styles.statusActive : styles.statusCompleted}
          />
          <LabelValue label="Total Participants" value={`${currentInvestment.total_participants ?? 0}`} />
          <LabelValue label="Type" value={currentInvestment.type} />
          <LabelValue label="Returns" value={`${parseFloat(currentInvestment.expected_return_rate).toFixed(1)}%`} />
          <LabelValue label="Start Date" value={currentInvestment.start_date} />
          <LabelValue label="End Date" value={currentInvestment.end_date} />
        </View>

        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.txCard}>
          <Text style={styles.txType}>Total Paid Out</Text>
          <Text style={styles.txAmount}>${currentInvestment.performance.total_paid_out}</Text>
        </View>
        <View style={styles.txCard}>
          <Text style={styles.txType}>Pending Payouts</Text>
          <Text style={styles.txAmount}>${currentInvestment.performance.pending_payouts}</Text>
        </View>
        {currentInvestment.performance.next_payout_date && (
          <View style={styles.txCard}>
            <Text style={styles.txType}>Next Payout</Text>
            <Text style={styles.txDate}>{currentInvestment.performance.next_payout_date}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

/* ---------- helpers (unchanged) ---------- */
const LabelValue = ({ label, value, valueStyle }: { label: string; value: string; valueStyle?: any }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, valueStyle]}>{value}</Text>
  </>
);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- styles (same as your file) ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingBottom: 100 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 16, color: Colors.secondary },
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
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.secondary, marginBottom: 1 },
  summaryCard: { backgroundColor: Colors.secondary, borderRadius: 14, padding: 18, marginBottom: 24 },
  label: { fontSize: 13, color: Colors.gray, marginTop: 8 },
  value: { fontSize: 16, color: Colors.white, fontWeight: "600" },
  statusActive: { color: Colors.green },
  statusCompleted: { color: Colors.gray },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: Colors.secondary, marginBottom: 10 },
  txCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txType: { fontSize: 15, color: Colors.white, fontWeight: "600" },
  txAmount: { fontSize: 15, color: Colors.white, fontWeight: "500" },
  txDate: { fontSize: 13, color: Colors.gray },
});
