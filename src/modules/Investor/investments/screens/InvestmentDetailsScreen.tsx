import { InvestmentStackParamList } from "@/navigation/InvestorStacks/InvestmentStack";
import Colors from "@/shared/colors/Colors";
import { Button } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchInvestmentsById } from "@/shared/store/slices/investmentSlice";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
type Props = NativeStackScreenProps<
  InvestmentStackParamList,
  "InvestmentDetails"
>;
type RouteProps = RouteProp<InvestmentStackParamList, "InvestmentDetails">;
export const InvestmentDetailsScreen = ({ navigation }: Props) => {
  const route = useRoute<RouteProps>();
  const { id } =
    useRoute<RouteProp<InvestmentStackParamList, "InvestmentDetails">>().params;
  const dispatch = useAppDispatch();
  const investment = useAppSelector(
    (state) => state.investments.currentInvestment
  );
  useEffect(() => {
    dispatch(fetchInvestmentsById(String(id)));
  }, [id]);
  if (!investment) {
    return (
      <View>
        <Text>Investment not found.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={27} />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{investment.name}</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.label}>Amount Invested</Text>
          <Text style={styles.value}>
            ${investment.initial_amount ?? " --"}
          </Text>
          <Text style={styles.label}>Status</Text>
          <Text
            style={[
              styles.status,
              investment.status === "active"
                ? styles.statusActive
                : styles.statusCompleted,
            ]}
          >
            {investment.status.charAt(0).toUpperCase() +
              investment.status.slice(1)}
          </Text>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.returns}>{investment.type}</Text>
          <Text style={styles.label}>Returns</Text>
          <Text style={styles.returns}>
            {investment.expected_return_rate != null
              ? parseFloat(investment.expected_return_rate).toFixed(1)
              : "--"}
            %
          </Text>
          <Text style={styles.label}>Start Date</Text>
          <Text style={styles.value}>{investment.start_date}</Text>
          <Text style={styles.label}>End Date</Text>
          <Text style={styles.value}>{investment.end_date}</Text>
          <View style={styles.footer}>
            <Button
              title="Update"
              icon={<Ionicons name="create-outline" size={20} color={Colors.white} />}
              onPress={() => {
                console.log("Editing investment:", investment); // full object
                console.log("Editing investment ID:", investment.id); // just ID
                navigation.navigate("EditInvestments", {
                  id: investment.id,
                  mode: "edit"
                })

              }
              }
              style={styles.updateButton}
              textStyle={styles.footerButtonText}
              variant="primary"
            />
            <Button
              title="Delete"
              icon={<Ionicons name="trash-outline" size={20} color={Colors.white} />}
              onPress={() => console.log("Delete pressed")}
              style={styles.deleteButton}
              textStyle={styles.footerButtonText}
              variant="primary"
            />
          </View>
        </View>
        <Text style={styles.sectionTitle}>Transactions</Text>
        {investment?.recent_payouts?.map((tx: any) => (
          <View key={tx.id} style={styles.txCard}>
            <Text style={styles.txType}>Payout</Text>
            <Text style={styles.txAmount}>${tx.amount.toLocaleString()}</Text>
            <Text style={styles.txDate}>{tx.due_date}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingBottom: 100,
  },
  closeBtn: {
    position: "absolute",
    top: 32,
    right: 24,
    zIndex: 10,
    backgroundColor: Colors.white,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { fontSize: 22, fontWeight: "bold", color: Colors.secondary },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.secondary,
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
  },
  label: { fontSize: 13, color: Colors.gray, marginTop: 8 },
  value: { fontSize: 16, color: Colors.white, fontWeight: "600" },
  status: { fontSize: 15, fontWeight: "600", marginTop: 2 },
  statusActive: { color: Colors.green },
  statusCompleted: { color: Colors.gray },
  returns: {
    fontSize: 15,
    color: Colors.green,
    fontWeight: "600",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 10,
  },
  txCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txType: { fontSize: 15, color: Colors.white, fontWeight: "600" },
  txAmount: { fontSize: 15, color: Colors.white, fontWeight: "500" },
  txDate: { fontSize: 13, color: Colors.gray },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    borderTopWidth: 0.2,
    borderTopColor: Colors.gray,
    paddingTop: 12,
  },

  updateButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#3B82F6", // Blue
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#EF4444", // Red
  },
  footerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
// export default InvestmentDetailsScreen;
