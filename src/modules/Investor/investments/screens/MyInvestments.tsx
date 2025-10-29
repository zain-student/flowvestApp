import { InvestmentStackParamList } from "@/navigation/InvestorStacks/InvestmentStack";
import Colors from "@/shared/colors/Colors";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";

const myInvestments = [
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
  InvestmentStackParamList,
  "MyInvestments"
>;

export const MyInvestments = ({ navigation }: Props) => {
  const renderItem = ({ item }: { item: (typeof myInvestments)[0] }) => (
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
        data={myInvestments}
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

// export default MyInvestments;
