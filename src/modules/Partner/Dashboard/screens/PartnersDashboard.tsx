import { DashboardLayout } from '@/modules/Common/components/DashboardLayout';
import Colors from '@/shared/colors/Colors';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AssignedInvestments } from '../components/AssignedInvestments';
import { PayoutDueThisWeek } from '../components/PayoutDueThisWeek';
import { RecentPaymentsLog } from '../components/RecentPaymentsLog';
export const PartnersDashboard = () => {
  return (
    <DashboardLayout>
      <ScrollView contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        <AssignedInvestments />
        <View style={styles.innerContainer} >
        <PayoutDueThisWeek />
        <RecentPaymentsLog/>
        </View>
      </ScrollView>
   </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    // paddingHorizontal: 0,
    paddingBottom: 80,
    backgroundColor: Colors.background,
  },
  innerContainer:{
    paddingHorizontal:8
  }
 
});

export default PartnersDashboard;

