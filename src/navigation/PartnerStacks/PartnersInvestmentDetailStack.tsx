import { JoinedInvestmentDetail } from "@/modules/Partner/InvestmentDetails/screens/JoinedInvestmentDetail";
import { Ionicons } from "@expo/vector-icons";
import { InvestmentDetails } from "@modules/Partner/InvestmentDetails/screens/InvestmentDetails";
import { SharedInvestments } from '@modules/Partner/InvestmentDetails/screens/SharedInvestments';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { TouchableOpacity } from "react-native";

export type PartnersInvestmentDetailStackParamList = {
  InvestmentDetails: undefined;
  SharedInvestments: undefined;
  JoinedInvestmentDetail: {id: number};
};
export const Stack = createNativeStackNavigator<PartnersInvestmentDetailStackParamList>();
export const PartnersInvestmentDetailStack = () => {
  return (
    <Stack.Navigator initialRouteName='InvestmentDetails'
      screenOptions={{
        animation: "slide_from_right"
      }}
    >
      <Stack.Screen name='InvestmentDetails' component={InvestmentDetails}
        options={{
          headerShown: false,
          gestureEnabled: false
        }}
      />
      <Stack.Screen
        name="SharedInvestments"
        component={SharedInvestments}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Shared Investments',
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
                width: 40,
                height: 40,
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
      <Stack.Screen
        name="JoinedInvestmentDetail"
        component={JoinedInvestmentDetail}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Joined Investments',
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
                width: 40,
                height: 40,
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

export default PartnersInvestmentDetailStack
