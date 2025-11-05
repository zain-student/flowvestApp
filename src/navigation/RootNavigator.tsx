/**
 * Root Navigator
 * Main navigation component that switches between Auth and App flows
 */

import { LoadingScreen } from '@/app/LoadingScreen';
import { NotificationDetailScreen } from '@/modules/Common/notifications/screens/NotificationDetailScreen';
import { NotificationsScreen } from '@/modules/Common/notifications/screens/NotificationsScreen';
import { InvestmentStack } from "@/navigation/InvestorStacks/InvestmentStack";
import { PayoutStack } from "@/navigation/InvestorStacks/PayoutStack";
import { Ionicons } from "@expo/vector-icons";
import {
  selectIsAuthenticated,
  selectIsLoading,
} from "@modules/auth/store/authSlice";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { authService } from "@services/authService";
import { useAppDispatch, useAppSelector } from "@store/index";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { AppTabNavigator } from "./AppTabNavigator";
import { AuthStack } from "./AuthStack";
import { InvestorDashboardStack } from "./InvestorStacks/InvestorDashboardStack";
import { PartnerDashboardStack } from "./PartnerStacks/PartnerDashboardStack";
import { PartnersInvestmentDetailStack } from "./PartnerStacks/PartnersInvestmentDetailStack";
import { PartnersPayoutStack } from "./PartnerStacks/PartnersPayoutStack";
// Navigation types
export type RootStackParamList = {
  AuthStack: undefined;
  InvestmentStack: undefined;
  InvestorDashboardStack: undefined;
  PartnerDashboardStack: undefined;
  PartnersPayoutStack: undefined;
  PartnerInvestmentStack: undefined;
  PayoutStack: undefined;
  AppTabs: undefined;
  Loading: undefined;
  Notifications: undefined;
  NotificationDetail: { notification: any };
  // InvestmentDetails: { id: number };
  // PayoutDetails: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const userRole = useAppSelector((state) => state.auth.user?.roles?.[0]); // e.g. 'user' or 'admin'

  // const role= useAppSelector((state) => state.auth.user?.roles || []);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize authentication state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authState = await authService.initializeAuth();

        if (authState.isAuthenticated) {
          // Update Redux state with stored auth data
          // This will be implemented when we connect the auth service to Redux
          console.log("User is authenticated:", authState.user?.email);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Show loading screen during initialization or auth operations
  if (isInitializing ) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else if (isAuthenticated && !userRole) {
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="AuthStack" component={AuthStack} />
      </Stack.Navigator>
    </NavigationContainer>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        {isAuthenticated ? (
          <>
            {userRole === "admin" && (
              <>
                <Stack.Screen
                  name="AppTabs"
                  component={AppTabNavigator}
                  options={{ animationTypeForReplace: "push" }}
                />
                <Stack.Screen
                  name="InvestorDashboardStack"
                  component={InvestorDashboardStack}
                  options={{ animationTypeForReplace: "push" }}
                />
                <Stack.Screen
                  name="InvestmentStack"
                  component={InvestmentStack}
                />
                <Stack.Screen name="PayoutStack" component={PayoutStack} />
              </>
            )}
            {userRole === "user" && (
              <>
                <Stack.Screen
                  name="AppTabs"
                  component={AppTabNavigator}
                  options={{ animationTypeForReplace: "push" }}
                />
                <Stack.Screen
                  name="PartnerDashboardStack"
                  component={PartnerDashboardStack}
                  options={{ animationTypeForReplace: "push" }}
                />
                <Stack.Screen
                  name="PartnersPayoutStack"
                  component={PartnersPayoutStack}
                  options={{
                    animationTypeForReplace: "push",
                  }}
                />
                <Stack.Screen
                  name="PartnerInvestmentStack"
                  component={PartnersInvestmentDetailStack}
                />
              </>
            )}
            {/* <Stack.Screen name="Notifications" component={NotificationsScreen} /> */}
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={({ navigation }) => ({
                // gestureEnabled: false,
                title: 'Notifications',
                headerTitleAlign: 'center',
                headerShown: true,
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
              name="NotificationDetail"
              component={NotificationDetailScreen}
              options={({ navigation }) => ({
                // gestureEnabled: false,
                title: 'Notification Detail',
                headerTitleAlign: 'center',
                headerShown: true,
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
          </>
        ) : (
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{ animationTypeForReplace: "pop" }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
