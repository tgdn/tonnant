import * as React from "react";
import { Pressable, View, type PressableProps } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export function RecordButton({
  iconName,
  style,
  ...props
}: PressableProps & {
  isRecording: boolean;
  iconName: "pause" | "microphone" | "play";
}) {
  const { styles } = useStyles(stylesheet);
  return (
    <Pressable
      style={[
        styles.playPauseButtonContainer,
        typeof style !== "function" ? style : null,
      ]}
      {...props}
    >
      <View style={styles.playPauseButtonInnerContainer}>
        <FontAwesome size={38} color="white" name={iconName} />
      </View>
    </Pressable>
  );
}

export function StopButton({ style, ...props }: PressableProps) {
  const { styles } = useStyles(stylesheet);
  return (
    <Pressable
      style={[
        styles.stopButtonContainer,
        typeof style !== "function" ? style : null,
      ]}
      {...props}
    >
      <View style={styles.stopButtonInnerContainer}>
        <FontAwesome size={24} color="white" name="stop" />
      </View>
    </Pressable>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  playPauseButtonContainer: {
    borderRadius: 100,
    width: 90,
    height: 90,
    padding: 3,
    borderWidth: 3,
    borderColor: theme.colors.blood,
    alignItems: "center",
    justifyContent: "center",
  },
  playPauseButtonInnerContainer: {
    borderRadius: 100,
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.blood,
    alignItems: "center",
    justifyContent: "center",
  },
  stopButtonContainer: {
    borderRadius: 100,
    width: 60,
    height: 60,
    padding: 3,
    borderWidth: 3,
    borderColor: theme.colors.chineseSilver,
    alignItems: "center",
    justifyContent: "center",
  },
  stopButtonInnerContainer: {
    borderRadius: 100,
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.chineseSilver,
    alignItems: "center",
    justifyContent: "center",
  },
}));
