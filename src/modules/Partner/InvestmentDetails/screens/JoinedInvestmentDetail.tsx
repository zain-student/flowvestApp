import type { PartnersInvestmentDetailStackParamList } from "@/navigation/PartnerStacks/PartnersInvestmentDetailStack";
import Colors from "@/shared/colors/Colors";
import { useAppSelector } from "@/shared/store";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
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
    "JoinedInvestmentDetail"
>;

export const JoinedInvestmentDetail: React.FC<Props> = ({ route, navigation }) => {
    const { id } = route.params;
    const { formatCurrency } = useCurrencyFormatter();
    // Select investments & loading state from Redux
    const { investments, isLoading } = useAppSelector(
        (state) => state.userInvestments
    );

    //  Find current investment
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
                <Text style={styles.title}>{currentInvestment.name}</Text>

                {/* Summary Card  */}
                <View style={styles.summaryCard}>
                    <LabelValue label="Amount Invested" value={formatCurrency(Number(currentInvestment.current_total_invested))} />
                    <LabelValue label="Status" value={capitalize(currentInvestment.status)}
                        valueStyle={
                            currentInvestment.status === "active"
                                ? styles.statusActive
                                : styles.statusCompleted
                        }
                    />
                    <LabelValue label="Total Participants" value={`${currentInvestment.total_participants ?? 0}`} />
                    {/* <LabelValue label="Type" value={currentInvestment.type} /> */}
                    <LabelValue
                        label="Returns"
                        value={`${parseFloat(currentInvestment.expected_return_rate).toFixed(1)}%`}
                    />
                    <LabelValue label="Start Date" value={formatDate(currentInvestment.start_date)} />
                    <LabelValue label="End Date" value={formatDate(currentInvestment.end_date)} />
                    <LabelValue label="Joined Date" value={formatDate(currentInvestment.joined_at)} />
                </View>

                {/*  Performance  */}
                <Text style={styles.sectionTitle}>Performance</Text>
                <View style={styles.txCard}>
                    <Text style={styles.txType}>Total Paid Out</Text>
                    <Text style={styles.txAmount}>{formatCurrency(currentInvestment.performance?.total_paid_out ?? 0)}</Text>
                </View>
                <View style={styles.txCard}>
                    <Text style={styles.txType}>Pending Payouts</Text>
                    <Text style={styles.txAmount}>{formatCurrency(currentInvestment.performance?.pending_payouts ?? 0)}</Text>
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

/*  Helpers  */
const LabelValue = ({
    label,
    value,
    valueStyle,
}: {
    label: string;
    value: string;
    valueStyle?: any;
}) => (
    <View style={{ marginBottom: 8 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
);

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const formatDate = (d?: string | null) => (d ? new Date(d).toISOString().split("T")[0] : "N/A");
const formatNum = (n?: string | number | null) =>
    n !== undefined && n !== null ? Number(n).toLocaleString() : "0";

/* -- Styles -- */
const styles = StyleSheet.create({
    container: { flex: 1, marginBottom: 70, backgroundColor: Colors.background },
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
    scrollContent: { padding: 24, paddingTop: 60 },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.secondary,
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: Colors.gray,
        marginBottom: 18,
    },
    summaryCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 14,
        padding: 18,
        marginBottom: 24,
    },
    performanceCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 14,
        padding: 18,
        marginBottom: 24,
    },
    label: { fontSize: 13, color: Colors.gray },
    value: { fontSize: 16, color: Colors.white, fontWeight: "600" },
    statusActive: { color: Colors.green },
    statusCompleted: { color: Colors.gray },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.secondary,
        marginBottom: 10,
    },
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
