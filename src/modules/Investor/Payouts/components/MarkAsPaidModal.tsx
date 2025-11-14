import Colors from "@/shared/colors/Colors";
import { useCurrencyFormatter } from "@/shared/utils/useCurrencyFormatter";
import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
interface MarkAsPaidModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  payoutSummary?: {
    investmentName: string;
    participantName: string;
    amount: number;
    scheduledDate: string;
  };
  isBulk?: boolean;
}

export const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({
  visible,
  onClose,
  onSubmit,
  payoutSummary,
  isBulk,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const { formatCurrency } = useCurrencyFormatter();
// 👇 Reset form fields when modal opens/closes
useEffect(() => {
  if (!visible) {
    setPaymentMethod("Bank Transfer");
    setReferenceNumber("");
    setNotes("");
    setIsFocus(false);
  }
}, [visible]);

  const paymentOptions = [
    { label: "Bank Transfer", value: "Bank Transfer" },
    { label: "Cheque", value: "Cheque" },
    { label: "Credit Card", value: "Credit Card" },
    { label: "PayPal", value: "PayPal" },
  ];

  const handleSubmit = () => {
    if (!referenceNumber.trim()) {
      Alert.alert("Please enter reference number");
      return;
    }

    onSubmit({
      status: "paid",
      payment_method: paymentMethod,
      reference_number: referenceNumber,
      notes,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.header}>Process Payment</Text>

          {/* Payout Summary */}
          {!isBulk && payoutSummary &&(
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Payout Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Investment:</Text>
              <Text style={styles.value}>{payoutSummary.investmentName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Participant:</Text>
              <Text style={styles.value}>{payoutSummary.participantName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>{formatCurrency(payoutSummary.amount)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Scheduled Date:</Text>
              <Text style={styles.value}>{payoutSummary.scheduledDate}</Text>
            </View>
          </View>
         ) }

          {/* Payment Method */}
          <Text style={styles.inputLabel}>Payment Method</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: Colors.primary }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={paymentOptions}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select method" : "..."}
            value={paymentMethod}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setPaymentMethod(item.value);
              setIsFocus(false);
            }}
          />

          {/* Reference Number */}
          <Text style={styles.inputLabel}>Reference Number</Text>
          <TextInput
            value={referenceNumber}
            onChangeText={setReferenceNumber}
            placeholder="Enter reference number (e.g PAY-2025-001)"
            style={styles.input}
          />

          {/* Notes */}
          <Text style={styles.inputLabel}>Payment Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter any payment notes or confirmation details"
            style={[styles.input, { height: 80 }]}
            multiline
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Process Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.secondary,
    marginBottom: 12,
  },
  summaryBox: {
    backgroundColor: "#F0F6FF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  summaryTitle: {
    fontWeight: "600",
    fontSize: 15,
    color: Colors.secondary,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    color: Colors.secondary,
  },
  value: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "600",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.secondary,
    marginTop: 8,
  },
  dropdown: {
    height: 50,
    borderColor: Colors.gray || "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#888",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: Colors.secondary,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  cancelBtn: {
    backgroundColor: Colors.gray,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  cancelText: {
    color: Colors.white,
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: "#16A34A",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  submitText: {
    color: Colors.white,
    fontWeight: "600",
  },
});
