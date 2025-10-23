import { ProfileStackParamList } from "@/navigation/ProfileStacks/ProfileStack";
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{template.name}</Text>
      <Text style={styles.description}>{template.description}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Subject</Text>
        <Text style={styles.value}>{template.subject}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Body</Text>
        <Text style={styles.value}>{template.body}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Available Variables</Text>
        {template.variables.map((v:any) => (
          <Text key={v} style={styles.variable}>
            • {v}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Channels</Text>
        <View style={styles.channelRow}>
          {template.channels.map((ch:any) => (
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
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  description: { color: "#666", marginBottom: 16 },
  section: { marginBottom: 20 },
  label: { fontWeight: "600", marginBottom: 6, color: "#333" },
  value: { color: "#444", fontSize: 16 },
  variable: { fontSize: 15, color: "#555", marginLeft: 10 },
  channelRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  badge: {
    backgroundColor: "#e5f2ff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: "#007AFF", fontSize: 13 },
});

export default TemplateDetailScreen;
