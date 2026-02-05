import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sendResetCode, verifyResetCode } from "../store/forgotPasswordSlice";

export const VerifyResetCodeScreen = ({ route, navigation }: any) => {
  const { email } = route.params;

  const dispatch = useAppDispatch();
  const { loading, error, verificationToken } = useAppSelector(
    (state) => state.forgotPassword,
  );
  const RESEND_SECONDS = 60;

  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const [code, setCode] = useState("");

  // Navigate only after successful verification
  useEffect(() => {
    if (verificationToken) {
      navigation.navigate("ResetPassword", {
        email,
        token: verificationToken,
      });
    }
  }, [verificationToken]);
  useEffect(() => {
    startResendTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  const startResendTimer = () => {
    setResendTimer(RESEND_SECONDS);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    await dispatch(sendResetCode({ email }));
    startResendTimer();
  };

  const handleVerifyCode = async () => {
    await dispatch(
      verifyResetCode({
        email,
        code,
      }),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          disabled={loading}
          onPress={() => navigation.goBack()}
        >
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
            editable={!loading}
          />
          <View style={styles.resendContainer}>
            {resendTimer > 0 ? (
              <Text style={styles.timerText}>
                Resend code in {resendTimer}s
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResendCode} disabled={loading}>
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </View>

          <Button
            title="Verify Code"
            onPress={handleVerifyCode}
            loading={loading}
            disabled={code.length !== 6 || loading}
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
  scrollView: { flex: 1 },
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
  resendContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  timerText: {
    color: Colors.gray,
    fontSize: 14,
  },
  resendText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
});
