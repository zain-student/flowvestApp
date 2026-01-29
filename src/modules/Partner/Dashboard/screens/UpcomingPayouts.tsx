import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerDashboard } from "@/shared/store/slices/partner/dashboard/partnerDashboardSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../../../shared/colors/Colors";

export const UpcomingPayouts = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { upcoming_payouts, loading } = useAppSelector(
    (state) => state.partnerDashboard,
  );
  const { formatCurrency } = useCurrencyFormatter();

  const pullToRefresh = () => {
    dispatch(fetchPartnerDashboard());
  };

  const renderItem = ({ item }: any) => {
    const statusColor =
      item.status === "scheduled"
        ? Colors.green
        : item.status === "paid"
          ? Colors.gray
          : Colors.error;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
      >
        {/* Left Icon */}
        <View style={styles.iconWrapper}>
          <Feather
            name="clock"
            size={22}
            color={Colors.primary}
            style={styles.icon}
          />
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          {/* Top Row */}
          {/* <View style={styles.topRow}> */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.title}>{item.investment_name}</Text>
            <Text
              style={styles.statusBadge}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>

          {/* Middle Row */}
          <View style={styles.middleRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }} >
              <Ionicons name="time-outline" size={13} color={Colors.secondary} />
              <Text style={styles.date}>
                Due:{" "}
                {formatDate(item.due_date)}
                {/* {new Date(item.due_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} */}
              </Text>
            </View>
            <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
          </View>

          {/* Bottom Row */}
          <View style={{ flexDirection: "row", alignItems: "center" }} >
            <Ionicons name="time-outline" size={13} color={Colors.secondary} />
            <Text style={styles.daysRemaining}>
              {item.days_until_due.toFixed()} days remaining
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={upcoming_payouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Image source={require('../../../../../assets/images/noRecentActivity.png')} style={{ width: 150, height: 150, alignSelf: 'center', marginTop: 80 }} />
            <Text style={styles.emptyText}>No upcoming payouts scheduled.</Text>
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
const formatDate = (d?: string | null) => {
  if (!d) return "N/A";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyState: { justifyContent: "center", alignItems: "center", paddingTop: 20, marginTop: 100 },
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
  iconContainer: {
    marginRight: 12,
    backgroundColor: "#E0F2FE",
    borderRadius: 10,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    // marginRight: 10,
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
  infoContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  middleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: Colors.secondary,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2
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
  date: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  amount: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
    color: Colors.secondary
  },
  daysRemaining: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingVertical: 16,
  },
});

export default UpcomingPayouts;
