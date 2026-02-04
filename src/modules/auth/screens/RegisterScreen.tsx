// import { Button } from "@components/ui/Button";
// import { Input } from "@components/ui/Input";
// import { Select, SelectOption } from "@components/ui/Select";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import Colors from "@shared/colors/Colors";
// import { useAppDispatch, useAppSelector } from "@store/index";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { AuthStackParamList } from "../../../navigation/AuthStack";
// import { clearError, registerUser, selectAuthError } from "../store/authSlice";
// import {
//   createRegistrationSchema,
//   validateFormData,
// } from "../utils/authValidation";

// type RegisterScreenNavigationProp = NativeStackNavigationProp<
//   AuthStackParamList,
//   "Register"
// >;

// // Company type options for independent users
// const companyTypeOptions: SelectOption[] = [
//   {
//     label: "Individual",
//     value: "individual",
//     description: "Personal investment account",
//   },
//   {
//     label: "Private Company",
//     value: "private",
//     description: "Private limited company",
//   },
//   {
//     label: "Silent Partnership",
//     value: "silent",
//     description: "Silent partner investment",
//   },
//   {
//     label: "Holding Company",
//     value: "holding",
//     description: "Investment holding company",
//   },
// ];

// export const RegisterScreen: React.FC = () => {
//   const navigation = useNavigation<RegisterScreenNavigationProp>();
//   const dispatch = useAppDispatch();
//   const { isLoading } = useAppSelector((state) => state.auth);
//   const authError = useAppSelector(selectAuthError);

//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     password_confirmation: "",
//     role: "",
//     registration_type: "",
//     company_name: "",
//     company_type: "",
//     invitation_token: "",
//     terms_accepted: false,
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [currentStep, setCurrentStep] = useState(1);

//   const handleInputChange = (field: string, value: string | boolean) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
//     if (authError) dispatch(clearError());
//   };

//   const handleRoleSelect = (option: SelectOption) => {
//     setFormData({
//       ...formData,
//       role: option.value,
//       registration_type: "",
//       company_name: "",
//       company_type: "",
//       invitation_token: "",
//     });
//     setCurrentStep(2);
//   };

//   const handleRegistrationTypeSelect = (option: SelectOption) => {
//     setFormData({
//       ...formData,
//       registration_type: option.value,
//       company_name: "",
//       company_type: "",
//       invitation_token: "",
//     });
//     setCurrentStep(3);
//   };

//   const handleCompanyTypeSelect = (option: SelectOption) => {
//     handleInputChange("company_type", option.value);
//   };

//   const handleSubmit = async () => {
//     const schema = createRegistrationSchema(
//       formData.role,
//       formData.registration_type,
//     );
//     const validation = validateFormData(schema, formData);

//     if (!validation.success && validation.errors) {
//       setErrors(validation.errors);
//       return;
//     }

//     if (!validation.data) return;

//     try {
//       const result = await dispatch(registerUser(validation.data));
//       if (registerUser.fulfilled.match(result)) {
//         console.log("✅ Registration successful:", result);
//       } else if (registerUser.rejected.match(result)) {
//         console.log("❌ Registration failed:", result.error.message);
//         dispatch(clearError());
//         return;
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//     }
//   };

//   const navigateToLogin = () => navigation.navigate("Login");

//   /** RENDER STEPS **/
//   const renderRoleSelection = () => (
//     <View style={styles.stepContent}>
//       <Text style={styles.stepTitle}>Choose Your Role</Text>
//       <Text style={styles.stepDescription}>
//         Select how you'll be using Invstrhub
//       </Text>
//       <Select
//         label="Role"
//         placeholder="Select your role..."
//         value={formData.role}
//         onSelect={handleRoleSelect}
//         error={errors.role}
//         required
//         options={[
//           {
//             label: "Investment Manager",
//             value: "admin",
//             description:
//               "Manage company investments, invite team members, and oversee payouts.",
//           },
//           {
//             label: "Partner",
//             value: "user",
//             description: "Invest in opportunities and track your payouts.",
//           },
//         ]}
//       />
//     </View>
//   );

//   const renderRegistrationTypeSelection = () => (
//     <View style={styles.stepContent}>
//       <Text style={styles.stepTitle}>Registration Type</Text>
//       <Text style={styles.stepDescription}>
//         How would you like to join Invstrhub?
//       </Text>
//       <Select
//         label="Registration Type"
//         placeholder="Select registration type..."
//         value={formData.registration_type}
//         onSelect={handleRegistrationTypeSelect}
//         error={errors.registration_type}
//         required
//         options={[
//           {
//             label: "Invited by Company",
//             value: "invited",
//             description: "I have an invitation token from a company",
//           },
//           {
//             label: "Independent Registration",
//             value: "independent",
//             description: "I want to create my own investment account",
//           },
//         ]}
//       />
//     </View>
//   );

