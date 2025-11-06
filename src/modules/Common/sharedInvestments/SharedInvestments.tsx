import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import type { PartnerInvestment } from "@/shared/store/slices/shared/investments/partnerInvestmentSlice";
import {
  fetchAvailableSharedPrograms,
} from "@/shared/store/slices/shared/investments/partnerInvestmentSlice";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const SharedInvestments: React.FC = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const {
    list,
    isLoading,
    error,
    summary,
    meta: { pagination },
  } = useAppSelector((state) => state.userInvestments.sharedPrograms);

  // Initial load
  useEffect(() => {
    if (search === "") {
      dispatch(fetchAvailableSharedPrograms({ page: 1, search }));
    }
  }, [search, dispatch]);

  // Search handler
  const handleSearch = useCallback(() => {
    setPage(1);
    dispatch(fetchAvailableSharedPrograms({ search, page: 1 }));
  }, [dispatch, search]);

  // Pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await dispatch(fetchAvailableSharedPrograms({ page: 1, search }));
    setRefreshing(false);
  };

  // Load more pagination
  const handleLoadMore = () => {
    if (
      !isLoading &&
      pagination?.has_more_pages &&
      pagination.current_page < pagination.last_page 
    ) {
      const nextPage = pagination.current_page + 1;
      setPage(nextPage);
      dispatch(fetchAvailableSharedPrograms({ page: nextPage, search }));
    }
  };

  if (isLoading && list.length === 0)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );

  const renderSummary = () => (
    <View style={styles.summaryRow}>
      <SummaryCard
        label="Total Invested"
        value={`$${summary.total_invested.toLocaleString()}`}
        style={{ backgroundColor: "#E0F2FE" }}
      />
      <SummaryCard
        label="Total Investments"
        value={summary.total_investments}
        style={{ backgroundColor: "#FEF3C7" }}
      />
      <SummaryCard
        label="Avg ROI"
        value={`${summary.avg_roi.toFixed(1)}%`}
        style={{ backgroundColor: "#ECFDF5" }}
      />
      <SummaryCard
        label="Participants"
        value={summary.total_participants}
        style={{ backgroundColor: "#FEE2E2" }}
      />
    </View>
  );

  const renderItem = ({ item }: { item: PartnerInvestment }) => {
    const current = Number(item.current_total_invested) || 0;
    const target = Number(item.total_target_amount) || 0;

    // safe progress calculation, avoid division by zero and NaN
    const rawProgress = target > 0 ? (current / target) * 100 : 0;
    // cap displayed percent and bar width to [0, 100]
    const cappedProgress = Math.min(Math.max(Math.floor(rawProgress), 0), 100);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("SharedInvestmentDetail", { id: item.id })
        }
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text
              style={[
                styles.status,
                item.status?.toLowerCase() === "active"
                  ? styles.statusActive
                  : styles.statusClosed,
              ]}
            >
              {item.status
                ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                : "N/A"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.amount}>
              Amount: ${item.current_total_invested ?? "N/A"}
            </Text>
            <Text style={styles.amount}>
              Min: ${item.min_investment_amount ?? "N/A"} - Max: ${item.max_investment_amount ?? "N/A"}
            </Text>
          </View>

          {/* Investment Progress */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.meta}>
              Investment Progress ({cappedProgress}% funded)
            </Text>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${cappedProgress}%` },
                ]}
              />
            </View>
            <Text style={styles.meta}>
              ${item.current_total_invested} / ${item.total_target_amount}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.meta}>
              ROI:{" "}
              {item.expected_return_rate !== undefined &&
                item.expected_return_rate !== null
                ? Number(item.expected_return_rate).toFixed(1)
                : "N/A"}
              %
            </Text>
            <Text style={styles.meta}>
              Participants: {item.total_participants ?? "N/A"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.joinBtn}
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate("SharedInvestmentDetail", {
                id: item.id,
                showJoinForm: "true",
              });
            }}
          >
            <Ionicons name="add-circle-outline" size={18} color={Colors.white} />
            <Text style={styles.joinBtnText}>Join Investment</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, marginBottom: 0 }}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search investments..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Feather name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 12, paddingBottom: 70 }}
        data={list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderSummary}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.secondary}
          />
        }
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        onMomentumScrollBegin={() => {
        }}
        ListFooterComponent={
          pagination?.has_more_pages ? (
            <ActivityIndicator
              size="small"
              color={Colors.secondary}
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No shared programs available.</Text>
          </View>
        }
      />
    </View>
  );
};

// SummaryCard Component
const SummaryCard = ({
  label,
  value,
  style,
}: {
  label: string;
  value: string | number;
  style?: object;
}) => (
  <View style={[styles.summaryCard, style]}>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: Colors.gray },
  searchContainer: {
    marginTop: 12,
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
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 12,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: 4,
  },
  summaryLabel: { fontSize: 13, color: Colors.gray },
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "600", color: Colors.white, width: "80%" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  amount: { fontSize: 14, color: Colors.white, fontWeight: "500" },
  meta: { fontSize: 13, color: Colors.gray },
  status: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusActive: { color: Colors.green },
  statusClosed: { backgroundColor: Colors.inActiveStatusBg, color: Colors.gray },
  progressContainer: {
    height: 8,
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 4,
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 10,
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
});