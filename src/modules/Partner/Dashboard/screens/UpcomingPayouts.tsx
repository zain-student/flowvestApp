import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerDashboard } from "@/shared/store/slices/partner/dashboard/partnerDashboardSlice";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import Colors from "../../../../shared/colors/Colors";
export const UpcomingPayouts = () => {
    const dispatch = useAppDispatch()
    const { upcoming_payouts,loading } = useAppSelector((state) => state.partnerDashboard);
    const pullToRefresh = () => {
        dispatch(fetchPartnerDashboard());
    }
    const renderItem = ({ item }: any) => {
        const statusColor =
            item.status === "scheduled"
                ? Colors.green
                : item.status === "paid"
                    ? Colors.gray
                    : Colors.error;

        return (
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Feather name="clock" size={20} color={Colors.gray} />
                </View>

                <View style={styles.infoContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.title}>{item.investment_name}</Text>
                        <Text
                            style={[styles.statusBadge, { backgroundColor: statusColor }]}
                        >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.date}>
                            Due:{" "}
                            {new Date(item.due_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}
                        </Text>
                        <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.daysRemaining}>
                        {item.days_until_due.toFixed()} days remaining
                    </Text>
                </View>
            </View>

        )
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
        marginTop: 8,
        marginBottom: 16,
    },
    listContent: {
        paddingHorizontal: 12,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.secondary,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    iconContainer: {
        marginRight: 12,
        backgroundColor: "#E0F2FE",
        borderRadius: 10,
        padding: 8,
    },
    infoContainer: {
        flex: 1,
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
    },
    daysRemaining: {
        fontSize: 12,
        color: Colors.gray,
    },
    amount: {
        fontSize: 18,
        color: Colors.white,
        fontFamily: "Inter_700Bold",
        fontWeight: "700",
    },
    emptyText: {
        color: Colors.gray,
        fontSize: 15,
        textAlign: "center",
        paddingVertical: 16,
    },
});

export default UpcomingPayouts;
