import { DashboardLayout } from "@/modules/Common/components/DashboardLayout";
import type { PartnersInvestmentDetailStackParamList } from "@/navigation/PartnerStacks/PartnersInvestmentDetailStack";
import { Button } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import {
  fetchPartnerParticipatingInvestments,
  leaveInvestment,
} from "@/shared/store/slices/shared/investments/partnerInvestmentSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Colors from "@shared/colors/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
export const InvestmentDetails = () => {
  const dispatch = useAppDispatch();
  const { investments, summary, isLoading, error, meta, isLoadingMore } =
    useAppSelector((state) => state.userInvestments);
  const navigation =
    useNavigation<NativeStackNavigationProp<PartnersInvestmentDetailStackParamList>>();
  const { formatCurrency } = useCurrencyFormatter();
  const FILTERS = ["All", "Active", "Paused", "Completed"];
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

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
      dispatch(
        fetchPartnerParticipatingInvestments({
          page: meta.pagination.current_page + 1,
        }),
      );
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
        onPress={() =>
          navigation.navigate("JoinedInvestmentDetail", { id: item.id })
        }
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
            <Text
              style={styles.statusText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>


        {/* Amounts */}
        <View style={styles.amountRow}>
          <View>
            <Text style={styles.amountLabel}>Invested</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(item.amount)}
            </Text>
          </View>

          {item.type.toLowerCase() === "shared" && (
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.amountLabel}>Target</Text>
              <Text style={styles.amountValue}>
                {formatCurrency(item.targetAmount)}
              </Text>
            </View>
          )}
        </View>

        {/* Meta Row */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Started: {item.date}</Text>
          <Text style={styles.metaText}>
            Participants: {item.participants ?? 0}
          </Text>
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
                ],
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
        <LinearGradient
          colors={[Colors.primary, "#3a84fb"]} // left → right
          start={{ x: 0, y: 1 }}
          end={{ x: 2, y: 0 }}
          style={styles.balanceCardDark}
        >
          <Image source={require('../../../../../assets/images/upperDiv.png')}
            style={{ position: 'absolute', width: 100, height: 110, top: -30, right: -50 }} />
          <Text style={styles.balanceLabelDark}>Total Investment</Text>
          <Text style={styles.balanceValueDark}>
            {formatCurrency(Number(summary?.total_invested ?? 0))}
          </Text>
          <View style={styles.mirror}>
            <Text style={styles.balanceChange}>
              ROI Avg:
              <Text style={styles.balanceChangeDark}>
                {summary?.average_roi ?? 0}%
              </Text>
            </Text>
          </View>
          <Image source={require('../../../../../assets/images/lowerDiv.png')} style={{ position: 'absolute', width: 200, height: 260, bottom: -190, left: -150, }} />
        </LinearGradient>
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 4 }}>
                <View>
                  <Text style={styles.label}>
                    Total Investments:{" "}
                  </Text>
                  <Text style={styles.value}>{summary.total_investments}</Text>
                </View>
                <View>
                  <Text style={styles.label}>
                    Active Investments:{" "}
                  </Text>
                  <Text style={styles.value}>{summary.active_investments}</Text>
                </View>
              </View>
              <Text style={styles.label}>
                Current Value:{" "}
              </Text>
              <Text style={styles.value}>
                {formatCurrency(summary.current_value)}
              </Text>
              {/* </View> */}
              <Button
                title="Shared Investments"
                onPress={() => { navigation.navigate("SharedInvestments"); }
                }
                style={styles.balanceActionBtnDark}
                textStyle={styles.balanceActionTextDark}
                variant="primary"
              />
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Image source={require('../../../../../assets/images/noRecentActivity.png')} style={{ width: 100, height: 100, alignSelf: 'center' }} />
              <Text style={styles.emptyText}>
                No shared investments available.
              </Text>
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
    paddingBottom: 0,
    backgroundColor: Colors.background,
  },
  // innerContainer: { paddingHorizontal: 16 },
  balanceCardDark: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 12,
    padding: 24,
    // paddingTop: 36,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  balanceLabelDark: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter_500Regular",
  },
  balanceValueDark: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    fontWeight: "600",
    marginVertical: 2,
  },
  mirror: { backgroundColor: Colors.mirror, width: '47%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 18, paddingVertical: 6, borderWidth: 0.3, borderColor: Colors.white, opacity: 0.7 },
  balanceChange: {
    color: Colors.yellow,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  balanceChangeDark: {
    color: Colors.yellow,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 10 },
  balanceActionBtnDark: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    backgroundColor: Colors.darkButton,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginTop: 8,
  },
  balanceActionTextDark: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 7,
  },
  card: {
    backgroundColor: Colors.white,
    paddingTop: 16,
    borderRadius: 22,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E6EDFF"
  },
  title: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.gray,
    marginBottom: 8,
  },
  label: { fontSize: 12, fontWeight: '500', lineHeight: 18, color: Colors.gray, marginBottom: 4 },
  value: { color: Colors.secondary, fontWeight: "600", fontSize: 14 },
  cardContainer: {
    marginHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: "#E6EDFF",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  investmentName: {
    color: Colors.secondary,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },

  investmentType: {
    color: Colors.secondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusActive: {
    backgroundColor: Colors.statusbg,
  },

  statusClosed: {
    backgroundColor: "rgba(107,114,128,0.15)",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.statusText,
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
    fontSize: 12, fontWeight: '500', color: Colors.gray, marginTop: 10
  },

  amountValue: {
    color: Colors.secondary,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
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

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: {
    color: Colors.gray,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 28,
    marginHorizontal: 12,
    marginVertical: 6,
    paddingHorizontal: 8,
    borderColor: "#E6EDFF",
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    // paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
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
