/**
 * App Tab Navigator
 * Main navigation for authenticated users with bottom tabs
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text, View } from 'react-native';

// Placeholder screen components (will be replaced with actual screens)
const DashboardScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Dashboard Screen</Text>
  </View>
);

const InvestmentsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Investments Screen</Text>
  </View>
);

const PayoutsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Payouts Screen</Text>
  </View>
);

const PortfolioScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Portfolio Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile Screen</Text>
  </View>
);

// Tab navigation types
export type AppTabParamList = {
  Dashboard: undefined;
  Investments: undefined;
  Payouts: undefined;
  Portfolio: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="view-dashboard" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen 
        name="Investments" 
        component={InvestmentsScreen}
        options={{
          tabBarLabel: 'Investments',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="trending-up" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen 
        name="Payouts" 
        component={PayoutsScreen}
        options={{
          tabBarLabel: 'Payouts',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="cash-multiple" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen 
        name="Portfolio" 
        component={PortfolioScreen}
        options={{
          tabBarLabel: 'Portfolio',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="chart-pie" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="account-circle" size={size} color={color} />
          // ),
        }}
      />
    </Tab.Navigator>
  );
}; 