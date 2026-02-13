// src/screens/PartnerDropdownScreen.tsx
import { addPartnerSchema } from "@/modules/auth/utils/authValidation";
import { InvestorDashboardStackParamList } from "@/navigation/InvestorStacks/InvestorDashboardStack";
import { Button, Input } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import {
  addPartners,
  fetchPartners,
  Partner,
  updatePartner,
} from "@/shared/store/slices/investor/dashboard/addPartnerSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Colors from "../../../../shared/colors/Colors";
import { PartnerDropdown } from "../components/PartnerDropdown";
type AddPartnerRouteProp = RouteProp<
  InvestorDashboardStackParamList,
  "AddPartner"
>;
type Props = NativeStackNavigationProp<
  InvestorDashboardStackParamList,
  "AddPartner"
>;
export const AddPartnerScreen = () => {
  const dispatch = useAppDispatch();
  const route = useRoute<AddPartnerRouteProp>();
  const editingPartner = route.params?.partner;
  const { partners, isLoading, error } = useAppSelector(
    (state) => state.partner,
  );
  const [selectedPartner, setSelectedPartner] = useState<Partner | undefined>();
  const [modalVisible, setModalVisible] = useState(!!editingPartner);
  const navigation = useNavigation<Props>();
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isAutoPassword, setIsAutoPassword] = useState(true);
  const [customPassword, setCustomPassword] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addPartnerSchema),
    defaultValues: {
      name: editingPartner?.name || "",
      email: editingPartner?.email || "",
      phone: editingPartner?.phone || "",
      status: editingPartner?.status || "active",
      company_name: editingPartner?.company_name || "",
      company_type: editingPartner?.company_type || "private",
      address: editingPartner?.company?.address || "",
      description: editingPartner?.description || "",
      // initial_investment: editingPartner?.total_invested || "",
      notes: editingPartner?.notes || "",
    },
  });
  useEffect(() => {
    if (editingPartner) {
      reset({
        name: editingPartner.name,
        email: editingPartner.email,
        phone: editingPartner.phone,
        status: editingPartner.status,
        company_name: editingPartner.company?.name,
        company_type: editingPartner.company_type,
        address: editingPartner.company?.address,
        description: editingPartner.description,
        // initial_investment: editingPartner.total_invested,
        notes: editingPartner.notes,
      });
      setModalVisible(true); // ✅ open modal automatically
    }
  }, [editingPartner, reset]);
  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  const onSubmit = (data: any) => {
    if (editingPartner) {
      dispatch(updatePartner({ id: editingPartner.id, updatedData: data }))
        .unwrap()
        .then(() => {
          ToastAndroid.show("Partner Updated Successfully", ToastAndroid.SHORT);
          setModalVisible(false);
          navigation.goBack();
        })
        .catch((error: any) => {
          ToastAndroid.show("Update failed: " + error, ToastAndroid.LONG);
        });
    } else {
      const finalData = {
        ...data,
        send_email: isEmailEnabled,
        generate_password: isAutoPassword,
        password: !isAutoPassword ? customPassword : undefined,
      };
      dispatch(addPartners(finalData)) // from addPartnerSlice
        .unwrap()
        .then(() => {
          // ToastAndroid.show("Partner created successfully", ToastAndroid.SHORT);
          console.log("Adding partner Data:", data);
          setModalVisible(false);
        })
        .catch((error: any) => {
          // ToastAndroid.show(`Error: ${error}`, ToastAndroid.LONG);
          ToastAndroid.show(
            "Failed: " + (error.message || "Unknown error"),
            ToastAndroid.LONG,
          );
        });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Choose a Partner</Text>

        {/* Partner Dropdown */}
        {isLoading && <Text>Loading partners...</Text>}
        <PartnerDropdown
          label="Select Partner"
          partners={partners}
          selectedPartner={selectedPartner}
          onSelect={(partner) => {
            navigation.navigate("PartnerDetail", {
              id: partner.id,
            });

            setSelectedPartner(partner);
          }}
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
            <ScrollView
              contentContainerStyle={styles.modalOverlay}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "500",
                      margin: 5,
                      alignSelf: "center",
                    }}
                  >
                    {editingPartner ? "Update Partner" : " Add New Partner"}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => {
                      if (editingPartner) {
                        setModalVisible(false);
                        navigation.goBack();
                      } else {
                        setModalVisible(false);
                      }
                    }}
                  >
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>

                  {/* Input fields (UI only, no state) */}
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        label="Name"
                        placeholder="Enter your full name"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={errors.name?.message as string | undefined}
                        required
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <Input
                        label="Email"
                        placeholder="Enter email"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={errors.email?.message as string | undefined}
                        required
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <Input
                        label="Phone"
                        placeholder="Enter your Phone number"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={errors.phone?.message as string | undefined}
                        required
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="status"
                    render={({ field, fieldState }) => {
                      const [open, setOpen] = React.useState(false);
                      const [items, setItems] = React.useState([
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                      ]);

                      return (
                        <View style={{ marginBottom: 16, zIndex: 1000 }}>
                          <Text
                            style={{
                              marginBottom: 4,
                              fontWeight: "500",
                              color: Colors.secondary,
                            }}
                          >
                            Status *
                          </Text>
                          <DropDownPicker
                            open={open}
                            value={field.value}
                            items={items}
                            setOpen={setOpen}
                            setValue={(callback) =>
                              field.onChange(callback(field.value))
                            }
                            setItems={setItems}
                            placeholder="Select Status"
                            listMode="SCROLLVIEW"
                            dropDownDirection="BOTTOM"
                            style={{
                              borderColor: fieldState.error ? "red" : "#ccc",
                              borderRadius: 8,
                            }}
                            dropDownContainerStyle={{
                              borderColor: "#ccc",
                            }}
                          />
                          {fieldState.error?.message && (
                            <Text style={{ color: "red", marginTop: 4 }}>
                              {fieldState.error.message}
                            </Text>
                          )}
                        </View>
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name="company_name"
                    render={({ field }) => (
                      <Input
                        label="Company Name"
                        placeholder="Enter company name"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={
                          errors.company_name?.message as string | undefined
                        }
                        required
                      />
                    )}
                  />
                  {/* Company Type */}
                  <Controller
                    control={control}
                    name="company_type"
                    render={({ field, fieldState }) => {
                      const [open, setOpen] = React.useState(false);
                      const [items, setItems] = React.useState([
                        { label: "Private", value: "private" },
                        { label: "Individual", value: "individual" },
                        { label: "Silent", value: "silent" },
                        { label: "Holding", value: "holding" },
                      ]);

                      return (
                        <View style={{ marginBottom: 16, zIndex: 2000 }}>
                          <Text
                            style={{
                              marginBottom: 4,
                              fontWeight: "500",
                              color: Colors.secondary,
                            }}
                          >
                            Company Type *
                          </Text>
                          <DropDownPicker
                            open={open}
                            value={field.value}
                            items={items}
                            setOpen={setOpen}
                            setValue={(callback) =>
                              field.onChange(callback(field.value))
                            }
                            setItems={setItems}
                            placeholder="Select Company Type"
                            listMode="SCROLLVIEW"
                            dropDownDirection="BOTTOM"
                            style={{
                              borderColor: fieldState.error ? "red" : "#ccc",
                              borderRadius: 8,
                            }}
                            dropDownContainerStyle={{
                              borderColor: "#ccc",
                            }}
                          />
                          {fieldState.error?.message && (
                            <Text style={{ color: "red", marginTop: 4 }}>
                              {fieldState.error.message}
                            </Text>
                          )}
                        </View>
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <Input
                        label="Company Address"
                        placeholder="Enter Company Address"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={errors.address?.message as string | undefined}
                        required
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Input
                        label="Description"
                        placeholder="Enter description"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={
                          errors.description?.message as string | undefined
                        }
                        multiline
                      />
                    )}
                  />
                  {/* <Controller
                    control={control}
                    name="initial_investment"
                    render={({ field }) => (
                      <Input
                        label="Initial Investment"
                        placeholder="Enter initial investment"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={errors.initial_investment?.message as string | undefined}
                        required
                      />
                    )}
                  /> */}
                  <Controller
                    control={control}
                    name="notes"
                    render={({ field }) => (
                      <Input
                        label="Notes"
                        placeholder="Enter Notes"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={errors.notes?.message as string | undefined}
                        multiline
                      />
                    )}
                  />

                  {/* --- Account Credentials Section --- */}
                  {!editingPartner && (
                    <View
                      style={{
                        marginTop: 10,
                        marginBottom: 20,
                        backgroundColor: Colors.lightGray,
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: Colors.secondary,
                          marginBottom: 12,
                        }}
                      >
                        Account Credentials
                      </Text>

                      {/* Send Email with Credentials */}
                      <View style={{ marginBottom: 16 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <View style={{ flex: 1, paddingRight: 8 }}>
                            <Text
                              style={{
                                color: Colors.secondary,
                                fontWeight: "500",
                              }}
                            >
                              Send Email with Credentials
                            </Text>
                            <Text
                              style={{
                                color: Colors.gray,
                                fontSize: 13,
                                marginTop: 2,
                              }}
                            >
                              If enabled, the partner will receive an email with
                              their login credentials.
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={{
                              width: 46,
                              height: 28,
                              backgroundColor: isEmailEnabled
                                ? Colors.primary
                                : "#ccc",
                              borderRadius: 14,
                              justifyContent: "center",
                              paddingHorizontal: 3,
                            }}
                            onPress={() => setIsEmailEnabled(!isEmailEnabled)}
                          >
                            <View
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                backgroundColor: Colors.white,
                                alignSelf: isEmailEnabled
                                  ? "flex-end"
                                  : "flex-start",
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {/* Auto-Generate Password */}
                      <View style={{ marginBottom: 16 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <View style={{ flex: 1, paddingRight: 8 }}>
                            <Text
                              style={{
                                color: Colors.secondary,
                                fontWeight: "500",
                              }}
                            >
                              Auto-Generate Password
                            </Text>
                            <Text
                              style={{
                                color: Colors.gray,
                                fontSize: 13,
                                marginTop: 2,
                              }}
                            >
                              If enabled, a secure random password will be
                              generated. If disabled, you can set a custom
                              password below.
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={{
                              width: 46,
                              height: 28,
                              backgroundColor: isAutoPassword
                                ? Colors.primary
                                : "#ccc",
                              borderRadius: 14,
                              justifyContent: "center",
                              paddingHorizontal: 3,
                            }}
                            onPress={() => setIsAutoPassword(!isAutoPassword)}
                          >
                            <View
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                backgroundColor: Colors.white,
                                alignSelf: isAutoPassword
                                  ? "flex-end"
                                  : "flex-start",
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Custom Password Input */}
                      {!isAutoPassword && (
                        <View style={{ marginBottom: 8 }}>
                          <Input
                            label="Custom Password"
                            placeholder="Enter password (min 8 characters)"
                            secureTextEntry
                            value={customPassword}
                            onChangeText={setCustomPassword}
                          />
                        </View>
                      )}

                      <Text
                        style={{
                          color: Colors.warning || "#D97706",
                          fontSize: 12,
                          marginTop: 4,
                        }}
                      >
                        ⚠️ Make sure to securely share this password with the
                        partner if email is not being sent.
                      </Text>
                    </View>
                  )}
                  {/* --- End Account Credentials Section --- */}

                  <Button
                    title={editingPartner ? "Update" : "Add"}
                    onPress={handleSubmit(onSubmit)}
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
    maxHeight: "80%",
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
