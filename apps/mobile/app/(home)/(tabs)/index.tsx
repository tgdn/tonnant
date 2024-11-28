import { SafeAreaView, ScrollView } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useUser } from "@clerk/clerk-expo";

import { Text } from "@/components/Themed";

export default function TabOneScreen() {
  const { styles } = useStyles(stylesheet);
  const { user } = useUser();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Hello {user?.firstName}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.screenGutter,
  },
  title: {
    color: theme.colors.typography,
    fontSize: 30,
    fontWeight: "500",
    marginTop: theme.spacing.m,
  },
}));
