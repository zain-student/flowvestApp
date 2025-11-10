import { useAppSelector } from "@/shared/store";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "../../../../shared/colors/Colors";
export const RecentPaymentsLog = () => {
  const { recent_activities } = useAppSelector((state) => state.partnerDashboard)
  const renderActivityItem = ({ item }: any) => (
    <View style={styles.activityItem}>
      {/* Row 1: Icon + Title + Status */}
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Feather
            name={
              item.type === "payout"
                ? "arrow-down-right"
                : item.type === "investment"
                  ? "arrow-up-right"
                  : "activity"
            }
            size={20}
            color={Colors.white}
            style={styles.activityIcon}
          />
          <Text style={styles.activityText}>{item.title}</Text>
        </View>
        <Text
          style={[
            styles.activityStatus,
            {
              color:
                item.status === "completed"
                  ? Colors.green
                  : item.status === "processing"
                    ? Colors.yellow
                    : Colors.gray,
            },
          ]}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>

      {/* Row 2: Date + Amount */}
      <View style={styles.rowBetween}>
        <Text style={styles.activityDate}>{item.time}</Text>
        <Text style={styles.activityAmount}>{item.amount}</Text>
      </View>
      <Text style={styles.activityDate}>Created: {item.created_at}</Text>
    </View>
  );

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
    // paddingHorizontal: 12,
    marginTop: 4,
    marginBottom: 80,
  },
  list: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: 8,
  },
  activityItem: {
    backgroundColor: Colors.secondary,
    marginVertical: 6,
    paddingVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityIcon: {
    marginRight: 12,
  },
  activityText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  activityDate: {
    color: Colors.gray,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  activityAmount: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  activityStatus: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingVertical: 16,
  },
});

export default RecentPaymentsLog;
