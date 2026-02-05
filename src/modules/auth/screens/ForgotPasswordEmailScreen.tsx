// /**
//  * Step 1: Enter email to receive verification code
//  */

// import Colors from "@/shared/colors/Colors";
// import { Button } from "@components/ui/Button";
// import { Input } from "@components/ui/Input";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import React, { useState } from "react";
// import {
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { AuthStackParamList } from "../../../navigation/AuthStack";

// type NavProp = NativeStackNavigationProp<
//   AuthStackParamList,
//   "ForgotPasswordEmail"
// >;

// export const ForgotPasswordEmailScreen = () => {
//   const navigation = useNavigation<NavProp>();
//   const [email, setEmail] = useState("");

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color={Colors.secondary} />
//           </TouchableOpacity>
//         </View>

//         <ScrollView
//           contentContainerStyle={styles.content}
//           style={styles.scrollView}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View>
//             <View style={styles.header2}>
//               <Text style={styles.title}>Forgot Password</Text>
//               <Text style={styles.subtitle}>
//                 Enter your email and we’ll send you a 6-digit verification code.
//               </Text>
//             </View>
//             <Input
//               label="Email Address"
//               placeholder="john@example.com"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               value={email}
//               onChangeText={setEmail}
//               required
//             />

//             <Button
//               title="Send Code"
//               onPress={() => navigation.navigate("VerifyResetCode", { email })}
//               fullWidth
//               style={{ marginTop: 24 }}
//             />
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };
/**
 * Step 1: Enter email to receive verification code
 */

import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
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
import {
    sendResetCode,
    setEmail as setForgotEmail,
} from "../store/forgotPasswordSlice";

type NavProp = NativeStackNavigationProp<
  AuthStackParamList,
  "ForgotPasswordEmail"
>;

export const ForgotPasswordEmailScreen = () => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.forgotPassword);

  const [email, setEmail] = useState("");

  // Navigate only after successful API call
  useEffect(() => {
    if (!loading && !error && email) {
      // success case handled after thunk resolves
    }
  }, [loading, error]);

  const handleSendCode = async () => {
    dispatch(setForgotEmail(email));

    const result = await dispatch(sendResetCode({ email }));

    if (sendResetCode.fulfilled.match(result)) {
      navigation.navigate("VerifyResetCode", { email });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.secondary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <View style={styles.header2}>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>
                Enter your email and we’ll send you a 6-digit verification code.
              </Text>
            </View>

            <Input
              label="Email Address"
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              required
              editable={!loading}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="Send Code"
              onPress={handleSendCode}
              loading={loading}
              disabled={!email || loading}
              fullWidth
              style={{ marginTop: 24 }}
            />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  header2: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  errorText: {
    color: "red",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 80,
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.secondary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 24,
  },
});
