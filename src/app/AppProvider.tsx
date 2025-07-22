import { AutoTokenRefresh } from "@modules/auth/utils/AutoTokenRefresh";
import { persistor, store } from "@store/index";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RootNavigator } from "../navigation/RootNavigator";

export const AppProvider: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <StatusBar style="auto" />
            {/* Auto refresh token on app start */}
            {/* This component will handle the auto token refresh logic */}
            <AutoTokenRefresh />
            <RootNavigator />
          </PersistGate>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
