import { Pressable, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useClerk, useUser } from "@clerk/clerk-expo";

export default function ProfileScreen() {
  const { styles, theme } = useStyles(stylesheet);
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
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
            backgroundColor: "#fff",
            borderRadius: 10,
          }}
          onPress={() => signOut({ redirectUrl: "/" })}
        >
          <Text
            style={{ color: theme.colors.red, fontSize: theme.fontSizes.m }}
          >
            Sign out
          </Text>
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
