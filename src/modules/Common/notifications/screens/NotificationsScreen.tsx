import Colors from "@/shared/colors/Colors";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { dummyNotifications, Notification } from "../components/dummyNotifications";

export const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setNotifications(prev => [...prev].reverse());
      setRefreshing(false);
    }, 1000);
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const statusColors = { scheduled: Colors.green, sent: Colors.primary, read: Colors.green };
    const priorityColors = { high: Colors.error, medium: Colors.green, low: Colors.green };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => (navigation as any).navigate("NotificationDetail", { notification: item })}
        >
        <View style={styles.header}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={[styles.priorityDot, { backgroundColor: priorityColors[item.priority] }]} />
        </View>

        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>

        <View style={styles.footer}>
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
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No notifications yet</Text>}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  title: { fontSize: 16, fontWeight: "600", color: Colors.white, flex: 1, marginRight: 8 },
  message: { fontSize: 14, color: Colors.gray, marginBottom: 10 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sender: { fontSize: 12, color: Colors.gray },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: Colors.white, fontSize: 10, fontWeight: "600" },
  priorityDot: { width: 12, height: 12, borderRadius: 6 },
  emptyText: { textAlign: "center", marginTop: 20, color: Colors.gray, fontSize: 14 },
});
