import { InvestmentStackParamList } from '@/navigation/InvestmentStack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const mockInvestment = {
  id: 1,
  name: 'Tech Growth Fund',
  amount: 12000,
  status: 'Active',
  returns: '+8.2%',
  startDate: '2023-01-01',
  endDate: '2024-12-31',
  transactions: [
    { id: 1, date: '2024-06-01', type: 'Deposit', amount: 5000 },
    { id: 2, date: '2024-03-01', type: 'Deposit', amount: 7000 },
    { id: 3, date: '2024-05-01', type: 'Payout', amount: 800 },
  ],
};

type Props = NativeStackScreenProps<InvestmentStackParamList, 'InvestmentDetails'>;

export const InvestmentDetailsScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{mockInvestment.name}</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.label}>Amount Invested</Text>
          <Text style={styles.value}>${mockInvestment.amount.toLocaleString()}</Text>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.status, mockInvestment.status === 'Active' ? styles.statusActive : styles.statusCompleted]}>{mockInvestment.status}</Text>
          <Text style={styles.label}>Returns</Text>
          <Text style={styles.returns}>{mockInvestment.returns}</Text>
          <Text style={styles.label}>Start Date</Text>
          <Text style={styles.value}>{mockInvestment.startDate}</Text>
          <Text style={styles.label}>End Date</Text>
          <Text style={styles.value}>{mockInvestment.endDate}</Text>
        </View>
        <Text style={styles.sectionTitle}>Transactions</Text>
        {mockInvestment.transactions.map(tx => (
          <View key={tx.id} style={styles.txCard}>
            <Text style={styles.txType}>{tx.type}</Text>
            <Text style={styles.txAmount}>${tx.amount.toLocaleString()}</Text>
            <Text style={styles.txDate}>{tx.date}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  closeBtn: {  position: "absolute",
    top: 32,
    right: 24,
    zIndex: 10,
    backgroundColor: "#F3F4F6",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",},
  closeText: { fontSize: 22,fontWeight: "bold", color: '#6B7280' },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#18181B', marginBottom: 18 },
  summaryCard: { backgroundColor: '#18181B', borderRadius: 14, padding: 18, marginBottom: 24 },
  label: { fontSize: 13, color: '#6B7280', marginTop: 8 },
  value: { fontSize: 16, color: '#fff', fontWeight: '600' },
  status: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  statusActive: { color: '#22C55E' },
  statusCompleted: { color: '#6B7280' },
  returns: { fontSize: 15, color: '#22C55E', fontWeight: '600', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 10 },
  txCard: { backgroundColor: '#18181B', borderRadius: 10, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txType: { fontSize: 15, color: '#fff', fontWeight: '600' },
  txAmount: { fontSize: 15, color: '#fff', fontWeight: '500' },
  txDate: { fontSize: 13, color: '#6B7280' },
});
export default InvestmentDetailsScreen; 