// app/_layout.tsx
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { initializeDatabase } from '../database/init';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        await initializeDatabase();
        setDbReady(true);
      } catch (e) {
        console.warn(e);
      } finally {

        await SplashScreen.hideAsync();
      }
    }

    setup();
  }, []);

  if (!dbReady) {
    return null;
  }

  return <Slot />;
}