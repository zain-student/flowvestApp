import { PartnerPayoutStackParamList } from "@/navigation/PartnerStacks/PartnersPayoutStack";
import Colors from "@/shared/colors/Colors";
// import { Button } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPayoutsById } from "@/shared/store/slices/partner/payout/PartnerPayoutSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
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
type Props = NativeStackScreenProps<PartnerPayoutStackParamList, "PartnerPayoutDetails">;
type RouteProps = RouteProp<PartnerPayoutStackParamList, "PartnerPayoutDetails">;
export const PartnerPayoutDetails = ({ navigation }: Props) => {
    const route = useRoute<RouteProps>();
    const { formatCurrency } = useCurrencyFormatter();
    const { id } = useRoute<RouteProp<PartnerPayoutStackParamList, "PartnerPayoutDetails">>().params;
    const dispatch = useAppDispatch();
    const payouts = useAppSelector(
        (state) => state.userPayouts.payouts.find((p) => p.id === id)
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
            <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="close" size={27} />
            </TouchableOpacity>
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
                    <Text style={styles.label}>ROI%</Text>
                    <Text style={styles.value}>
                        {Number(payouts.investment_roi).toFixed(1)}%
                    </Text>
                    <Text style={styles.label}>Type</Text>
                    <Text style={styles.value}>{payouts.payout_type.charAt(0).toUpperCase() + payouts.payout_type.slice(1)}</Text>
                    <Text style={styles.label}>Notes</Text>
                    <Text style={styles.value}>{payouts.notes ?? "N/A"}</Text>
                    <Text style={styles.label}>Scheduled Date</Text>
                    <Text style={styles.value}>{payouts.scheduled_date}</Text>
                    <Text style={styles.label}>Paid Date</Text>
                    <Text style={styles.value}>{payouts.paid_date ?? "Not Paid Yet"}</Text>
                </View>
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
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
    },
    closeText: { fontSize: 22, fontWeight: "bold", color: Colors.secondary },
    scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
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
    label: { fontSize: 13, color: Colors.gray, marginTop: 8 },
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
});
export default PartnerPayoutDetails;
