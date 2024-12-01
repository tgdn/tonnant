import { SafeAreaView, ScrollView } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { Text } from "@/components/Themed";
import { api } from "@/utils/api";

export default function HomeScreen() {
  const { styles } = useStyles(stylesheet);
  const { data } = api.user.getSession.useQuery();
  console.log(data);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.title}>Content content</Text>
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
    fontSize: 16,
    fontWeight: "500",
    marginTop: theme.spacing.m,
  },
}));
