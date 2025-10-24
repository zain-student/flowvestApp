import { ProfileStackParamList } from "@/navigation/ProfileStacks/ProfileStack";
import Colors from "@/shared/colors/Colors";
import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type TemplateDetailRouteProp = RouteProp<
  ProfileStackParamList,
  "TemplateDetail"
>;

export const TemplateDetailScreen = () => {
  const route = useRoute<TemplateDetailRouteProp>();
  const { template } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{template.name}</Text>
        <Text style={styles.subtitle}>{template.description}</Text>
      </View>

      {/* Subject */}
      <View style={styles.section}>
        <Text style={styles.label}>Subject</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>{template.subject}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.section}>
        <Text style={styles.label}>Body</Text>
        <View style={[styles.card, styles.bodyCard]}>
          <Text style={styles.cardText}>{template.body}</Text>
        </View>
      </View>

      {/* Variables */}
      <View style={styles.section}>
        <Text style={styles.label}>Available Variables</Text>
        <View style={styles.card}>
          {template.variables.map((v: string) => (
            <Text key={v} style={styles.variable}>
            {v}
            </Text>
          ))}
        </View>
      </View>

      {/* Channels */}
      <View style={styles.section}>
        <Text style={styles.label}>Channels</Text>
        <View style={styles.channelRow}>
          {template.channels.map((ch: string) => (
            <View key={ch} style={styles.badge}>
              <Text style={styles.badgeText}>{ch}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background || "#F9FAFB",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
  },
  section: {
    marginBottom: 22,
  },
  label: {
    fontWeight: "600",
    color: "#374151",
    fontSize: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bodyCard: {
    minHeight: 80,
  },
  cardText: {
    color: "#1F2937",
    fontSize: 15,
    lineHeight: 22,
  },
  variable: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 4,
  },
  channelRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    backgroundColor: "#E0F2FE",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#0369A1",
    fontWeight: "600",
    fontSize: 14,
    textTransform: "capitalize",
  },
});

export default TemplateDetailScreen;
