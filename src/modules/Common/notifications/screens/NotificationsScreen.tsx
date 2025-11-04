import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchNotifications } from "@/shared/store/slices/profile/notificationSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const NotificationsScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const {
    notifications,
    isLoading,
    isPaginating,
    pagination,
    error,
  } = useAppSelector((state) => state.notificationSettings);
  const { user } = useAppSelector((state) => state.auth); // assuming user info is in auth slice

  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Fetch notifications for current user
  const loadNotifications = useCallback(
    (page: number = 1) => {
      if (!user?.id) return;
      dispatch(fetchNotifications({ recipientId: user.id, page }));
    },
    [dispatch, user?.id]
  );

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadNotifications(1);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLoadMore = () => {
    if (
      !isPaginating &&
      pagination?.has_more_pages &&
      pagination?.current_page
    ) {
      loadNotifications(pagination.current_page + 1);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        (navigation as any).navigate("NotificationDetail", {
          notification: item,
        })
      }
    >
      <View style={styles.row}>
        <Ionicons
          name={
            item.type === "payout_reminder"
              ? "cash-outline"
              : item.type === "overdue_alert"
                ? "alert-circle-outline"
                : item.type === "system_alert"
                  ? "warning-outline"
                  : "notifications-outline"
          }
          size={22}
          color={Colors.primary}
        />

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
          <Text style={{ color: Colors.white, alignSelf: "flex-end" }}>From:
            <Text style={styles.sender}>{item.sender.name}</Text></Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () =>
    isPaginating ? (
      <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 10 }} />
    ) : null;

  if (isLoading && notifications.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
      </View>
    );
  }

  if (notifications.length === 0 && !isLoading) {
    return (
      <View style={styles.center}>
        <Ionicons name="notifications-off-outline" size={40} color={Colors.gray} />
        <Text style={styles.emptyText}>No notifications yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.4}
      ListFooterComponent={renderFooter}
      contentContainerStyle={{ padding: 12 }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.secondary,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  message: {
    fontSize: 14,
    color: Colors.white,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  sender: {
    fontSize: 12,
    color: Colors.gray,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: Colors.danger,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 6,
  },
});
