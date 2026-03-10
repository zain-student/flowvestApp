import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";
import Colors from "../colors/Colors";

export const toastConfig = {
  success: ({ text1 }: BaseToastProps) => (
    <View style={[styles.container, styles.success]}>
      <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
      <Text style={styles.text}>{text1}</Text>
    </View>
  ),

  error: ({ text1 }: BaseToastProps) => (
    <View style={[styles.container, styles.error]}>
      <Ionicons name="close-circle" size={22} color="#dc2626" />
      <Text style={styles.text}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    width: "92%",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderLeftWidth: 4,
  },

  success: {
    borderLeftColor: Colors.primary,
  },

  error: {
    borderLeftColor: "#dc2626",
  },

  text: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
});
