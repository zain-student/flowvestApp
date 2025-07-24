import type { AppTabParamList } from "@/navigation/AppTabNavigator";
import Colors from "@/shared/colors/Colors";
import { Feather } from "@expo/vector-icons";
import { logoutUser } from "@modules/auth/store/authSlice";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "@store/index";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface DashboardLayoutProps {
  children: React.ReactNode;
  headerStyle?: "dark" | "light";
}

const Avatar = () => (
  <View style={styles.avatar}>
    <Feather name="user" size={20} color="#fff" />
  </View>
);

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const navigation =
    useNavigation<BottomTabNavigationProp<AppTabParamList, "Dashboard">>();
  const dispatch = useAppDispatch();

  // Sign out handler
  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: () => signOut(),
        style: "destructive",
      },
    ]);
    const signOut = async () => {
    try {
      await dispatch(logoutUser());
      // await storage.clear(); 
      navigation.navigate("Profile"); // Or use navigation.reset if you have a root stack
    } catch (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>FlowVest</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Avatar />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutBtn}
            accessibilityLabel="Sign Out"
          >
            <Feather name="log-out" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: Colors.secondary, 
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  logo: { fontSize: 22, fontWeight: "bold", color: Colors.white },
  headerRight: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { color: Colors.white, fontWeight: "bold", fontSize: 16 },
  signOutBtn: { padding: 6 },
  signOutText: { fontSize: 22, color: "#EF4444" },
});
