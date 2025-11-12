/**
 * Authentication Stack Navigator
 * Handles navigation between auth screens (login, register, forgot password)
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ForgotPasswordScreen } from '../modules/auth/screens/ForgotPasswordScreen';
import { LoginScreen } from '../modules/auth/screens/LoginScreen';
import { OnBoardingScreen } from "../modules/auth/screens/OnBoardingScreen";
import { RegisterScreen } from '../modules/auth/screens/RegisterScreen';

// Auth navigation types
export type AuthStackParamList = {
  onBoarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="onBoarding"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
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
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
}; 