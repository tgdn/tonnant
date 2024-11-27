import { Button, StyleSheet } from "react-native";
import { useClerk, useUser } from "@clerk/clerk-expo";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  return (
    <View style={styles.container}>
      <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      <Button title="Sign out" onPress={() => signOut({ redirectUrl: "/" })} />
      {/* <Text style={styles.title}>Tab Two</Text> */}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
