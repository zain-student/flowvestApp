// src/screens/PrivacyPolicyScreen.tsx

import Colors from "@/shared/colors/Colors";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.lastUpdated}>Last Updated: March 9, 2026</Text>

        <Text style={styles.text}>
          This Privacy Policy explains how InvstrHub collects, uses, and
          safeguards your information when you use our mobile application. By
          using the application, you agree to the collection and use of
          information in accordance with this policy.
        </Text>

        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We may collect personal information such as your name, email address,
          phone number, and account details when you register or interact with
          our services. We may also collect technical information such as device
          type, operating system, and application usage data to improve the
          service.
        </Text>

        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          The information we collect is used to operate and improve our
          services, manage user accounts, process transactions, provide customer
          support, and communicate important updates related to the application.
        </Text>

        <Text style={styles.heading}>3. Data Security</Text>
        <Text style={styles.text}>
          We implement appropriate security measures to protect your personal
          data against unauthorized access, alteration, disclosure, or
          destruction. However, no digital platform can guarantee absolute
          security.
        </Text>

        <Text style={styles.heading}>4. Data Retention</Text>
        <Text style={styles.text}>
          We retain your information only for as long as necessary to provide
          our services and comply with legal obligations. When data is no longer
          required, it will be securely deleted or anonymized.
        </Text>

        <Text style={styles.heading}>5. Changes to This Privacy Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy from time to time. When changes are
          made, the "Last Updated" date at the top of this page will be revised.
          Continued use of the application after updates indicates your
          acceptance of the revised policy.
        </Text>

        <Text style={styles.heading}>6. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions or concerns regarding this Privacy Policy or
          how your data is handled, please contact the InvstrHub support team
          through the application or official communication channels.
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
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },

  lastUpdated: {
    fontSize: 13,
    color: "#777",
    marginBottom: 16,
  },

  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
});
