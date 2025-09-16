import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ChangePasswordScreen } from "../../modules/Common/profile/screens/ChangePasswordScreen";
import ProfileScreen from "../../modules/Common/profile/screens/ProfileScreen";

export type ProfileStackParamList = {
  Profile: undefined;
  ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: "Change Password" }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
