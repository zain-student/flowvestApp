import type { PartnersInvestmentDetailStackParamList } from "@/navigation/PartnerStacks/PartnersInvestmentDetailStack";
import Colors from "@/shared/colors/Colors";
import { Button, Input } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { joinInvestment } from "@/shared/store/slices/shared/investments/partnerInvestmentSlice";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={27} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{currentInvestment.name}</Text>

        <View style={styles.summaryCard}>
          <LabelValue label="Target Amount" value={`$${currentInvestment.total_target_amount ?? "0"}`} />
          <LabelValue label="Currently Invested" value={`$${currentInvestment.current_total_invested ?? "0"}`} />
          <LabelValue label="Remaining Capacity" value={
            `$${Number(currentInvestment.total_target_amount ?? 0) - Number(currentInvestment.current_total_invested ?? 0)}`
          } />

          <LabelValue
            label="Status"
            value={capitalize(currentInvestment.status)}
            valueStyle={currentInvestment.status === "active" ? styles.statusActive : styles.statusCompleted}
          />
          <LabelValue label="Total Participants" value={`${currentInvestment.total_participants ?? 0}`} />
          <LabelValue label="Type" value={currentInvestment.type.charAt(0).toUpperCase() + currentInvestment.type.slice(1)} />
          <LabelValue label="Returns" value={`${parseFloat(currentInvestment.expected_return_rate).toFixed(1)}%`} />
          <LabelValue label="Start Date" value={currentInvestment.start_date} />
          <LabelValue label="End Date" value={currentInvestment.end_date} />
        </View>
        {showJoinForm ? null :
          <>
            <Text style={styles.sectionTitle}>Performance</Text>
            <View style={styles.txCard}>
              <Text style={styles.txType}>Total Paid Out</Text>
              <Text style={styles.txAmount}>${currentInvestment.performance?.total_paid_out ?? 0}</Text>
            </View>
            <View style={styles.txCard}>
              <Text style={styles.txType}>Pending Payouts</Text>
              <Text style={styles.txAmount}>${currentInvestment.performance?.pending_payouts ?? 0}</Text>
            </View>
            {currentInvestment.performance.next_payout_date && (
              <View style={styles.txCard}>
                <Text style={styles.txType}>Next Payout</Text>
                <Text style={styles.txDate}>{currentInvestment.performance?.next_payout_date ?? 0}</Text>
              </View>
            )}
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
            {/* {errors.amount && <Text style={styles.error}>{errors.amount.message}</Text>} */}

            <Input
              label="Notes (optional)"
              type="text"
              placeholder="Any notes for your investment"
              value={notes}
              onChangeText={setNotes}
            // error={errors.email}
            // required
            // autoFocus
            />
            {formError ? <Text style={styles.error}>{formError}</Text> : null}
            {/* {joinError ? <Text style={styles.error}>{joinError}</Text> : null} */}

            <Button
              // title={isJoining ? "Joining..." : "Join Investment"}
              title="Join Investment"
              onPress={handleJoinInvestment}
              disabled={isJoining}
              style={{ marginTop: 5, backgroundColor: Colors.primary, borderColor: Colors.lightGray }}
            />
            {/* {joinError && <Text style={{ color: "red", marginTop: 6 }}>{joinError}</Text>} */}
          </View>
        }




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
  sectionTitle: { fontSize: 16, fontWeight: "600", color: Colors.secondary, marginBottom: 5 },
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
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    fontSize: 16,
  },
  error: {
    color: Colors.error,
    marginBottom: 8,
    fontSize: 13,
  },
  joinBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  joinText: { color: "#fff", fontWeight: "600", fontSize: 16 },

});
