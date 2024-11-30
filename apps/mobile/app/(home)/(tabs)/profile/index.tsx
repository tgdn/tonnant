import { Pressable, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useClerk, useUser } from "@clerk/clerk-expo";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ProfileScreen() {
  const { styles } = useStyles(stylesheet);
  const { user } = useUser();
  const { signOut } = useClerk();
  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View>
        <Text>
          You are logged in as{" "}
          <Text style={styles.emailText}>
            {user?.emailAddresses[0].emailAddress}
          </Text>
        </Text>
      </View>
      <View style={{ marginTop: 30 }}>
        <Pressable
          style={{
            width: "100%",
            flexDirection: "row",
            gap: 20,
            alignItems: "center",
            paddingVertical: 20,
          }}
          onPress={() => signOut({ redirectUrl: "/" })}
        >
          <FontAwesome size={16} style={{}} name="sign-out" />
          <Text style={{ fontWeight: "500", fontSize: 16 }}>Sign out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    paddingTop: theme.spacing.m,
    paddingHorizontal: theme.spacing.screenGutter,
    backgroundColor: theme.colors.backgroundColor,
  },
  text: {
    color: theme.colors.typography,
  },
  emailText: {
    color: theme.colors.purpleBlue,
  },
}));