//   const renderMainForm = () => {
//     const isAdmin = formData.role === "admin";
//     const isInvitedUser =
//       formData.role === "user" && formData.registration_type === "invited";
//     const isIndependentUser =
//       formData.role === "user" && formData.registration_type === "independent";

//     return (
//       <View style={styles.stepContent}>

//         <View style={styles.form}>
//           <Text style={styles.stepTitle}>Create an Account?</Text>
//           {/* <Text style={styles.stepDescription}>
//             Fill in your details to get started
//           </Text> */}
//           <Input
//             label="First Name"
//             placeholder="Enter your first name"
//             value={formData.first_name}
//             onChangeText={(v) => handleInputChange("first_name", v)}
//             error={errors.first_name}
//             required
//           />
//           <Input
//             label="Last Name"
//             placeholder="Enter your last name"
//             value={formData.last_name}
//             onChangeText={(v) => handleInputChange("last_name", v)}
//             error={errors.last_name}
//             required
//           />
//           <Input
//             label="Email Address"
//             type="email"
//             placeholder="Enter your email"
//             value={formData.email}
//             onChangeText={(v) => handleInputChange("email", v)}
//             error={errors.email}
//             required
//           />
//           <Input
//             label="Password"
//             type="password"
//             placeholder="Create a strong password"
//             value={formData.password}
//             onChangeText={(v) => handleInputChange("password", v)}
//             error={errors.password}
//             required
//           />
//           <Input
//             label="Confirm Password"
//             type="password"
//             placeholder="Confirm your password"
//             value={formData.password_confirmation}
//             onChangeText={(v) => handleInputChange("password_confirmation", v)}
//             error={errors.password_confirmation}
//             required
//           />

//           {isAdmin && (
//             <Input
//               label="Company Name"
//               placeholder="Enter your company name"
//               value={formData.company_name}
//               onChangeText={(v) => handleInputChange("company_name", v)}
//               error={errors.company_name}
//               required
//             />
//           )}

//           {isInvitedUser && (
//             <Input
//               label="Invitation Token"
//               placeholder="Enter your invitation token"
//               value={formData.invitation_token}
//               onChangeText={(v) => handleInputChange("invitation_token", v)}
//               error={errors.invitation_token}
//               required
//             />
//           )}

//           {isIndependentUser && (
//             <>
//               <Input
//                 label="Company Name"
//                 placeholder="Enter your company name"
//                 value={formData.company_name}
//                 onChangeText={(v) => handleInputChange("company_name", v)}
//                 error={errors.company_name}
//                 required
//               />
//               <Select
//                 label="Company Type"
//                 placeholder="Select company type..."
//                 value={formData.company_type}
//                 onSelect={handleCompanyTypeSelect}
//                 error={errors.company_type}
//                 required
//                 options={companyTypeOptions}
//               />
//             </>
//           )}

//           {/* Terms */}
//           <TouchableOpacity
//             style={styles.termsContainer}
//             onPress={() =>
//               handleInputChange("terms_accepted", !formData.terms_accepted)
//             }
//           >
//             <View
//               style={[
//                 styles.checkbox,
//                 formData.terms_accepted && styles.checkboxChecked,
//               ]}
//             >
//               {formData.terms_accepted && (
//                 <Ionicons name="checkmark" size={16} color="white" />
//               )}
//             </View>
//             <Text style={styles.termsText}>
//               I agree to the Terms of Service
//             </Text>
//           </TouchableOpacity>
//           {errors.terms_accepted && (
//             <Text style={styles.fieldError}>{errors.terms_accepted}</Text>
//           )}

//           {/* Submit */}
//           {isLoading ? (
//             <ActivityIndicator size="small" color="black" />
//           ) : (
//             <Button
//               title="Create Account"
//               onPress={handleSubmit}
//               fullWidth
//               style={styles.submitButton}
//             />
//           )}
//         </View>
//       </View>
//     );
//   };

//   const renderCurrentStep = () => {
//     if (currentStep === 1) return renderRoleSelection();
//     if (currentStep === 2 && formData.role === "user")
//       return renderRegistrationTypeSelection();
//     return renderMainForm();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         style={styles.keyboardAvoid}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         {/* HEADER */}
//         <View style={styles.headerContainer}>
//           {currentStep > 1 && (
//             <TouchableOpacity
//               style={styles.headerBackButton}
//               onPress={() => setCurrentStep((prev) => prev - 1)}
//             >
//               <Ionicons name="arrow-back" size={24} color={Colors.secondary} />
//             </TouchableOpacity>
//           )}
//           <Text style={styles.headerTitle}>Invstrhub</Text>
//         </View>

