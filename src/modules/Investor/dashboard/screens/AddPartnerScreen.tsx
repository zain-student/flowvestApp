// src/screens/PartnerDropdownScreen.tsx
import { Button, Input } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchPartners, Partner } from "@/shared/store/slices/addPartnerSlice";
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
import { PartnerDropdown } from "../components/PartnerDropdown";

export const AddPartnerScreen = () => {
  const dispatch = useAppDispatch();
  const { partners, isLoading, error } = useAppSelector((state) => state.partner);
  const [selectedPartner, setSelectedPartner] = useState<Partner | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  // const navigation = useNavigation<Props>();
  // Dummy partners for UI preview
  const partnersList = [
    { id: 1, name: "Zain", email: "zain@example.com" },
    { id: 2, name: "Ali", email: "ali@example.com" },
    { id: 3, name: "Hassan", email: "hassan@example.com" },
    { id: 4, name: "Ahmed", email: "ahmed@example.com" },
  ];
  useEffect(() => {
    dispatch(fetchPartners())
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Choose a Partner</Text>

        {/* Partner Dropdown */}
        {isLoading && <Text>Loading partners...</Text>}
        {error && <Text style={{ color: "red" }}>{error}</Text>}

        <PartnerDropdown
          label="Select Partner"
          partners={partners}
          selectedPartner={selectedPartner}
          onSelect={(p) => { setSelectedPartner(p) }}
          placeholder="Choose a partner"
        />

        <View style={styles.modal}>
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setModalVisible(false)}
            statusBarTranslucent={true}
          >
            <ScrollView contentContainerStyle={styles.modalOverlay}>
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

                  {/* Input fields (UI only, no state) */}
                  <Input label="First Name" placeholder="Enter first name" />
                  <Input label="Last Name" placeholder="Enter last name" />
                  <Input label="Email" placeholder="Enter email" />
                  <Input label="Phone Number" placeholder="Enter phone number" />

                  {/* Dropdowns */}
                  <Text style={{ fontWeight: "500", color: Colors.secondary }}>
                    Role
                  </Text>
                  <View style={styles.pickerView}>
                    <Picker selectedValue={"Partner"} style={styles.picker}>
                      <Picker.Item label="Partner" value="Partner" />
                    </Picker>
                  </View>

                  <Text style={{ fontWeight: "500", color: Colors.secondary }}>
                    Permissions
                  </Text>
                  <View style={styles.pickerView}>
                    <Picker selectedValue={"view_own_investments"} style={styles.picker}>
                      <Picker.Item label="View_Own_Investments" value="view_own_investments" />
                      <Picker.Item label="View_Payouts" value="view_payouts" />
                    </Picker>
                  </View>

                  <Text style={{ fontWeight: "500", color: Colors.secondary }}>
                    Invitation
                  </Text>
                  <View style={styles.pickerView}>
                    <Picker selectedValue={"Yes"} style={styles.picker}>
                      <Picker.Item label="Yes" value="Yes" />
                      <Picker.Item label="No" value="No" />
                    </Picker>
                  </View>

                  <Button
                    title="Add"
                    onPress={() => setModalVisible(false)}
                    style={{ marginTop: 0, backgroundColor: Colors.secondary }}
                  />
                </ScrollView>
              </View>
            </ScrollView>
          </Modal>
        </View>
      </ScrollView>

      {/* Floating Button to open modal */}
      <Button
        title="+ Add New Partner"
        onPress={() => setModalVisible(true)}
        style={{
          marginBottom: 80,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
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
  modal: {
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
    maxHeight: "75%",
  },
  pickerView: {
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    height: 51,
    width: "100%",
  },
});
