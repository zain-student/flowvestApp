import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
// import { AddPartnerScreen } from '../../modules/dashboard/Investor/screens/AddPartnerScreen';
import { PartnerPayoutScreen } from '@/modules/Partner/Activities/screens/PartnerPayoutScreen';

export type PartnerActivityStackParamList = {
  PartnerPayouts: undefined;
 
};
const Stack = createNativeStackNavigator<PartnerActivityStackParamList>();
export const PartnersPayoutStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="PartnerPayouts"
      screenOptions={{
        animation: 'slide_from_right',
      }}
      >
      <Stack.Screen
        name="PartnerPayouts"
        component={PartnerPayoutScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default PartnersPayoutStack;

