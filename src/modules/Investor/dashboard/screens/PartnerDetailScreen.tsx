import { InvestorDashboardStackParamList } from "@/navigation/InvestorStacks/InvestorDashboardStack";
import Colors from "@/shared/colors/Colors";
import { Button } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerDetail } from "@/shared/store/slices/addPartnerSlice";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
type PartnerDetailParams = {
  PartnerDetailScreen: { id: number };
};
type Props = NativeStackNavigationProp<InvestorDashboardStackParamList, "AddPartner">;
export const PartnerDetailScreen = () => {
  const route = useRoute<RouteProp<PartnerDetailParams, "PartnerDetailScreen">>();
  const navigation = useNavigation<Props>();
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const { selectedPartner, isLoading, error } = useAppSelector((state) => state.partner);
  useEffect(() => {
    dispatch(fetchPartnerDetail(id));
  }, [dispatch, id])
  if (isLoading) {
    return <ActivityIndicator size="large" color="#131314ff" />;
  }

  if (error) {
    return <Text style={{ padding: 20, color: "red" }}>{error}</Text>;
  }

  if (!selectedPartner) {
    return <Text style={{ padding: 20 }}>No partner data available.</Text>;
  }

  const partner = selectedPartner;
  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.card}>
        <Text style={styles.name}>{partner.name}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.email}>Email: {partner.email}</Text>
          <Text style={[styles.status, partner.status === "active" ? styles.active : styles.inactive]}>
            {partner.status?.charAt(0).toUpperCase()}{partner.status?.slice(1)}
          </Text>
        </View>
        <Text style={styles.email}>Phone: {partner.phone || "N/A"}</Text>
      </View>

      {/* Company Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Company Information</Text>
        <Text style={styles.detail}>Name: {partner.company?.name}</Text>
        {/* <Text style={styles.detail}>📂 {partner.company.type}</Text> */}
        <Text style={styles.detail}>Address: {partner.company?.address || "N/A"}</Text>
      </View>

      {/* Financials */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <Text style={styles.detail}>Total Investments: {partner.total_invested}</Text>
        <Text style={styles.detail}>Active Investments: {partner.active_investments}</Text>
        <Text style={styles.detail}>Total Earned: {partner.total_earned}</Text>
        <Text style={styles.detail}>ROI %: {partner.roi_percentage}</Text>
        <View style={{flexDirection:'row',
          justifyContent:"space-between", marginBottom:4
        }}>
        <TouchableOpacity style={styles.investmentButton} onPress={()=>navigation.navigate("PartnerInvestment",{ id :partner.id})}>
          <Ionicons name="eye-outline" size={23} />
          <Text style={{ marginLeft:5,fontSize: 16,fontWeight:"500" }}>
            View Investments
          </Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.payoutButton} onPress={()=>navigation.navigate("PartnerPayout",{id:partner.id})}>
          <Ionicons name="eye-outline" size={23} />
          <Text style={{ marginLeft:5,fontSize: 16, fontWeight:"500" }}>
            View Payouts
          </Text>
        </TouchableOpacity>
        </View>
         <TouchableOpacity style={styles.performanceButton} onPress={()=>navigation.navigate("PartnerPerformance",{id:partner.id})}>
          <Ionicons name="eye-outline" size={23} />
          <Text style={{ marginLeft:5,fontSize: 16, fontWeight:"500" }}>
            Performance
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Button */}
      <Button
        title="Edit Partner"
        loading={isLoading}
        onPress={() =>
          navigation.navigate("AddPartner", { partner })
          // console.log("Editing partner.....")
        }
      />
      {/* <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Partner</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 12 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  name: { fontSize: 20, fontWeight: "700", color: Colors.secondary },
  email: { fontSize: 14, color: Colors.gray, marginVertical: 4 },
  status: { fontWeight: "600", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, alignSelf: "flex-start" },
  active: { backgroundColor: Colors.activeStatusBg, color: Colors.activeStatus },
  inactive: { backgroundColor: Colors.inActiveStatusBg, color: Colors.inActiveStatus },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: Colors.secondary },
  detail: { fontSize: 14, color: Colors.secondary, marginBottom: 4 },
  activityRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  activityText: { fontSize: 14, color: Colors.secondary },
  investmentButton: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    width: "46%",
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  payoutButton: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    width: "46%",
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
   performanceButton: {
    flexDirection: 'row',
    alignSelf:"center",
    backgroundColor: Colors.background,
    width: "46%",
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:3,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,

  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
