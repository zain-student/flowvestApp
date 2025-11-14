import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image, Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";

import { ProfileStackParamList } from "@/navigation/ProfileStacks/ProfileStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import {
  getCurrencies,
  getCurrentUser,
  getPreferences,
  updatePreferences,
  uploadUserAvatar
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

  const { currencies, isCurrenciesLoading } = useAppSelector((state) => state.profile);
  const pullToRefresh = () => {
    dispatch(getCurrentUser());
  }
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
  }, [dispatch])
  //  Image picker handler
  const handlePickImage = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert(
          "Permission required",
          "Please allow access to your photo gallery."
        );
      }

      const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
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

  //  Helper: show initials if no avatar
  const getInitials = (name?: string) => (name ? name.charAt(0).toUpperCase() : "U");

  //  Conditional states
  const showLoader = isLoading || (!user && !imageLoading);
  const handleCurrencySelect = (currency: any) => {
    setSelectedCurrency(currency);
    setCurrencyDropdownOpen(false);

    dispatch(
      updatePreferences({
        display: { currency: currency.code }
      })
    )
      .unwrap()
      .then(() => {
        ToastAndroid.show("Currency updated successfully!", ToastAndroid.SHORT);
        dispatch(getPreferences());
      })
      .catch(() => {
        ToastAndroid.show("Failed to update currency preference.", ToastAndroid.SHORT);
      });
  };

  return (
    <DashboardLayout>
      {
        isImageModalVisible && (
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
        )
      }
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
        {/* Avatar Section */}
        <View style={styles.container}>
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

          {/*  Camera Badge */}
          <TouchableOpacity
            onPress={handlePickImage}
            disabled={isLoading || imageLoading}
            style={styles.cameraBadge}
          >
            <Ionicons name="camera" size={18} color={Colors.white} />
          </TouchableOpacity>

          <Text style={styles.name}>{user?.name || "John Doe"}</Text>
          <Text style={styles.role}>{user?.roles?.[0] || "Investment Manager"}</Text>
        </View>

        {/*  Account Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          <InfoRow label="Email" value={user?.email ?? "--"} />
          <InfoRow label="Company" value={user?.company?.name ?? "--"} />

          {/* Currency Preference */}
          <View style={{ marginTop: 12 }}>
            <Text style={styles.infoLabel}>Preferred Currency</Text>

            {/* {isCurrenciesLoading ? (
              <ActivityIndicator size="small" color={Colors.green} />
            ) : ( */}
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownText}>
                {selectedCurrency
                  ? `${selectedCurrency.icon} ${selectedCurrency.name} (${selectedCurrency.code})`
                  : "Select Currency"}
              </Text>
              <Ionicons name="chevron-down" size={18} color={Colors.gray} />
            </TouchableOpacity>
            {/* )} */}

            {currencyDropdownOpen && (
              <View style={styles.dropdownList}>
                {currencies.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.dropdownItem}
                    onPress={() => handleCurrencySelect(c)}
                  >
                    <Text style={styles.dropdownItemText}>
                      {c.icon} {c.name} ({c.code})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
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
                Alert.alert("Access Denied", "You do not have permission to access Notification Settings.");
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
            onPress={() => Alert.alert("Support", "Contact us at support@flowvest.com")}
          />
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

export default ProfileScreen;

// Reusable Components
const InfoRow = React.memo(({ label, value }: { label: string; value: string }) => (
  <>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </>
));

const SettingsButton = React.memo(
  ({
    icon,
    label,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.buttonItem} onPress={onPress}>
      <Ionicons name={icon} color={Colors.white} size={20} />
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  )
);


// Styles
const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    backgroundColor: Colors.background,
    paddingBottom: 100,
  },
  container: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 40,
    color: "#fff",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  fullscreenImage: {
    width: "95%",
    height: "95%",
    borderRadius: 10,
  },

  cameraBadge: {
    position: "absolute",
    bottom: 70,
    right: Dimensions.get("window").width * 0.33 - 30,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 6,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.secondary,
    marginTop: 10,
  },
  role: {
    fontSize: 15,
    color: Colors.gray,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.secondary,
    marginTop: 8,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.gray,
    marginTop: 2,
  },
  dropdownContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownText: {
    fontSize: 15,
    color: Colors.secondary,
  },

  dropdownList: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginTop: 4,
    paddingVertical: 6,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  dropdownItemText: {
    fontSize: 15,
    color: Colors.secondary,
  },

  buttonItem: {
    flexDirection: "row",
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: "500",
    marginLeft: 8,
  },
});
