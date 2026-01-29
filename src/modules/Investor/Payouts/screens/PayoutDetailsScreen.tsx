import { PayoutStackParamList } from "@/navigation/InvestorStacks/PayoutStack";
import Colors from "@/shared/colors/Colors";
import { Button } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { cancelPayout, fetchPayoutsById, markPayoutAsPaid } from "@/shared/store/slices/investor/payouts/payoutSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View
} from "react-native";
import { MarkAsPaidModal } from "../components/MarkAsPaidModal";
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
  const { formatCurrency } = useCurrencyFormatter();
  const { id } =
    useRoute<RouteProp<PayoutStackParamList, "PayoutDetails">>().params;
  const dispatch = useAppDispatch();
  const payouts = useAppSelector(
    (state) => state.payout.currentPayout
  );
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
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>
            {formatCurrency(payouts.amount)}
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
            {payouts.status.charAt(0).toUpperCase() + payouts.status.slice(1)}
          </Text>
          <Text style={styles.label}>Participant</Text>
          <Text style={styles.value}>{payouts.participant_name}({payouts.participant_email})</Text>
          <Text style={styles.label}>Investment ROI</Text>
          <Text style={styles.value}>{Number(payouts.investment_roi).toFixed(1)}%</Text>
          {payouts.status.toLowerCase() === "cancelled" && (
            <>
              <Text style={styles.label}>Notes</Text>
              <Text style={styles.value}>{payouts.notes ?? "N/A"}</Text>
            </>
          )
          }
          {payouts.status.toLowerCase() === "paid" && (
            <>
              <Text style={styles.label}>Payout Method</Text>
              <Text style={styles.value}>{payouts.payment_method ?? "Not Paid Yet"}</Text>
              <Text style={styles.label}>Reference No</Text>
              <Text style={styles.value}>{payouts.reference_number || "N/A"}</Text>
              <Text style={styles.label}>Paid Date</Text>
              <Text style={styles.value}>{payouts.paid_date}</Text>
            </>
          )
          }
          <Text style={styles.label}>Scheduled Date</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.value}>{payouts.scheduled_date}</Text>
            {/* pay payout button */}
            {payouts.status.toLowerCase() !== "paid" && payouts.status.toLowerCase() !== "cancelled" && (<View
            // style={styles.footer}
            >
              <Button
                title="Pay"
                icon={<Ionicons name="send-sharp" size={20} color={Colors.white} />}
                onPress={() => setShowPayModal(true)}
                style={styles.payButton}
                textStyle={styles.footerButtonText}
                variant="primary"
              />

              <MarkAsPaidModal
                visible={showPayModal}
                onClose={() => setShowPayModal(false)}
                onSubmit={handleSubmitPayment}
                payoutSummary={{
                  investmentName: payouts.investment_title,
                  participantName: payouts.participant_name,
                  amount: payouts.amount,
                  scheduledDate: payouts.scheduled_date,
                }}
              />

            </View>)
            }
          </View>

          {payouts.status.toLowerCase() !== "paid" && payouts.status.toLowerCase() !== "cancelled" && (<View style={styles.footer}>
            <Button
              title="Cancel Payout"
              icon={<Ionicons name="trash" size={20} color={Colors.white} />}
              onPress={() => {
                Alert.alert(
                  "Confirm Cancellation",
                  "Are you sure you want to cancel this payout?",
                  [
                    { text: "No", style: "cancel" },
                    {
                      text: "Yes",
                      style: "destructive",
                      onPress: () => delPayout()
                    },
                  ]
                );
              }
              }
              style={styles.cancelButton}
              textStyle={styles.footerButtonText}
              variant="primary"
            />
          </View>)}
        </View>
      </ScrollView>
    </View>
  );
};

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
  label: { fontSize: 13, color: Colors.gray, marginTop: 8, },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
  },
  status: { fontSize: 15, fontWeight: "600", marginTop: 2 },
  statusScheduled: { color: Colors.green },
  statusCompleted: { color: Colors.gray },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    borderTopWidth: 0.2,
    borderTopColor: Colors.gray,
    paddingTop: 12,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#EF4444", // Blue
  },
  payButton: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: Colors.primary,
  },
  footerButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
  timelineDate: { fontSize: 13, color: Colors.gray },
});
export default PayoutDetailsScreen;
