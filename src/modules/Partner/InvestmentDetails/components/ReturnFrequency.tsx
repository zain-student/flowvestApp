import Colors from '@/shared/colors/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const ReturnFrequency = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Return Type & Frequency</Text>
      <Text style={styles.info}>Type: Fixed Return</Text>
      <Text style={styles.info}>Frequency: Monthly</Text>
      <Text style={styles.info}>Rate: 8% per annum</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.white, padding: 16, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: Colors.secondary, marginBottom: 8 },
  info: { fontSize: 14, color: Colors.secondary, marginBottom: 4 },
});
