import AddInvestmentPartner from "@/modules/Investor/investments/screens/AddInvestmentPartner";
import { AddInvestments } from "@/modules/Investor/investments/screens/AddInvestments";
// import { BrowseInvestments } from "@/modules/Investor/investments/screens/BrowseInvestments";
import { SharedInvestmentDetail } from "@/modules/Common/sharedInvestments/SharedInvestmentDetail";
import { SharedInvestments } from "@/modules/Common/sharedInvestments/SharedInvestments";
import EditInvestments from "@/modules/Investor/investments/screens/EditInvestments";
import { InvestmentDetailsScreen } from "@/modules/Investor/investments/screens/InvestmentDetailsScreen";
import { InvestmentsScreen } from "@/modules/Investor/investments/screens/InvestmentsScreen";
import { MyInvestments } from "@/modules/Investor/investments/screens/MyInvestments";
import { JoinedInvestmentDetail } from "@/modules/Partner/InvestmentDetails/screens/JoinedInvestmentDetail";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity } from "react-native";
export type InvestmentStackParamList = {
  InvestmentScreen: undefined;
  InvestmentDetails: { id: number; showJoinForm?: String };
  AddInvestments: undefined;
  EditInvestments: {
    investmentDet: any;
    mode: string;
  };
  AddPartner: { id: number };
  MyInvestments: undefined;
  JoinedInvestmentDetail: { id: number };
  SharedInvestments: undefined;
  SharedInvestmentDetail: { id: number; showJoinForm?: boolean };
  // BrowseInvestments: undefined;
};

export const Stack = createNativeStackNavigator<InvestmentStackParamList>();

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
          headerBackTitleVisible: false,
          headerTintColor: "black",
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
              <Ionicons name="chevron-back" color="black" size={24} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="AddInvestments"
        component={AddInvestments}
        options={({ navigation }) => ({
          title: "Add Investment",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
              style={{
                // marginLeft: 1, // only this
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
        name="EditInvestments"
        component={EditInvestments}
        options={({ navigation }) => ({
          title: "Edit Investment",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
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
        name="AddPartner"
        component={AddInvestmentPartner}
        options={({ navigation }) => ({
          title: "Add Partner",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
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
        name="MyInvestments"
        component={MyInvestments}
        options={({ navigation }) => ({
          title: "My Investments",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
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
          title: "Investment Details",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
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
        name="SharedInvestments"
        component={SharedInvestments}
        options={({ navigation }) => ({
          title: "Browse Investments",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
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
          title: "Browse Investments Detail",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
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
// export default InvestmentStack;
