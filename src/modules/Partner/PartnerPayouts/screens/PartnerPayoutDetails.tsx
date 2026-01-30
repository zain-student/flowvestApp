import { PartnerPayoutStackParamList } from "@/navigation/PartnerStacks/PartnersPayoutStack";
import Colors from "@/shared/colors/Colors";
// import { Button } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPayoutsById } from "@/shared/store/slices/partner/payout/PartnerPayoutSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
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
type Props = NativeStackScreenProps<
  PartnerPayoutStackParamList,
  "PartnerPayoutDetails"
>;
type RouteProps = RouteProp<
  PartnerPayoutStackParamList,
  "PartnerPayoutDetails"
>;
export const PartnerPayoutDetails = ({ navigation }: Props) => {
  const route = useRoute<RouteProps>();
  const { formatCurrency } = useCurrencyFormatter();
  const { id } =
    useRoute<RouteProp<PartnerPayoutStackParamList, "PartnerPayoutDetails">>()
      .params;
  const dispatch = useAppDispatch();
  const payouts = useAppSelector((state) =>
    state.userPayouts.payouts.find((p) => p.id === id),
  );
  useEffect(() => {
    dispatch(fetchPayoutsById(id));
  }, [dispatch]);
  if (!payouts) {
    return (
      <View>
        <Text>Payout not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{payouts.investment_title}</Text>
        <View style={styles.summaryCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.value}>{formatCurrency(payouts.amount)}</Text>
            </View>
            <View>
              <Text style={styles.label}>ROI%</Text>
              <Text style={styles.valueRoi}>
                {Number(payouts.investment_roi).toFixed(1)}%
              </Text>
            </View>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}> {payouts.status.charAt(0).toUpperCase() + payouts.status.slice(1)}</Text>
          </View>

          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>
            {payouts.payout_type.charAt(0).toUpperCase() +
              payouts.payout_type.slice(1)}
          </Text>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.value}>{payouts.notes ?? "N/A"}</Text>
          <Divider />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.label}>Scheduled Date</Text>
            <Text style={styles.value}>{payouts.scheduled_date}</Text>
          </View>
          <Divider />
          <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
            <Text style={styles.labelDate}>Paid Date</Text>
            <Text style={styles.valueDate}>
              {payouts.paid_date ?? "Not Paid Yet"}
            </Text>
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
  label: { fontSize: 13, color: Colors.gray, marginTop: 8, },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
  },
  valueRoi: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.green,
  },
  labelDate: { fontSize: 13, color: Colors.gray, marginTop: 8, },
  valueDate: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 7,
    color: Colors.secondary,
  },
  statusBadge: {
    width: "30%",
    backgroundColor: Colors.statusbg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },

  statusText: {
    fontSize: 12,
    color: Colors.statusText,
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
  rowDivider: {
    marginVertical: 4,
    height: 1,
    backgroundColor: "#EFEFEF",
  },
});
export default PartnerPayoutDetails;
