import { InvestmentDetails } from "@modules/Partner/InvestmentDetails/screens/InvestmentDetails";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

export type PartnersInvestmentDetailStackParamList={
    InvestmentDetails:undefined;
};
const Stack=createNativeStackNavigator<PartnersInvestmentDetailStackParamList>();
export const PartnersInvestmentDetailStack = () => {
  return (
    <Stack.Navigator initialRouteName='InvestmentDetails'
    screenOptions={{
        animation:"slide_from_right"
    }}
    >
        <Stack.Screen name='InvestmentDetails' component={InvestmentDetails}
        options={{
            headerShown:false,
            gestureEnabled:false
        }}
        />
    </Stack.Navigator>
  )
}

export default PartnersInvestmentDetailStack
