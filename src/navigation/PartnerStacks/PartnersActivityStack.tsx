import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
// import { AddPartnerScreen } from '../../modules/dashboard/Investor/screens/AddPartnerScreen';
import { MyActivity } from '@/modules/Partner/Activities/screens/MyActivity';

export type PartnerActivityStackParamList = {
  PartnersActivity: undefined;
 
};
const Stack = createNativeStackNavigator<PartnerActivityStackParamList>();
export const PartnersActivityStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="PartnersActivity"
      screenOptions={{
        animation: 'slide_from_right',
      }}
      >
      <Stack.Screen
        name="PartnersActivity"
        component={MyActivity}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default PartnersActivityStack;

