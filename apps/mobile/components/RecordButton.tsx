import * as React from "react";
import { Button, Alert, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";

import { Text, View } from "@/components/Themed";

export function RecordButton() {
  const [recording, setRecording] = React.useState<
    Audio.Recording | undefined
  >();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Failed to start recording");
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.getURI();
    console.log("Recording stopped and stored at", uri);
  }
  return (
    <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
      <View>
        <Text>{recording ? "Stop Recording" : "Start Recording"}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <Button
      title={recording ? "Stop Recording" : "Start Recording"}
      onPress={recording ? stopRecording : startRecording}
    />
  );
}
