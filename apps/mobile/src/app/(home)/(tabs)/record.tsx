import React from "react";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { RecordButton, StopButton } from "@/components/RecordButton";
import { useRecordingContext } from "@/providers/recording.provider";

export default function TabTwoScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const {
    formattedRecordingDuration,
    recordingStatus,
    isRecording,
    startRecording,
    stopRecording,
    pauseRecording,
  } = useRecordingContext();
  const [hours, minutes, seconds, milliseconds] = formattedRecordingDuration;

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text
          style={{
            fontSize: 50,
            fontWeight: "300",
            color: theme.colors.typography,
            fontVariant: ["tabular-nums"],
          }}
        >
          {hours}:{minutes}:{seconds}.
          <Text style={{ fontSize: 30 }}>{milliseconds}</Text>
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
          paddingVertical: 10,
          marginBottom: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StopButton
          onPress={() => stopRecording()}
          disabled={recordingStatus === "idle"}
          style={{
            position: "absolute",
            left: 20,
          }}
        />
        <RecordButton
          isRecording={isRecording}
          iconName={
            recordingStatus === "idle"
              ? "microphone"
              : recordingStatus === "paused"
                ? "play"
                : "pause"
          }
          onPress={() => {
            if (isRecording) {
              pauseRecording();
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
