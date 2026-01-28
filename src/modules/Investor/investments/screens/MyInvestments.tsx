import { InvestmentStackParamList } from "@/navigation/InvestorStacks/InvestmentStack";
import Colors from "@/shared/colors/Colors";
import { Button } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  fetchPartnerParticipatingInvestments,
  leaveInvestment,
} from "@shared/store/slices/shared/investments/partnerInvestmentSlice";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
type Props = NativeStackScreenProps<InvestmentStackParamList, "MyInvestments">;
export const MyInvestments = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { investments, summary, isLoading, error, meta, isLoadingMore } =
    useAppSelector((state) => state.userInvestments);
  const [search, setSearch] = useState("");
  const { formatCurrency } = useCurrencyFormatter();
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
  const handleRefresh = () => {
    dispatch(fetchPartnerParticipatingInvestments({ page: 1 }));
  };
  const handleSearch = () => {
    // always start at page 1
    dispatch(fetchPartnerParticipatingInvestments({ page: 1, search }));
  };
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate("JoinedInvestmentDetail", { id: item.id })
      }
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
            item.status === "active"
              ? styles.statusActive
              : styles.statusClosed,
          ]}
        >
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Divider */}
      {/* <View style={styles.divider} /> */}

      {/* Amounts */}
      <View style={styles.amountRow}>
        <View>
          <Text style={styles.amountLabel}>My Investment</Text>
          <Text style={styles.amountValue}>
            {formatCurrency(item.my_investment ?? 0)}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.amountLabel}>Target</Text>
          <Text style={styles.amountValue}>
            {formatCurrency(item.total_target_amount ?? 0)}
          </Text>
        </View>
      </View>

      {/* Meta */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Joined: {formatDate(item.joined_at)}</Text>
        <Text style={styles.metaText}>
          Participants: {item.total_participants}
        </Text>
      </View>

      {/* Actions */}
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
  const formatDate = (d?: string | null) => {
    if (!d) return "N/A";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };
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
          <Feather name="search" size={20} color={Colors.primary} />
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 4 }}>
              <View>
                <Text style={styles.label}>
                  Invested:{" "}
                </Text>
                <Text style={styles.value}>
                  {formatCurrency(summary.total_invested)}
                </Text>
              </View>

              <View >
                <Text style={styles.label}>
                  Total:{" "}
                </Text>
                <Text style={styles.value}>{summary.total_investments}</Text>
              </View>

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 4 }}>
              <View >
                <Text style={styles.label}>
                  Avg. ROI:{" "}
                </Text>
                <Text style={styles.value}>{summary.average_roi}%</Text>
              </View>


              {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}> */}
              <View>
                <Text style={styles.label}>
                  Active:{" "}
                </Text>
                <Text style={styles.value}>{summary.active_investments}</Text>
              </View>
            </View>
            <Button
              title="Browse Investment"
              // icon={<Ionicons name="trash" size={20} color={Colors.white} />}
              onPress={() => { navigation.navigate("SharedInvestments"); }
              }
              style={styles.balanceActionBtnDark}
              textStyle={styles.balanceActionTextDark}
              variant="primary"
            />
            {/* </View> */}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Image source={require('../../../../../assets/images/noInvestment.png')} style={{ width: 100, height: 100, alignSelf: 'center' }} />
            <Text style={styles.emptyText}>No joined investments available.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.background,
    paddingHorizontal: 16,
    marginBottom: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 28,
    // marginHorizontal: 12,
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
  card: {
    backgroundColor: Colors.white,
    paddingTop: 16,
    borderRadius: 22,
    paddingHorizontal: 16,
    // marginHorizontal: 12,
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
  investmentName: {
    color: Colors.secondary,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#6B7280" },
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
});

// export default MyInvestments;
