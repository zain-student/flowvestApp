// import Colors from "@/shared/colors/Colors";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { RouteProp, useRoute } from "@react-navigation/native";
// import React from "react";
// import { ScrollView, StyleSheet, Text, View } from "react-native";
// import { Notification } from "../components/dummyNotifications";

// type NotificationDetailRouteProp = RouteProp<
//   { NotificationDetail: { notification: Notification } },
//   "NotificationDetail"
// >;

// export const NotificationDetailScreen = () => {
//   const route = useRoute<NotificationDetailRouteProp>();
//   const { notification } = route.params;

//   const statusColors = { scheduled: "yellow", sent: Colors.primary, read: Colors.green };
//   const priorityColors = { high: Colors.error, medium: "yellow", low: Colors.green };

//   const renderInfoRow = (label: string, value: string | React.ReactNode, icon?: JSX.Element) => (
//     <View style={styles.infoRow}>
//       <View style={styles.rowLeft}>
//         {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
//         <Text style={styles.label}>{label}</Text>
//       </View>
//       <Text style={[styles.value, { color: typeof value === "string" ? Colors.white : undefined }]}>
//         {value}
//       </Text>
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
//       <View style={styles.card}>
//         <Text style={styles.title}>{notification.title}</Text>
//         <Text style={styles.message}>{notification.message}</Text>

//         {renderInfoRow("From:", notification.senderName)}
//         {renderInfoRow("To:", notification.recipientName)}
//         {renderInfoRow(
//           "Status:",
//           notification.status.toUpperCase(),
//           <Ionicons name="time-outline" size={16} color={statusColors[notification.status]} />
//         )}
//         {renderInfoRow(
//           "Priority:",
//           notification.priority.toUpperCase(),
//           <Ionicons name="alert-circle-outline" size={16} color={priorityColors[notification.priority]} />
//         )}
//         {renderInfoRow(
//           "Scheduled At:",
//           new Date(notification.scheduledAt).toLocaleString(),
//           <Ionicons name="calendar-outline" size={16} color={Colors.gray} />
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background, padding: 12 },
//   card: {
//     backgroundColor: Colors.secondary,
//     borderRadius: 12,
//     padding: 18,
//     shadowColor: "#000",
//     shadowOpacity: 0.03,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   title: { fontSize: 20, fontWeight: "700", color: Colors.white, marginBottom: 8 },
//   message: { fontSize: 16, color: Colors.gray, marginBottom: 18 },

//   infoRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   rowLeft: { flexDirection: "row", alignItems: "center" },
//   label: { fontWeight: "600", color: Colors.gray, fontSize: 14 },
//   value: { fontWeight: "500", fontSize: 16, color: Colors.white },
// });
import Colors from "@/shared/colors/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type NotificationDetailRouteProp = RouteProp<
  { NotificationDetail: { notification: any } },
  "NotificationDetail"
>;

export const NotificationDetailScreen = () => {
  const route = useRoute<NotificationDetailRouteProp>();
  const { notification } = route.params;

  const statusColors = {
    scheduled: "yellow",
    sent: Colors.primary,
    read: Colors.green,
  };
  const priorityColors = {
    high: Colors.error,
    medium: "yellow",
    low: Colors.green,
  };

  const renderInfoRow = (
    label: string,
    value: string | React.ReactNode,
    icon?: JSX.Element
  ) => (
    <View style={styles.infoRow}>
      <View style={styles.rowLeft}>
        {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text
        style={[
          styles.value,
          { color: typeof value === "string" ? Colors.white : undefined },
        ]}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.card}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>

        {renderInfoRow("From:", notification.sender?.name || "System")}
        {renderInfoRow("To:", notification.recipient?.name || "You")}
        {renderInfoRow(
          "Status:",
          notification.status?.toUpperCase() || "SENT",
          <Ionicons
            name="time-outline"
            size={16}
            color={
              statusColors[
                ((notification.status || "").toLowerCase() as keyof typeof statusColors)
              ] || Colors.primary
            }
          />
        )}
        {renderInfoRow(
          "Priority:",
          notification.priority?.toUpperCase() || "NORMAL",
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color={
              priorityColors[
                ((notification.priority || "").toLowerCase() as keyof typeof priorityColors)
              ] || Colors.green
            }
          />
        )}
        {renderInfoRow(
          "Scheduled At:",
          new Date(notification.scheduled_at).toLocaleString(),
          <Ionicons name="calendar-outline" size={16} color={Colors.gray} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 12 },
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  title: { fontSize: 20, fontWeight: "700", color: Colors.white, marginBottom: 8 },
  message: { fontSize: 16, color: Colors.gray, marginBottom: 18 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  label: { fontWeight: "600", color: Colors.gray, fontSize: 14 },
  value: { fontWeight: "500", fontSize: 16, color: Colors.white },
});
