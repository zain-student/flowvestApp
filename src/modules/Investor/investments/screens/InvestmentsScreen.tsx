import { InvestmentStackParamList } from "@/navigation/InvestorStacks/InvestmentStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchInvestments } from "@/shared/store/slices/investor/investments/investmentSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { DashboardLayout } from "../../../Common/components/DashboardLayout";
import InvestmentPartnersModal from "../components/InvestmentPartnersModal";

const FILTERS = ["All", "Active", "Paused", "Completed"];
type Props = NativeStackNavigationProp<InvestmentStackParamList, "InvestmentScreen">;

export const InvestmentsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Props>();

  const { investments, stats, isLoading, isLoadingMore, meta } = useAppSelector(
    (state) => state.investments
  );

  const [filter, setFilter] = useState("All");
  const [showPartnersModal, setShowPartnersModal] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<number | null>(null);
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
    console.log("Investments loaded", stats.total_investments)
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
            item.status === "Active" ? styles.statusActive : styles.statusClosed,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Amount */}
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Invested Amount</Text>
        <Text style={styles.amountValue}>
          {formatCurrency(
            item.type === "shared" ? item.shared_amount : item.amount
          )}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footerRow}>
        <Text style={styles.startDate}>Started: {item.date}</Text>

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


  console.log("Filtered investments IDs:", filtered.map((i) => i.id));
  return (
    <DashboardLayout>
      <View style={styles.container}>
        {/* Top card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Invested Amount</Text>
          <Text style={styles.cardValue}>
            {formatCurrency(stats.total_invested)}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.cardSubtitle}>
              +8.2%{" "}
              <Text style={{ color: Colors.gray, fontWeight: "400" }}>this year</Text>
            </Text>
            <Text style={{ color: Colors.gray, fontWeight: "400" }}>Total Investments:
              <Text style={styles.cardSubtitle}>
                {stats.total_investments}{" "}
              </Text>
            </Text>
          </View>
          <View style={styles.balanceActionsRow}>
            <TouchableOpacity style={styles.balanceActionBtnDark}
              onPress={() => navigation.navigate("MyInvestments")}
            >
              <Feather name="arrow-up-right" size={18} color="#fff" />
              <Text style={styles.balanceActionTextDark}>My Investments</Text>
            </TouchableOpacity>
          </View>
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
                style={[styles.filterText, filter === f && styles.filterTextActive]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
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
            isLoadingMore ? <ActivityIndicator size="small" color={Colors.green} /> : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
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
          <Text style={styles.fabLabel}>Add Investment</Text>
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
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    paddingTop: 36,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: { fontSize: 15, color: Colors.gray, marginBottom: 6 },
  cardValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 4,
  },
  cardSubtitle: { fontSize: 14, color: Colors.green },
  balanceActionsRow: { flexDirection: "row", marginTop: 18 },
  balanceActionBtnDark: {
    width: '60%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.success,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
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
    marginBottom: 16,
    marginTop: 10,
    gap: 10,
    marginHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 4,
    justifyContent: "space-around",
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  cardContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 14,
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
    fontSize: 17,
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
  },

  amountLabel: {
    fontSize: 13,
    color: Colors.gray,
  },

  amountValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.white,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  startDate: {
    fontSize: 12,
    color: Colors.gray,
  },

  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
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
    marginTop: 14,
    gap: 10,
  },

  actionBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    paddingVertical: 10,
  },

  actionText: {
    color: Colors.gray,
    fontSize: 14,
    fontWeight: "500",
  },

  filterBtnActive: { backgroundColor: Colors.secondary },
  filterText: { color: "#6B7280", fontWeight: "500" },
  filterTextActive: { color: Colors.white },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#6B7280" },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 80,
    backgroundColor: Colors.green,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  fabLabel: { color: Colors.white, fontWeight: "bold", fontSize: 15 },
  partnerButton: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.gray, padding: 2, borderRadius: 6, width: "45%", justifyContent: 'center' },
});

export default InvestmentsScreen;
