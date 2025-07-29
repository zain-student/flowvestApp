import Colors from '@/shared/colors/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const mockNotes = [
  { id: 1, date: 'Jul 14', note: 'Reviewed performance of Tech Fund' },
  { id: 2, date: 'Jul 12', note: 'Flagged Green Energy for review' },
];

export const NotesAdded = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Notes Added</Text>
      {mockNotes.map((item) => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.text}>{item.note}</Text>
          <Text style={styles.subText}>{item.date}</Text>
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
