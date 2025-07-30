import Colors from '@/shared/colors/Colors';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mockPayouts = [
  { id: '1', date: 'Aug 01, 2025', amount: '$200', status: 'Pending' },
  { id: '2', date: 'Sep 01, 2025', amount: '$200', status: 'Pending' },
  { id: '3', date: 'Oct 01, 2025', amount: '$200', status: 'Paid' },
];

export const PayoutSchedule = () => {
  const [payouts, setPayouts] = useState(mockPayouts);

  const handlePayoutPress = (id: string) => {
    Alert.alert(
      "Payout Action",
      "Mark as paid or add a note?",
      [
        {
          text: "Mark as Paid",
          onPress: () => {
            setPayouts(prev =>
              prev.map(p => (p.id === id ? { ...p, status: 'Paid' } : p))
            );
          },
        },
        { text: "Add Note", onPress: () => console.log("Note modal coming soon...") },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Payout Schedule</Text>
      {/* <FlatList
        data={payouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => ( */}
        {
            payouts.map(item=>(
          <TouchableOpacity key={item.id} onPress={() => handlePayoutPress(item.id)} style={styles.row}>
            <View>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
            <Text style={[styles.status, item.status === 'Paid' ? styles.paid : styles.pending]}>
              {item.status}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.white, padding: 16, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: 'bold', color: Colors.secondary, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  date: { fontSize: 14, color: Colors.secondary },
  amount: { fontSize: 13, color: Colors.gray },
  status: { fontWeight: '600', fontSize: 13 },
  paid: { color: Colors.success },
  pending: { color: Colors.warning },
});
