import { ProfileStackParamList } from "@/navigation/ProfileStacks/ProfileStack";
import Colors from "@/shared/colors/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ProfileNavProp = NativeStackNavigationProp<ProfileStackParamList>;

export const NotificationButtons: React.FC = () => {
    const navigation = useNavigation<ProfileNavProp>();

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.header}>Notifications Center</Text>
            <Text style={styles.subHeader}>
                Manage your notification preferences, alerts, and templates.
            </Text>

            {/* Settings Section */}
            <View style={styles.section}>
                <SettingsButton
                    icon="notifications-outline"
                    label="Notifications Settings"
                    description="Customize reminders, alerts, and sound preferences"
                    onPress={() => navigation.navigate("NotificationSettings")}
                    gradient={["#717478ff", "#05060fff"]}
                />

                <SettingsButton
                    icon="megaphone-outline"
                    label="Notification Templates"
                    description="Create and manage message templates"
                    onPress={() => navigation.navigate("NotificationsTemplates")}
                    gradient={["#677171ff", "#0a1314ff"]}
                />
                <SettingsButton
                    icon="notifications-outline"
                    label="Send Notifications"
                    description="Create and send notifications to users"
                    onPress={() => console.log("Sending Notifications")}
                    gradient={["#6b1c1cff", "#252556ff"]}
                />
            </View>
        </ScrollView>
    );
};

export default NotificationButtons;

const SettingsButton = React.memo(
    ({
        icon,
        label,
        description,
        onPress,
        gradient,
    }: {
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        description?: string;
        onPress: () => void;
        gradient: readonly string[];
    }) => (
        <TouchableOpacity
            style={styles.buttonContainer}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <LinearGradient colors={gradient as readonly [string, string, ...string[]]} style={styles.gradient}>
                <Ionicons name={icon} color={Colors.white} size={26} />
                <View style={styles.textContainer}>
                    <Text style={styles.buttonText}>{label}</Text>
                    {description && (
                        <Text style={styles.buttonDescription}>
                            {description}
                        </Text>
                    )}
                </View>
                <Ionicons
                    name="chevron-forward"
                    color="rgba(255,255,255,0.7)"
                    size={20}
                />
            </LinearGradient>
        </TouchableOpacity>
    )
);

const styles = StyleSheet.create({
    scrollContent: {
        padding: 20,
        backgroundColor: Colors.background,
        flexGrow: 1,
    },
    header: {
        fontSize: 22,
        fontWeight: "700",
        color: Colors.secondary,
        marginBottom: 4,
    },
    subHeader: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.secondary,
        marginBottom: 12,
    },
    buttonContainer: {
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 14,
        ...Platform.select({
            android: {
                elevation: 3,
            },
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
            },
        }),
    },
    gradient: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 14,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 2,
    },
    buttonDescription: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 13,
    },
});
