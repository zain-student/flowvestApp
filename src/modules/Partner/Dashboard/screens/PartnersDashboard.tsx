import { DashboardLayout } from '@/modules/Investor/dashboard/components/DashboardLayout';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { AssignedInvestments } from '../components/AssignedInvestments';
import { PayoutDueThisWeek } from '../components/PayoutDueThisWeek';
import { RecentPaymentsLog } from '../components/RecentPaymentsLog';
export const PartnersDashboard = () => {
  return (
    <DashboardLayout>
      <ScrollView style={styles.container}>
        <AssignedInvestments />
        <PayoutDueThisWeek />
        <RecentPaymentsLog />
      </ScrollView>
   </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default PartnersDashboard;