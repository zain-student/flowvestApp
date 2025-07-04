import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mockPayout = {
  id: 1,
  date: '2024-07-15',
  amount: 1200,
  status: 'Upcoming',
  recipient: 'You',
  method: 'Bank Transfer',
  timeline: [
    { id: 1, label: 'Requested', date: '2024-07-01' },
    { id: 2, label: 'Scheduled', date: '2024-07-10' },
    { id: 3, label: 'Processing', date: '2024-07-14' },
  ],
};

const PayoutDetailsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Payout Details</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>${mockPayout.amount.toLocaleString()}</Text>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.status, mockPayout.status === 'Upcoming' ? styles.statusUpcoming : styles.statusCompleted]}>{mockPayout.status}</Text>
          <Text style={styles.label}>Recipient</Text>
          <Text style={styles.value}>{mockPayout.recipient}</Text>
          <Text style={styles.label}>Method</Text>
          <Text style={styles.value}>{mockPayout.method}</Text>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{mockPayout.date}</Text>
        </View>
        <Text style={styles.sectionTitle}>Timeline</Text>
        {mockPayout.timeline.map(item => (
          <View key={item.id} style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>{item.label}</Text>
            <Text style={styles.timelineDate}>{item.date}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  closeBtn: { position: 'absolute', top: 32, right: 24, zIndex: 10, backgroundColor: '#F3F4F6', borderRadius: 16, padding: 8 },
  closeText: { fontSize: 22, color: '#6B7280' },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2563EB', marginBottom: 18 },
  summaryCard: { backgroundColor: '#F9FAFB', borderRadius: 14, padding: 18, marginBottom: 24 },
  label: { fontSize: 13, color: '#6B7280', marginTop: 8 },
  value: { fontSize: 16, color: '#111827', fontWeight: '600' },
  status: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  statusUpcoming: { color: '#F59E42' },
  statusCompleted: { color: '#22C55E' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 10 },
  timelineItem: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timelineLabel: { fontSize: 15, color: '#2563EB', fontWeight: '600' },
  timelineDate: { fontSize: 13, color: '#6B7280' },
});
export default PayoutDetailsScreen; 