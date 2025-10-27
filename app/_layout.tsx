import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AuthContextProvider } from "../components/context/AuthContext";
import './globals.css';

export default function RootLayout() {
  return <>
    <AuthContextProvider>
      <StatusBar backgroundColor="#0f0D23" barStyle="light-content" hidden={true} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
      </Stack>
    </AuthContextProvider>
  </>;
}
