// src/modules/Admin/screens/NotificationTemplatesScreen.tsx

import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchNotificationTemplates } from "@/shared/store/slices/profile/notifications/notificationTemplateSlice";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const NotificationTemplatesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { templates, isLoading, error } = useAppSelector(
    (state) => state.notifications
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchNotificationTemplates());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchNotificationTemplates());
  }, [dispatch]);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }:{item:any}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("TemplateDetail", { template: item })
      }
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.channelRow}>
        {item.channels.map((ch:any) => (
          <View key={ch} style={styles.badge}>
            <Text style={styles.badgeText}>{ch}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search templates..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <Feather name="search" size={20} color={Colors.primary} style={styles.searchIcon} />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.green} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={filteredTemplates}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={Colors.green}
            />
          }
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchInput: { flex: 1, paddingVertical: 8, fontSize: 16 },
  searchIcon: {
    // backgroundColor: Colors.secondary,
    padding: 8,
    borderRadius: 8,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  name: { fontSize: 16, fontWeight: "600", color: "#222" },
  description: { color: "#666", marginVertical: 4 },
  channelRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginTop: 4,
  },
  badgeText: { color: "#fff", fontSize: 12 },
  error: { color: "red", textAlign: "center", marginTop: 20 },
});
