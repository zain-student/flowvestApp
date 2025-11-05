import { InvestmentStackParamList } from "@/navigation/InvestorStacks/InvestmentStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchInvestments } from "@/shared/store/slices/investor/investments/investmentSlice";
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
      style={styles.investmentCard}
      onPress={() => navigation.navigate("InvestmentDetails", { id: item.id })}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          {item.type === "shared" && item.status === "Active" && item.can_join === true && (
            <TouchableOpacity
              style={styles.joinBtn}
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate("InvestmentDetails", {
                  id: item.id,
                  showJoinForm: "true",
                });
                console.log("Join investment tapped:", item.id);
              }}
            >
              <Ionicons name="add-circle-outline" size={18} color={Colors.white} />
              <Text style={styles.joinBtnText}>Join Investment</Text>
            </TouchableOpacity>)
          }
        </View>
        <Text style={styles.investmentName}>{item.name}(<Text style={styles.investmentAmount}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>)</Text>
        <Text style={styles.investmentAmount}>Amount: ${item.type === "shared" ? item.shared_amount : item.amount}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.investmentDate}>Started: {item.date}</Text>
          <Text
            style={[
              styles.investmentStatus,
              item.status === "Active" ? styles.statusActive : styles.statusClosed,
            ]}
          >
            {item.status}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' }}>
          {/* View partners of investment */}
          <TouchableOpacity
            onPress={() => handleOpenPartners(item.id)}
            style={styles.partnerButton}>
            <Text style={{ color: Colors.gray, marginBottom: 4, fontSize: 18 }}>Partners</Text>
            <Feather name="users" size={20} color={Colors.gray} />
          </TouchableOpacity>
          {/* Add partner to investment button */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddPartner", { id: item.id })
              console.log("Investment id is :", item.id)
            }
            }
            style={[styles.partnerButton, { marginTop: 8 }]}
          >
            <Text style={{ color: Colors.gray, marginBottom: 4, fontSize: 18 }}>Add Partner</Text>
            <Feather name="user-plus" size={20} color={Colors.gray} />
          </TouchableOpacity>
        </View>
      </View>

      {/* <Ionicons name="chevron-forward" size={20} color={Colors.gray} /> */}
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
            ${stats.total_invested}
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
            <Feather name="search" size={20} color="#fff" />
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
    backgroundColor: Colors.secondary,
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
