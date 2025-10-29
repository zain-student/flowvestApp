import { InvestmentStackParamList } from "@/navigation/InvestorStacks/InvestmentStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchPartnerParticipatingInvestments, leaveInvestment } from "@shared/store/slices/shared/investments/partnerInvestmentSlice";
import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, Alert, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = NativeStackScreenProps<
    InvestmentStackParamList,
    "MyInvestments"
>;

export const MyInvestments = ({ navigation }: Props) => {
    const dispatch = useAppDispatch();
    const { investments, summary, isLoading, error, meta, isLoadingMore } = useAppSelector((state) => state.userInvestments);
    useEffect(() => {
        dispatch(fetchPartnerParticipatingInvestments({ page: 1 }));
    }, [dispatch]);
    const handleLoadMore = useCallback(() => {
        if (!isLoadingMore && meta?.pagination?.has_more_pages) {
            dispatch(fetchPartnerParticipatingInvestments({ page: meta.pagination.current_page + 1 }));
        }
    }, [isLoadingMore, meta]);
    const handleRefresh = () => {
        dispatch(fetchPartnerParticipatingInvestments({ page: 1 }));
    };
    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.investmentCard} onPress={() => {
            //   navigation.navigate('PartnerInvestmentStack', { screen: 'JoinedInvestmentDetail', params: { id: item.id } })
            console.log('navigating to JoinedInvestmentDetail with id:', item.id);
        }}>
            <View style={{ flex: 1 }}>
                <Text style={styles.investmentName}>{item.name}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.investmentAmount}>Amount Invested: ${item.my_investment}</Text>
                    <Text
                        style={[
                            styles.investmentStatus,
                            item.status === "active" ? styles.statusActive : styles.statusClosed,
                        ]}
                    >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                </View>
                <Text style={styles.investmentAmount}>Target Amount:  ${item.total_target_amount}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={styles.investmentDate}>Started: {item.start_date}</Text>
                    <Text style={styles.investmentParticipants}>Participants: {item.total_participants}</Text>
                </View>
            </View>
            {/* Leave Button */}
            <TouchableOpacity
                style={styles.leaveBtn}
                onPress={() =>
                    Alert.alert(
                        "Leave Investment",
                        `Are you sure you want to leave "${item.name}"? You will no longer receive payouts from this investment.
            `,
                        [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Leave",
                                style: "destructive",
                                onPress: () => dispatch(leaveInvestment(item.id)),
                            },
                        ]
                    )
                }
            >
                <Text style={styles.leaveBtnText}>Leave Investment</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
    return (

        <View style={styles.container}>
            <StatusBar
                barStyle="light-content" // or "dark-content"
                backgroundColor="#000" // set to match your theme
            />
            <FlatList
                data={investments}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}

                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshing={isLoading}
                // scrollEnabled={false}
                onRefresh={handleRefresh}
                ListFooterComponent={
                    isLoadingMore ? (
                        <ActivityIndicator size="small" color={Colors.green} />
                    ) : null
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
    investmentCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        padding: 16,
        marginBottom: 14,
        // marginHorizontal: 12,
        // flexDirection: "row",
        // alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    investmentName: { fontSize: 16, fontWeight: "600", color: Colors.white },
    investmentAmount: { fontSize: 15, color: Colors.gray, marginTop: 2 },
    investmentStatus: { fontSize: 13, fontWeight: "500", marginBottom: 2 },
    statusActive: { color: Colors.green },
    statusClosed: { color: "#6B7280" },
    investmentDate: { fontSize: 13, color: Colors.gray },
    investmentParticipants: { fontSize: 13, color: Colors.gray },
    leaveBtn: {
        marginTop: 8,
        backgroundColor: Colors.error,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: "center",
        alignSelf: "flex-end",
    },
    leaveBtnText: {
        color: Colors.white,
        fontWeight: "600",
        fontSize: 14,
    },
});

// export default MyInvestments;
