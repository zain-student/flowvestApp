import { InvestmentStackParamList } from "@/navigation/InvestorStacks/InvestmentStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartners, invitePartnerToInvestment } from "@/shared/store/slices/investor/dashboard/addPartnerSlice";
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
  View
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

  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [investedAmount, setInvestedAmount] = useState("");
  const [investmentNotes, setInvestmentNotes] = useState("");
  const [invitationMessage, setInvitationMessage] = useState("");
  const [minExperience, setMinExperience] = useState("");

  // Get investment details
  const investment = useMemo(
    () => investments.find((inv) => inv.id === id),
    [investments, id]
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
      })
    );

    if (invitePartnerToInvestment.fulfilled.match(result)) {
      ToastAndroid.show("Partner invited successfully!", ToastAndroid.SHORT);
      resetForm();
    } else {
      ToastAndroid.show(
        result.payload as string || "Failed to invite partner",
        ToastAndroid.SHORT
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
        ListHeaderComponent={
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Investment Details</Text>
            <Text style={styles.detail}>Name: {investment.name}</Text>
            <Text style={styles.detail}>Total: ${investment.type==="solo"?investment.initial_amount:investment.current_total_invested}</Text>
            <Text style={styles.detail}>Status: {investment.status}</Text>
            <Text style={styles.detail}>
              Expected Return: {parseFloat(investment.expected_return_rate).toFixed(1)}%
            </Text>
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
            <Text style={styles.partnerEmail}>{item.email}</Text>
          </TouchableOpacity>
        )}
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
            placeholder="Min s Experience(Optional)"
            value={minExperience}
            onChangeText={setMinExperience}
          />

          <TouchableOpacity
            style={[styles.addButton, isLoading && { opacity: 0.6 }]}
            disabled={isLoading}
            onPress={handleAddPartner}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Add Partner</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16,paddingBottom:80, backgroundColor: "#F9FAFB" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8, color: "#111827" },
  detail: { fontSize: 14, color: "#374151", marginBottom: 4 },
  partnerItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedPartner: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  partnerName: { fontSize: 15, fontWeight: "500", color: "#111827" },
  partnerEmail: { fontSize: 13, color: "#6B7280" },
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
  addButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
