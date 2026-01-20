import Colors from '@/shared/colors/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const mockPayouts = [
  { id: 1, date: 'Jul 15', amount: '$1,200', investment: 'Tech Fund' },
  { id: 2, date: 'Jul 10', amount: '$800', investment: 'Green Energy' },
];

export const PayoutsHistory = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Payout History</Text>
      {mockPayouts.map((item) => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.text}>{item.investment}</Text>
          <Text style={styles.subText}>{item.date} - {item.amount}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.white, padding: 16, marginBottom: 12, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: 'bold', color: Colors.secondary, marginBottom: 8 },
  item: { marginBottom: 8 },
  text: { fontSize: 15, color: Colors.secondary },
  subText: { fontSize: 13, color: Colors.gray },
});
