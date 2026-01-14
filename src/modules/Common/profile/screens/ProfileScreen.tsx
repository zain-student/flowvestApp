import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import { ProfileStackParamList } from "@/navigation/ProfileStacks/ProfileStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import {
  getCurrencies,
  getCurrentUser,
  getPreferences,
  updatePreferences,
  uploadUserAvatar,
} from "@/shared/store/slices/profile/profileSlice";
import { DashboardLayout } from "../../components/DashboardLayout";

//  Constants
const AVATAR_SIZE = Dimensions.get("window").width * 0.32;
const IMAGE_PICKER_OPTIONS = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1] as [number, number],
  quality: 0.7,
};

type ProfileNavProp = NativeStackNavigationProp<ProfileStackParamList>;

export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<ProfileNavProp>();
  const { user, isLoading } = useAppSelector((state) => state.profile);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);

  const { currencies, isCurrenciesLoading } = useAppSelector(
    (state) => state.profile
  );
  const pullToRefresh = () => {
    dispatch(getCurrentUser());
  };
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        if (!user) {
          // if Redux has no user, load from API
          await dispatch(getCurrentUser());
        }
        setInitialLoadDone(true);
      };
      loadUser();
    }, [dispatch, user])
  );
  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getCurrencies());
  }, [dispatch]);
  //  Image picker handler
  const handlePickImage = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert(
          "Permission required",
          "Please allow access to your photo gallery."
        );
      }

      const result =
        await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
      if (result.canceled || !result.assets?.length) return;

      const imageUri = result.assets[0].uri;
      setImageLoading(true);

      await dispatch(uploadUserAvatar(imageUri)).unwrap();
      await dispatch(getCurrentUser()).unwrap();

      Alert.alert("Success", "Your profile photo has been updated!");
    } catch (err) {
      console.error("Avatar upload failed:", err);
      Alert.alert("Error", "Failed to upload avatar. Please try again.");
    } finally {
      setImageLoading(false);
    }
  }, [dispatch]);

  const getInitials = (name?: string) =>
    name ? name.charAt(0).toUpperCase() : "U";

  //  Conditional states
  const showLoader = isLoading || (!user && !imageLoading);
  const handleCurrencySelect = (currency: any) => {
    setSelectedCurrency(currency);
    setCurrencyDropdownOpen(false);

    dispatch(
      updatePreferences({
        display: { currency: currency.code },
      })
    )
      .unwrap()
      .then(() => {
        ToastAndroid.show("Currency updated successfully!", ToastAndroid.SHORT);
        dispatch(getPreferences());
      })
      .catch(() => {
        ToastAndroid.show(
          "Failed to update currency preference.",
          ToastAndroid.SHORT
        );
      });
  };

  return (
    <DashboardLayout>
      {isImageModalVisible && (
        <Modal
          visible={isImageModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalCloseArea}
              onPress={() => setImageModalVisible(false)}
              activeOpacity={1}
            >
              <Image
                source={{ uri: `${user?.avatar}?t=${Date.now()}` }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={pullToRefresh}
          // tintColor={}
          />
        }
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity
              onPress={() => user?.avatar && setImageModalVisible(true)}
              activeOpacity={user?.avatar ? 0.8 : 1}
            >
              {showLoader ? (
                <View style={styles.avatarPlaceholder}>
                  <ActivityIndicator size="small" color={Colors.green} />
                </View>
              ) : user?.avatar ? (
                <Image
                  source={{ uri: `${user.avatar}?t=${Date.now()}` }}
                  style={styles.avatarImage}
                  onLoadEnd={() => setImageLoading(false)}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={handlePickImage}
            >
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileRole}>{user?.roles?.[0]}</Text>
        </View>

        {/*  Account Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          <InfoRow label="Email" value={user?.email ?? "--"} />
          {user?.roles?.includes("admin") ? (<TouchableOpacity onPress={() => navigation.navigate("CompanyInfo")}>
            <InfoRow label="Company" value={user?.company?.name ?? "--"} />
          </TouchableOpacity>) :
            (<InfoRow label="Company" value={user?.company?.name ?? "--"} />)}
          {/* Currency Preference */}
          <TouchableOpacity
            style={styles.preferenceRow}
            onPress={() => setCurrencyDropdownOpen(true)}
          >
            <Text style={styles.prefLabel}>Preferred Currency</Text>
            <View style={styles.prefValue}>
              <Text>{selectedCurrency?.code}</Text>
              <Ionicons name="chevron-forward" size={18} />
            </View>
          </TouchableOpacity>
          <Modal
            visible={currencyDropdownOpen}
            animationType="slide"
            transparent
            onRequestClose={() => setCurrencyDropdownOpen(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalOverlay}
              onPress={() => setCurrencyDropdownOpen(false)}
            >
              {/* Stop propagation for modal content */}
              <TouchableOpacity
                activeOpacity={1}
                style={styles.modalSheet}
                onPress={() => { }}
              >
                <Text style={styles.modalTitle}>Select Currency</Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {currencies.map((c) => (
                    <TouchableOpacity
                      key={c.code}
                      style={styles.currencyItem}
                      onPress={() => handleCurrencySelect(c)}
                    >
                      <Text style={styles.currencyText}>
                        {c.icon} {c.name}
                      </Text>
                      <Text style={styles.currencyCode}>{c.code}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>


        </View>
        {/*  Settings */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <SettingsButton
            icon="person-outline"
            label="Update Profile"
            onPress={() => navigation.navigate("UpdateProfile")}
          />
          <SettingsButton
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => navigation.navigate("ChangePassword")}
          />
          <SettingsButton
            icon="notifications-outline"
            label="Notifications"
            onPress={() => {
              if (user?.roles?.includes("admin")) {
                navigation.navigate("NotificationButtons");
              } else {
                Alert.alert(
                  "Access Denied",
                  "You do not have permission to access Notification Settings."
                );
              }
            }}
          />
        </View>

        {/*  Support Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About & Support</Text>
          <InfoRow label="App Version" value="1.0.0" />
          <SettingsButton
            icon="call-outline"
            label="Contact Support"
            onPress={() =>
              Alert.alert("Support", "Contact us at support@flowvest.com")
            }
          />
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

export default ProfileScreen;

// Reusable Components
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);
const SettingsButton = ({ icon, label, onPress }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.settingsRow} onPress={onPress}>
    <Ionicons name={icon} size={20} color={Colors.primary} />
    <Text style={styles.settingsLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
  </TouchableOpacity>
);
// Styles
const styles = StyleSheet.create({
  scrollContent: { padding: 20, backgroundColor: Colors.background, paddingBottom: 100 },
  avatarImage: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center", shadowColor: "#000000ff", shadowOpacity: 0.08, shadowRadius: 6, elevation: 4, },
  avatarPlaceholder: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, backgroundColor: Colors.gray, alignItems: "center", justifyContent: "center", },
  avatarText: { fontSize: 40, color: "#fff", },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center", },
  modalCloseArea: { flex: 1, justifyContent: "center", alignItems: "center", width: "100%", },
  fullscreenImage: { width: "95%", height: "95%", borderRadius: 10, },
  profileHeader: { alignItems: "center", paddingVertical: 30, },
  avatarWrapper: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, alignItems: "center", justifyContent: "center", },
  editAvatarBtn: { position: "absolute", bottom: 5, right: 0, backgroundColor: Colors.primary, width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", },
  profileName: { fontSize: 20, fontWeight: "700", marginTop: 14, color: Colors.secondary, },
  profileRole: { fontSize: 13, color: Colors.gray, marginTop: 4, },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 18, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: Colors.secondary, marginBottom: 10, },
  infoRow: { marginBottom: 12, },
  infoLabel: { fontSize: 12, color: Colors.gray, },
  infoValue: { fontSize: 15, fontWeight: "500", color: Colors.secondary, marginTop: 4, },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end", },
  modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 16, paddingHorizontal: 20, paddingBottom: 30, maxHeight: "70%", },
  modalTitle: { fontSize: 17, fontWeight: "700", color: Colors.secondary, marginBottom: 16, textAlign: "center", },
  currencyItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", },
  currencyText: { fontSize: 15, color: Colors.secondary, },
  currencyCode: { fontSize: 13, color: Colors.gray, },
  preferenceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 4, marginTop: 12, borderBottomWidth: 1, borderBottomColor: "#E5E7EB", },
  prefLabel: { fontSize: 14, color: Colors.gray, },
  prefValue: { flexDirection: "row", alignItems: "center", },
  prefValueText: { fontSize: 15, fontWeight: "600", color: Colors.secondary, marginRight: 6, },
  settingsRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  settingsLabel: { flex: 1, marginLeft: 12, fontSize: 15, color: Colors.secondary, },
});
