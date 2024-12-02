import { Text } from "react-native";
import { useStyles } from "react-native-unistyles";
import { Stack, useRouter } from "expo-router";

import { ModalCloseButton } from "@/components/ModalCloseButton";
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
        <Stack.Screen
          name="upload"
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Recording complete",
            headerRight: () => {
              const router = useRouter();
              return <ModalCloseButton onPress={() => router.back()} />;
            },
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </RecordingProvider>
  );
}
