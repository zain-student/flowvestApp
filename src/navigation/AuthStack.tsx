/**
 * Authentication Stack Navigator
 * Handles navigation between auth screens (login, register, forgot password)
 */

import { ForgotPasswordEmailScreen } from "@/modules/auth/screens/ForgotPasswordEmailScreen";
import { ResetPasswordScreen } from "@/modules/auth/screens/ResetPasswordScreen";
import { VerifyResetCodeScreen } from "@/modules/auth/screens/VerifyResetCodeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { LoginScreen } from "../modules/auth/screens/LoginScreen";
import { OnBoardingFinal } from "../modules/auth/screens/OnBoardingFinal";
import { OnBoardingScreen } from "../modules/auth/screens/OnBoardingScreen";
import { RegisterScreen } from "../modules/auth/screens/RegisterScreen";

// Auth navigation types
export type AuthStackParamList = {
  onBoarding: undefined;
  OnBoardingFinal: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPasswordEmail: undefined;
  VerifyResetCode: { email: string };
  ResetPassword: { email: string; token: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="onBoarding"
      // initialRouteName="onBoard1"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="OnBoardingFinal"
        component={OnBoardingFinal}
        options={{
          gestureEnabled: false,
        }}
      />
      {/* <Stack.Screen
        name="onBoard2"
        component={OnBoard2}
        options={{
          gestureEnabled: false,
        }}
      /> */}
      <Stack.Screen
        name="onBoarding"
        component={OnBoardingScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="ForgotPasswordEmail"
        component={ForgotPasswordEmailScreen}
      />
      <Stack.Screen name="VerifyResetCode" component={VerifyResetCodeScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};
