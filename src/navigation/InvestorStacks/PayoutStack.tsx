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
  );
};

// export default PayoutStack;
