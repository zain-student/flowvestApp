import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { AppProvider } from './src/app/AppProvider';

SplashScreen.preventAutoHideAsync(); // Keep splash visible

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      // Wait 10 seconds (10000 ms)
      await new Promise(resolve => setTimeout(resolve));
      setAppReady(true);
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  if (!appReady) {
    // Optionally return null or a loading indicator
    return null;
  }

  return <AppProvider />;
} 