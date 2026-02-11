import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { updateCompanyInfo } from "@/shared/store/slices/profile/profileSlice";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

export const EditCompanyScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { companyInfo, isCompanyLoading } = useAppSelector(
    (state) => state.profile,
  );

  const [form, setForm] = useState({
    name: companyInfo?.name || "",
    description: companyInfo?.description || "",
    email: companyInfo?.email || "",
    phone: companyInfo?.phone || "",
    website: companyInfo?.website || "",
    street: companyInfo?.address?.street || "",
    city: companyInfo?.address?.city || "",
    state: companyInfo?.address?.state || "",
    zip: companyInfo?.address?.zip || "",
    country: companyInfo?.address?.country || "",
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
      }),
    ).unwrap();

    navigation.goBack();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Edit Company Profile</Text>
          <Text style={styles.subtitle}>
            Keep your business information up to date
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Company Information</Text>

          <Input
            label="Company Name"
            placeholder="Your company name"
            value={form.name}
            onChangeText={(v) => handleChange("name", v)}
            required
          />

          <Input
            label="Description"
            placeholder="Short description about your company"
            value={form.description}
            onChangeText={(v) => handleChange("description", v)}
            multiline
            numberOfLines={3}
          />

          <Input
            label="Email"
            placeholder="company@example.com"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(v) => handleChange("email", v)}
            autoCapitalize="none"
          />

          <Input
            label="Phone Number"
            placeholder="+92 300 1234567"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => handleChange("phone", v)}
          />

          <Input
            label="Website"
            placeholder="https://www.example.com"
            value={form.website}
            onChangeText={(v) => handleChange("website", v)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.sectionTitle}>Business Address</Text>

          <Input
            label="Street Address"
            placeholder="123 Business Road"
            value={form.street}
            onChangeText={(v) => handleChange("street", v)}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Input
                label="City"
                placeholder="Islamabad"
                value={form.city}
                onChangeText={(v) => handleChange("city", v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="State / Province"
                placeholder="Punjab"
                value={form.state}
                onChangeText={(v) => handleChange("state", v)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Input
                label="ZIP / Postal Code"
                placeholder="44000"
                value={form.zip}
                onChangeText={(v) => handleChange("zip", v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Country"
                placeholder="Pakistan"
                value={form.country}
                onChangeText={(v) => handleChange("country", v)}
              />
            </View>
          </View>

          <Button
            title={isCompanyLoading ? "Saving..." : "Save Changes"}
            onPress={onSave}
            disabled={isCompanyLoading}
            loading={isCompanyLoading}
            fullWidth
            style={styles.submitButton}
          />
        </View>

        {/* Bottom safe area padding */}
        {/* <View style={{ height: 40 }} /> */}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 80,
    backgroundColor: Colors.background || "#f9fafb",
  },

  header: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 6,
  },

  formContainer: {
    // backgroundColor: "#ffffff",
    // borderRadius: 16,
    // padding: 20,
    // borderWidth: 1,
    // borderColor: "#f1f1f1",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 6,
    // elevation: 2,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 16,
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    marginBottom: 4,
  },

  submitButton: {
    borderRadius: 12,
  },
});

export default EditCompanyScreen;