//         {/* PROGRESS */}
//         <View style={styles.progressContainer}>
//           <View style={styles.progressBar}>
//             <View
//               style={[
//                 styles.progressFill,
//                 {
//                   width: `${(currentStep / (formData.role === "user" ? 3 : 2)) * 100}%`,
//                 },
//               ]}
//             />
//           </View>
//           <Text style={styles.progressText}>
//             Step {currentStep} of {formData.role === "user" ? 3 : 2}
//           </Text>
//         </View>

//         {/* FORM */}
//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           {renderCurrentStep()}

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Already have an account? </Text>
//             <TouchableOpacity onPress={navigateToLogin}>
//               <Text style={styles.footerLink}>Sign In</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },
//   keyboardAvoid: { flex: 1 },
//   scrollView: { flex: 1 },
//   scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 10 },

//   // HEADER
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     // justifyContent: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: Colors.background,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.lightGray,
//   },
//   headerBackButton: { marginRight: 16 },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: Colors.primary,
//     flex: 1,
//     textAlign: "center",
//   },

//   // PROGRESS
//   progressContainer: { marginVertical: 1 },
//   progressBar: {
//     height: 4,
//     backgroundColor: Colors.lightGray,
//     borderRadius: 2,
//     marginBottom: 8,
//   },
//   progressFill: {
//     height: "100%",
//     backgroundColor: Colors.primary,
//     borderRadius: 2,
//   },
//   progressText: { fontSize: 12, color: Colors.gray, textAlign: "center" },
//   stepContent: { flex: 1 },
//   form: {
//     backgroundColor: "#ffffff",
//     borderRadius: 20,
//     paddingVertical: 28,
//     paddingHorizontal: 15,
//     marginBottom: 32,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     elevation: 4,
//   },
//   stepTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: Colors.secondary,
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   stepDescription: {
//     fontSize: 14,
//     color: Colors.gray,
//     textAlign: "center",
//     marginBottom: 24,
//   },
//   termsContainer: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 16,
//   },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: "#cbd5e1",
//     marginRight: 10,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   checkboxChecked: {
//     borderColor: Colors.primary,
//     backgroundColor: Colors.primary,
//   },
//   termsText: { fontSize: 14, color: Colors.secondary, flex: 1, lineHeight: 20 },
//   fieldError: {
//     fontSize: 12,
//     color: "#EF4444",
//     marginTop: -12,
//     marginBottom: 16,
//     marginLeft: 4,
//   },
//   submitButton: { marginBottom: 16 },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: Colors.lightGray,
//   },
//   footerText: { fontSize: 14, color: Colors.secondary },
//   footerLink: { fontSize: 14, color: Colors.primary, fontWeight: "600" },
// });

import { useAppDispatch, useAppSelector } from "@/shared/store";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Colors from "@shared/colors/Colors";
import React, { useCallback, useEffect, useState } from "react";
import {
  checkEmailAndSendCode,
  registerUser,
  resetRegister,
  setEmail as setReduxEmail,
  setRole as setReduxRole,
  setStep as setReduxStep,
  setTermsAccepted as setReduxTerms,
  setVerificationCode,
  verifyEmailCode,
} from "../store/registerSlice";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthStackParamList } from "../../../navigation/AuthStack";
type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;
const TOTAL_STEPS = 3;

