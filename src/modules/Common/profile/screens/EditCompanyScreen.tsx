import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { updateCompanyInfo } from "@/shared/store/slices/profile/profileSlice";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

export const EditCompanyScreen = ({ navigation }: any) => {
    const dispatch = useAppDispatch();
    const { companyInfo, isCompanyLoading } = useAppSelector(
        state => state.profile
    );

    const [form, setForm] = useState({
        name: companyInfo?.name || "",
        description: companyInfo?.description || "",
        email: companyInfo?.email || "",
        phone: companyInfo?.phone || "",
        website: companyInfo?.website || "",
        street: companyInfo?.address.street || "",
        city: companyInfo?.address.city || "",
        state: companyInfo?.address.state || "",
        zip: companyInfo?.address.zip || "",
        country: companyInfo?.address.country || "",
    });

    const handleChange = (key: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const onSave = async () => {
        await dispatch(
            updateCompanyInfo({
                name: form.name,
                description: form.description,
                email: form.email,
                phone: form.phone,
                website: form.website,
                status: "active",
                address: {
                    street: form.street,
                    city: form.city,
                    state: form.state,
                    zip: form.zip,
                    country: form.country,
                },
            })
        ).unwrap();

        navigation.goBack();
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Edit Company</Text>
                <Text style={styles.subtitle}>
                    Update your company information
                </Text>
            </View>

            {/* Company Info */}
            <View style={styles.form}>
                <Text style={styles.sectionTitle}>Company Details</Text>

                <Input
                    label="Company Name"
                    placeholder="Enter company name"
                    value={form.name}
                    onChangeText={v => handleChange("name", v)}
                    required
                />

                <Input
                    label="Description"
                    placeholder="Enter company description"
                    value={form.description}
                    onChangeText={v => handleChange("description", v)}
                />

                <Input
                    label="Email"
                    placeholder="Enter company email"
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={v => handleChange("email", v)}
                />

                <Input
                    label="Phone"
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    value={form.phone}
                    onChangeText={v => handleChange("phone", v)}
                />

                <Input
                    label="Website"
                    placeholder="https://example.com"
                    value={form.website}
                    onChangeText={v => handleChange("website", v)}
                />

                {/* Address */}
                <Text style={styles.sectionTitle}>Address</Text>

                <Input
                    label="Street"
                    placeholder="Street address"
                    value={form.street}
                    onChangeText={v => handleChange("street", v)}
                />

                <Input
                    label="City"
                    placeholder="City"
                    value={form.city}
                    onChangeText={v => handleChange("city", v)}
                />

                <Input
                    label="State"
                    placeholder="State"
                    value={form.state}
                    onChangeText={v => handleChange("state", v)}
                />

                <Input
                    label="ZIP Code"
                    placeholder="ZIP code"
                    value={form.zip}
                    onChangeText={v => handleChange("zip", v)}
                />

                <Input
                    label="Country"
                    placeholder="Country"
                    value={form.country}
                    onChangeText={v => handleChange("country", v)}
                />

                <Button
                    title={isCompanyLoading ? "Saving..." : "Save Changes"}
                    onPress={onSave}
                    fullWidth
                    disabled={isCompanyLoading}
                    style={styles.submitButton}
                />
            </View>
        </ScrollView>
    );
};

export default EditCompanyScreen;
const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 20,
        paddingBottom: 80,
        backgroundColor: Colors.background,
    },
    header: {
        alignItems: "center",
        marginTop: 40,
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.gray,
        textAlign: "center",
    },
    form: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.secondary,
        marginBottom: 12,
        marginTop: 8,
        alignSelf: "center",
    },
    submitButton: {
        marginTop: 24,
    },
});
