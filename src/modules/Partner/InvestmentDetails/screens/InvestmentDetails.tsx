import { DashboardLayout } from "@/modules/Common/components/DashboardLayout";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerParticipatingInvestments, leaveInvestment } from "@/shared/store/slices/shared/investments/partnerInvestmentSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather } from "@expo/vector-icons";
import Colors from "@shared/colors/Colors";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
export const InvestmentDetails = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { investments, summary, isLoading, error, meta, isLoadingMore } = useAppSelector((state) => state.userInvestments);
  const { formatCurrency } = useCurrencyFormatter();
  const FILTERS = ["All", "Active", "Paused", "Completed"];
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  // useEffect(() => {
  //   if (search === '') {
  //     dispatch(fetchPartnerParticipatingInvestments({ page: 1 }));
  //   }
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
  const handleSearch = () => {
    // always start at page 1
    dispatch(fetchPartnerParticipatingInvestments({ page: 1, search }));
  };
  const handleRefresh = () => {
    dispatch(fetchPartnerParticipatingInvestments({ page: 1 }));
  };
  const formattedInvestments = investments.map((inv: any) => ({
    id: inv.id,
    name: inv.name,
    amount: inv.current_total_invested ?? inv.initial_amount ?? "0",
    targetAmount: inv.total_target_amount ?? "0",
    status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
    type: inv.type.charAt(0).toUpperCase() + inv.type.slice(1),
    returns: inv.expected_return_rate,
    date: inv.start_date,
    participants: inv.total_participants,
  }));

  const filtered =
    filter === "All"
      ? formattedInvestments
      : formattedInvestments.filter((i: any) => i.status === filter);
  const renderInvestment = ({ item }: any) => {
    // Status color
    const isActive = item.status.toLowerCase() === "active";
    const statusColor = isActive ? Colors.green : Colors.gray;

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.85}
        onPress={() => {
          navigation.navigate('PartnerInvestmentStack', { screen: 'JoinedInvestmentDetail', params: { id: item.id } })
        }}
      >
        {/* Header: Name + Status */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.investmentName}>{item.name}</Text>
            <Text style={styles.investmentType}>{item.type}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              isActive ? styles.statusActive : styles.statusClosed,
            ]}
          >
            <Text style={[styles.statusText, { color: isActive ? Colors.green : Colors.gray }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Amounts */}
        <View style={styles.amountRow}>
          <View>
            <Text style={styles.amountLabel}>Invested</Text>
            <Text style={styles.amountValue}>{formatCurrency(item.amount)}</Text>
          </View>

          {item.type.toLowerCase() === "shared" && (
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.amountLabel}>Target</Text>
              <Text style={styles.amountValue}>{formatCurrency(item.targetAmount)}</Text>
            </View>
          )}
        </View>

        {/* Meta Row */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Started: {item.date}</Text>
          <Text style={styles.metaText}>Participants: {item.participants ?? 0}</Text>
        </View>

        {/* Leave Button */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={() =>
              Alert.alert(
                "Leave Investment",
                `Are you sure you want to leave "${item.name}"?`,
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
            <Text style={styles.leaveText}>Leave Investment</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };



  return (
    <DashboardLayout>
      <View style={styles.container}>
        <View style={styles.balanceCardDark}>
          <Text style={styles.balanceLabelDark}>Total Investment</Text>
          <Text style={styles.balanceValueDark}>
            {formatCurrency(Number(summary?.total_invested ?? 0))}
          </Text>
          <Text style={styles.balanceChangeDark}>
            ROI Avg: {summary?.average_roi ?? 0}%
          </Text>
          <View style={styles.balanceActionsRow}>
            <TouchableOpacity style={styles.balanceActionBtnDark}>
              <Feather name="arrow-up-right" size={18} color="#fff" />
              <Text style={styles.balanceActionTextDark}>
                Payouts History
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
            <Feather name="search" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>




        {/* Investment List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderInvestment}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          // scrollEnabled={false}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color={Colors.green} />
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 80 }}
          ListHeaderComponent={
            <View style={styles.card}>
              <Text style={styles.title}>Joined Investments Overview</Text>
              <Text style={styles.label}>Total Investments: <Text style={styles.value}>{summary.total_investments}</Text></Text>
              <Text style={styles.label}>Active Investments: <Text style={styles.value}>{summary.active_investments}</Text></Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.label}>Current Value: <Text style={styles.value}>{formatCurrency(summary.current_value)}</Text></Text>
                {/* <Text style={styles.label}>Duration: <Text style={styles.value}>12 Months</Text></Text> */}
                <TouchableOpacity style={styles.balanceActionBtnDark} onPress={() => { navigation.navigate('PartnerInvestmentStack', { screen: 'SharedInvestments' }) }}>
                  <Text style={styles.balanceActionTextDark}>
                    Shared Investments
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
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    // flex:1,
    paddingBottom: 0, backgroundColor: Colors.background
  },
  // innerContainer: { paddingHorizontal: 16 },
  balanceCardDark: {
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    paddingTop: 36,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 18,
  },
  balanceLabelDark: {
    color: Colors.gray,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  balanceValueDark: {
    color: Colors.white,
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    marginVertical: 2,
  },
  balanceChangeDark: {
    color: Colors.green,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 18 },
  balanceActionBtnDark: {
    width: '50%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.darkButton,
    borderRadius: 18,
    padding: 8,
  },
  balanceActionTextDark: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 7,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 16, borderRadius: 8,
    paddingHorizontal: 16,
    marginHorizontal: 12, marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,

  },
  title: { fontSize: 16, fontWeight: 'bold', color: Colors.secondary, marginBottom: 8 },
  label: { fontSize: 14, color: Colors.gray, marginBottom: 4 },
  value: { color: Colors.secondary, fontWeight: '600' },
  filterContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  filterRow: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 4,
    justifyContent: "space-around",
    alignItems: "center",
    height: 44,              // ✅ fixed height prevents jump
    elevation: 2,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    height: 36,            // 🔑 fixed height
    justifyContent: 'center', // 🔑 vertically center
    alignItems: 'center',
  },
  filterBtnActive: { backgroundColor: Colors.secondary },
  filterText: {
    color: "#6B7280", fontWeight: "500",
    fontSize: 14,           // optional but keeps text stable
    lineHeight: 20,         // ensure same lineHeight
  },
  filterTextActive: { color: Colors.white },
  cardContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  investmentName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },

  investmentType: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusActive: {
    backgroundColor: "rgba(16,185,129,0.15)",
  },

  statusClosed: {
    backgroundColor: "rgba(107,114,128,0.15)",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 12,
  },

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  amountLabel: {
    fontSize: 13,
    color: Colors.gray,
  },

  amountValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
    marginTop: 2,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  metaText: {
    fontSize: 12,
    color: Colors.gray,
  },

  actionsRow: {
    marginTop: 14,
  },

  leaveButton: {
    backgroundColor: "rgba(239,68,68,0.15)",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },

  leaveText: {
    color: Colors.error,
    fontWeight: "600",
    fontSize: 14,
  },

  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  middleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  // statusBadge: { color: Colors.white, fontSize: 12, fontFamily: 'Inter_500Medium', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, overflow: 'hidden', textTransform: 'capitalize' },

  // statusActive: { color: Colors.green },
  // statusClosed: { color: "#6B7280" },
  investmentDate: { fontSize: 13, color: Colors.gray },
  investmentParticipants: { fontSize: 13, color: Colors.gray },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#6B7280" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 12,
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
    // backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 14,
    marginLeft: 6,
    justifyContent: "center",
    alignItems: "center",
  },

});
