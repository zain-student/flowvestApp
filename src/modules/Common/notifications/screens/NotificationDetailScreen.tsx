import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Notification } from "../components/dummyNotifications";

type NotificationDetailRouteProp = RouteProp<{ NotificationDetail: { notification: Notification } }, "NotificationDetail">;

export const NotificationDetailScreen=()=> {
  const route = useRoute<NotificationDetailRouteProp>();
  const { notification } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.message}>{notification.message}</Text>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>{notification.senderName}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>{notification.recipientName}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{notification.status.toUpperCase()}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Priority:</Text>
        <Text style={styles.value}>{notification.priority.toUpperCase()}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.label}>Scheduled At:</Text>
        <Text style={styles.value}>{new Date(notification.scheduledAt).toLocaleString()}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  message: { fontSize: 16, color: "#333", marginBottom: 20 },
  infoBlock: { flexDirection: "row", marginBottom: 10 },
  label: { fontWeight: "bold", marginRight: 10 },
  value: { color: "#555" },
});
