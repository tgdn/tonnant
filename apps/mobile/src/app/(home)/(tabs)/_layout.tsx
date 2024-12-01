import React from "react";
import { useStyles } from "react-native-unistyles";
import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { theme } = useStyles();
  const { isSignedIn } = useAuth();
  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.tint1,
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.backgroundColor,
        },
        headerTitleStyle: {
          color: theme.colors.typography,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundColor,
          borderColor: "transparent",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: "Record",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="microphone" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
