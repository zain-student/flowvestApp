/**
 * App Tab Navigator
 * Main navigation for authenticated users with bottom tabs
 */

import InvestmentStack from '@/navigation/InvestmentStack';
import { Feather } from '@expo/vector-icons';
import { DashboardScreen } from '@modules/dashboard/screens/DashboardScreen';
import { PayoutsScreen } from '@modules/payouts/screens';
import { PortfolioScreen } from '@modules/portfolio/screens';
import { ProfileScreen } from '@modules/profile/screens';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Placeholder screen components (will be replaced with actual screens)
// const InvestmentsScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Investments Screen</Text>
//   </View>
// );

// const PayoutsScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Payouts Screen</Text>
//   </View>
// );

// const PortfolioScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Portfolio Screen</Text>
//   </View>
// );

// const ProfileScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Profile Screen</Text>
//   </View>
// );

// Tab navigation types
export type AppTabParamList = {
  Dashboard: undefined;
  Investments: undefined;
  Payouts: undefined;
  Portfolio: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const TAB_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  Dashboard: 'home',
  Investments: 'trending-up',
  Payouts: 'dollar-sign',
  Portfolio: 'folder',
  Profile: 'user',
};

const TAB_LABELS: Record<string, string> = {
  Dashboard: 'Home',
  Investments: 'Invest',
  Payouts: 'Payouts',
  Portfolio: 'Portfolio',
  Profile: 'Profile',
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
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
              accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={[styles.tabItem, focused ? styles.tabItemActive : styles.tabItemInactive]}
              activeOpacity={0.85}
            >
              <Feather
                name={TAB_ICONS[route.name]}
                size={20}
                color={focused ? '#18181B' : '#A1A1AA'}
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
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Investments" component={InvestmentStack} />
      <Tab.Screen name="Payouts" component={PayoutsScreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'ios' ? 32 : 16,
    zIndex: 10,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#18181B',
    borderRadius: 32,
    padding: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    minWidth: 44,
    minHeight: 44,
  },
  tabItemInactive: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    flexDirection: 'column',
  },
  tabItemActive: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 0,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
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
    color: '#18181B',
    fontWeight: '600',
    fontSize: 13,
    maxWidth: 70,
  },
}); 