import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { PayoutDetailsScreen } from "../modules/payouts/screens/PayoutDetailsScreen";
import { PayoutsScreen } from "../modules/payouts/screens/PayoutsScreen";

export type PayoutStackParamList={
  PayoutsScreen: undefined,
  PayoutDetails:{id :number}
}
const Stack=createNativeStackNavigator<PayoutStackParamList>();
const PayoutStack = () => {
  return (
    <Stack.Navigator
    initialRouteName='PayoutsScreen'>
      <Stack.Screen name='PayoutsScreen' component={PayoutsScreen}/>
      <Stack.Screen name='PayoutDetails' component={PayoutDetailsScreen}/>
    </Stack.Navigator>
  )
}

export default PayoutStack;