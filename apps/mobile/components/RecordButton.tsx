import * as React from "react";
import { Pressable, View, type PressableProps } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export function RecordButton({
  isRecording,
  ...props
}: PressableProps & { isRecording: boolean }) {
  const { styles } = useStyles(stylesheet);
  return (
    <Pressable style={styles.container} {...props}>
      <View style={styles.innerContainer}>
        <FontAwesome
          size={38}
          color="white"
          name={isRecording ? "stop" : "microphone"}
        />
      </View>
    </Pressable>
  );
}

export function StopButton(props: PressableProps) {}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    borderRadius: 100,
    width: 90,
    height: 90,
    padding: 3,
    borderWidth: 3,
    borderColor: theme.colors.blood,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    borderRadius: 100,
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.blood,
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
}));
