import * as React from "react";
import {
  Alert,
  Button,
  Pressable,
  View,
  type PressableProps,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Audio } from "expo-av";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export function RecordButton(props: PressableProps) {
  const { styles } = useStyles(stylesheet);
  // const [recording, setRecording] = React.useState<
  //   Audio.Recording | undefined
  // >();
  // const isRecording = !!recording;
  // const [permissionResponse, requestPermission] = Audio.usePermissions();
  // async function startRecording() {
  //   console.log("Starting recording..");
  //   // TODO: debugging comment to prevent recording
  //   return;
  //   try {
  //     if (permissionResponse?.status !== Audio.PermissionStatus.GRANTED) {
  //       console.log("Requesting permission..");
  //       await requestPermission();
  //     }
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     });

  //     console.log("Starting recording..");
  //     const { recording } = await Audio.Recording.createAsync(
  //       Audio.RecordingOptionsPresets.HIGH_QUALITY,
  //     );
  //     setRecording(recording);
  //     console.log("Recording started");
  //   } catch (err) {
  //     console.error("Failed to start recording", err);
  //     Alert.alert("Failed to start recording");
  //   }
  // }
  // async function stopRecording() {
  //   console.log("Stopping recording..");
  //   setRecording(undefined);
  //   await recording?.stopAndUnloadAsync();
  //   await Audio.setAudioModeAsync({
  //     allowsRecordingIOS: false,
  //   });
  //   const uri = recording?.getURI();
  //   console.log("Recording stopped and stored at", uri);
  // }
  return (
    <Pressable
      // onPress={() => (recording ? stopRecording : startRecording)}
      style={styles.container}
      {...props}
    >
      <View style={styles.innerContainer}>
        <FontAwesome size={38} color="white" name="microphone" />
      </View>
    </Pressable>
  );
}

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
