import { Stack } from "expo-router";

import { RecordingProvider } from "@/providers/recording.provider";

export default function RootLayoutNav() {
  return (
    <RecordingProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </RecordingProvider>
  );
}
