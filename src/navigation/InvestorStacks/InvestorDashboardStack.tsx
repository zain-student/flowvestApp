import { PartnerDetailScreen } from '@/modules/Investor/dashboard/screens/PartnerDetailScreen';
import { PartnerInvestments } from "@/modules/Investor/dashboard/screens/PartnerInvestments";
import { PartnerPayouts } from "@/modules/Investor/dashboard/screens/PartnerPayouts";
import { Ionicons } from '@expo/vector-icons';
import { PartnerPerformanceScreen } from "@modules/Investor/dashboard/screens/PartnerPerformanceScreen";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AddPartnerScreen } from '../../modules/Investor/dashboard/screens/AddPartnerScreen';
import { DashboardScreen } from '../../modules/Investor/dashboard/screens/DashboardScreen';
export type InvestorDashboardStackParamList = {
  InvestorDashboard: undefined;
  AddPartner: { partner?: any };
  PartnerDetail: { id: number };
  PartnerInvestment: { id: number };
  PartnerPayout: { id: number };
  PartnerPerformance:{id: number};
};
export const Stack = createNativeStackNavigator<InvestorDashboardStackParamList>();
export const InvestorDashboardStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="InvestorDashboard"
      screenOptions={{
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="InvestorDashboard"
        component={DashboardScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="AddPartner"
        component={AddPartnerScreen}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Add Partner',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="PartnerDetail"
        component={PartnerDetailScreen}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Partner Details',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="PartnerInvestment"
        component={PartnerInvestments}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Partner Investments',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="PartnerPayout"
        component={PartnerPayouts}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Partner Payouts',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="PartnerPerformance"
        component={PartnerPerformanceScreen}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Partner Performance',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  )
}

// export default InvestorDashboardStack

