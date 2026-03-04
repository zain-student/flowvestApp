import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity } from "react-native";
import { PayoutDetailsScreen } from "../../modules/Investor/Payouts/screens/PayoutDetailsScreen";
import { PayoutsScreen } from "../../modules/Investor/Payouts/screens/PayoutsScreen";
export type PayoutStackParamList = {
  PayoutsScreen: undefined;
  PayoutDetails: { id: number };
};
const Stack = createNativeStackNavigator<PayoutStackParamList>();
export const PayoutStack = () => {
  return (
    <Stack.Navigator initialRouteName="PayoutsScreen">
      <Stack.Screen
        name="PayoutsScreen"
        component={PayoutsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PayoutDetails"
        component={PayoutDetailsScreen}
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

// export default PayoutStack;
