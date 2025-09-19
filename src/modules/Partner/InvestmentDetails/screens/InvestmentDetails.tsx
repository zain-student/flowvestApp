import { DashboardLayout } from "@/modules/Common/components/DashboardLayout";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerParticipatingInvestments } from "@/shared/store/slices/partner/investments/partnerInvestmentSlice";
import { Feather } from "@expo/vector-icons";
import Colors from "@shared/colors/Colors";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const InvestmentDetails = () => {
  const dispatch = useAppDispatch();
  const { investments, summary, isLoading, error, meta, isLoadingMore } = useAppSelector((state) => state.userInvestments);

  const FILTERS = ["All", "Active", "Paused", "Completed"];
  const [filter, setFilter] = useState("All");
  useEffect(() => {
    dispatch(fetchPartnerParticipatingInvestments(1));
  }, [dispatch]);
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && meta?.pagination?.has_more_pages) {
      dispatch(fetchPartnerParticipatingInvestments(meta.pagination.current_page + 1));
    }
  }, [isLoadingMore, meta]);

  const handleRefresh = () => {
    dispatch(fetchPartnerParticipatingInvestments(1));
  };
  const formattedInvestments = investments.map((inv: any) => ({
    id: inv.id,
    name: inv.name,
    amount: inv.current_total_invested,
    status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
    returns: inv.expected_return_rate,
    date: inv.start_date,
  }));

  const filtered =
    filter === "All"
      ? formattedInvestments
      : formattedInvestments.filter((i: any) => i.status === filter);

  const renderInvestment = ({ item }: any) => (
    <TouchableOpacity style={styles.investmentCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.investmentName}>{item.name}</Text>
        <Text style={styles.investmentAmount}>Amount: ${item.amount}</Text>
        <Text style={styles.investmentDate}>Started: {item.date}</Text>
      </View>
      <Text
        style={[
          styles.investmentStatus,
          item.status === "Active" ? styles.statusActive : styles.statusClosed,
        ]}
      >
        {item.status}
      </Text>
    </TouchableOpacity>
  );
  if (isLoading) {
    return (
      <DashboardLayout>
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Text style={{ color: "red", marginTop: 50, textAlign: "center" }}>{error}</Text>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <View style={styles.container}>
        <View style={styles.balanceCardDark}>
          <Text style={styles.balanceLabelDark}>Total Investment</Text>
          <Text style={styles.balanceValueDark}>
            ${summary?.total_invested?.toLocaleString() ?? 0}
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


        <View style={styles.card}>
          <Text style={styles.title}>Investment Overview</Text>
          <Text style={styles.label}>Total Investments: <Text style={styles.value}>{summary.total_investments}</Text></Text>
          <Text style={styles.label}>Active Investments: <Text style={styles.value}>{summary.active_investments}</Text></Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.label}>Current Value: <Text style={styles.value}>${summary.current_value}</Text></Text>
            {/* <Text style={styles.label}>Duration: <Text style={styles.value}>12 Months</Text></Text> */}
            <TouchableOpacity style={styles.balanceActionBtnDark}>
              <Text style={styles.balanceActionTextDark}>
                Shared Investments
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
                onPress={() => setFilter(f)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>


        {/* Investment List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderInvestment}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={handleRefresh}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color={Colors.green} />
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingBottom: 80 },
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
    flexDirection: "row",
    alignItems: "center",
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
  investmentCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
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
});
