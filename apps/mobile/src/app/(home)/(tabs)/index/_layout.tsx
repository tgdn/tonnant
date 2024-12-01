import React from "react";
import { Pressable } from "react-native";
import { useStyles } from "react-native-unistyles";
import { Link, Stack } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function IndexRouteLayout() {
  const { theme } = useStyles();
  const { user } = useUser();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.backgroundColor,
        },
        headerTitleStyle: {
          color: theme.colors.typography,
        },
        // headerSearchBarOptions: {},
        // headerRight: () => (
        //   <Link href="/modal" asChild>
        //     <Pressable>
        //       {({ pressed }) => (
        //         <FontAwesome
        //           name="qrcode"
        //           size={25}
        //           color={theme.colors.purpleBlue}
        //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
        //         />
        //       )}
        //     </Pressable>
        //   </Link>
        // ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: `Hello ${user?.firstName}`,
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
