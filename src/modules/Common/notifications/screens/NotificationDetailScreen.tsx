import Colors from "@/shared/colors/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";

type NotificationDetailRouteProp = RouteProp<
  { NotificationDetail: { notification: any } },
  "NotificationDetail"
>;

const STATUS_COLORS = {
  scheduled: Colors.warning,
  sent: Colors.primary,
  read: Colors.green,
} as const;

const PRIORITY_COLORS = {
  high: Colors.error,
  medium: Colors.warning,
  low: Colors.green,
} as const;

export const NotificationDetailScreen = () => {
  const { notification } = useRoute<NotificationDetailRouteProp>().params;
  const isDark = useColorScheme() === "dark";

  const Row = ({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: React.ReactNode }) => (
    <View style={styles.infoRow}>
      <View style={styles.left}>
        <Ionicons name={icon} size={18} color={Colors.primary} style={styles.icon} />
        <Text style={[styles.label, isDark && styles.subTextDark]}>{label}</Text>
      </View>
      {typeof value === "string" ? (
        <Text style={[styles.value, isDark && styles.textDark]}>{value}</Text>
      ) : (
        value
      )}
    </View>
  );

  const Pill = ({ text, color }: { text: string; color: string }) => (
    <View style={[styles.pill, { backgroundColor: color + "20" }]}>
      <Text style={[styles.pillText, { color }]}>{text}</Text>
    </View>
  );

  const getStatusColor = (status?: string) => STATUS_COLORS[(status || "sent").toLowerCase() as keyof typeof STATUS_COLORS] || Colors.primary;
  const getPriorityColor = (priority?: string) => PRIORITY_COLORS[(priority || "normal").toLowerCase() as keyof typeof PRIORITY_COLORS] || Colors.green;

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.headerCard, isDark && styles.cardDark]}>
        <Ionicons name="notifications-outline" size={26} color={Colors.primary} style={styles.icon} />
        <Text style={[styles.title, isDark && styles.textDark]}>{notification.title}</Text>
        <Text style={[styles.message, isDark && styles.subTextDark]}>{notification.message}</Text>
      </View>

      {/* Details */}
      <View style={[styles.card, isDark && styles.cardDark]}>
        <Row icon="person-outline" label="From" value={notification.sender?.name || "System"} />
        <Row icon="person-circle-outline" label="To" value={notification.recipient?.name || "You"} />
        <Row
          icon="checkmark-done-outline"
          label="Status"
          value={<Pill text={(notification.status || "sent").toUpperCase()} color={getStatusColor(notification.status)} />}
        />
        <Row
          icon="alert-circle-outline"
          label="Priority"
          value={<Pill text={(notification.priority || "normal").toUpperCase()} color={getPriorityColor(notification.priority)} />}
        />
      </View>

      {/* Footer */}
      <Text style={styles.time}>{new Date(notification.created_at).toLocaleString()}</Text>
    </ScrollView>
  );
};

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  containerDark: { backgroundColor: "#020617" },

  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    alignItems: "center",
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDark: { backgroundColor: "#1E293B" },

  title: { fontSize: 20, fontWeight: "700", color: Colors.secondary, marginBottom: 8 },
  message: { fontSize: 15, color: Colors.gray, lineHeight: 22, textAlign: "center" },

  infoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  left: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 10 },
  label: { fontSize: 14, fontWeight: "600", color: Colors.gray },
  value: { fontSize: 14, fontWeight: "500", color: Colors.secondary },

  pill: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  pillText: { fontSize: 12, fontWeight: "700" },

  time: { fontSize: 12, color: Colors.gray, textAlign: "center", marginTop: 16 },

  textDark: { color: "#F8FAFC" },
  subTextDark: { color: "#94A3B8" },
});
