import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { TouchableOpacity } from 'react-native';
// import { AddPartnerScreen } from '../../modules/dashboard/Investor/screens/AddPartnerScreen';
import { PartnersDashboard } from '../../modules/Partner/Dashboard/screens/PartnersDashboard';
import { RecentPayouts } from '../../modules/Partner/Dashboard/screens/RecentPayouts';
import { UpcomingPayouts } from '../../modules/Partner/Dashboard/screens/UpcomingPayouts';
export type PartnerDashboardStackParamList = {
  PartnersDashboard: undefined;
  RecentPayouts: undefined;
  UpcomingPayouts:undefined;
};
const Stack = createNativeStackNavigator<PartnerDashboardStackParamList>();
export const PartnerDashboardStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="PartnersDashboard"
      screenOptions={{
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="PartnersDashboard"
        component={PartnersDashboard}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="RecentPayouts" component={RecentPayouts}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Recent Payouts',
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
      <Stack.Screen name="UpcomingPayouts" component={UpcomingPayouts}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Upcoming Payouts',
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

// export default PartnerDashboardStack;

