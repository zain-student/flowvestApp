import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerDetail } from "@/shared/store/slices/addPartnerSlice";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
type PartnerDetailParams = {
  PartnerDetailScreen: { id: number };
};

export const PartnerDetailScreen=()=> {
  const route = useRoute<RouteProp<PartnerDetailParams, "PartnerDetailScreen">>();
  const { id } = route.params;
const dispatch= useAppDispatch();
const {selectedPartner,isLoading,error}=useAppSelector((state)=>state.partner);
useEffect(()=>{
    dispatch(fetchPartnerDetail(id));
},[dispatch,id])
if (isLoading) {
    return <ActivityIndicator size="large" color="#131314ff" />;
  }
   
  if (error) {
    return <Text style={{ padding: 20, color: "red" }}>{error}</Text>;
  }

  if (!selectedPartner) {
    return <Text style={{ padding: 20 }}>No partner data available.</Text>;
  }

const partner=selectedPartner;
  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.card}>
        <Text style={styles.name}>{partner.name }</Text>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}> 
        <Text style={styles.email}>Email: {partner.email}</Text>
        <Text style={[styles.status, partner.status === "active" ? styles.active : styles.inactive]}>
          {partner.status}
        </Text>
        </View>
        <Text style={styles.email}>Phone: {partner.phone||"N/A"}</Text>
      </View>

      {/* Company Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Company Information</Text>
        <Text style={styles.detail}>Name: {partner.company?.name}</Text>
        {/* <Text style={styles.detail}>📂 {partner.company.type}</Text> */}
        <Text style={styles.detail}>Address: {partner.company?.address||"N/A"}</Text>
      </View>

      {/* Financials */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <Text style={styles.detail}>Total Investments: {partner.total_invested}</Text>
        <Text style={styles.detail}>Active Investments: {partner.active_investments}</Text>
        <Text style={styles.detail}>Total Earned: {partner.total_earned}</Text>
        <Text style={styles.detail}>ROI %: {partner.roi_percentage}</Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Partner</Text>
      </TouchableOpacity>
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
  status: {  fontWeight: "600", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, alignSelf: "flex-start" },
  active: { backgroundColor: "#d1f7c4", color: "#1a7f37" },
  inactive: { backgroundColor: "#ffe0e0", color: "#a00" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: Colors.secondary },
  detail: { fontSize: 14, color: Colors.secondary, marginBottom: 4 },
  activityRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  activityText: { fontSize: 14, color: Colors.secondary },
 
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
