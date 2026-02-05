import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  clearForgotPasswordState,
  resetPassword,
} from "../store/forgotPasswordSlice";

export const ResetPasswordScreen = ({ route, navigation }: any) => {
  const { token } = route.params;

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.forgotPassword);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleResetPassword = async () => {
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    const result = await dispatch(
      resetPassword({
        token,
        password,
        confirmPassword,
      }),
    );

    if (resetPassword.fulfilled.match(result)) {
      dispatch(clearForgotPasswordState());
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.content2}>
          <Text style={styles.title}>Create New Password</Text>
          <Text style={styles.subtitle}>
            Your new password must be different from the previous one.
          </Text>
        </View>

        <Input
          label="New Password"
          type="password"
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          required
          editable={!loading}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          required
          editable={!loading}
        />

        {(localError || error) && (
          <Text style={styles.errorText}>{localError || error}</Text>
        )}

        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          loading={loading}
          disabled={!password || !confirmPassword || loading}
          fullWidth
          style={{ marginTop: 24 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingBottom: 80,
    justifyContent: "center",
  },
  content2: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
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
  errorText: {
    marginTop: 8,
    color: "red",
    fontSize: 14,
  },
});
