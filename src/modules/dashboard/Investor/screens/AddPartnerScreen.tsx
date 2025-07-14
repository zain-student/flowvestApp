// src/screens/PartnerDropdownScreen.tsx

import { Button, Input } from "@/shared/components/ui";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../../../shared/colors/Colors";
import { PartnerDropdown } from "../../../../shared/components/ui/PartnerDropdown"; // Adjust path if needed
type Partner = {
  id: string;
  name: string;
};

export const AddPartnerScreen = () => {
  const [selectedPartner, setSelectedPartner] = useState<Partner>();
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [send_invitation, setSendInvitation] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    // role: "Partner",
    // send_invitation: false,
    permissions: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const partners = [
    { id: "1", name: "Zain" },
    { id: "2", name: "Ali" },
    { id: "3", name: "Hassan" },
    { id: "4", name: "Ahmed" },
  ];
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const handleSelect = (partner: any) => {
    setSelectedPartner(partner);
    setError(""); // Clear error on selection
  };
  useEffect(() => {
    // Reset form data when the modal is closed
    if (!modalVisible) {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        // role: "Partner",
        // send_invitation: false,
        permissions: "",
      });
      setErrors({});
    }
    // Clear selected partner when the screen is mounted
    setSelectedPartner(undefined);
  }, [modalVisible]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Choose a Partner</Text>

        <PartnerDropdown
          label="Select Partner"
          required
          partners={partners}
          selectedPartner={selectedPartner}
          onSelect={handleSelect}
          error={error}
        />

        {selectedPartner && (
          <Text style={styles.selectedText}>
            Selected: {selectedPartner.name}
          </Text>
        )}
        <View style={styles.modal}>
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setModalVisible(false)}
            statusBarTranslucent={true}
          >
            <ScrollView
              contentContainerStyle={styles.modalOverlay}
              //  style={styles.modalOverlay}
            >
              <View style={styles.modalContainer}>
                <ScrollView>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "500",
                      margin: 5,
                      alignSelf: "center",
                    }}
                  >
                    Add New Partner
                  </Text>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                  <Input
                    label="First Name"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChangeText={(value) =>
                      handleInputChange("first_name", value)
                    }
                    error={errors.first_name}
                    required
                  />
                  <Input
                    label="Last Name"
                    placeholder="Enter your Last name"
                    value={formData.last_name}
                    onChangeText={(value) =>
                      handleInputChange("last_name", value)
                    }
                    error={errors.last_name}
                    required
                  />
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange("phone", value)}
                    error={errors.phone}
                    // required
                  />
                  <Text style={{ fontWeight: "500", color: Colors.secondary }}>
                    Role
                  </Text>
                  <View style={styles.pickerView}>
                    {/* <label style={{ color: Colors.text, fontWeight: "500" }}>
                  Role
                </label> */}
                    <Picker
                      selectedValue={selectedRole}
                      placeholder="Select Role"
                      onValueChange={(itemValue) => setSelectedRole(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Partner" value="Partner" />
                    </Picker>
                  </View>
                  {/* <Input
                label="Role"
                placeholder="Enter role"
                value={formData.role}
                onChangeText={(value) => handleInputChange("role", value)}
                error={errors.role}
                required 
              /> */}
                  <Input
                    label="Permissions"
                    placeholder="Enter permissions"
                    value={formData.permissions}
                    onChangeText={(value) =>
                      handleInputChange("permissions", value)
                    }
                    error={errors.permissions}
                    required
                  />
                  <Text style={{ fontWeight: "500", color: Colors.secondary }}>
                    Invitation
                  </Text>
                  <View style={styles.pickerView}>
                    {/* <label style={{ color: Colors.text, fontWeight: "500" }}>
                  Role
                </label> */}
                    <Picker
                      selectedValue={selectedRole}
                      placeholder="Send Invitation"
                      onValueChange={(itemValue) => setSelectedRole(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="No" value="No" />
                      <Picker.Item label="Yes" value="Yes" />
                    </Picker>
                  </View>
                  {/* <Input
                label="Send Invitation"
                placeholder="Send invitation"
                value={formData.send_invitation ? "Yes" : "No"}
                onChangeText={(value) =>
                  handleInputChange("send_invitation", value === "Yes")
                }
                error={errors.send_invitation}
                required
              /> */}
                  <Button
                    title="Add"
                    onPress={() => {
                      // Handle form submission logic here
                      console.log("Form Data:", formData);
                      setModalVisible(false);
                    }}
                    style={{
                      marginTop: 0,
                      backgroundColor: Colors.secondary,
                    }}
                  />
                  {/* <Pressable
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </Pressable> */}
                </ScrollView>
              </View>
            </ScrollView>
          </Modal>
        </View>
      </ScrollView>
      <Button
        title="+ Add New Partner"
        onPress={() => setModalVisible(true)}
        style={{
          marginBottom: 80,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
        // disabled={!selectedPartner}
      />
    </SafeAreaView>
  );
};
export default AddPartnerScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: Colors.secondary,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 7,
    zIndex: 10,
    backgroundColor: Colors.white,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { fontSize: 17, fontWeight: "bold", color: Colors.secondary },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  errorButton: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.error,
    fontWeight: "500",
  },
  modal: {
    maxHeight: "40%",
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
  },
  modalOverlay: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 16,
    // maxHeight: "80%",
  },
  pickerView: {
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    // paddingHorizontal: 12,
    // paddingVertical: 10,
    marginBottom: 10,
  },
  picker: {
    height: 49,
    width: "100%",
  },
  // closeBtn: {
  //   marginTop: 12,
  //   alignItems: "center",
  // },
  // closeText: {
  //   color: Colors.secondary,
  //   fontWeight: "500",
  // },
  searchInput: {
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
});
