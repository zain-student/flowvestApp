import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { InvestmentDetailsScreen } from "../modules/investments/screens/InvestmentDetailsScreen";
import { InvestmentsScreen } from "../modules/investments/screens/InvestmentsScreen";

export type InvestmentStackParamList = {
  InvestmentScreen: undefined;
  InvestmentDetails: { id: number };
 
};

const Stack = createNativeStackNavigator<InvestmentStackParamList>();

export const InvestmentStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="InvestmentScreen"
    //   screenOptions={{
    //     headerShown: false,
    //     animation: 'slide_from_right',
    //   }}
    >
      <Stack.Screen 
        name="InvestmentScreen" 
        component={InvestmentsScreen}
        options={{
          gestureEnabled: false,
          headerShown:false
        }}
      />
      <Stack.Screen 
        name="InvestmentDetails" 
        component={InvestmentDetailsScreen}
        options={{
          title:"Investment Details"
        }}
      />

    </Stack.Navigator>
  );
}; 
export default InvestmentStack;