import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchNotifications } from "@/shared/store/slices/profile/notificationSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, { FadeInUp } from "react-native-reanimated";

export const NotificationsScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const theme = useColorScheme();
  const isDark = theme === "dark";

  const {
    notifications,
    isLoading,
    isPaginating,
    pagination,
    error,
  } = useAppSelector((state) => state.notificationSettings);

  const { user } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

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
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleLoadMore = () => {
    if (!isPaginating && pagination?.has_more_pages) {
      loadNotifications(pagination.current_page + 1);
    }
  };

  /* ---------------- DATE GROUPING ---------------- */
  const groupedData = useMemo(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    return notifications.reduce((acc: any[], item: any) => {
      const date = new Date(item.created_at).toDateString();
      let title = "Older";

      if (date === today) title = "Today";
      else if (date === yesterday) title = "Yesterday";

      let section = acc.find((s) => s.title === title);
      if (!section) {
        section = { title, data: [] };
        acc.push(section);
      }
      section.data.push(item);
      return acc;
    }, []);
  }, [notifications]);

  /* ---------------- SWIPE ACTION ---------------- */
  const renderRightAction = () => (
    <View style={styles.swipeAction}>
      <Ionicons name="checkmark-done" size={22} color="#fff" />
      <Text style={styles.swipeText}>Read</Text>
    </View>
  );

  /* ---------------- ITEM ---------------- */
  const renderItem = ({ item }: any) => {
    const isUnread = !item.read_at;

    return (
      <Swipeable renderRightActions={renderRightAction}>
        <Animated.View entering={FadeInUp.duration(300)}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.card,
              isDark && styles.cardDark,
              isUnread && styles.unread,
            ]}
            onPress={() =>
              (navigation as any).navigate("NotificationDetail", {
                notification: item,
              })
            }
          >
            <View style={styles.icon}>
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
            </View>

            <View style={styles.content}>
              <Text
                style={[
                  styles.title,
                  isDark && styles.textDark,
                  isUnread && styles.unreadTitle,
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>

              <Text
                style={[styles.message, isDark && styles.subTextDark]}
                numberOfLines={2}
              >
                {item.message}
              </Text>

              <View style={styles.meta}>
                <Text style={styles.metaText}>
                  From {item.sender.name}
                </Text>
                <Text style={styles.metaText}>
                  {new Date(item.created_at).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Swipeable>
    );
  };

  /* ---------------- SKELETON ---------------- */
  if (isLoading && notifications.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        {[...Array(5)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.skeleton,
              isDark && styles.skeletonDark,
            ]}
          />
        ))}
      </View>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.danger }}>{error}</Text>
      </View>
    );
  }

  if (!isLoading && notifications.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="notifications-off-outline"
          size={48}
          color={Colors.gray}
        />
        <Text style={styles.emptyText}>No notifications yet</Text>
      </View>
    );
  }

  /* ---------------- LIST ---------------- */
  return (
    <FlatList
      data={groupedData}
      keyExtractor={(item) => item.title}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.4}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
      renderItem={({ item }) => (
        <View>
          <Text style={styles.section}>{item.title}</Text>
          {item.data.map((n: any) => (
            <View key={n.id}>{renderItem({ item: n })}</View>
          ))}
        </View>
      )}
      ListFooterComponent={
        isPaginating ? (
          <ActivityIndicator style={{ marginVertical: 16 }} />
        ) : null
      }
    />
  );
};
/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  section: { fontSize: 14, fontWeight: "700", marginHorizontal: 16, marginVertical: 10, color: Colors.gray, },
  card: { flexDirection: "row", backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 14, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, },
  cardDark: { backgroundColor: "#1E293B", },
  unread: { borderLeftWidth: 3, borderLeftColor: Colors.primary },
  icon: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#ECFDF5", alignItems: "center", justifyContent: "center", },
  content: { flex: 1, marginLeft: 12, },
  title: { fontSize: 15, fontWeight: "600", color: Colors.secondary, },
  unreadTitle: { fontWeight: "700", },
  message: { fontSize: 14, color: Colors.gray, marginTop: 4, lineHeight: 20, },
  meta: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, },
  metaText: { fontSize: 12, color: Colors.gray, },
  swipeAction: { backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center", width: 80, borderRadius: 16, marginVertical: 4, },
  swipeText: { color: "#fff", fontSize: 12, marginTop: 2, },
  skeleton: { height: 80, backgroundColor: "#E5E7EB", borderRadius: 16, marginBottom: 12, },
  skeletonDark: { backgroundColor: "#334155", },
  textDark: { color: "#F8FAFC", },
  subTextDark: { color: "#94A3B8", },
  center: { flex: 1, alignItems: "center", justifyContent: "center", },
  emptyText: { marginTop: 8, color: Colors.gray, },
});
