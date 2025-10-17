import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchNotificationSettings } from "@/shared/store/slices/profile/notificationSlice";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

export const NotificationSettingsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { settings, isLoading,error } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotificationSettings());
  }, [dispatch]);

  if (isLoading) {
    return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );
  }

  if (!settings) {
    return (
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
    );
  }

  return (
      <ScrollView contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Notification Preferences</Text>

        {/* Email Notifications */}
        <Section title="Email Notifications">
          <ToggleRow label="Payout Reminders" value={settings.email_notifications.payout_reminders} />
          <ToggleRow label="Investment Updates" value={settings.email_notifications.investment_updates} />
          <ToggleRow label="System Alerts" value={settings.email_notifications.system_alerts} />
        </Section>

        {/* SMS Notifications */}
        <Section title="SMS Notifications">
          <ToggleRow label="Payout Reminders" value={settings.sms_notifications.payout_reminders} />
          <ToggleRow label="Urgent Alerts" value={settings.sms_notifications.urgent_alerts} />
        </Section>

        {/* Push Notifications */}
        <Section title="Push Notifications">
          <ToggleRow label="Payout Reminders" value={settings.push_notifications.payout_reminders} />
          <ToggleRow label="Investment Updates" value={settings.push_notifications.investment_updates} />
        </Section>

        {/* Reminder Settings */}
        <Section title="Reminder Settings">
          <Text style={styles.text}>
            Payout reminder days: {settings.reminder_settings.payout_reminder_days.join(", ")}
          </Text>
          <Text style={styles.text}>
            Overdue alert days: {settings.reminder_settings.overdue_alert_days}
          </Text>
          <Text style={styles.text}>
            Investment milestone alerts:{" "}
            {settings.reminder_settings.investment_milestone_alerts ? "Enabled" : "Disabled"}
          </Text>
        </Section>
      </ScrollView>
  );
};

//  Reusable Components 
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const ToggleRow = ({
  label,
  value,
}: {
  label: string;
  value: boolean;
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Switch value={value} disabled />
  </View>
);

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: Colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 16,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.secondary,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  label: {
    fontSize: 15,
    color: Colors.gray,
  },
  text: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 6,
  },
  errorText: {
    color: Colors.gray,
  },
});

export default NotificationSettingsScreen;
