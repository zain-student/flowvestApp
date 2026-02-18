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
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Colors from "../../../../shared/colors/Colors";
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
  const [search, setSearch] = useState("");

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
      description: editingPartner?.description || "",
      // notes: editingPartner?.notes || "",
    },
  });
  useEffect(() => {
    if (editingPartner) {
      reset({
        name: editingPartner.name,
        email: editingPartner.email,
        phone: editingPartner.phone,
        status: editingPartner.status,
        description: editingPartner.description,
        // notes: editingPartner.notes,
      });
      setModalVisible(true); // ✅ open modal automatically
    }
  }, [editingPartner, reset]);
  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);
  const filteredPartners = useMemo(
    () =>
      partners
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [partners, search],
  );

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
          reset();
          setCustomPassword("");
          setIsAutoPassword(true);
          setIsEmailEnabled(false);
          setModalVisible(false);
        })
        .catch((error: any) => {
          // ToastAndroid.show(`Error: ${error}`, ToastAndroid.LONG);
          ToastAndroid.show(
            "Failed: " + (error?.message || "Unknown error"),
            ToastAndroid.LONG,
          );
        });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView contentContainerStyle={styles.content}> */}
      {/* <Text style={styles.title}>Choose a Partner</Text> */}

      {/* Partner Dropdown */}
      {/* {isLoading && <Text>Loading partners...</Text>}
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
        /> */}
      {/* --- Inline Partner Search + List --- */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Choose a Partner</Text>
        <Text style={styles.sectionSubtitle}>
          Select an existing partner or add a new one.
        </Text>

        <TextInput
          placeholder="Search partner..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={Colors.primary}
            style={{ marginTop: 2 }}
          />
        ) : (
          // <Text>Loading partners...</Text>
          <FlatList
            data={filteredPartners}
            keyExtractor={(item) => item.id.toString()}
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.partnerOption}
                onPress={() => {
                  setSelectedPartner(item);
                  navigation.navigate("PartnerDetail", { id: item.id });
                }}
              >
                <Text style={styles.partnerName}>{item.name}</Text>
                <View style={{ flexDirection: "row", marginTop: 4 }}>
                  <Ionicons name="mail-outline" size={14} color={Colors.gray} />
                  <Text style={styles.Text}>Email: </Text>
                  <Text style={styles.subText}>{item.email ?? "N/A"}</Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 4 }}>
                  <Ionicons name="call-outline" size={14} color={Colors.gray} />
                  <Text style={styles.Text}>Phone: </Text>
                  <Text style={styles.subText}>{item.phone ?? "N/A"}</Text>
                </View>
                {/* <Text style={styles.subText}>Phone: {item.phone ?? "N/A"}</Text> */}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No matching partners</Text>
            }
          />
        )}
      </View>
      <View style={styles.modal}>
        <Modal
          visible={modalVisible}
          animationType="fade"
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
                      placeholder="Enter full name"
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
                      autoCapitalize="none"
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
                      placeholder="Enter Phone number"
                      value={field.value}
                      onChangeText={field.onChange}
                      error={errors.phone?.message as string | undefined}
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
                  name="description"
                  render={({ field }) => (
                    <Input
                      label="Description"
                      placeholder="Enter description"
                      value={field.value}
                      onChangeText={field.onChange}
                      error={errors.description?.message as string | undefined}
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
                <Text
                  style={{
                    color: "red",
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
                <Button
                  title={editingPartner ? "Update" : "Add"}
                  disabled={isLoading}
                  onPress={handleSubmit(onSubmit)}
                  style={{ marginTop: 0, backgroundColor: Colors.secondary }}
                />
              </ScrollView>
            </View>
          </ScrollView>
        </Modal>
      </View>
      {/* </ScrollView> */}

      {/* Floating Button to open modal */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.fab}
      >
        <Ionicons name="add" size={24} color={"white"} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddPartnerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingBottom: 60,
  },
  content: {
    padding: 20,
  },
  sectionCard: {
    // backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 60,
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
    // elevation: 3,
  },
  sectionTitle: { fontSize: 20, fontWeight: "600", color: Colors.secondary },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  partnerOption: {
    padding: 10,
    borderWidth: 1.5,
    marginBottom: 6,
    borderRadius: 8,
    borderColor: Colors.borderColor,
  },
  partnerName: { fontWeight: "600", color: Colors.secondary },
  Text: { marginLeft: 4, fontSize: 12, color: Colors.secondary },
  subText: { fontSize: 12, color: Colors.gray },
  emptyText: { textAlign: "center", color: Colors.gray, paddingVertical: 20 },

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
    maxHeight: "83%",
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
  fab: {
    position: "absolute",
    right: 24,
    bottom: 60,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});
