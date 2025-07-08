/**
 * Root Navigator
 * Main navigation component that switches between Auth and App flows
 */

import PayoutStack from '@/navigation/PayoutStack';
import { selectIsAuthenticated, selectIsLoading } from '@modules/auth/store/authSlice';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { authService } from '@services/authService';
import { useAppDispatch, useAppSelector } from '@store/index';
import React, { useEffect, useState } from 'react';
import { LoadingScreen } from '../app/LoadingScreen';
import { AppTabNavigator } from './AppTabNavigator';
import { AuthStack } from './AuthStack';
import { InvestmentStack } from './InvestmentStack';

// Navigation types
export type RootStackParamList = {
  AuthStack: undefined;
  InvestmentStack:undefined;
  PayoutStack: undefined;
  AppTabs: undefined;
  Loading: undefined;

  // InvestmentDetails: { id: number };
  // PayoutDetails: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize authentication state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authState = await authService.initializeAuth();
        
        if (authState.isAuthenticated) {
          // Update Redux state with stored auth data
          // This will be implemented when we connect the auth service to Redux
          console.log('User is authenticated:', authState.user?.email);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Show loading screen during initialization or auth operations
  if (isInitializing || isLoading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen 
              name="AppTabs" 
              component={AppTabNavigator}
              options={{ animationTypeForReplace: 'push' }}
            />
            <Stack.Screen name="InvestmentStack" component={InvestmentStack}/>
            <Stack.Screen name='PayoutStack' component={PayoutStack}/>
            {/* <Stack.Screen
              name="InvestmentDetails"
              component={require('../modules/investments/screens/InvestmentDetailsScreen').default}
              options={{ presentation: 'modal', headerShown: true, title: 'Investment Details' }}
            /> */}
            {/* <Stack.Screen
              name="PayoutDetails"
              component={require('../modules/payouts/screens/PayoutDetailsScreen').default}
              options={{ presentation: 'modal', headerShown: true, title: 'Payout Details' }}
            /> */}
          </>
        ) : (
          <Stack.Screen 
            name="AuthStack" 
            component={AuthStack}
            options={{ animationTypeForReplace: 'pop' }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 