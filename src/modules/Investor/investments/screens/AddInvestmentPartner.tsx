import { InvestmentStackParamList } from "@/navigation/InvestorStacks/InvestmentStack";
import Colors from "@/shared/colors/Colors";
import { Button } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import {
  fetchPartners,
  invitePartnerToInvestment,
} from "@/shared/store/slices/investor/dashboard/addPartnerSlice";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

type AddPartnerRouteProp = RouteProp<InvestmentStackParamList, "AddPartner">;

interface Partner {
  id: number;
  name: string;
  email: string;
}

export default function AddInvestmentPartner() {
  const route = useRoute<AddPartnerRouteProp>();
  const { id } = route.params;
  const dispatch = useAppDispatch();

  const { partners, isLoading } = useAppSelector((state) => state.partner);
  const { investments } = useAppSelector((state) => state.investments);
  const { formatCurrency } = useCurrencyFormatter();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [investedAmount, setInvestedAmount] = useState("");
  const [investmentNotes, setInvestmentNotes] = useState("");
  const [invitationMessage, setInvitationMessage] = useState("");
  const [minExperience, setMinExperience] = useState("");

  // Get investment details
  const investment = useMemo(
    () => investments.find((inv) => inv.id === id),
    [investments, id],
  );

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  const handleAddPartner = async () => {
    if (
      !selectedPartner
      // || !investedAmount
    ) {
      ToastAndroid.show("Please select a partner first!.", ToastAndroid.SHORT);
      return;
    }

    const result = await dispatch(
      invitePartnerToInvestment({
        investmentId: id,
        partnerId: selectedPartner.id,
        investedAmount: parseFloat(investedAmount),
        investmentNotes,
        invitationMessage,
        minExperience,
      }),
    );

    if (invitePartnerToInvestment.fulfilled.match(result)) {
      ToastAndroid.show("Partner invited successfully!", ToastAndroid.SHORT);
      resetForm();
    } else {
      ToastAndroid.show(
        (result.payload as string) || "Failed to invite partner",
        ToastAndroid.SHORT,
      );
    }
  };

  const resetForm = () => {
    setSelectedPartner(null);
    setInvestedAmount("");
    setInvestmentNotes("");
    setInvitationMessage("");
    setMinExperience("");
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.green} />
      </View>
    );
  }

  if (!investment) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ color: Colors.gray, fontSize: 16 }}>
          Investment not found.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={partners}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Investment Details</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 4 }}>
              <View>
                <Text style={styles.label}>Name: </Text>
                <Text style={styles.value}>{investment.name}</Text>
              </View>
              <View>
                <Text style={styles.label}>Status: </Text>
                <Text style={styles.value}>{investment.status}</Text>
              </View>

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 4 }}>
              <View>
                <Text style={styles.label}>Expected Return:{" "}</Text>
                <Text style={styles.value}> {parseFloat(investment.expected_return_rate).toFixed(1)}%</Text>
              </View>
              <View>
                <Text style={styles.label}>Total:{" "}</Text>
                <Text style={styles.value}>{formatCurrency(
                  Number(
                    investment.type === "solo"
                      ? investment.initial_amount
                      : investment.current_total_invested,
                  ),
                )}</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.partnerItem,
              selectedPartner?.id === item.id && styles.selectedPartner,
            ]}
            onPress={() => setSelectedPartner(item)}
          >
            <Text style={styles.partnerName}>{item.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="mail-outline" size={13} color={Colors.gray} />
              <Text style={styles.partnerEmail}>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No partner available.</Text>
          </View>
        }
      />

      {selectedPartner && (
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Add Partner Details</Text>

          <TextInput
            style={styles.input}
            placeholder="Investment Amount(Optional)"
            keyboardType="numeric"
            value={investedAmount}
            onChangeText={setInvestedAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Investment Notes(Optional)"
            value={investmentNotes}
            onChangeText={setInvestmentNotes}
          />
          <TextInput
            style={styles.input}
            placeholder="Invitation Message(Optional)"
            value={invitationMessage}
            onChangeText={setInvitationMessage}
          />
          <TextInput
            style={styles.input}
            placeholder="Min Experience(Optional)"
            value={minExperience}
            onChangeText={setMinExperience}
          />
          <Button
            title="Add Partner"
            // icon={<Ionicons name="add-circle-outline" size={20} color={Colors.white} />}
            disabled={isLoading}
            onPress={handleAddPartner}
            style={styles.joinButton}
            textStyle={styles.joinText}
            variant="primary"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    // paddingBottom: 80,
    backgroundColor: "#F9FAFB",
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: {
    paddingBottom: 75
  },
  card: {
    // marginHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: "#E6EDFF",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.gray,
    marginBottom: 8,
  },
  label: { fontSize: 12, fontWeight: '500', lineHeight: 18, color: Colors.gray, marginBottom: 4 },
  value: { color: Colors.secondary, fontWeight: "600", fontSize: 14 },
  detail: {
    color: Colors.secondary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
  },
  partnerItem: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: "#E6EDFF",
  },
  selectedPartner: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  partnerName: {
    color: Colors.secondary,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  partnerEmail: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4
  },
  emptyState: { justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#6B7280" },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
    fontSize: 14,
  },
  joinButton: {
    paddingVertical: 10,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    // paddingVertical: 10,
    borderRadius: 10,
  },

  joinText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },

});
