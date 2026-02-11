/**
 * Login Screen
 * User authentication login form with validation
 */

import Colors from "@/shared/colors/Colors";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "@store/index";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthStackParamList } from "../../../navigation/AuthStack";
import {
  clearError,
  loginUser,
  selectAuthError,
  selectIsLoading,
} from "../store/authSlice";
import {
  LoginFormData,
  loginSchema,
  validateFormData,
} from "../utils/authValidation";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const authError = useAppSelector(selectAuthError);

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    // 'zainma4989@gmail.com',
    // 'abc123@gmail.com',
    password: "",
    // 'Zain,4321',
    // 'Zainmalik,4989',
    remember: false,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (
    field: keyof LoginFormData,
    value: string | boolean,
  ) => {
    setFormData((prev: LoginFormData) => ({ ...prev, [field]: value }));

    // Clear specific field error when user starts typing
    if (errors[field as string]) {
      setErrors((prev: Record<string, string>) => ({
        ...prev,
        [field as string]: "",
      }));
    }

    // Clear auth error when user makes changes
    if (authError) {
      dispatch(clearError());
    }
  };
  useEffect(() => {});
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form data
    const validation = validateFormData(loginSchema, formData);

    if (!validation.success && validation.errors) {
      setErrors(validation.errors);
      return;
    }

    if (!validation.data) return;

    try {
      // Dispatch login action
      const result = await dispatch(loginUser(validation.data));

      if (loginUser.fulfilled.match(result)) {
        // Login successful - navigation will be handled by RootNavigator
        console.log("Login successful");
      } else if (loginUser.rejected.match(result)) {
        // Login failed - error will be shown via authError
        console.log("Login failed:", result.error.message);
        // ToastAndroid.show(
        //   `Login failed: ${result.payload || result.error.message}`,
        //   ToastAndroid.LONG
        // );
      }
    } catch (error) {
      // console.error('Login error:', error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  // Navigate to register screen
  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  // Navigate to forgot password screen
  const navigateToForgotPassword = () => {
    navigation.navigate("ForgotPasswordEmail");
  };

  const isEmailValid = () => {
    const result = loginSchema.shape.email.safeParse(formData.email);
    return result.success;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar
            barStyle="dark-content" // or "dark-content"
            // backgroundColor="#000" // set to match your theme
          />
          <View>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Your journey to financial freedom continues here.
              </Text>
            </View>
          </View>
          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email"
              type="email"
              placeholder="ulfa123@gmail.com"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              error={errors.email}
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={Colors.gray} />
              }
              rightIcon={
                formData.email.length > 0 && isEmailValid() ? (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={Colors.secondary}
                  />
                ) : (
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color={Colors.secondary}
                  />
                )
              }
              // required
              // autoFocus
            />

            <Input
              label="Password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              error={errors.password}
              leftIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Colors.gray}
                />
              }
              // required
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
                marginTop: 8,
              }}
            >
              {/* Remember Me - Simple implementation */}
              <TouchableOpacity
                style={styles.rememberContainer}
                onPress={() =>
                  handleInputChange("remember", !formData.remember)
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.remember && styles.checkboxActive,
                  ]}
                >
                  {formData.remember && (
                    //  <Text style={styles.checkmark}>✓</Text>
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={Colors.primary}
                    />
                  )}
                </View>
                <Text style={styles.rememberText}>Keep Login</Text>
              </TouchableOpacity>
              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={navigateToForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <Button
              title="Login"
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              style={styles.submitButton}
            />
          </View>

          {/* Footer */}
          <View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.footerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  keyboardAvoid: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: "space-between",
  },

  header: {
    // alignItems: '',
    marginTop: 40,
    marginBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.secondary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 24,
    color: Colors.gray,
    // textAlign: 'center',
  },

  form: {
    flex: 1,
  },

  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    // backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  errorBanner: {
    backgroundColor: "#fef2f2",
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    alignItems: "center",
  },
  errorBannerText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "500",
  },
  checkboxChecked: {
    // borderColor: Colors.secondary,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },

  checkmark: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },

  rememberText: {
    fontSize: 14,
    color: Colors.secondary,
  },

  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
  },

  submitButton: {
    marginBottom: 20,
  },

  forgotPasswordContainer: {
    alignItems: "flex-end",
    // marginBottom: 32,
  },

  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    // alignItems: 'center',
    // paddingTop: 20,
    // borderTopWidth: 1,
    // borderTopColor: Colors.lightGray,
    // marginTop: 10,
  },

  footerText: {
    fontSize: 14,
    color: Colors.gray,
  },

  footerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
});
