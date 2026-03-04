import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
// import { AddPartnerScreen } from '../../modules/dashboard/Investor/screens/AddPartnerScreen';
import PartnerPayoutDetails from "@/modules/Partner/PartnerPayouts/screens/PartnerPayoutDetails";
import { PartnerPayoutScreen } from "@/modules/Partner/PartnerPayouts/screens/PartnerPayoutScreen";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
export type PartnerPayoutStackParamList = {
  PartnerPayouts: undefined;
  PartnerPayoutDetails: { id: number };
};
const Stack = createNativeStackNavigator<PartnerPayoutStackParamList>();
export const PartnersPayoutStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="PartnerPayouts"
      screenOptions={{
        animation: "slide_from_right",
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
      <Stack.Screen
        name="PartnerPayoutDetails"
        component={PartnerPayoutDetails}
        options={({ navigation }) => ({
          title: "Payout Details",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                // marginLeft: 10, // only this
                width: 40,
                height: 40,
                borderRadius: 20,
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
  );
};

export default PartnersPayoutStack;
