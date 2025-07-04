import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DashboardLayout } from '../../dashboard/components/DashboardLayout';

const mockAssets = [
  { id: 1, name: 'Tech Growth Fund', value: 12000, growth: '+8.2%' },
  { id: 2, name: 'Real Estate Trust', value: 5000, growth: '+2.1%' },
  { id: 3, name: 'Green Energy Bonds', value: 3000, growth: '+5.7%' },
];

export const PortfolioScreen: React.FC = () => {
  return (
    <DashboardLayout>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Net Worth</Text>
          <Text style={styles.cardValue}>$25,000.00</Text>
          <Text style={styles.cardSubtitle}>Asset Allocation</Text>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartBar} />
          <Text style={styles.chartLabel}>Performance (Mock Chart)</Text>
        </View>
        <Text style={styles.sectionTitle}>Your Assets</Text>
        {mockAssets.map(asset => (
          <View key={asset.id} style={styles.assetCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.assetName}>{asset.name}</Text>
              <Text style={styles.assetValue}>${asset.value.toLocaleString()}</Text>
            </View>
            <Text style={styles.assetGrowth}>{asset.growth}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>⬇️</Text>
        <Text style={styles.fabLabel}>Export Report</Text>
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
  chartContainer: { alignItems: 'center', marginBottom: 18 },
  chartBar: { width: '90%', height: 80, backgroundColor: '#FDE68A', borderRadius: 16, marginBottom: 8 },
  chartLabel: { color: '#F59E42', fontWeight: '600', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 10 },
  assetCard: {
    backgroundColor: '#F9FAFB', borderRadius: 10, padding: 16, marginBottom: 14, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1,
  },
  assetName: { fontSize: 16, fontWeight: '600', color: '#2563EB' },
  assetValue: { fontSize: 15, color: '#111827', marginTop: 2 },
  assetGrowth: { fontSize: 15, color: '#22C55E', fontWeight: '600' },
  fab: {
    position: 'absolute', right: 24, bottom: 32, backgroundColor: '#2563EB', borderRadius: 24, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  fabIcon: { fontSize: 22, color: '#fff', marginRight: 6 },
  fabLabel: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
export default PortfolioScreen; 