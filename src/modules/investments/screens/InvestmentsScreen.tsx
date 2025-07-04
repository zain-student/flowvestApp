import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RootStackParamList } from '../../../app/RootNavigator';
import { DashboardLayout } from '../../dashboard/components/DashboardLayout';

const mockInvestments = [
  { id: 1, name: 'Tech Growth Fund', amount: 12000, status: 'Active', returns: '+8.2%', date: '2024-06-01' },
  { id: 2, name: 'Real Estate Trust', amount: 5000, status: 'Pending', returns: '+2.1%', date: '2024-07-01' },
  { id: 3, name: 'Green Energy Bonds', amount: 3000, status: 'Completed', returns: '+5.7%', date: '2024-05-15' },
];

const FILTERS = ['All', 'Active', 'Pending', 'Completed'];

export const InvestmentsScreen: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const filtered = filter === 'All' ? mockInvestments : mockInvestments.filter(i => i.status === filter);

  return (
    <DashboardLayout>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Invested</Text>
          <Text style={styles.cardValue}>$12,500.00</Text>
          <Text style={styles.cardSubtitle}>+8.2% this year</Text>
        </View>
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterBtnActive]} onPress={() => setFilter(f)}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Investments</Text>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}><Text style={styles.emptyText}>No investments found.</Text></View>
        ) : (
          filtered.map(i => (
            <TouchableOpacity key={i.id} style={styles.investmentCard} onPress={() => navigation.navigate('InvestmentDetails', { id: i.id })}>
              <View style={{ flex: 1 }}>
                <Text style={styles.investmentName}>{i.name}</Text>
                <Text style={styles.investmentAmount}>${i.amount.toLocaleString()}</Text>
                <Text style={styles.investmentDate}>{i.date}</Text>
              </View>
              <Text style={[styles.investmentStatus, i.status === 'Active' ? styles.statusActive : styles.statusClosed]}>{i.status}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>＋</Text>
        <Text style={styles.fabLabel}>Add Investment</Text>
      </TouchableOpacity>
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
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 10 },
  investmentCard: {
    backgroundColor: '#F9FAFB', borderRadius: 10, padding: 16, marginBottom: 14, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1,
  },
  investmentName: { fontSize: 16, fontWeight: '600', color: '#2563EB' },
  investmentAmount: { fontSize: 15, color: '#111827', marginTop: 2 },
  investmentStatus: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  statusActive: { color: '#22C55E' },
  statusClosed: { color: '#6B7280' },
  investmentDate: { fontSize: 13, color: '#2563EB' },
  filterRow: { flexDirection: 'row', marginBottom: 10 },
  filterBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    marginRight: 8,
  },
  filterBtnActive: {
    backgroundColor: '#2563EB',
  },
  filterText: { fontSize: 14, color: '#2563EB' },
  filterTextActive: { fontWeight: 'bold', color: '#fff' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { fontSize: 16, color: '#6B7280' },
  fab: {
    position: 'absolute', right: 24, bottom: 32, backgroundColor: '#F97316', borderRadius: 24, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  fabIcon: { fontSize: 22, color: '#fff', marginRight: 6 },
  fabLabel: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
export default InvestmentsScreen; 