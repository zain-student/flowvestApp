import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { removeInvestmentPartner } from "@/shared/store/slices/investor/investments/investmentSlice";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export const RemovePartnerButton = ({ item }:any) => {
  const dispatch = useAppDispatch();
  const { partners } = useAppSelector((state:any) => state.investments);
  const isLoading = partners.isLoading;

  const [isModalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState("Partner requested withdrawal");

  const handleConfirmRemove = () => {
    setModalVisible(false);
    dispatch(
      removeInvestmentPartner({
        investmentId: item.investment_id,
        partnerId: item.user.id,
        reason,
      })
    );
  };

  return (
    <>
      {item.invitation_status === "accepted" && (
        <TouchableOpacity
          style={[styles.removeBtn, isLoading && { opacity: 0.6 }]}
          disabled={isLoading}
          onPress={() => setModalVisible(true)}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={18} color={Colors.white} />
              <Text style={styles.btnText}>Remove</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Confirmation Modal */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Partner Removal</Text>
            <Text style={styles.modalSubtitle}>
              Please enter a reason for removing this partner:
            </Text>

            <TextInput
              style={styles.input}
              value={reason}
              onChangeText={setReason}
              multiline
              placeholder="Enter reason..."
              placeholderTextColor="#888"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmBtn]}
                onPress={handleConfirmRemove}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Text style={styles.confirmText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-end",
    backgroundColor: Colors.error,
  },
  btnText: {
    color: Colors.white,
    fontSize: 14,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  cancelText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  confirmText: {
    color: Colors.white,
    fontWeight: "600",
  },
});
