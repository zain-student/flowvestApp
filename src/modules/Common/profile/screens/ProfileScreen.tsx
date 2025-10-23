import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image, Modal, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { ProfileStackParamList } from "@/navigation/ProfileStacks/ProfileStack";
import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import {
  getCurrentUser,
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

  //  Refetch user when screen is focused
  useFocusEffect(
    useCallback(() => {
      dispatch(getCurrentUser());
    }, [dispatch])
  );

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
                navigation.navigate("NotificationSettings");
              } else {
                Alert.alert("Access Denied", "You do not have permission to access Notification Settings.");
              }
            }}
          />
          {user?.roles?.includes("admin") &&
          <SettingsButton
            // icon="document-text-outline"
            icon="megaphone-outline"
            label="Notifications Templates"
            onPress={() => navigation.navigate("NotificationsTemplates")}
          />}
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
