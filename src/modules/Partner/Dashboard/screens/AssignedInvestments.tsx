// import { PartnerDashboardStackParamList } from '@/navigation/PartnerStacks/PartnerDashboardStack';
// import Colors from '@/shared/colors/Colors';
// import { Feather } from '@expo/vector-icons';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// const  stats= {
//     total_investments: 12,
//     active_investments: 5,
//     total_payouts_scheduled: 3,
//     overdue_payouts: 1,
//     total_partners: 4,
//     total_payout_amount: 8200,
//     this_month_payouts: 2,
//     roi_average: 8.2,
// }
// type Props = NativeStackScreenProps<PartnerDashboardStackParamList, 'AssignedInvestments'>;
// export const AssignedInvestments = () => {
//   return (
//     <View>
//       {/* Replace with FlatList or cards */}
//        {/* Main Balance Card (dark, rounded) */}
//         <View style={styles.balanceCardDark}>
//           <Text style={styles.balanceLabelDark}>Total Investment</Text>
//           <Text style={styles.balanceValueDark}>
//             ${stats.total_payout_amount.toLocaleString()}
//           </Text>
//           <Text style={styles.balanceChangeDark}>
//             +${(11915.28).toLocaleString()}{" "}
//             <Text
//               style={{
//                 color: Colors.gray,
//                 fontWeight: "400",
//                 fontFamily: "Inter_400Regular",
//               }}
//             >
//               than last month
//             </Text>
//           </Text>
//           <View style={styles.balanceActionsRow}>
//             {/* <TouchableOpacity style={styles.balanceActionBtnDark}>
//               <Feather name="plus" size={18} color="#fff" />
//               <Text style={styles.balanceActionTextDark}>Top Up</Text>
//             </TouchableOpacity> */}
//             <TouchableOpacity style={styles.balanceActionBtnDark}>
//               <Feather name="arrow-up-right" size={18} color="#fff" />
//               <Text style={styles.balanceActionTextDark}>Assigned Investments</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//     </View>
//   );
// };

// const styles=StyleSheet.create({
//    balanceCardDark: {
//     backgroundColor: Colors.secondary,
//     borderBottomLeftRadius: 32,
//     borderBottomRightRadius: 32,
//     padding: 24,
//     paddingTop: 36,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     elevation: 6,
//     marginBottom: 18,
//   },
//   balanceLabelDark: {
//     color: Colors.gray,
//     fontSize: 15,
//     fontFamily: "Inter_400Regular",
//   },
//   balanceValueDark: {
//     color: Colors.white,
//     fontSize: 36,
//     fontFamily: "Inter_700Bold",
//     fontWeight: "700",
//     marginVertical: 2,
//   },
//   balanceChangeDark: {
//     color: Colors.green,
//     fontSize: 14,
//     fontFamily: "Inter_600SemiBold",
//     // marginBottom: 8
//   },
//   balanceActionsRow: { flexDirection: "row", marginTop: 18 },
//   balanceActionBtnDark: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.darkButton,
//     borderRadius: 18,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     marginRight: 12,
//   },
//   balanceActionTextDark: {
//     color: Colors.white,
//     fontSize: 15,
//     fontFamily: "Inter_600SemiBold",
//     marginLeft: 7,
//   },
// })
// // export default AssignedInvestments;

import { PartnerDashboardStackParamList } from "@/navigation/PartnerStacks/PartnerDashboardStack";
import Colors from "@/shared/colors/Colors";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";

const assignedInvestments = [
  {
    id: "1",
    name: "Tech Growth Fund",
    amount: 5000,
    status: "Active",
    assignedDate: "Jul 10, 2025",
    roi: "8.5%",
  },
  {
    id: "2",
    name: "Green Energy Venture",
    amount: 3000,
    status: "Pending",
    assignedDate: "Jul 20, 2025",
    roi: "7.2%",
  },
  {
    id: "3",
    name: "Healthcare Portfolio",
    amount: 4500,
    status: "Active",
    assignedDate: "Jul 1, 2025",
    roi: "9.1%",
  },
  {
    id: "4",
    name: "Tech Growth Fund",
    amount: 5000,
    status: "Active",
    assignedDate: "Jul 10, 2025",
    roi: "8.5%",
  },
  {
    id: "5",
    name: "Green Energy Venture",
    amount: 3000,
    status: "Pending",
    assignedDate: "Jul 20, 2025",
    roi: "7.2%",
  },
  {
    id: "6",
    name: "Healthcare Portfolio",
    amount: 4500,
    status: "Active",
    assignedDate: "Jul 1, 2025",
    roi: "9.1%",
  },
];

type Props = NativeStackScreenProps<
  PartnerDashboardStackParamList,
  "AssignedInvestments"
>;

export const AssignedInvestments = ({ navigation }: Props) => {
  const renderItem = ({ item }: { item: (typeof assignedInvestments)[0] }) => (
    <View style={styles.investmentCard}>
      <View style={styles.investmentRow}>
        <Text style={styles.title}>{item.name}</Text>
        {/* (item.status) */}
        <Text
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === "Active" ? Colors.green : Colors.gray,
            },
          ]}
        >
          {item.status}
        </Text>
      </View>
      <Text style={styles.investmentMeta}>
        Assigned: {item.assignedDate} | ROI: {item.roi}
      </Text>
      <Text style={styles.investmentAmount}>
        ${item.amount.toLocaleString()}
      </Text>
    </View>
  );

  return (
    
    <View style={styles.container}>
    <StatusBar
        barStyle="light-content" // or "dark-content"
        backgroundColor="#000" // set to match your theme
      />
      {/* <Text style={styles.title}>Assigned Investments</Text> */}
      <FlatList
        data={assignedInvestments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.secondary,
    alignSelf: "center",
    marginBottom: 16,
    fontFamily: "Inter_700Bold",
  },
  investmentCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  statusBadge: {
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    overflow: "hidden",
  },
  investmentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  investmentMeta: {
    color: Colors.gray,
    fontSize: 13,
    marginTop: 6,
    fontFamily: "Inter_400Regular",
  },
  investmentAmount: {
    color: Colors.secondary,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
    fontFamily: "Inter_700Bold",
  },
});

// export default AssignedInvestments;
