// src/screens/TermsOfServiceScreen.tsx

import Colors from "@/shared/colors/Colors";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";

export const TermsOfServiceScreen = () => {
  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Terms of Service</Text>

        <Text style={styles.lastUpdated}>Last Updated: March 10, 2026</Text>

        <Text style={styles.text}>
          By using InvstrHub, you agree to these Terms. If you don't agree,
          please don't use this app.
        </Text>

        <Text style={styles.heading}>1. Your Account</Text>
        <Text style={styles.text}>
          Keep your password confidential and provide accurate information. You
          are responsible for all activity on your account.
        </Text>

        <Text style={styles.heading}>2. Investment Disclaimer</Text>
        <Text style={styles.text}>
          InvstrHub is for tracking and managing investments only. Information
          is not financial advice. You are responsible for your investment
          decisions. Consult professionals before making decisions.
        </Text>

        <Text style={styles.heading}>3. Prohibited Activities</Text>
        <Text style={styles.text}>
          Do not violate laws, commit fraud, hack accounts, use bots, or engage
          in illegal activities.
        </Text>

        <Text style={styles.heading}>4. Intellectual Property</Text>
        <Text style={styles.text}>
          All app content is our property. Do not copy or distribute without
          permission.
        </Text>

        <Text style={styles.heading}>5. No Warranties</Text>
        <Text style={styles.text}>
          The app is provided "as is" without guarantees. We're not liable for
          damages from using or inability to use the app.
        </Text>
        <Text style={styles.heading}>6. Investment Risk Disclosure</Text>
        <Text style={styles.text}>
          Investments involve risk, including potential loss of capital.
          InvstrHub only provides tools for managing and tracking investment
          information. We do not provide financial, legal, or investment advice.
        </Text>
        <Text style={styles.heading}>7. Data Accuracy Disclaimer</Text>
        <Text style={styles.text}>
          InvstrHub relies on information provided by users. We do not guarantee
          the accuracy, completeness, or reliability of the data stored in the
          application.
        </Text>
        <Text style={styles.heading}>8. Account Termination</Text>
        <Text style={styles.text}>
          We may suspend or terminate your account if you violate these Terms.
        </Text>

        <Text style={styles.heading}>9. Privacy</Text>
        <Text style={styles.text}>
          Your use is governed by our Privacy Policy. Please review it.
        </Text>

        <Text style={styles.heading}>10. Updates to Terms</Text>
        <Text style={styles.text}>
          We may update these Terms anytime. Continued use means you accept the
          changes.
        </Text>

        <Text style={styles.heading}>11. Contact Us</Text>
        <Text style={styles.text}>Have questions? Contact us:</Text>

        <Text style={[styles.text, { marginTop: 8 }]}>
          <Text style={{ fontWeight: "600" }}>Support Team</Text>
        </Text>
        <Text
          style={[styles.email, { marginBottom: 12 }]}
          onPress={() => handleEmailPress("support@invstrhub.com")}
        >
          support@invstrhub.com
        </Text>

        <Text style={[styles.text, { marginTop: 20, fontWeight: "500" }]}>
          By using InvstrHub, you agree to these Terms of Service.
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsOfServiceScreen;

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
