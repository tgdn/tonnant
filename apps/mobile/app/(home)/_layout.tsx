import { useStyles } from "react-native-unistyles";
import { Stack } from "expo-router";

import { RecordingProvider } from "@/providers/recording.provider";

export default function RootLayoutNav() {
  const { theme } = useStyles();
  return (
    <RecordingProvider>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: theme.colors.backgroundColor,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </RecordingProvider>
  );
}
