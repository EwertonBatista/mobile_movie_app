import * as NavigationBar from 'expo-navigation-bar';
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { AuthContextProvider, useAuth } from "../components/context/AuthContext";
import "./globals.css";

export default function RootLayout() {
    useEffect(() => {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }, []);
  return (
    <AuthContextProvider>
      <StatusBar backgroundColor="#0f0D23" barStyle="light-content" hidden={true} />
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
