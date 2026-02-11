import {
    ChangePasswordFormData,
    changePasswordSchema,
    validateFormData,
} from "@/modules/auth/utils/authValidation"; // adjust path if needed
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { changePassword } from "@/shared/store/slices/profile/profileSlice"; // or wherever you put it
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    ToastAndroid,
    View,
} from "react-native";

export const ChangePasswordScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.profile);
  const navigation = useNavigation();
  useEffect(() => {
    console.log("Profile error state changed:");
  }, [error]);
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof ChangePasswordFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const handleSubmit = async () => {
    const result = validateFormData(changePasswordSchema, formData);

    if (!result.success) {
      setErrors(result.errors || {});
      return;
    }

    setErrors({});
    console.log("Password form submitted ✅", result.data);

    try {
      const res = await dispatch(
        changePassword({
          current_password: formData.current_password,
          new_password: formData.password,
          new_password_confirmation: formData.password_confirmation,
        }),
      ).unwrap();

      console.log("✅ Change password API response:", res);

      // Show toast here if you want
      ToastAndroid.show(res.message, ToastAndroid.SHORT);

      // Navigate back after success
      navigation.goBack();
    } catch (err: any) {
      ToastAndroid.show(err, ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.lock}>🔒</Text>
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>
          Please enter your current and new password
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Input
          label="Current Password"
          type="password"
          placeholder="********"
          value={formData.current_password}
          onChangeText={(value) => handleInputChange("current_password", value)}
          error={errors.current_password}
          required
        />

        <Input
          label="New Password"
          type="password"
          placeholder="********"
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          error={errors.password}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="********"
          value={formData.password_confirmation}
          onChangeText={(value) =>
            handleInputChange("password_confirmation", value)
          }
          error={errors.password_confirmation}
          required
        />

        <Button
          title={isLoading ? "Updating..." : "Update Password"}
          onPress={handleSubmit}
          disabled={isLoading}
          fullWidth
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 20,
    paddingBottom: 80,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  lock: {
    fontSize: 48,
    marginBottom: 8,
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
    borderRadius: 20,
    marginBottom: 32,
  },
  submitButton: {
    marginTop: 24,
  },
});
