import { ProfileStackParamList } from "@/navigation/ProfileStacks/ProfileStack";
import Colors from "@/shared/colors/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
type ProfileNavProp = NativeStackNavigationProp<ProfileStackParamList>;

export const NotificationButtons: React.FC = () => {
    const navigation = useNavigation<ProfileNavProp>();

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/*  Settings */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <SettingsButton
                    icon="notifications-outline"
                    label="Notifications Settings"
                    onPress={() => { navigation.navigate("NotificationSettings"); }}
                />
                <SettingsButton
                    // icon="document-text-outline"
                    icon="megaphone-outline"
                    label="Notifications Templates"
                    onPress={() => navigation.navigate("NotificationsTemplates")}
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
        onPress,
    }: {
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        onPress: () => void;
    }) => (
        <TouchableOpacity style={styles.buttonItem} onPress={onPress}>
            <Ionicons name={icon} color={Colors.white} size={20} />
            <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
    )
);


// Styles
const styles = StyleSheet.create({
    scrollContent: {
        padding: 20,
        backgroundColor: Colors.background,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.secondary,
        marginBottom: 10,
    },
    buttonItem: {
        flexDirection: "row",
        backgroundColor: Colors.secondary,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        fontSize: 15,
        color: Colors.white,
        fontWeight: "500",
        marginLeft: 8,
    },
});
