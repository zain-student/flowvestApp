import { InvestorDashboardStackParamList } from "@/navigation/InvestorStacks/InvestorDashboardStack";
import Colors from "@/shared/colors/Colors";
import { Button } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartnerDetail } from "@/shared/store/slices/investor/dashboard/addPartnerSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
type PartnerDetailParams = {
  PartnerDetailScreen: { id: number };
};
type Props = NativeStackNavigationProp<
  InvestorDashboardStackParamList,
  "AddPartner"
>;
export const PartnerDetailScreen = () => {
  const route =
    useRoute<RouteProp<PartnerDetailParams, "PartnerDetailScreen">>();
  const navigation = useNavigation<Props>();
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const { formatCurrency } = useCurrencyFormatter();
  const { selectedPartner, isLoading, error } = useAppSelector(
    (state) => state.partner,
  );
  useEffect(() => {
    dispatch(fetchPartnerDetail(id));
  }, [dispatch, id]);
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
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
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={styles.email}>Email: {partner.email}</Text>
          </View>
          <View style={styles.assetBadge}>
            <Text style={styles.assetBadgeText}>
              {partner.status?.charAt(0).toUpperCase()}
              {partner.status?.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.email}>Phone: {partner.phone || "N/A"}</Text>
      </View>

      {/* Company Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Company Information</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detail}>{partner.company?.name}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detail}>{partner.company?.phone || "N/A"}</Text>
        </View>
        {/* <Text style={styles.detail}>📂 {partner.company.type}</Text> */}
        <Text style={styles.sectionTitle}>Address:</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text style={styles.detailLabel}>Country:</Text>
          <Text style={styles.detail}>
            {partner.company?.address?.country || "N/A"}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text style={styles.detailLabel}>City:</Text>
          <Text style={styles.detail}>
            {partner.company?.address?.city || "N/A"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text style={styles.detailLabel}>Street:</Text>
          <Text style={styles.detail}>
            {partner.company?.address?.street || "N/A"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text style={styles.detailLabel}>Zip:</Text>
          <Text style={styles.detail}>
            {partner.company?.address?.zip || "N/A"}
          </Text>
        </View>
      </View>

      {/* Financials */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <Text style={styles.detail}>
          Total Investments: {formatCurrency(partner.total_invested ?? 0)}
        </Text>
        <Text style={styles.detail}>
          Active Investments: {partner.active_investments}
        </Text>
        <Text style={styles.detail}>
          Total Earned: {formatCurrency(partner.total_earned ?? 0)}
        </Text>
        <Text style={styles.detail}>
          ROI %: {partner.roi_percentage?.toFixed(1)}
        </Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.actionButton, { marginRight: 8 }]}
            onPress={() =>
              navigation.navigate("PartnerInvestment", { id: partner.id })
            }
          >
            <Ionicons name="eye-outline" size={20} />
            <Text style={styles.buttonText}>Investments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { marginLeft: 8 }]}
            onPress={() =>
              navigation.navigate("PartnerPayout", { id: partner.id })
            }
          >
            <Ionicons name="eye-outline" size={20} />
            <Text style={styles.buttonText}>Payouts</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { marginTop: 8 }]}
          onPress={() =>
            navigation.navigate("PartnerPerformance", { id: partner.id })
          }
        >
          <Ionicons name="stats-chart-outline" size={20} />
          <Text style={styles.buttonText}>Performance</Text>
        </TouchableOpacity>
      </View>

      {/* Action Button */}
      <Button
        title="Edit Partner"
        loading={isLoading}
        onPress={() => navigation.navigate("AddPartner", { partner })}
      />
    </ScrollView>
  );
};

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
  status: {
    // backgroundColor: Colors.statusbg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  active: {
    backgroundColor: Colors.statusbg,
    color: Colors.activeStatus,
  },
  inactive: {
    backgroundColor: Colors.inActiveStatusBg,
    color: Colors.inActiveStatus,
  },
  assetBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 19,
    backgroundColor: Colors.statusbg,
  },
  assetBadgeText: {
    fontSize: 11,
    // fontFamily: "Inter_600SemiBold",
    color: Colors.statusText,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.secondary,
  },
  detailLabel: { fontSize: 14, color: Colors.gray, marginBottom: 4 },
  detail: { fontSize: 14, color: Colors.secondary, marginBottom: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,

    shadowColor: "#000",
    shadowOpacity: 0.12, // increase for visibility
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,

    elevation: 1.5, // Android shadow
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  // buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
