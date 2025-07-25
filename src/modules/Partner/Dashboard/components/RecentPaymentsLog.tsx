import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from "../../../../shared/colors/Colors";

const  recent_payments= [
    {
      id: 1,
      icon: "arrow-down-right",
      text: "Payout received",
      date: "Jul 1",
      amount: "+$1,200",
    },
     {
      id: 5,
      icon: "arrow-down-right",
      text: "Payout received",
      date: "Jul 1",
      amount: "+$1,200",
    },
    {
      id: 2,
      icon: "arrow-up-right",
      text: 'Invested in "Tech Fund"',
      date: "Jun 28",
      amount: "-$500",
    },
     {
      id: 3,
      icon: "arrow-up-right",
      text: 'Invested in "Tech Fund"',
      date: "Jun 28",
      amount: "-$500",
    },
     {
      id: 4,
      icon: "arrow-up-right",
      text: 'Invested in "Tech Fund"',
      date: "Jun 28",
      amount: "-$500",
    },
  ];

export const RecentPaymentsLog = () => {
  return (
    // <View style={styles.container}> 
    <>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Recent Payments</Text>
      </View>
      <ScrollView style={styles.payments}>
      <View style={styles.activityList}>
        {recent_payments.length === 0 ? (
          <Text style={styles.emptyText}>No recent activities.</Text>
        ) : (
          recent_payments.map((act) => (
            
            <View key={act.id} style={styles.activityItem}>
              <Feather
                name={act.icon as any}
                size={20}
                color={Colors.secondary}
                style={styles.activityIcon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText}>{act.text}</Text>
                <Text style={styles.activityDate}>{act.date}</Text>
              </View>
              <Text style={styles.activityAmount}>{act.amount}</Text>
            </View>
          ))
        )}
      </View>
        </ScrollView>
        </>
    // </View>
  );
};
const styles =StyleSheet.create({
  container:{

  },
payments:{
  // borderWidth:1,
  height:"40%",
  // marginBottom:20
},
sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    color: "colors.secondary",
  },
  activityList: { paddingHorizontal: 8 },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
    backgroundColor: Colors.white,
    borderRadius: 8,
 
  },
  activityIcon: { marginRight: 12 },
  activityText: {
    color: "colors.secondary",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
  activityDate: {
    color: Colors.gray,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  activityAmount: {
    color: "colors.secondary",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
  },
emptyText: {
    color: Colors.gray,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingVertical: 16,
  },

 
});

export default RecentPaymentsLog;

