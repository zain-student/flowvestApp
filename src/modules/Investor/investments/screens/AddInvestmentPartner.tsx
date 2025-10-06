// import { useAppDispatch } from "@/shared/store";
// import { addInvestmentPartner } from "@/shared/store/slices/investmentSlice";

// const dispatch = useAppDispatch();

// const handleAddPartner = (investmentId: number, formData: any) => {
//   dispatch(addInvestmentPartner({ investmentId, partnerData: formData }))
//     .unwrap()
//     .then(() => {
//       console.log("Partner added successfully!");
//     })
//     .catch((err) => {
//       console.error("Error adding partner:", err);
//     });
// };
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Partner {
  id: number;
  name: string;
  email: string;
}

const mockPartners: Partner[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Sarah Khan", email: "sarah@example.com" },
  { id: 3, name: "Ali Raza", email: "ali@example.com" },
];

export default function AddInvestmentPartner() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [investedAmount, setInvestedAmount] = useState("");
  const [investmentNotes, setInvestmentNotes] = useState("");
  const [invitationMessage, setInvitationMessage] = useState("");
  const [minExperience, setMinExperience] = useState("");

  return (
    <View style={styles.container}>


      {/* Partner List */}
      <Text style={styles.sectionTitle}>Available Partners</Text>
      <FlatList
        data={mockPartners}
        keyExtractor={(item) => item.id.toString()}
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
        ListHeaderComponent={
          // {/* Investment Details Card */ }
          < View style={styles.card}>
        <Text style={styles.cardTitle}>Investment Details</Text>
        <Text style={styles.detail}>Name: Startup Equity Fund</Text>
        <Text style={styles.detail}>Total: $50,000</Text>
        <Text style={styles.detail}>Open Slots: 5</Text>
    </View>
        }
      />

{/* Form for adding partner details */ }
{
  selectedPartner && (
    <View style={styles.formCard}>
      <Text style={styles.cardTitle}>Add Partner Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Invested Amount"
        keyboardType="numeric"
        value={investedAmount}
        onChangeText={setInvestedAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Investment Notes"
        value={investmentNotes}
        onChangeText={setInvestmentNotes}
      />

      <TextInput
        style={styles.input}
        placeholder="Invitation Message"
        value={invitationMessage}
        onChangeText={setInvitationMessage}
      />

      <TextInput
        style={styles.input}
        placeholder="Min Experience (e.g. 2 years)"
        value={minExperience}
        onChangeText={setMinExperience}
      />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Partner</Text>
      </TouchableOpacity>
    </View>
  )
}
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },
  detail: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: "#111827",
  },
  partnerItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedPartner: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  partnerName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  partnerEmail: {
    fontSize: 13,
    color: "#6B7280",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 80,
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
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
