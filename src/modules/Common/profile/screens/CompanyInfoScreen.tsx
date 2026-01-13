import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { getCompanyInfo } from "@/shared/store/slices/profile/profileSlice";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || "--"}</Text>
    </View>
);

const Section = ({ title, children }: any) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.card}>{children}</View>
    </View>
);

export const CompanyInfoScreen = () => {
    const dispatch = useAppDispatch();
    const { companyInfo, isCompanyLoading } = useAppSelector(
        state => state.profile
    );

    useEffect(() => {
        dispatch(getCompanyInfo());
    }, []);

    if (isCompanyLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!companyInfo) return null;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.companyName}>{companyInfo.name}</Text>
                    <Text style={styles.subText}>{companyInfo.status.toUpperCase()}</Text>
                </View>

                {/* Edit button (Admin only – logic later) */}
                <TouchableOpacity style={styles.editBtn}>
                    <Ionicons name="create-outline" size={18} color={Colors.primary} />
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>

            {/* Basic Info */}
            <Section title="Company Details">
                <InfoRow label="Email" value={companyInfo.email} />
                <InfoRow label="Phone" value={companyInfo.phone} />
                <InfoRow label="Website" value={companyInfo.website} />
            </Section>

            {/* Address */}
            <Section title="Address">
                <InfoRow label="Street" value={companyInfo.address.street} />
                <InfoRow label="City" value={companyInfo.address.city} />
                <InfoRow label="State" value={companyInfo.address.state} />
                <InfoRow label="ZIP Code" value={companyInfo.address.zip} />
                <InfoRow label="Country" value={companyInfo.address.country} />
            </Section>
        </ScrollView>
    );
};

export default CompanyInfoScreen;
const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    /* Header */
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    companyName: {
        fontSize: 20,
        fontWeight: "700",
        color: Colors.secondary,
    },
    subText: {
        fontSize: 12,
        color: Colors.gray,
        marginTop: 4,
    },
    editBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: Colors.primary + "15",
    },
    editText: {
        fontSize: 13,
        color: Colors.primary,
        fontWeight: "600",
    },

    /* Sections */
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: Colors.gray,
        marginBottom: 8,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 14,
        elevation: 2,
    },

    /* Rows */
    infoRow: {
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        color: Colors.gray,
    },
    value: {
        fontSize: 15,
        fontWeight: "500",
        color: Colors.secondary,
        marginTop: 4,
    },
});
