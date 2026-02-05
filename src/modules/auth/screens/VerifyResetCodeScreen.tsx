/**
 * Step 2: Verify 6-digit code
 */

import Colors from "@/shared/colors/Colors";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export const VerifyResetCodeScreen = ({ route, navigation }: any) => {
  const { email } = route.params;
  const [code, setCode] = useState("");

  return (
    <SafeAreaView style={styles.container}>
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
          <View style={styles.content2}>
            <Text style={styles.title}>Verify Code</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{" "}
              <Text style={styles.highlight}>{email}</Text>
            </Text>
          </View>
          <Input
            label="Verification Code"
            placeholder="123456"
            keyboardType="numeric"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            required
          />

          <Button
            title="Verify Code"
            onPress={() =>
              navigation.navigate("ResetPassword", {
                email,
                token: "TEMP_TOKEN_FROM_API",
              })
            }
            fullWidth
            style={{ marginTop: 24 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  content: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingBottom: 80,
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
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
  highlight: { fontWeight: "600", color: Colors.secondary },
});
