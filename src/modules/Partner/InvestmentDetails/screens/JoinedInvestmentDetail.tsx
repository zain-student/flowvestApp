import type { PartnersInvestmentDetailStackParamList } from "@/navigation/PartnerStacks/PartnersInvestmentDetailStack";
import Colors from "@/shared/colors/Colors";
import { useAppSelector } from "@/shared/store";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>{currentInvestment.name}</Text>
        <View style={styles.investmentCard}>
          {/* <Text style={styles.investmentName}>Joined Date: {formatDate(currentInvestment.joined_at)}</Text> */}
          <MetaItem label="Joined Date" value={formatDate(currentInvestment.joined_at)} />
          <View style={styles.badgeRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Active</Text>
            </View>
            <View style={styles.sharedBadge}>
              <Text style={styles.sharedText}>Shared</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.investmentAmount}>
                {formatCurrency(Number(currentInvestment.current_total_invested ?? 0))}
              </Text>
              <Text style={styles.subText}>Current Total Invested</Text>
            </View>
            <View>
              <Text style={styles.investmentAmount}>
                {formatCurrency(Number(currentInvestment.total_target_amount ?? "0"))}
              </Text>
              <Text style={styles.subText}>Target Amount</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <MetaItem
              label="Total Participants"
              value={`${currentInvestment.total_participants ?? 0}`}
            />
            <MetaItem
              label="Expected Returns"
              value={`+${parseFloat(currentInvestment.expected_return_rate).toFixed(1)}%`}
              positive
            />
          </View>
          <Divider />
          <View style={styles.dateRow}>
            <MetaItem label="Start Date" value={currentInvestment.start_date} />
            {currentInvestment.end_date && (
              <MetaItem label="End Date" value={currentInvestment.end_date} />
            )}
          </View>
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

const PerformanceCard = ({ icon, label, subLabel, value, highlight }: any) => (
  <View style={styles.performanceRow}>
    <View style={styles.iconWrapper}>
      <Feather name={icon} size={18} color={Colors.secondary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.performanceLabel}>{label}</Text>
      {/* <Text style={styles.performanceSub}>{subLabel}</Text> */}
    </View>
    <Text style={[styles.performanceValue, highlight && { color: Colors.gray }]}>
      {value}
    </Text>
  </View>
);
const Divider = () => <View style={styles.rowDivider} />;
const MetaItem = ({ label, value, positive }: any) => (
  <View style={{}}>
    <Text style={[styles.metaValue, positive && { color: Colors.green }]}>
      {value}
    </Text>
    <Text style={styles.metaLabel}>{label}</Text>
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
  container: { flex: 1, backgroundColor: Colors.background, paddingBottom: 0 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 70, marginTop: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 16, color: Colors.secondary },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.secondary,
    marginTop: 16,
    marginBottom: 14,
  },
  labelValueRow: {
    marginBottom: 12,
  },
  label: { fontSize: 13, color: Colors.gray },
  value: { fontSize: 16, color: Colors.white, fontWeight: "600" },
  investmentCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E6EDFF",
  },
  investmentAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
  },

  subText: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 12,
  },

  badgeRow: {
    flexDirection: "row",
    // marginBottom: 12,
    marginVertical: 12
  },

  statusBadge: {
    backgroundColor: Colors.statusbg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },

  statusText: {
    fontSize: 12,
    color: Colors.statusText,
  },

  sharedBadge: {
    backgroundColor: "#EAF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },

  sharedText: {
    fontSize: 12,
    color: Colors.primary,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  sectionTitle: {
    fontSize: 16, fontWeight: "500", color: Colors.secondary, marginBottom: 5
  },
  performanceContainer: { marginBottom: 2 },
  performanceRow: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#E6EDFF'
  },

  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  performanceLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.secondary,
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.secondary,
  },
  rowDivider: {
    marginTop: 4,
    height: 1,
    backgroundColor: "#EFEFEF",
  },
  metaLabel: {
    fontSize: 12,
    color: Colors.gray,
  },

  metaValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.secondary,
  },
});
