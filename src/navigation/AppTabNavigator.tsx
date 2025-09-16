/**
 * App Tab Navigator
 * Main navigation for authenticated users with bottom tabs
 */

// import { DashboardScreen } from '@/modules/dashboard/Investor/screens/DashboardScreen';
// import { ProfileScreen } from "@/modules/Common/profile/screens";
import { PortfolioScreen } from "@/modules/Investor/portfolio/screens/PortfolioScreen";
import { InvestmentStack } from "@/navigation/InvestorStacks/InvestmentStack";
import { InvestorDashboardStack } from "@/navigation/InvestorStacks/InvestorDashboardStack";
import { PayoutStack } from "@/navigation/InvestorStacks/PayoutStack";
import { useAppSelector } from "@/shared/store";
import { Feather } from "@expo/vector-icons";
import { MyActivity } from "@modules/Partner/Activities/screens/MyActivity";
import { InvestmentDetails } from "@modules/Partner/InvestmentDetails/screens/InvestmentDetails";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAppDispatch } from "@store/index";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PartnerDashboardStack } from "./PartnerStacks/PartnerDashboardStack";
import { ProfileStack } from "./ProfileStacks/ProfileStack";

// Tab navigation types
export type AppTabParamList = {
  Dashboard: undefined;
  Investments: undefined;
  Payouts: undefined;
  Portfolio: undefined;
  Profile: undefined;
  PartnerDashboard: undefined;
  Activity:undefined;
  InvestmentDetails :undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const TAB_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  Dashboard: "home",
  Investments: "trending-up",
  Payouts: "dollar-sign",
  Portfolio: "folder",
  Profile: "user",
  Activity:"activity",
  InvestmentDetails:'trending-up'
};

const TAB_LABELS: Record<string, string> = {
  Dashboard: "Home",
  Investments: "Invest",
  Payouts: "Payouts",
  Portfolio: "Portfolio",
  Profile: "Profile",
  Activity:"MyActivities",
  InvestmentDetails:"InvestmentDetails"
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={
                descriptors[route.key].options.tabBarAccessibilityLabel
              }
              onPress={onPress}
              style={[
                styles.tabItem,
                focused ? styles.tabItemActive : styles.tabItemInactive,
              ]}
              activeOpacity={0.85}
            >
              <Feather
                name={TAB_ICONS[route.name]}
                size={20}
                color={focused ? "#18181B" : "#A1A1AA"}
                style={focused ? styles.iconActive : styles.icon}
              />
              {focused && (
                <Text
                  style={styles.label}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {TAB_LABELS[route.name]}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const AppTabNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  // const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // const isLoading = useAppSelector(selectIsLoading);
  const userRole = useAppSelector((state) => state.auth.user?.roles?.[0]); // e.g. 'user' or 'admin
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {userRole === "admin" && (
        <>
          <Tab.Screen name="Dashboard" component={InvestorDashboardStack} />
          <Tab.Screen name="Investments" component={InvestmentStack} />
          <Tab.Screen name="Payouts" component={PayoutStack} />
          <Tab.Screen name="Portfolio" component={PortfolioScreen} />
          <Tab.Screen name="Profile" component={ProfileStack} />
        </>
      )}
      {userRole === "user" && (
        <>
          <Tab.Screen name="Dashboard" component={PartnerDashboardStack} />
          <Tab.Screen name="InvestmentDetails" component={InvestmentDetails}/>
          <Tab.Screen name="Activity" component={MyActivity}/>
          {/* <Tab.Screen name="Portfolio" component={PortfolioScreen} /> */}
          <Tab.Screen name="Profile" component={ProfileStack} />
        </>
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "ios" ? 32 : 16,
    zIndex: 10,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#18181B",
    borderRadius: 32,
    padding: 6,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    minWidth: 44,
    minHeight: 44,
  },
  tabItemInactive: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "transparent",
    flexDirection: "column",
  },
  tabItemActive: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 0,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    marginRight: 0,
  },
  iconActive: {
    marginRight: 7,
  },
  label: {
    color: "#18181B",
    fontWeight: "600",
    fontSize: 13,
    maxWidth: 70,
  },
});
