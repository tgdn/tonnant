import React from "react";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { RecordButton } from "@/components/RecordButton";
import { useRecordingContext } from "@/providers/recording.provider";

export default function TabTwoScreen() {
  const { styles, theme } = useStyles(stylesheet);

  const { audioRecorder, recordingDuration, startRecording, stopRecording } =
    useRecordingContext();
  const [hoursElapsed, minutesElapsed, secondsElapsed] = recordingDuration;
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text
          style={{
            fontSize: 70,
            fontWeight: "300",
            color: theme.colors.typography,
          }}
        >
          {String(hoursElapsed).padStart(2, "0")}:
          {String(minutesElapsed).padStart(2, "0")}:
          {String(secondsElapsed).padStart(2, "0")}
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          marginBottom: 40,
          alignItems: "center",
        }}
      >
        <RecordButton
          onPress={() => {
            if (audioRecorder.isRecording) {
              stopRecording();
            } else {
              startRecording();
            }
          }}
        />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    paddingHorizontal: theme.spacing.screenGutter,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
}));
