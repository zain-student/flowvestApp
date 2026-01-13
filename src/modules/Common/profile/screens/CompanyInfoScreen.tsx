import { ProfileStackParamList } from "@/navigation/ProfileStacks/ProfileStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { getCompanyInfo } from "@/shared/store/slices/profile/profileSlice";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
type ProfileNavProp = NativeStackNavigationProp<ProfileStackParamList>;
const InfoRow = ({ label, value }: { label: string; value: string }) => {
    const isWebsite = label === "Website";
    const hasValue = value && value !== "--" && value.trim() !== "";

    const handleWebsitePress = async () => {
        if (!hasValue || !isWebsite) return;

        // Add https:// if missing (common for user-entered links)
        let url = value.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = `https://${url}`;
        }
        try {
            // Optional: you can add Linking.canOpenURL check first
            await Linking.openURL(url);
        } catch (error) {
            console.warn("Cannot open URL:", error);
            // You could show an alert here if you want
        }
    };

    return (
        <View style={styles.infoRow}>
            <Text style={styles.label}>{label}</Text>

            {isWebsite && hasValue ? (
                <TouchableOpacity
                    onPress={handleWebsitePress}
                    activeOpacity={0.7}
                    style={{ flex: 1, alignItems: "flex-end" }}
                >
                    <Text
                        style={[
                            styles.value,
                            {
                                color: Colors.primary,          // make it look like a link
                                textDecorationLine: "underline", // classic link style
                            },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {value}
                    </Text>
                </TouchableOpacity>
            ) : (
                <Text
                    style={styles.value}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {value || "—"}
                </Text>
            )}
        </View>
    );
};
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.card}>{children}</View>
    </View>
);


export const CompanyInfoScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<ProfileNavProp>();
    const { companyInfo, isCompanyLoading } = useAppSelector((state) => state.profile);

    useEffect(() => {
        dispatch(getCompanyInfo());
    }, [dispatch]);

    if (isCompanyLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!companyInfo) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No company information available</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.companyName}>{companyInfo.name}</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{companyInfo.status.toUpperCase()}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate("EditCompany")}
                    activeOpacity={0.7}
                >
                    <Ionicons name="pencil" size={18} color={Colors.primary} />
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>

            {/* Company Details */}
            <Section title="Company Details">
                <InfoRow label="Email" value={companyInfo.email} />
                <InfoRow label="Phone" value={companyInfo.phone} />
                <InfoRow label="Website" value={companyInfo.website} />
            </Section>

            {/* Address */}
            <Section title="Address">
                <InfoRow label="Street" value={companyInfo.address?.street} />
                <InfoRow label="City" value={companyInfo.address?.city} />
                <InfoRow label="State" value={companyInfo.address?.state} />
                <InfoRow label="ZIP Code" value={companyInfo.address?.zip} />
                <InfoRow label="Country" value={companyInfo.address?.country} />
            </Section>

            {/* Optional bottom spacing */}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background || "#f8f9fa",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: Colors.gray,
        fontSize: 16,
    },

    /* Header */
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 32,
    },
    headerLeft: {
        flex: 1,
        paddingRight: 16,
    },
    companyName: {
        fontSize: 26,
        fontWeight: "700",
        color: Colors.secondary || "#1a1a1a",
        letterSpacing: -0.2,
    },
    statusBadge: {
        alignSelf: "flex-start",
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: Colors.primary + "15", // 9% opacity
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.primary,
        letterSpacing: 0.4,
    },

    editButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: Colors.primary + "10",
        borderWidth: 1,
        borderColor: Colors.primary + "30",
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.primary,
    },

    /* Sections */
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: Colors.gray || "#6b7280",
        marginBottom: 12,
        letterSpacing: 0.1,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: "#f1f1f1",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },

    /* Info Rows */
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    label: {
        fontSize: 14,
        color: Colors.gray || "#6b7280",
        fontWeight: "500",
    },
    value: {
        fontSize: 15,
        fontWeight: "500",
        color: Colors.secondary || "#111827",
        textAlign: "right",
        flex: 1,
        marginLeft: 16,
    },
});

export default CompanyInfoScreen;