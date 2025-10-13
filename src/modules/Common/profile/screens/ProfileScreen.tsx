// import { getCurrentUser, selectIsLoading } from '@/modules/auth/store/authSlice';
import { ProfileStackParamList } from "@/navigation/ProfileStacks/ProfileStack";
import Colors from '@/shared/colors/Colors';
import { useAppDispatch, useAppSelector } from '@/shared/store';
import { getCurrentUser, uploadUserAvatar } from '@/shared/store/slices/profile/profileSlice';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DashboardLayout } from '../../components/DashboardLayout';
const mockUser = {
  name: 'Naomi Carter',
  role: 'Investment Manager',
  email: 'naomi@flowvest.com',
  company: 'FlowVest Inc.',
};
type ProfileNavProp = NativeStackNavigationProp<ProfileStackParamList>;
export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, error, isLoading, avatar } = useAppSelector((state) => state.profile); // adjust if it's profileSlice
  // const isLoading = useAppSelector(selectIsLoading);
  const navigation = useNavigation<ProfileNavProp>();
  useEffect(() => {
    dispatch(getCurrentUser());
  }, []);
  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const imageUri = result.assets[0].uri;
      dispatch(uploadUserAvatar(imageUri));
    }
  };

  return (
    <DashboardLayout>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <TouchableOpacity onPress={handlePickImage} disabled={isLoading}>
            {user?.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={18} color={Colors.white} />
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>{user?.name || "John Doe"}</Text>
          <Text style={styles.role}>{user?.roles?.[0] || "Investment Manager"}</Text>
        </View>
        {/* {user ? (<View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{
              user.name.charAt(0).toUpperCase()
            }</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.roles}</Text>
        </View>) : (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>J</Text>
            </View>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.role}>Investment Manager</Text>
          </View>
        )
        } */}
        {user ? (<View style={styles.card}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
          <Text style={styles.infoLabel}>Company</Text>
          <Text style={styles.infoValue}>{user.company?.name}</Text>
        </View>)
          :
          (<View style={styles.card}>
            <Text style={styles.sectionTitle}>Account Info</Text>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{mockUser.email}</Text>
            <Text style={styles.infoLabel}>Company</Text>
            <Text style={styles.infoValue}>{mockUser.company}</Text>
          </View>)
        }
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.buttonItem} onPress={() => navigation.navigate("UpdateProfile")}>
              <Ionicons name='person-outline' color={"gray"} size={20} />
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonItem} onPress={() => navigation.navigate("ChangePassword")}>
              <Ionicons name='lock-closed-outline' color={"gray"} size={20} />
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonItem}>
              <Ionicons name='notifications-outline' color={"gray"} size={20} />
              <Text style={styles.buttonText}> Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About & Support</Text>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.buttonItem}>
              <Ionicons name='call-outline' color={"gray"} size={20} />
              <Text style={styles.buttonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    // flex:1,
    backgroundColor: Colors.background, // Light background color
    paddingBottom: 100,
  },
  container: { alignItems: "center", marginTop: 30 },
  avatarImage: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 40, color: "#fff" },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    // backgroundColor: '#2563EB',
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 2,
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
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
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
  buttonGroup: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    paddingTop: 12,
    gap: 10,
  },
  buttonItem: {
    // backgroundColor: '#E5E7EB',
    flexDirection: 'row',
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 15,
    // color: Colors.secondary,
    color: Colors.white,
    fontWeight: '500',
    marginLeft: 5
  },
});

export default ProfileScreen;
