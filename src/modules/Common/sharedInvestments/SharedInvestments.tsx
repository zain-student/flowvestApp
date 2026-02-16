import Colors from "@/shared/colors/Colors";
import { Button } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import type { PartnerInvestment } from "@/shared/store/slices/shared/investments/partnerInvestmentSlice";
import { fetchAvailableSharedPrograms } from "@/shared/store/slices/shared/investments/partnerInvestmentSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
  const { formatCurrency } = useCurrencyFormatter();
  const {
    list,
    isLoading,
    error,
    summary,
    meta: { pagination },
  } = useAppSelector((state) => state.userInvestments.sharedPrograms);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === "") {
        // When User cleared the search bar — reload all investment
        dispatch(fetchAvailableSharedPrograms({ page: 1, search: "" }));
      } else {
        // Normal search
        dispatch(fetchAvailableSharedPrograms({ page: 1, search }));
      }
    }, 1300); // 1.3 seconds debounce

    return () => clearTimeout(delayDebounce);
  }, [search]);

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

  // if (isLoading && list.length === 0)
  //   return (
  //     <View style={styles.centered}>
  //       <ActivityIndicator size="large" color={Colors.secondary} />
  //     </View>
  //   );

  const renderSummary = () => (
    <View style={styles.summaryRow}>
      <SummaryCard
        label="Total Invested"
        value={formatCurrency(summary.total_invested)}
        style={{ backgroundColor: Colors.white }}
      />
      <SummaryCard
        label="Total Investments"
        value={summary.total_investments}
        style={{ backgroundColor: Colors.white }}
      />
      <SummaryCard
        label="Avg ROI"
        value={`${summary.avg_roi.toFixed(1)}`}
        style={{ backgroundColor: Colors.white }}
      />
      <SummaryCard
        label="Participants"
        value={summary.total_participants}
        style={{ backgroundColor: Colors.white }}
      />
    </View>
  );
  const renderItem = ({ item }: { item: PartnerInvestment }) => {
    const current = Number(item.current_total_invested) || 0;
    const target = Number(item.total_target_amount) || 0;
    const progress =
      target > 0 ? Math.min(Math.floor((current / target) * 100), 100) : 0;

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("SharedInvestmentDetail", { id: item.id })
        }
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.investmentName}>{item.name}</Text>
            <Text style={styles.investmentType}>Shared Investment</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              item.status?.toLowerCase() === "active"
                ? styles.statusActive
                : styles.statusClosed,
            ]}
          >
            <Text style={styles.statusText}>
              {item.status
                ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                : "N/A"}
            </Text>
          </View>
        </View>

        {/* Divider */}
        {/* <View style={styles.divider} /> */}

        {/* Amount */}
        <View style={styles.amountRow}>
          <View>
            <Text style={styles.amountLabel}>Current Invested</Text>
            <Text style={styles.amountValue}>{formatCurrency(current)}</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.amountLabel}>Target</Text>
            <Text style={styles.amountValue}>{formatCurrency(target)}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.metaText}>Funding Progress</Text>
            <Text style={styles.metaText}>{progress}%</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            ROI:{" "}
            {item.expected_return_rate != null
              ? `${Number(item.expected_return_rate).toFixed(1)}%`
              : "N/A"}
          </Text>
          <Text style={styles.metaText}>
            Participants: {item.total_participants ?? "N/A"}
          </Text>
        </View>

        {/* Action */}

        <Button
          title="Join Investment"
          icon={
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={Colors.white}
            />
          }
          // onPress={() => { navigation.navigate("SharedInvestments"); }
          // }
          onPress={() =>
            navigation.navigate("SharedInvestmentDetail", {
              id: item.id,
              showJoinForm: "true",
            })
          }
          style={styles.joinButton}
          textStyle={styles.joinText}
          variant="primary"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: Colors.background, marginBottom: 0 }}
    >
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
          <Feather name="search" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={{ padding: 12, paddingBottom: 70 }}
        data={list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderSummary}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={handleRefresh}
        //     tintColor={Colors.secondary}
        //   />
        // }
        refreshing={isLoading}
        onRefresh={handleRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        onMomentumScrollBegin={() => {}}
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
            {/* <Feather name="briefcase" size={48} color={Colors.gray} /> */}
            <Image
              source={require("../../../../assets/images/noInvestment.png")}
              style={{ width: 100, height: 100, alignSelf: "center" }}
            />
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 28,
    marginHorizontal: 12,
    marginTop: 6,
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
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E6EDFF",
    // elevation: 2,
  },
  summaryValue: {
    color: Colors.secondary,
    fontSize: 14,
    fontFamily: "Inter_500Bold",
    fontWeight: "700",
  },
  summaryLabel: { fontSize: 13, color: Colors.gray },
  cardContainer: {
    // marginHorizontal: 12,
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
    fontSize: 12,
    fontWeight: "500",
    color: Colors.gray,
    marginTop: 10,
  },

  amountValue: {
    color: Colors.secondary,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
  },

  progressSection: {
    marginTop: 6,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  progressContainer: {
    height: 8,
    backgroundColor: "rgba(248, 81, 81, 0.15)",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 10,
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

  joinButton: {
    paddingVertical: 10,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    // paddingVertical: 10,
    borderRadius: 10,
  },

  joinText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
});
