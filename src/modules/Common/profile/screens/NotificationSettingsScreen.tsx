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
    View
} from "react-native";

export const NotificationSettingsScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { settings, isLoading, error } = useAppSelector(
        (state) => state.notifications
    );
    const [localSettings, setLocalSettings] = useState(settings);
    const isChanged = JSON.stringify(localSettings) !== JSON.stringify(settings);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch once on mount
    useEffect(() => {
        dispatch(fetchNotificationSettings());
    }, [dispatch]);

    // Sync store → local editable copy
    useEffect(() => {
        if (settings) {
            setLocalSettings(settings);
        }
    }, [settings]);

    const handleToggle = (category: string, field: string) => {
        if (!localSettings) return;
        // Cast to any for dynamic key access (keeps runtime behavior while satisfying TS)
        const currentCategory = (localSettings as any)[category] as Record<string, any>;
        const updatedCategory = { ...currentCategory, [field]: !currentCategory[field] };
        setLocalSettings({
            ...localSettings,
            [category]: updatedCategory,
        } as typeof localSettings);
    };

    const handleSave = async () => {
        if (!localSettings || !isChanged) return;
        setIsSaving(true);
        try {
            await dispatch(updateNotificationSettings(localSettings)).unwrap();
            ToastAndroid.show("Settings updated successfully", ToastAndroid.SHORT);
        } catch (err: any) {
            ToastAndroid.show(err || "Failed to update", ToastAndroid.SHORT);
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading && !localSettings) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!localSettings) {
        return (
            <View style={styles.loaderContainer}>
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

            {/* Email Notifications */}
            <Section title="Email Notifications">
                <ToggleRow
                    label="Payout Reminders"
                    value={localSettings.email_notifications.payout_reminders}
                    onToggle={() => handleToggle("email_notifications", "payout_reminders")}
                />
                <ToggleRow
                    label="Investment Updates"
                    value={localSettings.email_notifications.investment_updates}
                    onToggle={() => handleToggle("email_notifications", "investment_updates")}
                />
                <ToggleRow
                    label="System Alerts"
                    value={localSettings.email_notifications.system_alerts}
                    onToggle={() => handleToggle("email_notifications", "system_alerts")}
                />
            </Section>

            {/* SMS Notifications */}
            <Section title="SMS Notifications">
                <ToggleRow
                    label="Payout Reminders"
                    value={localSettings.sms_notifications.payout_reminders}
                    onToggle={() => handleToggle("sms_notifications", "payout_reminders")}
                />
                <ToggleRow
                    label="Urgent Alerts"
                    value={localSettings.sms_notifications.urgent_alerts}
                    onToggle={() => handleToggle("sms_notifications", "urgent_alerts")}
                />
            </Section>

            {/* Push Notifications */}
            <Section title="Push Notifications">
                <ToggleRow
                    label="Payout Reminders"
                    value={localSettings.push_notifications.payout_reminders}
                    onToggle={() => handleToggle("push_notifications", "payout_reminders")}
                />
                <ToggleRow
                    label="Investment Updates"
                    value={localSettings.push_notifications.investment_updates}
                    onToggle={() => handleToggle("push_notifications", "investment_updates")}
                />
            </Section>

            {/* Reminder Settings */}
            <Section title="Reminder Settings">
                <Text style={styles.label}>Payout reminder days (comma-separated)</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={localSettings.reminder_settings.payout_reminder_days.join(", ")}
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

                <Text style={[styles.label, { marginTop: 10 }]}>Overdue alert days</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
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
                    (!isChanged || isSaving) && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={!isChanged || isSaving}
            >
                {isSaving ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
            </TouchableOpacity>

        </ScrollView>
    );
};

// ---- Reusable Components ----
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
        <Text style={styles.label}>{label}</Text>
        <Switch value={value} onValueChange={onToggle} />
    </View>
);

// ---- Styles ----
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
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: Colors.secondary,
        fontSize: 14,
        backgroundColor: Colors.background,
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
    saveButton: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    saveButtonDisabled: {
        backgroundColor: Colors.gray, // or a lighter variant of Colors.primary
        opacity: 0.6,
    },

});
