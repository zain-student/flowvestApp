import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import {
  fetchNotificationSettings,
  updateNotificationSettings,
} from "@/shared/store/slices/profile/notificationSlice";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

export const NotificationSettingsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { settings, isLoading, error } = useAppSelector(
    (state) => state.notificationSettings,
  );

  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const isChanged = JSON.stringify(localSettings) !== JSON.stringify(settings);

  useEffect(() => {
    dispatch(fetchNotificationSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleToggle = (category: string, field: string) => {
    if (!localSettings) return;

    const current = (localSettings as any)[category];
    setLocalSettings({
      ...localSettings,
      [category]: { ...current, [field]: !current[field] },
    });
  };

  const handleSave = async () => {
    if (!localSettings || !isChanged) return;
    setIsSaving(true);

    try {
      await dispatch(updateNotificationSettings(localSettings)).unwrap();
      ToastAndroid.show("Settings updated", ToastAndroid.SHORT);
    } catch (err: any) {
      ToastAndroid.show(err || "Failed to update", ToastAndroid.SHORT);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !localSettings) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!localSettings) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || "No data available"}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Notification Preferences</Text>
      <Text style={styles.subtitle}>
        Choose how and when you want to be notified
      </Text>

      <Section title="Email Notifications">
        <ToggleRow
          label="Payout reminders"
          value={localSettings.email_notifications.payout_reminders}
          onToggle={() =>
            handleToggle("email_notifications", "payout_reminders")
          }
        />
        <ToggleRow
          label="Investment updates"
          value={localSettings.email_notifications.investment_updates}
          onToggle={() =>
            handleToggle("email_notifications", "investment_updates")
          }
        />
        <ToggleRow
          label="System alerts"
          value={localSettings.email_notifications.system_alerts}
          onToggle={() => handleToggle("email_notifications", "system_alerts")}
        />
      </Section>

      <Section title="SMS Notifications">
        <ToggleRow
          label="Payout reminders"
          value={localSettings.sms_notifications.payout_reminders}
          onToggle={() => handleToggle("sms_notifications", "payout_reminders")}
        />
        <ToggleRow
          label="Urgent alerts"
          value={localSettings.sms_notifications.urgent_alerts}
          onToggle={() => handleToggle("sms_notifications", "urgent_alerts")}
        />
      </Section>

      <Section title="Push Notifications">
        <ToggleRow
          label="Payout reminders"
          value={localSettings.push_notifications.payout_reminders}
          onToggle={() =>
            handleToggle("push_notifications", "payout_reminders")
          }
        />
        <ToggleRow
          label="Investment updates"
          value={localSettings.push_notifications.investment_updates}
          onToggle={() =>
            handleToggle("push_notifications", "investment_updates")
          }
        />
      </Section>

      <Section title="Reminder Settings">
        <Label>Payout reminder days</Label>
        <TextInput
          style={styles.input}
          value={localSettings.reminder_settings.payout_reminder_days.join(
            ", ",
          )}
          onChangeText={(text) => {
            const days = text
              .split(",")
              .map((d) => parseInt(d.trim(), 10))
              .filter((n) => !isNaN(n));
            setLocalSettings({
              ...localSettings,
              reminder_settings: {
                ...localSettings.reminder_settings,
                payout_reminder_days: days,
              },
            });
          }}
        />

        <Label style={{ marginTop: 12 }}>Overdue alert days</Label>
        <TextInput
          style={styles.input}
          value={String(localSettings.reminder_settings.overdue_alert_days)}
          onChangeText={(text) => {
            const day = parseInt(text, 10) || 0;
            setLocalSettings({
              ...localSettings,
              reminder_settings: {
                ...localSettings.reminder_settings,
                overdue_alert_days: day,
              },
            });
          }}
        />

        <ToggleRow
          label="Investment milestone alerts"
          value={localSettings.reminder_settings.investment_milestone_alerts}
          onToggle={() =>
            handleToggle("reminder_settings", "investment_milestone_alerts")
          }
        />
      </Section>

      <TouchableOpacity
        style={[
          styles.saveButton,
          (!isChanged || isSaving) && styles.saveDisabled,
        ]}
        onPress={handleSave}
        disabled={!isChanged || isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

/* ---------- Reusable UI ---------- */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const ToggleRow = ({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Switch value={value} onValueChange={onToggle} />
  </View>
);

const Label = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => <Text style={[styles.label, style]}>{children}</Text>;

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 100,
    backgroundColor: Colors.background,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.secondary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 20,
  },

  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  rowLabel: {
    fontSize: 15,
    color: Colors.gray,
  },

  label: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: Colors.background,
    color: Colors.secondary,
  },

  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  errorText: {
    color: Colors.gray,
  },
});
