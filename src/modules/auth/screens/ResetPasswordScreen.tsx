/**
 * Step 3: Reset password
 */

import Colors from "@/shared/colors/Colors";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ResetPasswordScreen = ({ navigation }: any) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          required
        />

        <Button
          title="Reset Password"
          onPress={() => {}}
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
});
