import { RootStackParamList } from "@/navigation/RootNavigator";
import Colors from "@/shared/colors/Colors";
import { selectHasUnreadNotifications } from "@/shared/store/slices/profile/notificationSlice";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "@store/index";
import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
  headerStyle?: "dark" | "light";
}

const Avatar = ({ showDot }: { showDot: boolean }) => (
  <View style={styles.avatar}>
    {/* <Feather name="bell" size={20} color={Colors.secondary} /> */}
    <Ionicons name="notifications-outline" size={22} color={Colors.secondary} />
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content" // or "dark-content"
        backgroundColor={Colors.background} // set to match your theme
        translucent={true}
      />
      <View style={styles.header}>
        <Text style={styles.logo}>Invstrhub</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
          >
            <Avatar showDot={hasUnread} />
          </TouchableOpacity>
          
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {children}
      </View>
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
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  logo: { fontSize: 20, fontWeight: "600", color: Colors.secondary },
  headerRight: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    // backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  avatarText: { color: Colors.secondary, fontWeight: "bold", fontSize: 16 },
  signOutBtn: { padding: 6 },
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
