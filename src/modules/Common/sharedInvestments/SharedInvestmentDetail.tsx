import type { PartnersInvestmentDetailStackParamList } from "@/navigation/PartnerStacks/PartnersInvestmentDetailStack";
import Colors from "@/shared/colors/Colors";
import { Button, Input } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { joinInvestment } from "@/shared/store/slices/shared/investments/partnerInvestmentSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

type Props = NativeStackScreenProps<
  PartnersInvestmentDetailStackParamList,
  "SharedInvestmentDetail"
>;

export const SharedInvestmentDetail: React.FC<Props> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();
  const { id, showJoinForm } = route.params;
  const { list, isLoading } = useAppSelector(
    (state) => state.userInvestments.sharedPrograms
  );
  const { formatCurrency } = useCurrencyFormatter();
  const { isJoining, error: joinError } = useAppSelector(
    (state) => state.userInvestments.join
  );
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  // const [isSubmitting, setIsSubmitting] = useState(false);
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
  const handleJoinInvestment = async () => {
    if (!amount) return setFormError('Amount is required');
    if (isNaN(Number(amount)) || Number(amount) <= 0)
      return setFormError('Enter a valid positive amount');

    setFormError('');
    try {
      await dispatch(
        joinInvestment({
          investmentId: currentInvestment!.id,
          amount: Number(amount),
          notes: notes.trim(),
        })
      ).unwrap();
      navigation.goBack();
    } catch (err) {
      // Error toast already handled inside thunk
      console.log('Join failed', err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{currentInvestment.name}</Text>
        <View style={styles.investmentCard}>
          <Text style={styles.investmentName}>{currentInvestment.creator.name || "N/A"}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}> {currentInvestment.status.charAt(0).toUpperCase() +
                currentInvestment.status.slice(1)}</Text>
            </View>
            <View style={styles.sharedBadge}>
              <Text style={styles.sharedText}> {currentInvestment.type.charAt(0).toUpperCase() +
                currentInvestment.type.slice(1)}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.subText}>Current Total Invested</Text>
              <Text style={styles.investmentAmount}>
                {formatCurrency(Number(currentInvestment.current_total_invested ?? 0))}
              </Text>
            </View>
            <View>
              <Text style={styles.subText}>Target Amount</Text>
              <Text style={styles.investmentAmount}>
                {formatCurrency(Number(currentInvestment.total_target_amount ?? "0"))}
              </Text>
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
        {showJoinForm ? null :
          <>
            <Text style={styles.sectionTitle}>Performance</Text>
            <View style={styles.performanceContainer}>
              <PerformanceCard
                icon="cash"
                label="Total Paid Out"
                value={formatCurrency(currentInvestment.performance?.total_paid_out ?? 0)}
              />
              <PerformanceCard
                icon="time-outline"
                label="Pending Payouts"
                value={formatCurrency(currentInvestment.performance?.pending_payouts ?? 0)}
                highlight
              />
              {currentInvestment.performance.next_payout_date && (
                <PerformanceCard
                  icon="calendar"
                  label="Next Payout"
                  value={currentInvestment.performance.next_payout_date}
                />
              )}
            </View>



          </>}
        {showJoinForm &&
          <View style={{
            marginBottom: 20, marginTop: 5, width: '100%', borderWidth: 1,
            borderColor: Colors.lightGray, borderRadius: 8, padding: 10,
            backgroundColor: Colors.white,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }} >
            <Text style={styles.sectionTitle}>Join This Investment</Text>

            <Input
              label="Amount to Invest"
              type="number"
              placeholder="Enter your investment amount"
              value={amount}
              onChangeText={(v) => {
                setAmount(v);
                if (formError) setFormError('');
              }}
              // error={errors.email}
              required
            // autoFocus
            />
            <Input
              label="Notes (optional)"
              type="text"
              placeholder="Any notes for your investment"
              value={notes}
              onChangeText={setNotes}
            />
            {formError ? <Text style={styles.error}>{formError}</Text> : null}

            <Button
              title="Join Investment"
              onPress={handleJoinInvestment}
              disabled={isJoining}
              style={{ marginTop: 5, backgroundColor: Colors.primary, borderColor: Colors.lightGray }}
            />
          </View>
        }
      </ScrollView>
    </View>
  );
};
const PerformanceCard = ({ icon, label, subLabel, value, highlight }: any) => (
  <View style={styles.performanceRow}>
    <View style={styles.iconWrapper}>
      <Ionicons name={icon} size={18} color={Colors.secondary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.performanceLabel}>{label}</Text>
      {/* <Text style={styles.performanceSub}>{subLabel}</Text> */}
    </View>
    <Text style={[styles.performanceValue, highlight && { color: Colors.green }]}>
      {value}
    </Text>
  </View>
);
const Divider = () => <View style={styles.rowDivider} />;
const MetaItem = ({ label, value, positive }: any) => (
  <View style={{}}>
    <Text style={styles.metaLabel}>{label}</Text>
    <Text style={[styles.metaValue, positive && { color: Colors.green }]}>
      {value}
    </Text>
  </View>
);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/* ---------- styles (same as your file) ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingBottom: 0 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 16, color: Colors.secondary },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 70, marginTop: 20 },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.secondary,
    marginTop: 16,
    marginBottom: 14,
  },
  investmentCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E6EDFF",
  },
  investmentName: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
  },

  investmentAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 10
  },

  subText: {
    fontSize: 12,
    color: Colors.gray,
    // marginBottom: 12,
  },

  badgeRow: {
    flexDirection: "row",
    marginBottom: 12,
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

  sectionTitle: { fontSize: 16, fontWeight: "500", color: Colors.secondary, marginBottom: 5 },
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
  metaLabel: {
    fontSize: 12,
    color: Colors.gray,
  },

  metaValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.secondary,
  },
  rowDivider: {
    marginTop: 4,
    height: 1,
    backgroundColor: "#EFEFEF",
  },
  error: {
    color: Colors.error,
    marginBottom: 8,
    fontSize: 13,
  },

});
