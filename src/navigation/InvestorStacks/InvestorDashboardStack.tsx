import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AddPartnerScreen } from '../../modules/dashboard/Investor/screens/AddPartnerScreen';
import { DashboardScreen } from '../../modules/dashboard/Investor/screens/DashboardScreen';

export type InvestorDashboardStackParamList = {
  InvestorDashboard: undefined;
 AddPartner: undefined;
};
const Stack = createNativeStackNavigator<InvestorDashboardStackParamList>();
export const InvestorDashboardStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="InvestorDashboard"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="InvestorDashboard"
        component={DashboardScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="AddPartner"
        component={AddPartnerScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default InvestorDashboardStack

