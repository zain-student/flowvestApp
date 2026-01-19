import { RootStackParamList } from "@/navigation/RootNavigator";
import Colors from "@/shared/colors/Colors";
import { selectHasUnreadNotifications } from "@/shared/store/slices/profile/notificationSlice";
import { Feather } from "@expo/vector-icons";
import { logoutUser } from "@modules/auth/store/authSlice";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "@store/index";
import React from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
  headerStyle?: "dark" | "light";
}

const Avatar = ({ showDot }: { showDot: boolean }) => (
  <View style={styles.avatar}>
    <Feather name="bell" size={20} color="#fff" />
    {showDot && <View style={styles.notificationDot} />}
  </View>
);

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const hasUnread = useAppSelector(selectHasUnreadNotifications);
  const dispatch = useAppDispatch();
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
        // navigation.navigate("Profile"); // Or use navigation.reset if you have a root stack
      } catch (error) {
        Alert.alert("Error", "Failed to sign out. Please try again.");
      }
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content" // or "dark-content"
        backgroundColor={Colors.secondary} // set to match your theme
        translucent={true}
      />
      <View style={styles.header}>
        <Text style={styles.logo}>FlowVest</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
          >
            <Avatar showDot={hasUnread} />
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
  notificationDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fb2e2e",
  },
});
