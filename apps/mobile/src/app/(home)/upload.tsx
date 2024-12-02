import { Platform, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { StatusBar } from "expo-status-bar";

export default function UploadScreen() {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const stylesheet = createStyleSheet({
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
