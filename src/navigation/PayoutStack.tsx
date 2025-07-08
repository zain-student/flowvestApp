import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { PayoutDetailsScreen } from "../modules/payouts/screens/PayoutDetailsScreen";
import { PayoutsScreen } from "../modules/payouts/screens/PayoutsScreen";

export type PayoutStackParamList={
  PayoutsScreen: undefined,
  PayoutDetails:{id :number}
}
const Stack=createNativeStackNavigator<PayoutStackParamList>();
export const PayoutStack = () => {
  return (
    <Stack.Navigator
    initialRouteName='PayoutsScreen'>
      <Stack.Screen name='PayoutsScreen' component={PayoutsScreen}
      options={{
        headerShown:false
      }}
      />
      <Stack.Screen name='PayoutDetails' component={PayoutDetailsScreen} options={{
        title:"Payout Details"
      }}/>
    </Stack.Navigator>
  )
}

export default PayoutStack;