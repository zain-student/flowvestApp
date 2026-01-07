import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerDashboard } from "@/shared/store/slices/partner/dashboard/partnerDashboardSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Colors from "../../../../shared/colors/Colors";

export const UpcomingPayouts = ({ navigation }: any) => {
    const dispatch = useAppDispatch();
    const { upcoming_payouts, loading } = useAppSelector(
        (state) => state.partnerDashboard
    );
    const { formatCurrency } = useCurrencyFormatter();

    const pullToRefresh = () => {
        dispatch(fetchPartnerDashboard());
    };

    const renderItem = ({ item }: any) => {
        const statusColor =
            item.status === "scheduled"
                ? Colors.green
                : item.status === "paid"
                    ? Colors.gray
                    : Colors.error;

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                // onPress={() =>
                //     navigation.navigate("PayoutDetails", { payoutId: item.id })
                // } // Navigate to payout details
            >
                {/* Left Icon */}
                <View style={styles.iconContainer}>
                    <Feather name="clock" size={20} color={Colors.gray} />
                </View>

                {/* Info Section */}
                <View style={styles.infoContainer}>
                    {/* Top Row */}
                    <View style={styles.topRow}>
                        <Text style={styles.title}>{item.investment_name}</Text>
                        <Text style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Text>
                    </View>

                    {/* Middle Row */}
                    <View style={styles.middleRow}>
                        <Text style={styles.date}>
                            Due:{" "}
                            {new Date(item.due_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}
                        </Text>
                        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
                    </View>

                    {/* Bottom Row */}
                    <Text style={styles.daysRemaining}>
                        {item.days_until_due.toFixed()} days remaining
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={upcoming_payouts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No upcoming payouts scheduled.</Text>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={pullToRefresh}
                        tintColor={Colors.primary}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 80,
    },
    listContent: {
        paddingBottom: 24,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.secondary,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 12,
        backgroundColor: "#E0F2FE",
        borderRadius: 10,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    infoContainer: {
        flex: 1,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    middleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        color: Colors.white,
        fontFamily: "Inter_700Bold",
        fontWeight: "700",
    },
    statusBadge: {
        color: Colors.white,
        fontSize: 12,
        fontFamily: "Inter_500Medium",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        overflow: "hidden",
        textTransform: "capitalize",
    },
    date: {
        fontSize: 13,
        color: Colors.gray,
        fontFamily: "Inter_400Regular",
    },
    amount: {
        fontSize: 18,
        color: Colors.white,
        fontFamily: "Inter_700Bold",
        fontWeight: "700",
    },
    daysRemaining: {
        fontSize: 12,
        color: Colors.gray,
        fontFamily: "Inter_400Regular",
        marginTop: 2,
    },
    emptyText: {
        color: Colors.gray,
        fontSize: 15,
        textAlign: "center",
        paddingVertical: 16,
    },
});

export default UpcomingPayouts;
