import { InvestmentDetailsScreen } from "@/modules/Investor/investments/screens/InvestmentDetailsScreen";
import { InvestmentsScreen } from "@/modules/Investor/investments/screens/InvestmentsScreen";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity } from "react-native";
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
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="InvestmentDetails"
        component={InvestmentDetailsScreen}
        options={({ navigation }) => ({
          title: "Investment Details",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft:10,
                marginTop:5,
                marginBottom:5,
                backgroundColor: "#F3F4F6",
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30}/>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};
export default InvestmentStack;
