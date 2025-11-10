import { useAppSelector } from "@/shared/store";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Colors from "../../../../shared/colors/Colors";

export const UpcomingPayouts = () => {
    const { upcoming_payouts } = useAppSelector((state) => state.partnerDashboard);
    const renderItem = ({ item }: any) => {
        const statusColor =
            item.status === "paid"
                ? Colors.green
                : item.status === "scheduled"
                    ? Colors.gray
                    : Colors.error;

        return (
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Feather name="clock" size={20} color={Colors.secondary} />
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
                />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 17,
        fontFamily: "Inter_700Bold",
        fontWeight: "700",
        color: Colors.secondary,
    },
    listContent: {
        paddingHorizontal: 12,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
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
        fontSize: 15,
        fontFamily: "Inter_600SemiBold",
        color: Colors.secondary,
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
        fontSize: 15,
        fontFamily: "Inter_700Bold",
        color: Colors.secondary,
    },
    emptyText: {
        color: Colors.gray,
        fontSize: 15,
        textAlign: "center",
        paddingVertical: 16,
    },
});

export default UpcomingPayouts;
