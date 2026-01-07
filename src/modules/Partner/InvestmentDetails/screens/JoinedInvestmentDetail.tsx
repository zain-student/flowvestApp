import type { PartnersInvestmentDetailStackParamList } from "@/navigation/PartnerStacks/PartnersInvestmentDetailStack";
import Colors from "@/shared/colors/Colors";
import { useAppSelector } from "@/shared/store";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather, Ionicons } from "@expo/vector-icons";
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
  "JoinedInvestmentDetail"
>;

export const JoinedInvestmentDetail: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { formatCurrency } = useCurrencyFormatter();
  const { investments, isLoading } = useAppSelector((state) => state.userInvestments);

  const currentInvestment = useMemo(
    () => investments.find((inv) => inv.id === id),
    [investments, id]
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

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={27} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>{currentInvestment.name}</Text>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <LabelValue
            label="Current Total Invested"
            value={formatCurrency(Number(currentInvestment.current_total_invested ?? currentInvestment.initial_amount))}
          />
          <LabelValue
            label="Type"
            value={capitalize(currentInvestment.type)}
            valueStyle={
              currentInvestment.type === "shared"
                ? styles.statusShared
                : styles.statusPrivate
            }
          />
          <LabelValue
            label="Status"
            value={capitalize(currentInvestment.status)}
            valueStyle={
              currentInvestment.status === "active"
                ? styles.statusActive
                : styles.statusCompleted
            }
          />
          <LabelValue
            label="Total Participants"
            value={`${currentInvestment.total_participants ?? 0}`}
          />
          <LabelValue
            label="Expected Returns"
            value={`${parseFloat(currentInvestment.expected_return_rate).toFixed(1)}%`}
          />
          <LabelValue label="Start Date" value={formatDate(currentInvestment.start_date)} />
          <LabelValue label="End Date" value={formatDate(currentInvestment.end_date)} />
          <LabelValue label="Joined Date" value={formatDate(currentInvestment.joined_at)} />
        </View>

        {/* Performance Section */}
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.performanceContainer}>
          <PerformanceCard
            icon="dollar-sign"
            label="Total Paid Out"
            value={formatCurrency(currentInvestment.performance?.total_paid_out ?? 0)}
          />
          <PerformanceCard
            icon="clock"
            label="Pending Payouts"
            value={formatCurrency(currentInvestment.performance?.pending_payouts ?? 0)}
          />
          {currentInvestment.performance.next_payout_date && (
            <PerformanceCard
              icon="calendar"
              label="Next Payout"
              value={formatDate(currentInvestment.performance.next_payout_date)}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

/* --- Components --- */
const LabelValue = ({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: any;
}) => (
  <View style={styles.labelValueRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, valueStyle]}>{value}</Text>
  </View>
);

const PerformanceCard = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.txCard}>
    <View style={styles.txLeft}>
      <Feather name={icon as any} size={20} color={Colors.white} style={{ marginRight: 8 }} />
      <Text style={styles.txType}>{label}</Text>
    </View>
    <Text style={styles.txAmount}>{value}</Text>
  </View>
);

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const formatDate = (d?: string | null) => {
  if (!d) return "N/A";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

/* --- Styles --- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 60 },
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
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  labelValueRow: {
    marginBottom: 12,
  },
  label: { fontSize: 13, color: Colors.gray },
  value: { fontSize: 16, color: Colors.white, fontWeight: "600" },
  statusActive: { color: Colors.green },
  statusCompleted: { color: Colors.gray },
  statusShared: { color: Colors.green },
  statusPrivate: { color: Colors.gray },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: 12,
  },
  performanceContainer: { marginBottom: 20 },
  txCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  txLeft: { flexDirection: "row", alignItems: "center" },
  txType: { fontSize: 15, color: Colors.white, fontWeight: "600" },
  txAmount: { fontSize: 15, color: Colors.white, fontWeight: "700" },
});