export const RegisterScreen = () => {
  // const [step, setStep] = useState(1);

  // UI State
  // const [email, setEmail] = useState("");
  const RESEND_TIME = 60;

  const [resendTimer, setResendTimer] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [termsAccepted, setTermsAccepted] = useState(false);
  const [accountTypeOpen, setAccountTypeOpen] = useState(false);
  // const [accountType, setAccountType] = useState<"user" | "admin" | null>(null);
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const startResendTimer = () => {
    setResendTimer(RESEND_TIME);
    setCanResend(false);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return interval;
  };

  const dispatch = useAppDispatch();
  const {
    step,
    email: reduxEmail,
    role: reduxRole,
    verificationCode: reduxCode,
    termsAccepted: reduxTerms,
    loading,
    error,
  } = useAppSelector((state) => state.register);
  const [selectedRole, setSelectedRole] = useState<"user" | "admin" | null>(
    reduxRole,
  );
  const verificationCode = useAppSelector(
    (state) => state.register.verificationCode,
  );

  const isCodeValid = verificationCode.length === 6;

  useEffect(() => {
    setSelectedRole(reduxRole);
  }, [reduxRole]);
  useEffect(() => {
    if (step !== 2) return;

    const interval = startResendTimer();

    return () => clearInterval(interval);
  }, [step]);
  useFocusEffect(
    useCallback(() => {
      return () => {
        dispatch(resetRegister());
      };
    }, [dispatch]),
  );

  type AccountTypeItem = {
    label: string;
    value: "user" | "admin";
    // description: string;
  };

  const [accountTypeItems, setAccountTypeItems] = useState<AccountTypeItem[]>([
    {
      label: "Investor",
      value: "user",
      // description: "Join investment programs and track your portfolio",
    },
    {
      label: "Company",
      value: "admin",
      // description: "Create investments and manage partners",
    },
  ]);
  const navigateToLogin = () => navigation.navigate("Login");
  /* ---------------- STEPPER ---------------- */

  const Stepper = () => {
    const steps = [
      { id: 1, label: "Email & Role" },
      { id: 2, label: "Verify Code" },
      { id: 3, label: "Password" },
    ];

    return (
      <View style={styles.stepperContainer}>
        {steps.map((s, index) => {
          const active = step === s.id;
          const completed = step > s.id;

          return (
            <View key={s.id} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  active && styles.stepActive,
                  completed && styles.stepCompleted,
                ]}
              >
                <Text
                  style={[styles.stepNumber, completed && { color: "#fff" }]}
                >
                  {s.id}
                </Text>
              </View>

              <Text
                style={[styles.stepLabel, active && styles.stepLabelActive]}
              >
                {s.label}
              </Text>

              {index !== steps.length - 1 && <View style={styles.stepLine} />}
            </View>
          );
        })}
      </View>
    );
  };

  /* ---------------- STEP CONTENT ---------------- */

  const renderStep1 = () => (
    <View style={styles.card}>
      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>
        Join thousands of investors managing their portfolios with confidence
      </Text>

      <Input
        label="Email Address"
        placeholder="your.email@example.com"
        type="email"
        value={reduxEmail}
        // onChangeText={setEmail}
        onChangeText={(text) => dispatch(setReduxEmail(text))}
        required
      />
      <View style={{ zIndex: 1000, marginBottom: 16 }}>
        <Text style={styles.label}>
          Account Type <Text style={{ color: "red" }}>*</Text>
        </Text>

        <DropDownPicker
          open={accountTypeOpen}
          value={selectedRole}
          setValue={(callback) => {
            const newVal =
              typeof callback === "function"
                ? callback(selectedRole)
                : callback;
            setSelectedRole(newVal as "user" | "admin");
            dispatch(setReduxRole(newVal as "user" | "admin"));
            console.log("Selected role (picker):", newVal);
          }}
          items={accountTypeItems}
          setOpen={setAccountTypeOpen}
          setItems={setAccountTypeItems}
          placeholder="Select account type"
          listMode="SCROLLVIEW"
        />
      </View>

      <TouchableOpacity
        style={styles.termsContainer}
        // onPress={() => setTermsAccepted(!termsAccepted)}
        onPress={() => dispatch(setReduxTerms(!reduxTerms))}
      >
        <View style={[styles.checkbox, reduxTerms && styles.checkboxChecked]}>
          {reduxTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
        <Text style={styles.termsText}>
          I agree to the Terms of Service and Privacy Policy
        </Text>
      </TouchableOpacity>
      <Button
        title="Continue"
        fullWidth
        onPress={async () => {
          if (!reduxEmail || !reduxRole) {
            return ToastAndroid.show(
              "Please enter email and select account type",
              ToastAndroid.SHORT,
            );
          }
          if (!reduxTerms)
            return ToastAndroid.show("Please accept terms", ToastAndroid.SHORT);
          const payload = {
            email: reduxEmail,
            role: reduxRole as "user" | "admin",
          };
          console.log(
            "Dispatching checkEmailAndSendCode with payload:",
            payload,
          );
          try {
            await dispatch(checkEmailAndSendCode(payload)).unwrap();
            ToastAndroid.show(
              "Verification code sent! Check your email.",
              ToastAndroid.SHORT,
            );
            //move to step 2 when verified
            dispatch(setReduxStep(2));
          } catch (err: any) {
            console.log("Error sending code:", err);
            ToastAndroid.show(err, ToastAndroid.SHORT);
          }
        }}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.card}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to{" "}
        <Text style={styles.emailHighlight}>{reduxEmail}</Text>
      </Text>

      <Input
        label="Verification Code"
        placeholder="123456"
        keyboardType="numeric"
        maxLength={6}
        value={reduxCode}
        onChangeText={(text) => dispatch(setVerificationCode(text))}
        required
      />
      <TouchableOpacity
        style={styles.resendContainer}
        disabled={!canResend}
        onPress={async () => {
          try {
            await dispatch(
              checkEmailAndSendCode({
                email: reduxEmail,
                role: reduxRole!,
              }),
            ).unwrap();

            ToastAndroid.show("Verification code resent", ToastAndroid.SHORT);
            startResendTimer();
          } catch (err: any) {
            ToastAndroid.show(err, ToastAndroid.SHORT);
          }
        }}
      >
        <Text style={[styles.resendText, !canResend && { color: Colors.gray }]}>
          {canResend ? "Resend code" : `Resend code in ${resendTimer}s`}
        </Text>
      </TouchableOpacity>
      <Button
        title="Verify"
        fullWidth
        disabled={!isCodeValid || loading}
        onPress={async () => {
          if (!reduxCode)
            return ToastAndroid.show(
              "Enter verification code",
              ToastAndroid.SHORT,
            );
          try {
            await dispatch(
              verifyEmailCode({ email: reduxEmail, code: reduxCode }),
            ).unwrap();
            dispatch(setReduxStep(3)); // move to password step
          } catch (err: any) {
            ToastAndroid.show(err, ToastAndroid.SHORT);
          }
        }}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.card}>
      <Text style={styles.title}>Set Password</Text>
      <Text style={styles.subtitle}>
        Choose a strong password to secure your account
      </Text>

      <Input
        label="Password"
        placeholder="Create password"
        type="password"
        value={password}
        onChangeText={setPassword}
        required
      />

      <Input
        label="Confirm Password"
        placeholder="Confirm password"
        type="password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        required
      />
      <Button
        title={loading ? "Creating Account..." : "Create Account"}
        fullWidth
        disabled={loading}
        onPress={async () => {
          if (!password || !confirmPassword)
            return ToastAndroid.show("Enter passwords", ToastAndroid.SHORT);
          if (password !== confirmPassword)
            return ToastAndroid.show(
              "Passwords do not match",
              ToastAndroid.SHORT,
            );

          try {
            await dispatch(
              registerUser({
                email: reduxEmail,
                code: reduxCode,
                password,
                role: reduxRole,
                termsAccepted: reduxTerms,
              }),
            ).unwrap();
            dispatch(resetRegister());
            // Alert.alert("Account created!");
            navigation.navigate("Login"); // or wherever
          } catch (err: any) {
            ToastAndroid.show(err, ToastAndroid.SHORT);
          }
        }}
      />

      {/* <Button
        title="Create Account"
        fullWidth
        onPress={() => { }}
      /> */}
    </View>
  );

  const renderContent = () => {
    if (step === 1) return renderStep1();
    if (step === 2) return renderStep2();
    return renderStep3();
  };

  /* ---------------- SCREEN ---------------- */

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Ionicons name="trending-up" size={22} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>Create Your Account</Text>
          </View>

          {/* Stepper */}
          <Stepper />

          {/* Content */}
          {renderContent()}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>

          {/* <Text style={styles.securityText}>
            🔒 Your data is protected with bank-level security
          </Text> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20 },

  header: { alignItems: "center", marginBottom: 16 },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.secondary,
  },

  stepperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 24,
  },
  stepItem: { flex: 1, alignItems: "center" },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  stepActive: { borderColor: Colors.primary },
  stepCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.secondary,
  },
  stepLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 6,
    textAlign: "center",
  },
  stepLabelActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  stepLine: {
    position: "absolute",
    top: 14,
    left: "60%",
    right: "-60%",
    height: 2,
    backgroundColor: Colors.lightGray,
    zIndex: -1,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.secondary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 20,
  },
  emailHighlight: {
    fontWeight: "600",
    color: Colors.secondary,
  },

  resendContainer: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  resendText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#1F2937",
  },
  dropdown: {
    borderColor: "#E5E7EB",
    borderRadius: 10,
    minHeight: 52,
  },
  dropdownContainer: {
    borderColor: "#E5E7EB",
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: "#111827",
  },
  placeholder: {
    color: "#9CA3AF",
  },
  selectedItem: {
    backgroundColor: "#EEF2FF",
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  itemDescription: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  termsText: {
    fontSize: 14,
    color: Colors.secondary,
    flex: 1,
    lineHeight: 20,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: { color: Colors.secondary },
  footerLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
  securityText: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 12,
    color: Colors.gray,
  },
});
