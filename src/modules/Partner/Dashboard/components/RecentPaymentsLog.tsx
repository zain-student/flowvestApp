import { useAppSelector } from "@/shared/store";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Colors from "../../../../shared/colors/Colors";

export const RecentPaymentsLog = () => {
  const { recent_activities } = useAppSelector((state) => state.partnerDashboard);
  const { formatCurrency } = useCurrencyFormatter();

  const renderActivityItem = ({ item }: any) => (
    <View style={styles.activityCard}>
      {/* Left: Icon */}
      <View style={styles.iconWrapper}>
        <Feather
          name={
            item.type === "payout"
              ? "arrow-down-right"
              : item.type === "investment"
                ? "arrow-up-right"
                : "activity"
          }
          size={22}
          color={Colors.primary}
        />
      </View>

      {/* Middle: Title & Dates */}
      <View style={styles.infoWrapper}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }} >
          <Ionicons name="calendar-outline" size={13} color={Colors.secondary} />
          <Text style={styles.activitySubText}>Created: {formatDate(item.created_at)}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }} >
          <Ionicons name="time-outline" size={13} color={Colors.secondary} />
          <Text style={styles.activitySubText}>Time: {item.time}</Text>
        </View>
      </View>

      {/* Right: Amount & Status */}
      <View style={styles.rightWrapper}>
        <Text style={styles.activityAmount}>{(item.amount ?? 0)}</Text>
        <Text
          style={[
            styles.activityStatus,
            item.status === "completed"
              ? styles.statusCompleted
              : item.status === "processing"
                ? styles.statusProcessing
                : styles.statusCancelled,
          ]}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </View>
  );
  const formatDate = (d?: string | null) => {
    if (!d) return "N/A";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Activities</Text>
      {recent_activities.length === 0 ? (
        <Text style={styles.emptyText}>No recent activities.</Text>
      ) : (
        <FlatList
          data={recent_activities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderActivityItem}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 80,
  },
  list: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    fontWeight: "500",
    color: "colors.secondary",
  },
  activityCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    marginVertical: 2,
    marginHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6EDFF",
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
  infoWrapper: {
    flex: 1,
  },
  rightWrapper: {
     alignItems: "flex-end" 
  },
  activityTitle: {
    color: Colors.secondary,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  activitySubText: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  activityAmount: {
    color: Colors.green,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  activityStatus: {
   fontSize: 13, fontFamily: "Inter_600SemiBold"
  },
  statusCompleted: { color: Colors.green },
  statusProcessing: { color: Colors.yellow },
  statusCancelled: { color: Colors.gray },
  emptyText: {
    color: Colors.gray,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingVertical: 16,
  },
});

export default RecentPaymentsLog;
