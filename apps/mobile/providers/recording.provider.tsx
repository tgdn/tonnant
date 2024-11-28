import * as React from "react";
import { Alert } from "react-native";
import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
  type AudioRecorder,
} from "expo-audio";

export type RecordingContextState = {
  audioRecorder: AudioRecorder;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
};

const RecordingContext = React.createContext<RecordingContextState>(
  {} as RecordingContextState,
);

export function RecordingProvider(props: { children: React.ReactNode }) {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const startRecording = async () => {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      Alert.alert("Permission to access microphone was denied");
      return;
    }
    audioRecorder.record();
    console.log("Recording started");
  };
  const pauseRecording = () => {
    audioRecorder.pause();
    console.log("Recording paused");
  };
  const stopRecording = async () => {
    await audioRecorder.stop();
    const uri = audioRecorder.uri;
    console.log("Recording stopped and stored at", uri);
  };
  return (
    <RecordingContext.Provider
      value={{
        audioRecorder,
        startRecording,
        pauseRecording,
        stopRecording,
      }}
    >
      {props.children}
    </RecordingContext.Provider>
  );
}

export function useRecordingContext() {
  const recordingContext = React.useContext(RecordingContext);
  if (!recordingContext) {
    throw new Error(
      "useRecordingContext must be used within a RecordingProvider",
    );
  }
  return recordingContext;
}
