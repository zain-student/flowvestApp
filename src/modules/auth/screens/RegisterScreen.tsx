import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Select, SelectOption } from "@components/ui/Select";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Colors from "@shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@store/index";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthStackParamList } from "../../../navigation/AuthStack";
import { clearError, registerUser, selectAuthError } from "../store/authSlice";
import {
  createRegistrationSchema,
  validateFormData,
} from "../utils/authValidation";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

// Company type options for independent users
const companyTypeOptions: SelectOption[] = [
  {
    label: "Individual",
    value: "individual",
    description: "Personal investment account",
  },
  {
    label: "Private Company",
    value: "private",
    description: "Private limited company",
  },
  {
    label: "Silent Partnership",
    value: "silent",
    description: "Silent partner investment",
  },
  {
    label: "Holding Company",
    value: "holding",
    description: "Investment holding company",
  },
];

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const authError = useAppSelector(selectAuthError);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
    registration_type: "",
    company_name: "",
    company_type: "",
    invitation_token: "",
    terms_accepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (authError) dispatch(clearError());
  };

  const handleRoleSelect = (option: SelectOption) => {
    setFormData({
      ...formData,
      role: option.value,
      registration_type: "",
      company_name: "",
      company_type: "",
      invitation_token: "",
    });
    setCurrentStep(2);
  };

  const handleRegistrationTypeSelect = (option: SelectOption) => {
    setFormData({
      ...formData,
      registration_type: option.value,
      company_name: "",
      company_type: "",
      invitation_token: "",
    });
    setCurrentStep(3);
  };

  const handleCompanyTypeSelect = (option: SelectOption) => {
    handleInputChange("company_type", option.value);
  };

  const handleSubmit = async () => {
    const schema = createRegistrationSchema(
      formData.role,
      formData.registration_type,
    );
    const validation = validateFormData(schema, formData);

    if (!validation.success && validation.errors) {
      setErrors(validation.errors);
      return;
    }

    if (!validation.data) return;

    try {
      const result = await dispatch(registerUser(validation.data));
      if (registerUser.fulfilled.match(result)) {
        console.log("✅ Registration successful:", result);
      } else if (registerUser.rejected.match(result)) {
        console.log("❌ Registration failed:", result.error.message);
        dispatch(clearError());
        return;
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const navigateToLogin = () => navigation.navigate("Login");

  /** RENDER STEPS **/
  const renderRoleSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Choose Your Role</Text>
      <Text style={styles.stepDescription}>
        Select how you'll be using invstrhub
      </Text>
      <Select
        label="Role"
        placeholder="Select your role..."
        value={formData.role}
        onSelect={handleRoleSelect}
        error={errors.role}
        required
        options={[
          {
            label: "Investment Manager",
            value: "admin",
            description:
              "Manage company investments, invite team members, and oversee payouts.",
          },
          {
            label: "Partner",
            value: "user",
            description: "Invest in opportunities and track your payouts.",
          },
        ]}
      />
    </View>
  );

  const renderRegistrationTypeSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Registration Type</Text>
      <Text style={styles.stepDescription}>
        How would you like to join invstrhub?
      </Text>
      <Select
        label="Registration Type"
        placeholder="Select registration type..."
        value={formData.registration_type}
        onSelect={handleRegistrationTypeSelect}
        error={errors.registration_type}
        required
        options={[
          {
            label: "Invited by Company",
            value: "invited",
            description: "I have an invitation token from a company",
          },
          {
            label: "Independent Registration",
            value: "independent",
            description: "I want to create my own investment account",
          },
        ]}
      />
    </View>
  );

  const renderMainForm = () => {
    const isAdmin = formData.role === "admin";
    const isInvitedUser =
      formData.role === "user" && formData.registration_type === "invited";
    const isIndependentUser =
      formData.role === "user" && formData.registration_type === "independent";

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Create Your Account</Text>
        <Text style={styles.stepDescription}>
          Fill in your details to get started
        </Text>
        <View style={styles.form}>
          <Input
            label="First Name"
            placeholder="Enter your first name"
            value={formData.first_name}
            onChangeText={(v) => handleInputChange("first_name", v)}
            error={errors.first_name}
            required
          />
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.last_name}
            onChangeText={(v) => handleInputChange("last_name", v)}
            error={errors.last_name}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(v) => handleInputChange("email", v)}
            error={errors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChangeText={(v) => handleInputChange("password", v)}
            error={errors.password}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formData.password_confirmation}
            onChangeText={(v) => handleInputChange("password_confirmation", v)}
            error={errors.password_confirmation}
            required
          />

          {isAdmin && (
            <Input
              label="Company Name"
              placeholder="Enter your company name"
              value={formData.company_name}
              onChangeText={(v) => handleInputChange("company_name", v)}
              error={errors.company_name}
              required
            />
          )}

          {isInvitedUser && (
            <Input
              label="Invitation Token"
              placeholder="Enter your invitation token"
              value={formData.invitation_token}
              onChangeText={(v) => handleInputChange("invitation_token", v)}
              error={errors.invitation_token}
              required
            />
          )}

          {isIndependentUser && (
            <>
              <Input
                label="Company Name"
                placeholder="Enter your company name"
                value={formData.company_name}
                onChangeText={(v) => handleInputChange("company_name", v)}
                error={errors.company_name}
                required
              />
              <Select
                label="Company Type"
                placeholder="Select company type..."
                value={formData.company_type}
                onSelect={handleCompanyTypeSelect}
                error={errors.company_type}
                required
                options={companyTypeOptions}
              />
            </>
          )}

          {/* Terms */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() =>
              handleInputChange("terms_accepted", !formData.terms_accepted)
            }
          >
            <View
              style={[
                styles.checkbox,
                formData.terms_accepted && styles.checkboxChecked,
              ]}
            >
              {formData.terms_accepted && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text style={styles.termsText}>
              I agree to the Terms of Service and Privacy Policy
            </Text>
          </TouchableOpacity>
          {errors.terms_accepted && (
            <Text style={styles.fieldError}>{errors.terms_accepted}</Text>
          )}

          {/* Submit */}
          {isLoading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Button
              title="Create Account"
              onPress={handleSubmit}
              fullWidth
              style={styles.submitButton}
            />
          )}
        </View>
      </View>
    );
  };

  const renderCurrentStep = () => {
    if (currentStep === 1) return renderRoleSelection();
    if (currentStep === 2 && formData.role === "user")
      return renderRegistrationTypeSelection();
    return renderMainForm();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* HEADER */}
        <View style={styles.headerContainer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => setCurrentStep((prev) => prev - 1)}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.secondary} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Join invstrhub</Text>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(currentStep / (formData.role === "user" ? 3 : 2)) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep} of {formData.role === "user" ? 3 : 2}
          </Text>
        </View>

        {/* FORM */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderCurrentStep()}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  keyboardAvoid: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20 },

  // HEADER
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerBackButton: { marginRight: 16 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.secondary,
    flex: 1,
    textAlign: "center",
  },

  // PROGRESS
  progressContainer: { marginVertical: 16 },
  progressBar: {
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: { fontSize: 12, color: Colors.gray, textAlign: "center" },
  stepContent: { flex: 1 },
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 28,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.secondary,
    marginBottom: 8,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 24,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    marginRight: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  termsText: { fontSize: 14, color: Colors.secondary, flex: 1, lineHeight: 20 },
  fieldError: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
  },
  submitButton: { marginBottom: 16 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  footerText: { fontSize: 14, color: Colors.secondary },
  footerLink: { fontSize: 14, color: Colors.primary, fontWeight: "600" },
});
