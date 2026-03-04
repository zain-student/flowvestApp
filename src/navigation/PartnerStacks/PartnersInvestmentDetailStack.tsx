import { SharedInvestmentDetail } from "@/modules/Common/sharedInvestments/SharedInvestmentDetail";
import { SharedInvestments } from "@/modules/Common/sharedInvestments/SharedInvestments";
import { JoinedInvestmentDetail } from "@/modules/Partner/InvestmentDetails/screens/JoinedInvestmentDetail";
import { Ionicons } from "@expo/vector-icons";
import { InvestmentDetails } from "@modules/Partner/InvestmentDetails/screens/InvestmentDetails";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity } from "react-native";

export type PartnersInvestmentDetailStackParamList = {
  InvestmentDetails: undefined;
  SharedInvestments: undefined;
  JoinedInvestmentDetail: { id: number };
  SharedInvestmentDetail: { id: number; showJoinForm?: boolean };
};
export const Stack =
  createNativeStackNavigator<PartnersInvestmentDetailStackParamList>();
export const PartnersInvestmentDetailStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="InvestmentDetails"
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="InvestmentDetails"
        component={InvestmentDetails}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="SharedInvestments"
        component={SharedInvestments}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: "Shared Investments",
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
      <Stack.Screen
        name="JoinedInvestmentDetail"
        component={JoinedInvestmentDetail}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: "Joined Investment Detail",
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
      <Stack.Screen
        name="SharedInvestmentDetail"
        component={SharedInvestmentDetail}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: "Shared Investment Detail",
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

export default PartnersInvestmentDetailStack;
