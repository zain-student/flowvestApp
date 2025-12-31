import { InvestmentStackParamList } from "@/navigation/InvestorStacks/InvestmentStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchPartnerParticipatingInvestments, leaveInvestment } from "@shared/store/slices/shared/investments/partnerInvestmentSlice";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
type Props = NativeStackScreenProps<
    InvestmentStackParamList,
    "MyInvestments"
>;

export const MyInvestments = ({ navigation }: Props) => {
    const dispatch = useAppDispatch();
    const { investments, summary, isLoading, error, meta, isLoadingMore } = useAppSelector((state) => state.userInvestments);
    const [search, setSearch] = useState("");
    const { formatCurrency } = useCurrencyFormatter();
    // useEffect(() => {
    //     if (search === "") {
    //         dispatch(fetchPartnerParticipatingInvestments({ page: 1 }));
    //     }
    // }, [search, dispatch]);
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (search.trim() === "") {
                // When User cleared the search bar — reload all investment
                dispatch(fetchPartnerParticipatingInvestments({ page: 1, search: "" }));
            } else {
                // Normal search 
                dispatch(fetchPartnerParticipatingInvestments({ page: 1, search }));
            }
        }, 1300); // 1.3 seconds debounce

        return () => clearTimeout(delayDebounce);
    }, [search]);
    const handleLoadMore = useCallback(() => {
        if (!isLoadingMore && meta?.pagination?.has_more_pages) {
            dispatch(fetchPartnerParticipatingInvestments({ page: meta.pagination.current_page + 1 }));
        }
    }, [isLoadingMore, meta, search]);
    const handleRefresh = () => {
        dispatch(fetchPartnerParticipatingInvestments({ page: 1 }));
    };
    const handleSearch = () => {
        // always start at page 1
        dispatch(fetchPartnerParticipatingInvestments({ page: 1, search }));
    };
    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={styles.investmentCard} onPress={() => {
            navigation.navigate("JoinedInvestmentDetail", { id: item.id });
            console.log('navigating to JoinedInvestmentDetail with id:', item.id);
        }}>
            <View style={{ flex: 1 }}>
                <Text style={styles.investmentName}>{item.name}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.investmentAmount}>Amount Invested: {formatCurrency(item.my_investment ?? 0)}</Text>
                    <Text
                        style={[
                            styles.investmentStatus,
                            item.status === "active" ? styles.statusActive : styles.statusClosed,
                        ]}
                    >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                </View>
                <Text style={styles.investmentAmount}>Target Amount:  {formatCurrency(item.total_target_amount ?? 0)}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={styles.investmentDate}>Joined: {item.joined_at}</Text>
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
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search investments..."
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                    returnKeyType="search"
                    onSubmitEditing={handleSearch} // ✅ allow Enter key search
                />
                <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                    <Feather name="search" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

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

                ListHeaderComponent={
                    <View style={styles.card}>
                        <Text style={styles.title}>Joined Investments Overview</Text>
                        <Text style={styles.label}>Total Investments: <Text style={styles.value}>{summary.total_investments}</Text></Text>
                        <Text style={styles.label}>Active Investments: <Text style={styles.value}>{summary.active_investments}</Text></Text>
                        <Text style={styles.label}>Average ROI: <Text style={styles.value}>{summary.average_roi}%</Text></Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.label}>Invested: <Text style={styles.value}>{formatCurrency(summary.total_invested)}</Text></Text>
                            {/* <Text style={styles.label}>Duration: <Text style={styles.value}>12 Months</Text></Text> */}
                            <TouchableOpacity style={styles.balanceActionBtnDark}
                                onPress={() => { navigation.navigate("SharedInvestments") }}
                            >
                                <Text style={styles.balanceActionTextDark}>
                                    Browse Investments
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No shared investments available.</Text>
                    </View>
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
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: 10,
        // marginHorizontal: 12,
        marginBottom: 12,
        paddingHorizontal: 8,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        color: Colors.secondary,
    },
    searchBtn: {
        height: 40,
        width: 40,
        backgroundColor: Colors.secondary,
        padding: 10,
        borderRadius: 14,
        marginLeft: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: Colors.white,
        padding: 16, borderRadius: 8,
        paddingHorizontal: 16,
        // marginHorizontal: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,

    },
    title: { fontSize: 16, fontWeight: 'bold', color: Colors.secondary, marginBottom: 8 },
    label: { fontSize: 14, color: Colors.gray, marginBottom: 4 },
    value: { color: Colors.secondary, fontWeight: '600' },
    balanceActionBtnDark: {
        width: '60%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.darkButton,
        borderRadius: 18,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    balanceActionTextDark: {
        color: Colors.white,
        fontSize: 15,
        fontFamily: "Inter_600SemiBold",
        marginLeft: 7,
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
    emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
    emptyText: { fontSize: 16, color: "#6B7280" },
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
