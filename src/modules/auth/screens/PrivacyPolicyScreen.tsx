// src/screens/PrivacyPolicyScreen.tsx

import Colors from "@/shared/colors/Colors";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";

export const PrivacyPolicyScreen = () => {
  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.lastUpdated}>Last Updated: March 10, 2026</Text>

        <Text style={styles.text}>
          InvstrHub is committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, and safeguard your information when you
          use our mobile application.
        </Text>

        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We collect information you provide (name, email, phone, financial
          details) and automatically collect technical data (device type, app
          usage, IP address) to improve our services.
        </Text>

        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use your information to manage your account, process investments,
          send transaction confirmations, prevent fraud, improve our service,
          and comply with legal obligations.
        </Text>

        <Text style={styles.heading}>3. Data Security</Text>
        <Text style={styles.text}>
          We use encryption, JWT authentication, and secure storage to protect
          your information. While we use industry-standard security measures, no
          system is completely secure.
        </Text>

        <Text style={styles.heading}>4. Data Retention</Text>
        <Text style={styles.text}>
          We keep your information as long as necessary to provide services and
          comply with legal requirements. You can request deletion by contacting
          us.
        </Text>

        <Text style={styles.heading}>5. Your Privacy Rights</Text>
        <Text style={styles.text}>
          You have the right to access, correct, delete, and receive your data
          in a portable format. To exercise these rights, contact us at{" "}
          <Text
            style={styles.email}
            onPress={() => handleEmailPress("support@invstrhub.com")}
          >
            support@invstrhub.com
          </Text>
          .
        </Text>

        <Text style={styles.heading}>6. Changes to This Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy at any time. Continued use of our
          app means you accept the updated policy.
        </Text>

        <Text style={styles.heading}>7. Contact Us</Text>
        <Text style={styles.text}>
          If you have questions about this Privacy Policy or wish to exercise
          your rights, please contact:
        </Text>

        <Text style={[styles.text, { marginTop: 8 }]}>
          <Text style={{ fontWeight: "600" }}>Privacy Team</Text>
        </Text>
        <Text
          style={[styles.email]}
          onPress={() => handleEmailPress("support@invstrhub.com")}
        >
          support@invstrhub.com
        </Text>

        <Text style={[styles.text, { marginTop: 20, fontWeight: "500" }]}>
          By using InvstrHub, you agree to this Privacy Policy.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1a1a1a",
  },

  lastUpdated: {
    fontSize: 12,
    color: "#999",
    marginBottom: 16,
    fontStyle: "italic",
  },

  heading: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 8,
    color: "#1a1a1a",
  },

  subheading: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
    color: "#2a2a2a",
  },

  text: {
    fontSize: 14,
    lineHeight: 21,
    color: "#555",
    marginBottom: 6,
  },

  email: {
    fontSize: 14,
    color: "#0066cc",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
