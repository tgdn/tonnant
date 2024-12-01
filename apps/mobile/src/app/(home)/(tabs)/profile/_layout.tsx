import { useStyles } from "react-native-unistyles";
import { Stack } from "expo-router";

export default function ProfileRouteLayout() {
  const { theme } = useStyles();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.colors.backgroundColor,
        },
        headerTitleStyle: {
          color: theme.colors.typography,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Profile",
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
