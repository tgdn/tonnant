import React from "react";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import { RecordButton } from "@/components/RecordButton";
import { useRecordingContext } from "@/providers/recording.provider";

export default function TabTwoScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const { audioRecorder, startRecording, stopRecording } =
    useRecordingContext();
  const recordingDuration = audioRecorder.currentTime;
  console.log({ recordingDuration });
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      console.log({ recordingDuration });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
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
          00:00:00
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
