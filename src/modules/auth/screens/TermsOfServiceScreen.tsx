// src/screens/TermsOfServiceScreen.tsx

import Colors from "@/shared/colors/Colors";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export const TermsOfServiceScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Terms of Service</Text>

        <Text style={styles.lastUpdated}>Last Updated: March 9, 2026</Text>

        <Text style={styles.text}>
          These Terms of Service ("Terms") govern your access to and use of the
          InvstrHub mobile application and related services. By accessing or
          using the application, you agree to be bound by these Terms. If you do
          not agree with these Terms, you should discontinue use of the
          application.
        </Text>

        <Text style={styles.heading}>1. Use of the Application</Text>
        <Text style={styles.text}>
          You agree to use the application only for lawful purposes and in
          compliance with all applicable laws and regulations. You must not use
          the application in any way that could damage, disable, or impair the
          service or interfere with other users.
        </Text>

        <Text style={styles.heading}>2. User Accounts</Text>
        <Text style={styles.text}>
          When creating an account, you are responsible for maintaining the
          confidentiality of your login credentials and for all activities that
          occur under your account. You agree to provide accurate and complete
          information during registration.
        </Text>

        <Text style={styles.heading}>
          3. Investments and Financial Decisions
        </Text>
        <Text style={styles.text}>
          InvstrHub provides tools that allow users to track and manage
          investment-related activities. The information presented within the
          application is for informational purposes only and should not be
          considered financial advice. Users are solely responsible for their
          financial decisions.
        </Text>

        <Text style={styles.heading}>4. Limitation of Liability</Text>
        <Text style={styles.text}>
          To the fullest extent permitted by law, InvstrHub and its affiliates
          shall not be liable for any direct, indirect, incidental, or
          consequential damages arising from the use or inability to use the
          application or its services.
        </Text>

        <Text style={styles.heading}>5. Changes to These Terms</Text>
        <Text style={styles.text}>
          We reserve the right to modify or update these Terms at any time. When
          changes are made, the "Last Updated" date at the top of this page will
          be revised. Continued use of the application after changes means that
          you accept the updated Terms.
        </Text>

        <Text style={styles.heading}>6. Contact Information</Text>
        <Text style={styles.text}>
          If you have any questions about these Terms of Service, please contact
          the InvstrHub support team through the application or official support
          channels.
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
