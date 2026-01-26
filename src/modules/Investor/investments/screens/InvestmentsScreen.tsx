import { InvestmentStackParamList } from "@/navigation/InvestorStacks/InvestmentStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchInvestments } from "@/shared/store/slices/investor/investments/investmentSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { DashboardLayout } from "../../../Common/components/DashboardLayout";
import InvestmentPartnersModal from "../components/InvestmentPartnersModal";
const FILTERS = ["All", "Active", "Paused", "Completed"];
type Props = NativeStackNavigationProp<
  InvestmentStackParamList,
  "InvestmentScreen"
>;

export const InvestmentsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Props>();

  const { investments, stats, isLoading, isLoadingMore, meta } = useAppSelector(
    (state) => state.investments,
  );

  const [filter, setFilter] = useState("All");
  const [showPartnersModal, setShowPartnersModal] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<
    number | null
  >(null);
  const [search, setSearch] = useState("");
  const { formatCurrency } = useCurrencyFormatter();
  const handleOpenPartners = (id: number) => {
    setSelectedInvestmentId(id);
    setShowPartnersModal(true);
  };

  const handleClosePartners = () => {
    setShowPartnersModal(false);
    setSelectedInvestmentId(null);
  };
  const formattedInvestments = investments.map((inv: any) => ({
    id: inv.id,
    name: inv.name,
    type: inv.type,
    amount: inv.initial_amount,
    can_join: inv.can_join_as_admin,
    shared_amount: inv.current_total_invested,
    status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
    returns: inv.expected_return_rate,
    date: inv.start_date,
  }));

  const filtered =
    filter === "All"
      ? formattedInvestments
      : formattedInvestments.filter((i: any) => i.status === filter);

  // First page load
  useEffect(() => {
    dispatch(fetchInvestments({ page: 1 }));
    console.log("Investments loaded", stats.total_investments);
  }, [dispatch]);
  const handleSearch = () => {
    // always start at page 1
    dispatch(fetchInvestments({ page: 1, search }));
  };
  // When search text changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === "") {
        // When User cleared the search bar — reload all investment
        dispatch(fetchInvestments({ page: 1, search: "" }));
      } else {
        // Normal search
        dispatch(fetchInvestments({ page: 1, search }));
      }
    }, 1300); // 1.3 seconds debounce

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Load more when reaching end
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && meta.pagination.has_more_pages) {
      dispatch(fetchInvestments({ page: meta.pagination.current_page + 1 }));
    }
  }, [isLoadingMore, meta.pagination]);

  // Pull-to-refresh
  const handleRefresh = () => {
    dispatch(fetchInvestments({ page: 1 }));
  };

  const renderInvestment = ({ item }: any) => (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("InvestmentDetails", { id: item.id })}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.investmentName}>{item.name}</Text>
          <Text style={styles.investmentType}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Investment
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            item.status === "Active"
              ? styles.statusActive
              : styles.statusClosed,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Divider */}
      {/* <View style={styles.divider} /> */}

      {/* Amount */}
      <View style={styles.amountRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="wallet-outline" size={13} color={Colors.secondary} />
          <Text style={styles.amountLabel}>Invested Amount</Text>
        </View>
        <Text style={styles.amountValue}>
          {formatCurrency(
            item.type === "shared" ? item.shared_amount : item.amount,
          )}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="calendar-outline" size={13} color={Colors.secondary} />
          <Text style={styles.startDate}>Started: {item.date}</Text>
        </View>
        {item.type === "shared" &&
          item.status === "Active" &&
          item.can_join && (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() =>
                navigation.navigate("InvestmentDetails", {
                  id: item.id,
                  showJoinForm: "true",
                })
              }
            >
              <Ionicons name="add-circle-outline" size={16} color="#fff" />
              <Text style={styles.joinText}>Join</Text>
            </TouchableOpacity>
          )}
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleOpenPartners(item.id)}
        >
          <Feather name="users" size={18} color={Colors.gray} />
          <Text style={styles.actionText}>Partners</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("AddPartner", { id: item.id })}
        >
          <Feather name="user-plus" size={18} color={Colors.gray} />
          <Text style={styles.actionText}>Add Partner</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  console.log(
    "Filtered investments IDs:",
    filtered.map((i) => i.id),
  );
  return (
    <DashboardLayout>
      <View style={styles.container}>
        {/* Top card */}
        <LinearGradient
          colors={[Colors.primary, "#3a84fb"]} // left → right
          start={{ x: 0, y: 1 }}
          end={{ x: 2, y: 0 }}
          style={styles.card}
        >
          <Image source={require('../../../../../assets/images/upperDiv.png')} style={{ position: 'absolute', width: 170, height: 170, top: -100, right: -115 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.cardTitle}>Total Invested Amount</Text>
            <View style={{ alignSelf: 'flex-end', backgroundColor: '#0AFF5C47', borderRadius: 8, height: 29, width: 71, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Ionicons name="trending-up" size={24} color={Colors.green} />
              <Text style={styles.increment}>
                +8.2% </Text>
            </View>
          </View>
          <Text style={styles.cardValue}>
            {formatCurrency(stats.total_invested)}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >

            <View style={styles.mirror}  >
              <Text style={{
                color: Colors.white,
                fontWeight: "400",
                fontFamily: "Inter_400Regular",
              }}>
                Total Investments:
                <Text style={styles.cardSubtitle}>
                  {stats.total_investments}{" "}
                </Text>
              </Text>
            </View>

            {/* <Text style={{ color: Colors.gray, fontWeight: "400" }}>
              this year
            </Text> */}
          </View>
          <View style={styles.balanceActionsRow}>
            <TouchableOpacity
              style={styles.balanceActionBtnDark}
              onPress={() => navigation.navigate("MyInvestments")}
            >
              <Feather name="arrow-up-right" size={18} color="#fff" />
              <Text style={styles.balanceActionTextDark}>My Investments</Text>
            </TouchableOpacity>
          </View>
          {/* </View> */}
          <Image source={require('../../../../../assets/images/lowerDiv.png')} style={{ position: 'absolute', width: 200, height: 260, bottom: -190, left: -150, }} />
          {/* <View style={styles.balanceActionsRow}></View> */}
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
        {/* Filters */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Investment list */}
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
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Image source={require('../../../../../assets/images/noInvestment.png')} style={{ width: 100, height: 100, alignSelf: 'center' }} />
              <Text style={styles.emptyText}>No investments available.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        {/* FAB */}
        <TouchableOpacity
          onPress={() => navigation.navigate("AddInvestments")}
          style={styles.fab}
        >
          <Ionicons name="add" size={24} color={"white"} />
        </TouchableOpacity>
      </View>
      {/* Investment Partners Modal */}
      {selectedInvestmentId && (
        <InvestmentPartnersModal
          visible={showPartnersModal}
          onClose={handleClosePartners}
          investmentId={selectedInvestmentId}
        />
      )}
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  card: {
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
  cardTitle: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter_500Regular",
  },
  cardValue: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    fontWeight: "600",
    marginVertical: 2,
  },
  mirror: { backgroundColor: Colors.mirror, width: '60%', justifyContent: 'center', alignItems: 'center', borderRadius: 18, paddingVertical: 4, paddingHorizontal: 12, borderWidth: 0.3, borderColor: Colors.white, opacity: 0.7, marginTop: 4 },
  cardSubtitle: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  increment: {
    color: Colors.green,
    fontSize: 14,
    fontFamily: "Inter_500SemiBold",
  },
  balanceActionsRow: { flexDirection: "row", marginTop: 4 },
  balanceActionBtnDark: {
    width: "60%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.green,
    borderRadius: 18,
    padding: 6,
    marginRight: 12,
  },
  balanceActionTextDark: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginLeft: 7,
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
  joinBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  joinBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 4,
    // marginTop: 10,
    gap: 1,
    marginHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 4,
    justifyContent: "space-around",
    borderColor: "#E6EDFF",
    borderWidth: 1
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,

  },
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
    // marginLeft: 4,
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
    color: Colors.green,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 12,
  },

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6
  },

  amountLabel: {
    color: Colors.secondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },

  amountValue: {
    color: Colors.secondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  startDate: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },

  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },

  joinText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 10,
  },

  actionBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E6EDFF",
    borderRadius: 10,
    paddingVertical: 10,
  },

  actionText: {
    color: Colors.gray,
    fontSize: 14,
    fontWeight: "500",
  },

  filterBtnActive: { backgroundColor: Colors.primary },
  filterText: { color: Colors.gray, fontWeight: "400", fontSize: 16 },
  filterTextActive: { color: Colors.white },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: {
    color: Colors.gray,
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingVertical: 16,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 80,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  fabLabel: { color: Colors.white, fontWeight: "bold", fontSize: 15 },
  partnerButton: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 2,
    borderRadius: 6,
    width: "45%",
    justifyContent: "center",
  },
});

export default InvestmentsScreen;
