/**
 * Authentication Stack Navigator
 * Handles navigation between auth screens (login, register, forgot password)
 */

import { ForgotPasswordEmailScreen } from "@/modules/auth/screens/ForgotPasswordEmailScreen";
import { ResetPasswordScreen } from "@/modules/auth/screens/ResetPasswordScreen";
import { VerifyResetCodeScreen } from "@/modules/auth/screens/VerifyResetCodeScreen";
import { storage, StorageKeys } from "@/shared/services/storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
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
  const [initialRoute, setInitialRoute] = useState<
    keyof AuthStackParamList | null
  >(null);
  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await storage.getItem(StorageKeys.ONBOARDING_COMPLETED);
      if (completed) {
        setInitialRoute("OnBoardingFinal");
      } else {
        setInitialRoute("onBoarding");
      }
    };
    checkOnboarding();
  }, []);
  if (!initialRoute) {
    return null; // or a loading spinner
  }
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
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
