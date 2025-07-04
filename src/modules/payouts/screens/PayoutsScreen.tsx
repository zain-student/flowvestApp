import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RootStackParamList } from '../../../app/RootNavigator';
import { DashboardLayout } from '../../dashboard/components/DashboardLayout';

const mockPayouts = [
  { id: 1, date: '2024-07-15', amount: 1200, status: 'Upcoming', recipient: 'You' },
  { id: 2, date: '2024-06-01', amount: 900, status: 'Completed', recipient: 'You' },
  { id: 3, date: '2024-05-01', amount: 800, status: 'Completed', recipient: 'You' },
];

const FILTERS = ['All', 'Upcoming', 'Completed'];

export const PayoutsScreen: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const filtered = filter === 'All' ? mockPayouts : mockPayouts.filter(p => p.status === filter);

  return (
    <DashboardLayout>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Payouts</Text>
          <Text style={styles.cardValue}>$2,900.00</Text>
          <Text style={styles.cardSubtitle}>Next payout: July 15, 2024</Text>
        </View>
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterBtnActive]} onPress={() => setFilter(f)}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Payouts</Text>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}><Text style={styles.emptyText}>No payouts found.</Text></View>
        ) : (
          filtered.map(p => (
            <TouchableOpacity key={p.id} style={styles.payoutCard} onPress={() => navigation.navigate('PayoutDetails', { id: p.id })}>
              <View style={{ flex: 1 }}>
                <Text style={styles.payoutAmount}>${p.amount.toLocaleString()}</Text>
                <Text style={styles.payoutDate}>{p.date}</Text>
              </View>
              <Text style={[styles.payoutStatus, p.status === 'Upcoming' ? styles.statusUpcoming : styles.statusCompleted]}>{p.status}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 16, color: '#6B7280', marginBottom: 6 },
  cardValue: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#2563EB' },
  filterRow: { flexDirection: 'row', marginBottom: 16, gap: 10 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6' },
  filterBtnActive: { backgroundColor: '#2563EB' },
  filterText: { color: '#6B7280', fontWeight: '500' },
  filterTextActive: { color: '#fff' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 10 },
  payoutCard: {
    backgroundColor: '#F9FAFB', borderRadius: 10, padding: 16, marginBottom: 14, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1,
  },
  payoutAmount: { fontSize: 16, fontWeight: '600', color: '#2563EB' },
  payoutDate: { fontSize: 15, color: '#111827', marginTop: 2 },
  payoutStatus: { fontSize: 13, fontWeight: '500', marginLeft: 12 },
  statusUpcoming: { color: '#F59E42' },
  statusCompleted: { color: '#22C55E' },
  emptyState: { alignItems: 'center', marginTop: 32 },
  emptyText: { color: '#6B7280', fontSize: 15 },
});
export default PayoutsScreen; 