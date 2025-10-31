import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { dummyNotifications, Notification } from "../components/dummyNotifications";

export const NotificationsScreen =()=> {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: Notification }) => {
    const statusColors = {
      scheduled: "#FFA500",
      sent: "#1E90FF",
      read: "#32CD32",
    };

    const priorityColors = {
      high: "#FF0000",
      medium: "#FFA500",
      low: "#32CD32",
    };

    return (
      <TouchableOpacity
        style={styles.card}
        // onPress={() => navigation.navigate("NotificationDetail", { notification: item })}
      >
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={[styles.priorityDot, { backgroundColor: priorityColors[item.priority] }]} />
        </View>
        <Text numberOfLines={1} style={styles.message}>{item.message}</Text>
        <View style={styles.row}>
          <Text style={styles.sender}>From: {item.senderName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No notifications yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginVertical: 5 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "bold" },
  message: { fontSize: 14, color: "#555", marginVertical: 5 },
  sender: { fontSize: 12, color: "#777" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5 },
  statusText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
});
