import * as NavigationBar from 'expo-navigation-bar';
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { AuthContextProvider, useAuth } from "../components/context/AuthContext";
import "./globals.css";

import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        ...Ionicons.font,
    });

    useEffect(() => {
      if (error) throw error;
    }, [error]);

    useEffect(() => {
      if (loaded) {
        SplashScreen.hideAsync();
      }
    }, [loaded]);

    useEffect(() => {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }, []);

    if (!loaded) {
      return null;
    }

  return (
    <AuthContextProvider>
      <StatusBar backgroundColor="#0f0D23" barStyle="light-content" hidden={false} />
      <AuthGuard />
    </AuthContextProvider>
  );
}

function AuthGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/(auth)/login");
      else router.replace("/(tabs)");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 bg-[#0f0D23] justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <Slot />;
}
