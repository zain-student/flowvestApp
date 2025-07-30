import Colors from '@/shared/colors/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const InvestmentOverview = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Investment Overview</Text>
      <Text style={styles.label}>Fund Name: <Text style={styles.value}>Tech Growth Fund</Text></Text>
      <Text style={styles.label}>Total Invested: <Text style={styles.value}>$10,000</Text></Text>
      <Text style={styles.label}>Start Date: <Text style={styles.value}>Jan 01, 2025</Text></Text>
      <Text style={styles.label}>Duration: <Text style={styles.value}>12 Months</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.white, padding: 16, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: Colors.secondary, marginBottom: 8 },
  label: { fontSize: 14, color: Colors.gray, marginBottom: 4 },
  value: { color: Colors.secondary, fontWeight: '600' },
});
