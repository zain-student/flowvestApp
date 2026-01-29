import { PartnerDashboardStackParamList } from "@/navigation/PartnerStacks/PartnerDashboardStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather, Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchPartnerDashboard } from "@store/slices/partner/dashboard/partnerDashboardSlice";
import React from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type Props = NativeStackScreenProps<
  PartnerDashboardStackParamList,
  "RecentPayouts"
>;

export const RecentPayouts = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { recent_payouts, loading } = useAppSelector(
    (state) => state.partnerDashboard,
  );
  const { formatCurrency } = useCurrencyFormatter();

  const pullToRefresh = () => {
    dispatch(fetchPartnerDashboard());
  };

  const renderPayoutItem = ({ item }: { item: (typeof recent_payouts)[0] }) => {
    const statusColor =
      item.status === "paid"
        ? Colors.green
        : item.status === "scheduled"
          ? Colors.gray
          : Colors.error;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
      >
        <View style={styles.iconWrapper}>
          <Feather
            name="arrow-down-right"
            size={22}
            color={Colors.primary}
            style={styles.icon}
          />
        </View>
        <View style={styles.infoWrapper}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.investmentName}>{item.investment_name}</Text>
            {/* </View> */}

            <Text style={styles.statusBadge}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          {/* </View> */}

          {/* Middle Row */}
          <View style={styles.metaRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }} >
              <Ionicons name="time-outline" size={13} color={Colors.secondary} />
              <Text style={styles.metaText}>Paid : {item.paid_date}</Text>
            </View>
            <Text style={styles.metaText}>
              Type:{" "}
              {item.payout_type.charAt(0).toUpperCase() +
                item.payout_type.slice(1)}
            </Text>
          </View>

          {/* Bottom Row */}
          <View style={styles.amountRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }} >
              <Ionicons name="cash-outline" size={13} color={Colors.secondary} />
              <Text style={styles.amountLabel}>Amount</Text>
            </View>
            <Text style={styles.amountValue}>{formatCurrency(item.amount)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recent_payouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPayoutItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Image source={require('../../../../../assets/images/noRecentActivity.png')} style={{ width: 150, height: 150, alignSelf: 'center', marginTop: 80 }} />
            <Text style={styles.emptyText}>No recent payouts found.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={pullToRefresh}
            tintColor={Colors.primary}
          />
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
  emptyState: { justifyContent: "center", alignItems: "center", paddingTop: 20, marginTop: 100 },
  listContainer: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderColor: "#E6EDFF",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: 'center'
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGray, // 20% opacity
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    // marginRight: 10,
  },
  infoWrapper: {
    flex: 1,
  },
  investmentName: {
    color: Colors.secondary,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  statusBadge: {
    backgroundColor: Colors.statusbg,
    color: Colors.statusText,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: "hidden",
    textTransform: "capitalize",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: 4,
    // marginBottom: 6,
  },
  metaText: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: 8,
  },
  amountLabel: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  amountValue: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
    color: Colors.secondary
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingVertical: 16,
  },
});

export default RecentPayouts;
