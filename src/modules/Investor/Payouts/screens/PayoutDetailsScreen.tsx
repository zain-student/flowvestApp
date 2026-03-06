import { PayoutStackParamList } from "@/navigation/InvestorStacks/PayoutStack";
import Colors from "@/shared/colors/Colors";
import { Button } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import {
  cancelPayout,
  fetchPayoutsById,
  markPayoutAsPaid,
} from "@/shared/store/slices/investor/payouts/payoutSlice";
import { useInvestmentCurrencyFormatter } from "@/shared/utils/formatInvestmentCurrency";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { MarkAsPaidModal } from "../components/MarkAsPaidModal";
type Props = NativeStackScreenProps<PayoutStackParamList, "PayoutDetails">;
type RouteProps = RouteProp<PayoutStackParamList, "PayoutDetails">;
export const PayoutDetailsScreen = ({ navigation }: Props) => {
  const route = useRoute<RouteProps>();
  const { formatCurrency } = useCurrencyFormatter();
  const { formatInvestmentCurrency } = useInvestmentCurrencyFormatter();
  const { id } =
    useRoute<RouteProp<PayoutStackParamList, "PayoutDetails">>().params;
  const dispatch = useAppDispatch();
  const payouts = useAppSelector((state) => state.payout.currentPayout);
  const isLoading = useAppSelector((state) => state.payout.isLoading);
  const [showPayModal, setShowPayModal] = React.useState(false);
  useEffect(() => {
    dispatch(fetchPayoutsById(id));
  }, [id]);
  if (!payouts) {
    return (
      <View>
        <Text>Payouts not found.</Text>
      </View>
    );
  }
  if (isLoading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }
  const delPayout = async () => {
    try {
      await dispatch(cancelPayout(payouts.id)).unwrap();
    } catch (err) {
      console.error("❌ Cancel payout failed:", err);
      ToastAndroid.show("Failed to cancel payout", ToastAndroid.SHORT);
    }
  };
  const handleSubmitPayment = async (data: any) => {
    try {
      await dispatch(markPayoutAsPaid({ id: payouts.id, data })).unwrap();
      ToastAndroid.show("✅ Payout marked as paid", ToastAndroid.SHORT);
      setShowPayModal(false);
      navigation.goBack();
    } catch (err) {
      console.error("❌ Mark as paid failed:", err);
      ToastAndroid.show("❌ Failed to mark payout as paid", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{payouts.investment_title}</Text>
        <View style={styles.summaryCard}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 18,
            }}
          >
            <View>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.value}>
                {formatInvestmentCurrency(
                  payouts.amount,
                  payouts.currency.code,
                )}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Investment ROI</Text>
              <Text style={styles.valueRoi}>
                {Number(payouts.investment_roi).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {" "}
                {payouts.status.charAt(0).toUpperCase() +
                  payouts.status.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={styles.label}>Participant</Text>

          <Text style={styles.value}>{payouts.participant_name}</Text>
          <Text style={[styles.label, { marginTop: 2, marginBottom: 12 }]}>
            {payouts.participant_email}
          </Text>
          {payouts.status.toLowerCase() === "cancelled" && (
            <>
              <Text style={styles.label}>Notes</Text>
              <Text style={[styles.value, { marginBottom: 12 }]}>
                {payouts.notes ?? "N/A"}
              </Text>
            </>
          )}
          {payouts.status.toLowerCase() === "paid" && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // marginBottom: 12,
                  marginTop: 8,
                }}
              >
                <Text style={styles.label}>Payout Method</Text>
                <Text style={styles.value}>
                  {payouts.payment_method ?? "Not Paid Yet"}
                </Text>
              </View>
              <Divider />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // marginBottom: 12,
                  marginTop: 8,
                }}
              >
                <Text style={styles.label}>Reference No</Text>
                <Text style={styles.value}>
                  {payouts.reference_number || "N/A"}
                </Text>
              </View>
              <Divider />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.labelDate}>Paid Date</Text>
                <Text style={styles.valueDate}>{payouts.paid_date}</Text>
              </View>
            </>
          )}
          <Divider />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              // paddingVertical: 8,
              marginBottom: 12,
            }}
          >
            <Text style={styles.labelDate}>Scheduled Date</Text>
            <Text style={styles.valueDate}>{payouts.scheduled_date}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            {/* pay payout button */}
            {payouts.status.toLowerCase() !== "paid" &&
              payouts.status.toLowerCase() !== "cancelled" && (
                <View style={styles.footer}>
                  <Button
                    title="Pay"
                    icon={
                      <Ionicons
                        name="send-outline"
                        size={18}
                        color={Colors.primary}
                        style={{ marginRight: 4 }}
                      />
                    }
                    onPress={() => setShowPayModal(true)}
                    style={styles.payButton}
                    textStyle={styles.payButtonText}
                    variant="outline"
                  />
                  <MarkAsPaidModal
                    visible={showPayModal}
                    onClose={() => setShowPayModal(false)}
                    onSubmit={handleSubmitPayment}
                    payoutSummary={{
                      investmentName: payouts.investment_title,
                      participantName: payouts.participant_name,
                      amount: payouts.amount,
                      currency: payouts.currency,
                      scheduledDate: payouts.scheduled_date,
                    }}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      Alert.alert(
                        "Confirm Cancellation",
                        "Are you sure you want to cancel this payout?",
                        [
                          { text: "No", style: "cancel" },
                          {
                            text: "Yes",
                            style: "destructive",
                            onPress: () => delPayout(),
                          },
                        ],
                      );
                    }}
                  >
                    <Ionicons name="trash" size={20} color="#C50003" />
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const Divider = () => <View style={styles.rowDivider} />;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingBottom: 0 },
  scrollContent: { paddingHorizontal: 12, paddingBottom: 70, marginTop: 20 },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.secondary,
    marginTop: 16,
    marginBottom: 14,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E6EDFF",
  },
  label: { fontSize: 13, color: Colors.gray },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.secondary,
    alignSelf: "flex-start",
  },
  participantEmail: {
    fontSize: 12,
    color: Colors.gray,
  },
  valueRoi: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.green,
  },
  labelDate: { fontSize: 13, color: Colors.gray, marginTop: 8 },
  valueDate: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 7,
    color: Colors.secondary,
  },
  statusBadge: {
    width: "23%",
    height: 25,
    backgroundColor: Colors.statusbg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  statusText: {
    fontSize: 12,
    color: Colors.statusText,
  },
  footer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginTop: 20,
    // borderTopWidth: 0.2,
    borderTopColor: Colors.gray,
    paddingTop: 16,
    justifyContent: "flex-end",
    gap: 10,
  },
  deleteButton: {
    width: 46,
    height: 46,
    justifyContent: "center",
    borderRadius: 23,
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#0120730D", // Red
  },
  payButton: {
    height: 40,
    width: 90,
    // paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  payButtonText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  rowDivider: {
    marginTop: 12,
    height: 1,
    backgroundColor: "#EFEFEF",
  },
});
export default PayoutDetailsScreen;
